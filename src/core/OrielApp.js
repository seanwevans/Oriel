import { DEFAULT_SPLASH_IMAGE, DEFAULT_WALLPAPER } from "../defaults.js";
import { loadDesktopState } from "../state.js";
import { applyWallpaperSettings } from "../wallpaper.js";
import {
  MOCK_FS,
  exportFileSystemAsJson,
  hydrateNativeDirectory,
  isNativeFsSupported,
  mountNativeFolder,
  replaceFileSystem,
  saveFileSystem,
  fileSystemReady
} from "../filesystem.js";
import { publish, subscribe } from "../eventBus.js";
import { getNetworkDefaults, refreshNetworkedWindows } from "../networking.js";
import {
  endTask,
  refreshAllProcessViews,
  switchTask
} from "../apps/taskman.js";
import { initScreensaver, hideUnlockPrompt, submitLockPassphrase } from "../apps/screensaver.js";
import { installSelectionFromWindow, rFL, rFT, uninstallSelectionFromWindow } from "../apps/fileManager.js";
import {
  applyFontSelection,
  applySavedTheme,
  applyScreensaver,
  applyTheme,
  openCPColor,
  openCPDefaults,
  openCPDesktop,
  openCPFonts,
  openCPScreensaver,
  openCPSound,
  previewScreensaver,
  setWallpaper
} from "../apps/controlPanel.js";
import {
  calcInput,
  handleConsoleKey,
  registerConsoleCommands,
  runCompiler,
  runPython
} from "../apps/console.js";
import { resetMines } from "../apps/minesweeper.js";
import { selectPaintTool, clearPaint } from "../apps/paint.js";
import { copyCharMap } from "../apps/charmap.js";
import { addDbRecord, deleteDbRecord, exportDbToCsv } from "../apps/database.js";
import {
  psApplyFilter,
  psExport,
  psFillCanvas,
  psNewDocument,
  psTriggerOpen,
  setPsTool
} from "../apps/photoshop.js";
import { controlPanelContext } from "../windowManager.js";
import { bootstrapInstallations } from "../installer.js";

const INVALID_FOLDER_CHARS = /[\\/:*?"<>|]/;
const RESERVED_FOLDER_NAMES = new Set([
  "CON",
  "PRN",
  "AUX",
  "NUL",
  "COM1",
  "COM2",
  "COM3",
  "COM4",
  "COM5",
  "COM6",
  "COM7",
  "COM8",
  "COM9",
  "LPT1",
  "LPT2",
  "LPT3",
  "LPT4",
  "LPT5",
  "LPT6",
  "LPT7",
  "LPT8",
  "LPT9"
]);

export class OrielApp {
  constructor({
    WindowManager,
    SimulatedKernel,
    filesystem = {
      MOCK_FS,
      exportFileSystemAsJson,
      hydrateNativeDirectory,
      isNativeFsSupported,
      mountNativeFolder,
      replaceFileSystem,
      saveFileSystem,
      fileSystemReady
    },
    state = { loadDesktopState },
    wallpaper = { applyWallpaperSettings },
    audio = {}
  } = {}) {
    this.WindowManager = WindowManager;
    this.SimulatedKernel = SimulatedKernel;
    this.fs = filesystem;
    this.state = state;
    this.wallpaper = wallpaper;
    this.audio = audio;

    this.windowManager = null;
    this.dom = {};
    this.initialDesktopState = null;
    this.installerReady = null;
    this.kernel = null;
  }

  cacheDom() {
    this.dom.desktop = document.getElementById("desktop");
    this.dom.contextMenu = document.getElementById("context-menu");
    this.dom.splash = document.getElementById("splash-screen");
    this.dom.dragDropTarget = this.dom.desktop || document.body;
  }

  async start() {
    this.cacheDom();

    subscribe("fs:change", this.#refreshOpenFileManagers.bind(this));
    subscribe("network:config-update", refreshNetworkedWindows);

    this.installerReady = bootstrapInstallations().catch((err) => {
      console.warn("Failed to bootstrap installed apps", err);
    });

    this.kernel = new this.SimulatedKernel(() => refreshAllProcessViews());

    const initialDesktopState = this.state.loadDesktopState();
    this.initialDesktopState = initialDesktopState;

    applySavedTheme(initialDesktopState.themeCustom);
    this.wallpaper.applyWallpaperSettings(
      initialDesktopState.wallpaper?.url ?? DEFAULT_WALLPAPER,
      initialDesktopState.wallpaper?.mode || "cover"
    );

    this.#registerWindowGlobals();

    await this.fs.fileSystemReady.catch(() => {});
    await this.installerReady.catch(() => {});
    this.#bootDesktop();
    this.#initDesktopContextMenu();
    this.#initSplash();
    initScreensaver();
    this.#initDragAndDropImport();
  }

  #normalizeFolderName(name) {
    return name?.toUpperCase() ?? "";
  }

  #getUniqueFolderName(targetDir, baseName = "New Folder") {
    if (!targetDir?.children) return baseName;
    const existingNames = new Set(
      Object.keys(targetDir.children).map((childName) => this.#normalizeFolderName(childName))
    );
    let candidate = baseName;
    let counter = 1;
    while (existingNames.has(this.#normalizeFolderName(candidate))) {
      candidate = `${baseName} (${counter})`;
      counter++;
    }
    return candidate;
  }

  async #createNamedFolder(targetDir, name) {
    if (!targetDir) {
      return { success: false, message: "Invalid folder target." };
    }

    const rawName = typeof name === "string" ? name : "";
    if (rawName) {
      if (/[. ]$/.test(rawName)) {
        return {
          success: false,
          message: "Folder names cannot end with a period or space."
        };
      }
      if (INVALID_FOLDER_CHARS.test(rawName)) {
        return {
          success: false,
          message:
            "Folder names cannot contain \\ / : * ? \" < > |. Remove these characters and try again."
        };
      }
    }

    const trimmedName = rawName.trim();
    if (trimmedName && RESERVED_FOLDER_NAMES.has(this.#normalizeFolderName(trimmedName))) {
      return {
        success: false,
        message:
          "That folder name is reserved by the system. Choose a different name and try again."
      };
    }

    let finalName = trimmedName || this.#getUniqueFolderName(targetDir);
    if (targetDir.children) {
      const normalized = this.#normalizeFolderName(finalName);
      const existingNames = Object.keys(targetDir.children).map((childName) =>
        this.#normalizeFolderName(childName)
      );
      if (existingNames.includes(normalized)) {
        finalName = this.#getUniqueFolderName(targetDir, finalName);
      }
    }

    if (targetDir.children?.[finalName]) {
      return { success: false, message: "Folder already exists!" };
    }
    if (targetDir.nativeHandle) {
      try {
        await targetDir.nativeHandle.getDirectoryHandle(finalName, { create: true });
        await this.fs.hydrateNativeDirectory(targetDir);
      } catch (err) {
        return {
          success: false,
          message: `Failed to create directory: ${err.message}`
        };
      }
    } else {
      targetDir.children[finalName] = {
        type: "dir",
        children: {}
      };
      this.fs.saveFileSystem();
    }
    return { success: true };
  }

  async #createFolder(btn) {
    const win = btn.closest(".window");
    const input = win.querySelector("#new-folder-name");
    const name = input.value.trim();
    if (name && win.currentDirObj) {
      const result = await this.#createNamedFolder(win.currentDirObj, name);
      if (!result.success) {
        alert(result.message);
        return;
      }
      input.value = "";
      await rFT(win);
      await rFL(win);
    }
  }

  async #mountLocalFolder(btn) {
    if (!this.fs.isNativeFsSupported()) {
      alert("Mounting a local folder requires a compatible browser.");
      return;
    }

    try {
      const driveNode = await this.fs.mountNativeFolder();
      await this.fs.hydrateNativeDirectory(driveNode);
      const win = btn.closest(".window");
      if (win) {
        win.cP = Object.keys(this.fs.MOCK_FS).includes("D\\") ? "D\\" : win.cP;
        win.cD = this.fs.MOCK_FS[win.cP] || driveNode;
        win.currentDirObj = win.cD;
        await rFT(win);
        await rFL(win);
      }
    } catch (err) {
      if (err?.name === "AbortError") return;
      alert(`Failed to mount folder: ${err.message}`);
    }
  }

  async #installSelectedManifest(btn) {
    const win = btn.closest(".window");
    if (!win) return;
    try {
      const manifest = await installSelectionFromWindow(win);
      alert(`Installed ${manifest.name} (${manifest.id})`);
    } catch (err) {
      alert(err.message || "Unable to install manifest.");
    }
  }

  async #uninstallManifest(btn) {
    const win = btn.closest(".window");
    if (!win) return;
    try {
      const removedId = await uninstallSelectionFromWindow(win);
      alert(`Uninstalled ${removedId}`);
    } catch (err) {
      alert(err.message || "Unable to uninstall app.");
    }
  }

  #downloadJson(content, filename) {
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  #isValidFileSystemNode(node) {
    if (!node || typeof node !== "object") return false;
    if (node.type === "dir") {
      if (typeof node.children !== "object") return false;
      return Object.values(node.children).every((child) => this.#isValidFileSystemNode(child));
    }
    return node.type === "file";
  }

  #normalizeImportedFileSystem(data) {
    if (!data || typeof data !== "object") throw new Error("Invalid JSON structure");
    const cDrive = data["C\\"] || data["C:\\\\"] || data["C:"] || data.C;
    if (!cDrive || cDrive.type !== "dir") throw new Error("Import is missing a C drive directory");
    if (!this.#isValidFileSystemNode(cDrive)) throw new Error("Import file system structure is invalid");
    return { "C\\": cDrive };
  }

  #resolveFileManagerPath(path = "C\\") {
    const normalized = (path || "C\\").replace(/\\+/g, "\\");
    const driveMatch = normalized.match(/^([A-Za-z]:?)(?:\\|$)/);
    const driveKey = driveMatch ? `${driveMatch[1].toUpperCase().replace(/:$/, "")}\\` : "C\\";
    const remainder = normalized.slice(driveKey.length).replace(/^\\/, "");
    const segments = remainder.split("\\").filter(Boolean);
    let current = this.fs.MOCK_FS[driveKey];
    let resolvedPath = driveKey;

    for (let i = 0; i < segments.length; i++) {
      if (!current?.children) return null;
      const next = current.children[segments[i]];
      if (!next || next.type !== "dir") return null;
      resolvedPath = resolvedPath.endsWith("\\")
        ? `${resolvedPath}${segments[i]}`
        : `${resolvedPath}\\${segments[i]}`;
      current = next;
    }

    return { path: resolvedPath, node: current };
  }

  #refreshOpenFileManagers() {
    if (!this.windowManager?.windows) return;
    this.windowManager.windows.forEach((win) => {
      if (win.type === "winfile" && win.el) {
        const resolved =
          this.#resolveFileManagerPath(win.el.cP || "C\\") || this.#resolveFileManagerPath("C\\");
        const resolvedPath = resolved?.path || "C\\";
        const resolvedDir = resolved?.node || this.fs.MOCK_FS["C\\"];

        win.el.cP = resolvedPath;
        win.el.cD = resolvedDir;
        win.el.currentDirObj = resolvedDir;
        rFT(win.el);
        rFL(win.el);
      }
    });
  }

  async #exportFileSystem() {
    const json = await this.fs.exportFileSystemAsJson();
    const stamp = new Date().toISOString().slice(0, 10);
    this.#downloadJson(json, `oriel-fs-${stamp}.json`);
  }

  #importFileSystem(event) {
    const input = event?.target;
    const file = input?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        const normalized = this.#normalizeImportedFileSystem(parsed);
        await this.fs.replaceFileSystem(normalized);
        this.#refreshOpenFileManagers();
        alert("File system imported successfully.");
      } catch (err) {
        alert(`Failed to import file system: ${err.message}`);
      } finally {
        if (input) input.value = "";
      }
    };
    reader.readAsText(file);
  }

  #getImportTargetDirectory() {
    const cDrive = this.fs.MOCK_FS["C\\"];
    if (!cDrive?.children) return null;

    if (!cDrive.children.DOCUMENTS) {
      cDrive.children.DOCUMENTS = { type: "dir", children: {} };
    }

    const documents = cDrive.children.DOCUMENTS;
    return documents?.type === "dir" ? documents : null;
  }

  #getAppForExtension(name = "") {
    const ext = name.toLowerCase().split(".").pop();
    if (!ext || ext === name.toLowerCase()) return "notepad";

    if (["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes(ext)) return "imageviewer";
    if (ext === "pdf") return "pdfreader";
    if (ext === "md" || ext === "markdown") return "markdown";

    return "notepad";
  }

  #getUniqueFileName(dir, desiredName) {
    if (!dir?.children || !desiredName) return desiredName;
    if (!dir.children[desiredName]) return desiredName;

    const lastDot = desiredName.lastIndexOf(".");
    const base = lastDot > 0 ? desiredName.slice(0, lastDot) : desiredName;
    const ext = lastDot > 0 ? desiredName.slice(lastDot) : "";
    let counter = 1;
    let candidate = `${base} (${counter})${ext}`;

    while (dir.children[candidate]) {
      counter += 1;
      candidate = `${base} (${counter})${ext}`;
    }

    return candidate;
  }

  #readFileForImport(file, app) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;
        if (app === "imageviewer" || app === "pdfreader") {
          resolve({ name: file.name, src: result });
        } else {
          resolve(result);
        }
      };

      reader.onerror = () => reject(reader.error);

      if (app === "imageviewer" || app === "pdfreader") {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
  }

  async #importDroppedFiles(files) {
    const targetDir = this.#getImportTargetDirectory();
    if (!targetDir) return;

    for (const file of files) {
      const app = this.#getAppForExtension(file.name);
      try {
        const content = await this.#readFileForImport(file, app);
        const filename = this.#getUniqueFileName(targetDir, file.name || "Untitled");
        targetDir.children[filename] = {
          type: "file",
          app,
          content
        };
      } catch (err) {
        console.error(`Failed to import file ${file.name}:`, err);
      }
    }

    await this.fs.saveFileSystem();
    publish("fs:change");
  }

  #initDragAndDropImport() {
    const target = this.dom.dragDropTarget;
    if (!target) return;

    target.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    target.addEventListener("drop", async (e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer?.files || []);
      if (!files.length) return;

      await this.#importDroppedFiles(files);
    });
  }

  #bootDesktop() {
    if (this.windowManager) return this.windowManager;
    this.windowManager = new this.WindowManager(this.initialDesktopState);
    window.wm = this.windowManager;
    return this.windowManager;
  }

  #resolveDesktopDirectory() {
    const preferredPaths = ["C\\DESKTOP", "C\\DOCUMENTS\\DESKTOP", "C\\DOCUMENTS"];
    for (const path of preferredPaths) {
      const resolved = this.#resolveFileManagerPath(path);
      if (resolved?.node?.type === "dir") return resolved;
    }
    return null;
  }

  async #createDesktopFolder() {
    const resolved = this.#resolveDesktopDirectory();
    if (!resolved?.node) {
      alert("Desktop folder is unavailable.");
      return;
    }
    const folderName = this.#getUniqueFolderName(resolved.node);
    const result = await this.#createNamedFolder(resolved.node, folderName);
    if (!result.success) {
      alert(result.message || "Unable to create folder.");
      return;
    }
    this.#refreshOpenFileManagers();
  }

  #openDesktopProperties() {
    if (!this.windowManager) return;
    const existing = this.windowManager.windows.find((win) => win.type === "control");
    const controlWin =
      existing || this.windowManager.openWindow("control", "Control Panel", 400, 300);
    if (!controlWin?.el) return;
    this.windowManager.focusWindow(controlWin.id);
    const viewArea = controlWin.el.querySelector(".cp-view-area");
    if (viewArea) openCPDesktop(controlPanelContext, viewArea);
  }

  #initDesktopContextMenu() {
    const desktop = this.dom.desktop;
    const menu = this.dom.contextMenu;
    if (!desktop || !menu) return;

    const hideMenu = () => {
      menu.style.display = "none";
    };

    const positionMenu = (x, y) => {
      menu.style.display = "block";
      menu.style.left = `${x}px`;
      menu.style.top = `${y}px`;
      const rect = menu.getBoundingClientRect();
      const adjustedLeft = Math.min(x, window.innerWidth - rect.width - 4);
      const adjustedTop = Math.min(y, window.innerHeight - rect.height - 4);
      menu.style.left = `${Math.max(0, adjustedLeft)}px`;
      menu.style.top = `${Math.max(0, adjustedTop)}px`;
    };

    desktop.addEventListener("contextmenu", (e) => {
      if (e.target.closest(".window")) return;
      e.preventDefault();
      positionMenu(e.clientX, e.clientY);
    });

    window.addEventListener("click", (e) => {
      if (!menu.contains(e.target)) hideMenu();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") hideMenu();
    });

    window.addEventListener("resize", hideMenu);

    menu.addEventListener("click", (e) => {
      const item = e.target.closest(".context-menu-item");
      if (!item) return;
      hideMenu();
      const action = item.dataset.action;
      if (action === "new-folder") this.#createDesktopFolder();
      if (action === "properties") this.#openDesktopProperties();
    });
  }

  #initSplash() {
    const splash = this.dom.splash;
    if (!splash) return;

    splash.style.backgroundImage = `url('${DEFAULT_SPLASH_IMAGE}')`;
    splash.style.backgroundSize = "cover";
    splash.style.backgroundPosition = "center";
    splash.style.backgroundRepeat = "no-repeat";

    const removeSplash = () => {
      splash.style.opacity = "0";
      setTimeout(() => {
        splash.style.display = "none";
      }, 200);
    };

    const timer = setTimeout(removeSplash, 5000);

    splash.addEventListener("click", () => {
      clearTimeout(timer);
      removeSplash();
    });
  }

  #registerWindowGlobals() {
    registerConsoleCommands();

    window.createFolder = this.#createFolder.bind(this);
    window.switchTask = switchTask;
    window.endTask = endTask;
    window.kernel = this.kernel;

    window.handleConsoleKey = handleConsoleKey;
    window.calcInput = calcInput;
    window.resetMines = resetMines;
    window.selectPaintTool = selectPaintTool;
    window.clearPaint = clearPaint;
    window.copyCharMap = copyCharMap;
    window.runCompiler = runCompiler;
    window.runPython = runPython;
    window.exportFileSystem = this.#exportFileSystem.bind(this);
    window.importFileSystem = this.#importFileSystem.bind(this);
    window.installSelectedManifest = this.#installSelectedManifest.bind(this);
    window.uninstallManifest = this.#uninstallManifest.bind(this);
    window.mountLocalFolder = this.#mountLocalFolder.bind(this);

    window.addDbRecord = addDbRecord;
    window.exportDbToCsv = exportDbToCsv;
    window.deleteDbRecord = deleteDbRecord;

    window.psTriggerOpen = psTriggerOpen;
    window.psNewDocument = psNewDocument;
    window.psExport = psExport;
    window.setPsTool = setPsTool;
    window.psApplyFilter = psApplyFilter;
    window.psFillCanvas = psFillCanvas;

    const openCPDesktopWithContext = (target, override) =>
      openCPDesktop(controlPanelContext, target, override);
    const openCPScreensaverWithContext = (target, override) =>
      openCPScreensaver(controlPanelContext, target, override);
    const applyScreensaverWithContext = () => applyScreensaver(controlPanelContext);
    const previewScreensaverWithContext = () => previewScreensaver(controlPanelContext);

    window.openCPColor = openCPColor;
    window.openCPDesktop = openCPDesktopWithContext;
    window.openCPScreensaver = openCPScreensaverWithContext;
    window.openCPSound = openCPSound;
    window.openCPFonts = openCPFonts;
    window.openCPDefaults = openCPDefaults;
    window.applyTheme = applyTheme;
    window.setWallpaper = setWallpaper;
    window.previewScreensaver = previewScreensaverWithContext;
    window.applyScreensaver = applyScreensaverWithContext;
    window.applyFontSelection = applyFontSelection;
    window.submitLockPassphrase = submitLockPassphrase;
    window.hideUnlockPrompt = hideUnlockPrompt;

    const getBrowserPlaceholder = () => {
      const { browserHome } = getNetworkDefaults();
      return browserHome || "https://example.com";
    };
    window.getBrowserPlaceholder = getBrowserPlaceholder;
  }
}

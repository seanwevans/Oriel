import { ICONS } from "./icons.js";
import {
  DEFAULT_MD_SAMPLE,
  DEFAULT_PDF_DATA_URI,
  DEFAULT_SPLASH_IMAGE,
  DEFAULT_WALLPAPER,
  IRC_BOT_MESSAGES
} from "./defaults.js";
import { loadDesktopState, persistDesktopState } from "./state.js";
import { applyWallpaperSettings, getWallpaperSettings } from "./wallpaper.js";
import { getMinecraftRoot, initMinecraft } from "./apps/minecraft.js";
import { getN64Root, initN64 } from "./apps/n64.js";
import { initNotepad } from "./apps/notepad.js";
import { initCardfile } from "./apps/cardfile.js";
import { initClock } from "./apps/clock.js";
import { getDiscordContent, initDiscord } from "./apps/discord.js";
import { getSpotifyContent, initSpotify } from "./apps/spotify.js";
import { getIRCContent, initIRC } from "./apps/irc.js";
import { initKakuro } from "./apps/kakuro.js";
import { initMarkdownViewer } from "./apps/markdown.js";
import { initMinesweeper, resetMines } from "./apps/minesweeper.js";
import { initPdfReader } from "./apps/pdfReader.js";
import { clearPaint, getPaintRoot, initPaint, selectPaintTool } from "./apps/paint.js";
import { initVm } from "./apps/vm.js";
import { initWrite } from "./apps/write.js";
import { initArtist } from "./apps/artist.js";
import { getSandspielRoot, initSandspiel } from "./apps/sandspiel.js";
import { getSandspiel3DRoot, initSandspiel3d } from "./apps/sandspiel3d.js";
import { initImageViewer } from "./apps/imageViewer.js";
import { initReversi } from "./apps/reversi.js";
import { initSolitaire } from "./apps/solitaire.js";
import { initSudoku } from "./apps/sudoku.js";
import { copyCharMap, initCharMap } from "./apps/charmap.js";
import { getBeatMakerContent, initBeatMaker } from "./apps/beatMaker.js";
import {
  addDbRecord,
  deleteDbRecord,
  exportDbToCsv,
  initDatabase
} from "./apps/database.js";
import { initMediaPlayer } from "./apps/mediaPlayer.js";
import {
  endTask,
  initTaskMan,
  refreshAllProcessViews,
  refreshAllTaskManagers,
  switchTask
} from "./apps/taskman.js";
import { initReset } from "./apps/reset.js";
import {
  MOCK_FS,
  exportFileSystemAsJson,
  hydrateNativeDirectory,
  isNativeFsSupported,
  mountNativeFolder,
  replaceFileSystem,
  saveFileSystem,
  fileSystemReady
} from "./filesystem.js";
import { publish, subscribe } from "./eventBus.js";
import {
  getLastNonZeroVolume,
  getMediaPlayerTracks,
  getSystemVolume,
  playVolumeTest,
  registerMediaElement,
  setSystemVolume
} from "./audio.js";
import {
  browserSessions,
  getNetworkDefaults,
  initBrowser,
  initRadio,
  initRadioGarden,
  initRssReader,
  refreshNetworkedWindows,
  resetNetworkDefaults,
  updateNetworkDefaults
} from "./networking.js";
import { initHexEditor } from "./apps/hexEditor.js";
import { initSoundRecorder } from "./apps/soundRecorder.js";
import { initDoom } from "./apps/doom.js";
import {
  getWinFileContent,
  initFileManager,
  installSelectionFromWindow,
  rFL,
  rFT,
  uninstallSelectionFromWindow
} from "./apps/fileManager.js";
import {
  calcInput,
  handleConsoleKey,
  initConsole,
  registerConsoleCommands,
  runCompiler,
  runPython
} from "./apps/console.js";
import {
  getPhotoshopContent,
  initPhotoshop,
  psApplyFilter,
  psExport,
  psFillCanvas,
  psNewDocument,
  psTriggerOpen,
  setPsTool
} from "./apps/photoshop.js";
import { SimulatedKernel } from "./kernel.js";
import { loadThree } from "./threeLoader.js";
import { getLineRiderContent, initLineRider } from "./apps/linerider.js";
import { getSimCityContent, initSimCity } from "./apps/simcity.js";
import { getSkiFreeContent, initSkiFree } from "./apps/skifree.js";
import { getCalcContent } from "./apps/calc.js";
import { getReadmeContent } from "./apps/readme.js";
import { getRssReaderContent } from "./apps/rss.js";
import { getClipboardContent } from "./apps/clipboard.js";
import { getTi83Root, initTi83 } from "./apps/ti83.js";
import {
  getAvailablePrograms as getProgramManagerApps,
  getIconForType as getProgramManagerIcon,
  getProgramDefaults as getProgramManagerDefaults,
  getProgramManagerContent,
  refreshProgramManagerContent,
  setupProgramManagerMenu
} from "./apps/programManager.js";
import {
  applyFontSelection,
  applySavedTheme,
  applyScreensaver,
  applyTheme,
  getCurrentThemeCustom,
  handleThemeInputChange,
  initControlPanel,
  openCPColor,
  openCPDefaults,
  openCPDesktop,
  openCPFonts,
  openCPScreensaver,
  openCPSound,
  previewScreensaver,
  setWallpaper
} from "./apps/controlPanel.js";
import {
  bootstrapInstallations,
  getRuntimeInitializer
} from "./installer.js";
import { initChess } from "./apps/chess.js";
import { initPapersPlease } from "./apps/papersPlease.js";

let THREE = null;
const controlPanelContext = {};

const APP_INITIALIZERS = {
  mines: initMinesweeper,
  kakuro: initKakuro,
  solitaire: initSolitaire,
  reversi: initReversi,
  sudoku: initSudoku,
  paint: initPaint,
  notepad: initNotepad,
  photoshop: initPhotoshop,
  artist: initArtist,
  mplayer: initMediaPlayer,
  simcity: initSimCity,
  skifree: initSkiFree,
  linerider: initLineRider,
  database: initDatabase,
  soundrec: initSoundRecorder,
  radio: initRadio,
  beatmaker: initBeatMaker,
  charmap: initCharMap,
  winfile: initFileManager,
  clock: initClock,
  control: (w, initData, wmInstance) =>
    initControlPanel(controlPanelContext, w, initData, wmInstance),
  reset: initReset,
  chess: initChess,
  console: initConsole,
  write: initWrite,
  cardfile: initCardfile,
  taskman: initTaskMan,
  pdfreader: initPdfReader,
  imageviewer: initImageViewer,
  markdown: initMarkdownViewer,
  rss: initRssReader,
  browser: initBrowser,
  radiogarden: initRadioGarden,
  discord: initDiscord,
  irc: initIRC,
  spotify: initSpotify,
  doom: initDoom,
  minecraft: initMinecraft,
  n64: initN64,
  ti83: initTi83,
  sandspiel: initSandspiel,
  sandspiel3d: initSandspiel3d,
  papers: initPapersPlease,
  vm: initVm,
  hexedit: initHexEditor
};

async function ensureThree() {
  if (!THREE) THREE = await loadThree();
  return THREE;
}



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

function normalizeFolderName(name) {
  return name?.toUpperCase() ?? "";
}

function getUniqueFolderName(targetDir, baseName = "New Folder") {
  if (!targetDir?.children) return baseName;
  const existingNames = new Set(
    Object.keys(targetDir.children).map((childName) => normalizeFolderName(childName))
  );
  let candidate = baseName;
  let counter = 1;
  while (existingNames.has(normalizeFolderName(candidate))) {
    candidate = `${baseName} (${counter})`;
    counter++;
  }
  return candidate;
}

async function createNamedFolder(targetDir, name) {
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
  if (trimmedName && RESERVED_FOLDER_NAMES.has(normalizeFolderName(trimmedName))) {
    return {
      success: false,
      message:
        "That folder name is reserved by the system. Choose a different name and try again."
    };
  }

  let finalName = trimmedName || getUniqueFolderName(targetDir);
  if (targetDir.children) {
    const normalized = normalizeFolderName(finalName);
    const existingNames = Object.keys(targetDir.children).map((childName) =>
      normalizeFolderName(childName)
    );
    if (existingNames.includes(normalized)) {
      finalName = getUniqueFolderName(targetDir, finalName);
    }
  }

  if (targetDir.children?.[finalName]) {
    return { success: false, message: "Folder already exists!" };
  }
  if (targetDir.nativeHandle) {
    try {
      await targetDir.nativeHandle.getDirectoryHandle(finalName, { create: true });
      await hydrateNativeDirectory(targetDir);
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
    saveFileSystem(); // Save changes
  }
  return { success: true };
}

async function createFolder(btn) {
  const win = btn.closest(".window");
  const input = win.querySelector("#new-folder-name");
  const name = input.value.trim();
  if (name && win.currentDirObj) {
    const result = await createNamedFolder(win.currentDirObj, name);
    if (!result.success) {
      alert(result.message);
      return;
    }
    input.value = "";
    await rFT(win);
    await rFL(win);
  }
}

async function mountLocalFolder(btn) {
  if (!isNativeFsSupported()) {
    alert("Mounting a local folder requires a compatible browser.");
    return;
  }

  try {
    const driveNode = await mountNativeFolder();
    await hydrateNativeDirectory(driveNode);
    const win = btn.closest(".window");
    if (win) {
      win.cP = Object.keys(MOCK_FS).includes("D\\") ? "D\\" : win.cP;
      win.cD = MOCK_FS[win.cP] || driveNode;
      win.currentDirObj = win.cD;
      await rFT(win);
      await rFL(win);
    }
  } catch (err) {
    if (err?.name === "AbortError") return;
    alert(`Failed to mount folder: ${err.message}`);
  }
}

async function installSelectedManifest(btn) {
  const win = btn.closest(".window");
  if (!win) return;
  try {
    const manifest = await installSelectionFromWindow(win);
    alert(`Installed ${manifest.name} (${manifest.id})`);
  } catch (err) {
    alert(err.message || "Unable to install manifest.");
  }
}

async function uninstallManifest(btn) {
  const win = btn.closest(".window");
  if (!win) return;
  try {
    const removedId = await uninstallSelectionFromWindow(win);
    alert(`Uninstalled ${removedId}`);
  } catch (err) {
    alert(err.message || "Unable to uninstall app.");
  }
}

function downloadJson(content, filename) {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function isValidFileSystemNode(node) {
  if (!node || typeof node !== "object") return false;
  if (node.type === "dir") {
    if (typeof node.children !== "object") return false;
    return Object.values(node.children).every((child) => isValidFileSystemNode(child));
  }
  if (node.type === "file") return true;
  return false;
}

function normalizeImportedFileSystem(data) {
  if (!data || typeof data !== "object") throw new Error("Invalid JSON structure");
  const cDrive = data["C\\"] || data["C:\\\\"] || data["C:"] || data.C;
  if (!cDrive || cDrive.type !== "dir") throw new Error("Import is missing a C drive directory");
  if (!isValidFileSystemNode(cDrive)) throw new Error("Import file system structure is invalid");
  return { "C\\": cDrive };
}

function resolveFileManagerPath(path = "C\\") {
  const normalized = (path || "C\\").replace(/\\+/g, "\\");
  const driveMatch = normalized.match(/^([A-Za-z]:?)(?:\\|$)/);
  const driveKey = driveMatch ? `${driveMatch[1].toUpperCase().replace(/:$/, "")}\\` : "C\\";
  const remainder = normalized.slice(driveKey.length).replace(/^\\/, "");
  const segments = remainder.split("\\").filter(Boolean);
  let current = MOCK_FS[driveKey];
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

function refreshOpenFileManagers() {
  if (!wm?.windows) return;
  wm.windows.forEach((win) => {
    if (win.type === "winfile" && win.el) {
      const resolved =
        resolveFileManagerPath(win.el.cP || "C\\") || resolveFileManagerPath("C\\");
      const resolvedPath = resolved?.path || "C\\";
      const resolvedDir = resolved?.node || MOCK_FS["C\\"];

      win.el.cP = resolvedPath;
      win.el.cD = resolvedDir;
      win.el.currentDirObj = resolvedDir;
      rFT(win.el);
      rFL(win.el);
    }
  });
}

async function exportFileSystem() {
  const json = await exportFileSystemAsJson();
  const stamp = new Date().toISOString().slice(0, 10);
  downloadJson(json, `oriel-fs-${stamp}.json`);
}

function importFileSystem(event) {
  const input = event?.target;
  const file = input?.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      const normalized = normalizeImportedFileSystem(parsed);
      await replaceFileSystem(normalized);
      refreshOpenFileManagers();
      alert("File system imported successfully.");
    } catch (err) {
      alert(`Failed to import file system: ${err.message}`);
    } finally {
      if (input) input.value = "";
    }
  };
  reader.readAsText(file);
}

function getImportTargetDirectory() {
  const cDrive = MOCK_FS["C\\"];
  if (!cDrive?.children) return null;

  if (!cDrive.children.DOCUMENTS) {
    cDrive.children.DOCUMENTS = { type: "dir", children: {} };
  }

  const documents = cDrive.children.DOCUMENTS;
  return documents?.type === "dir" ? documents : null;
}

function getAppForExtension(name = "") {
  const ext = name.toLowerCase().split(".").pop();
  if (!ext || ext === name.toLowerCase()) return "notepad";

  if (["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes(ext)) return "imageviewer";
  if (ext === "pdf") return "pdfreader";
  if (ext === "md" || ext === "markdown") return "markdown";

  return "notepad";
}

function getUniqueFileName(dir, desiredName) {
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

function readFileForImport(file, app) {
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

async function importDroppedFiles(files) {
  const targetDir = getImportTargetDirectory();
  if (!targetDir) return;

  for (const file of files) {
    const app = getAppForExtension(file.name);
    try {
      const content = await readFileForImport(file, app);
      const filename = getUniqueFileName(targetDir, file.name || "Untitled");
      targetDir.children[filename] = {
        type: "file",
        app,
        content
      };
    } catch (err) {
      console.error(`Failed to import file ${file.name}:`, err);
    }
  }

  await saveFileSystem();
  publish("fs:change");
}

function initDragAndDropImport() {
  const target = document.getElementById("desktop") || document.body;
  if (!target) return;

  target.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  target.addEventListener("drop", async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || []);
    if (!files.length) return;

    await importDroppedFiles(files);
  });
}

subscribe("fs:change", refreshOpenFileManagers);
subscribe("network:config-update", refreshNetworkedWindows);
const installerReady = bootstrapInstallations().catch((err) => {
  console.warn("Failed to bootstrap installed apps", err);
});

export const kernel = new SimulatedKernel(() => refreshAllProcessViews());
const getBrowserPlaceholder = () => {
  const { browserHome } = getNetworkDefaults();
  return browserHome || "https://example.com";
};

class WindowManager {
  constructor(initialState = null) {
    this.desktop = document.getElementById("desktop");
    this.minimizedContainer = document.getElementById("minimized-container");
    this.windows = [];
    this.highestZ = 100;
    this.isRestoring = false;
    this.dragState = {
      isDragging: false,
      initialX: 0,
      initialY: 0,
      offX: 0,
      offY: 0,
      currentWin: null
    };
    this.resizeState = {
      isResizing: false,
      currentWin: null,
      handleType: null,
      initialX: 0,
      initialY: 0,
      initialW: 0,
      initialH: 0,
      initialL: 0,
      initialT: 0
    };
    // Global Listeners
    window.addEventListener("mousemove", (e) => {
      this.onDrag(e);
      this.onResize(e);
    });
    window.addEventListener("mouseup", () => {
      this.endDrag();
      this.endResize();
    });
    window.addEventListener("keydown", (e) => this.handleWindowShortcuts(e));
    this.unsubscribeAppChange = subscribe("apps:change", () =>
      refreshProgramManagerContent(this)
    );
    // Restore prior desktop state
    if (initialState && initialState.windows?.length) {
      this.isRestoring = true;
      this.restoreWindows(initialState.windows);
      const top = this.getTopWindowByZ();
      if (top) this.focusWindow(top.id);
      this.isRestoring = false;
      this.highestZ = Math.max(
        this.highestZ,
        ...initialState.windows.map((w) => w.zIndex || 100)
      );
      this.saveDesktopState();
    }
    if (this.windows.length === 0)
      this.openWindow("progman", "Program Manager", 500, 480);
  }
  addKeyboardActivation(el, handler) {
    if (!el) return;
    el.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handler();
      }
    });
  }
  setupMenuBar(win) {
    const menuBar = win.querySelector(".menu-bar");
    if (!menuBar) return;
    const items = Array.from(menuBar.querySelectorAll(".menu-item"));
    if (!items.length) return;

    menuBar.setAttribute("role", "menubar");
    let focusedIndex = 0;

    const focusItem = (idx) => {
      const safeIndex = ((idx % items.length) + items.length) % items.length;
      focusedIndex = safeIndex;
      items.forEach((item, i) => {
        item.tabIndex = i === safeIndex ? 0 : -1;
      });
      items[safeIndex].focus();
    };

    items.forEach((item, idx) => {
      item.setAttribute("role", "menuitem");
      item.tabIndex = idx === 0 ? 0 : -1;
      item.addEventListener("focus", () => {
        focusedIndex = idx;
      });
      item.addEventListener("click", () => {
        focusedIndex = idx;
        focusItem(idx);
      });
      item.addEventListener("keydown", (e) => {
        const key = e.key;
        if (key === "ArrowRight") {
          e.preventDefault();
          focusItem(focusedIndex + 1);
        } else if (key === "ArrowLeft") {
          e.preventDefault();
          focusItem(focusedIndex - 1);
        } else if (key === "Home") {
          e.preventDefault();
          focusItem(0);
        } else if (key === "End") {
          e.preventDefault();
          focusItem(items.length - 1);
        } else if (key === "Enter" || key === " ") {
          e.preventDefault();
          item.click();
        } else if (key === "Escape") {
          e.preventDefault();
          item.blur();
        }
      });
    });
  }
  createWindowDOM(id, title, width, height, content, stateOverrides = {}) {
    const win = document.createElement("div");
    win.classList.add("window");
    const resolvedWidth =
      typeof width === "number" ? `${width}px` : width || width === 0 ? width : "";
    const resolvedHeight =
    win.setAttribute("role", "dialog");
    win.setAttribute("aria-label", title);
    win.style.width =
      typeof width === "number" ? width + "px" : width || width === 0 ? width : "";
    win.style.height =
      typeof height === "number"
        ? `${height}px`
        : height || height === 0
          ? height
          : "";
    const resolvedLeft =
      stateOverrides.left !== undefined
        ? stateOverrides.left
        : `${40 + this.windows.length * 20}px`;
    const resolvedTop =
      stateOverrides.top !== undefined
        ? stateOverrides.top
        : `${40 + this.windows.length * 20}px`;
    win.style.width = resolvedWidth;
    win.style.height = resolvedHeight;
    win.style.left = typeof resolvedLeft === "number" ? `${resolvedLeft}px` : resolvedLeft;
    win.style.top = typeof resolvedTop === "number" ? `${resolvedTop}px` : resolvedTop;
    win.dataset.id = id;
    win.dataset.type = title; // For task manager filter
    // HTML Structure with Resize Handles
    win.innerHTML = `
                <div class="resizer n" data-resize="n"></div>
                <div class="resizer s" data-resize="s"></div>
                <div class="resizer e" data-resize="e"></div>
                <div class="resizer w" data-resize="w"></div>
                <div class="resizer ne" data-resize="ne"></div>
                <div class="resizer nw" data-resize="nw"></div>
                <div class="resizer se" data-resize="se"></div>
                <div class="resizer sw" data-resize="sw"></div>
                <div class="title-bar">
                    <div class="sys-box" onclick="wm.closeWindow('${id}')">-</div>
                    <div class="title-bar-text">${title}</div>
                    <div class="win-controls-right">
                        <div class="win-btn" onclick="wm.minimizeWindow('${id}')">▼</div>
                        <div class="win-btn" onclick="wm.maximizeWindow('${id}')">▲</div>
                    </div>
                </div>
                <div class="menu-bar">
                    <div class="menu-item">File</div>
                    <div class="menu-item">Edit</div>
                    <div class="menu-item">Help</div>
                </div>
                <div class="window-body">
                    ${content}
                </div>
            `;
    // Drag Start
    const titleBar = win.querySelector(".title-bar");
    titleBar.addEventListener("mousedown", (e) => {
      if (
        e.target.classList.contains("sys-box") ||
        e.target.classList.contains("win-btn")
      )
        return;
      this.startDrag(e, win);
    });
    // Accessibility: make window controls keyboard operable
    const closeBtn = win.querySelector(".sys-box");
    closeBtn.setAttribute("role", "button");
    closeBtn.setAttribute("aria-label", `Close ${title}`);
    closeBtn.tabIndex = 0;
    this.addKeyboardActivation(closeBtn, () => this.closeWindow(id));

    const minimizeBtn = win.querySelector(".win-btn:nth-child(1)");
    minimizeBtn.setAttribute("role", "button");
    minimizeBtn.setAttribute("aria-label", `Minimize ${title}`);
    minimizeBtn.tabIndex = 0;
    this.addKeyboardActivation(minimizeBtn, () => this.minimizeWindow(id));

    const maximizeBtn = win.querySelector(".win-btn:nth-child(2)");
    maximizeBtn.setAttribute("role", "button");
    maximizeBtn.setAttribute("aria-label", `Maximize ${title}`);
    maximizeBtn.tabIndex = 0;
    this.addKeyboardActivation(maximizeBtn, () => this.maximizeWindow(id));
    this.setupMenuBar(win);
    // Resize Start
    win.querySelectorAll(".resizer").forEach((r) => {
      r.addEventListener("mousedown", (e) =>
        this.startResize(e, win, r.dataset.resize)
      );
    });
    // Focus on click
    win.addEventListener("mousedown", () => this.focusWindow(id));
    return win;
  }
  openWindow(type, title, w, h, initData = null, stateOverrides = {}) {
    const id = stateOverrides.id || "win-" + Date.now();
    let content = "";
    const defaults = getProgramManagerDefaults(type) || {};
    const resolvedWidth = w || defaults.width || 500;
    const resolvedHeight = h || defaults.height || 400;
    // Generate App Content
    if (type === "progman") content = getProgramManagerContent(this);
    if (type === "notepad") content = this.getNotepadContent(initData);
    if (type === "write") content = this.getWriteContent(initData);
    if (type === "cardfile") content = this.getCardfileContent();
    if (type === "calc") content = getCalcContent();
    if (type === "mines") content = this.getMinesContent();
    if (type === "kakuro") content = this.getKakuroContent();
    if (type === "solitaire") content = this.getSolitaireContent();
    if (type === "reversi") content = this.getReversiContent();
    if (type === "sudoku") content = this.getSudokuContent();
    if (type === "photoshop") content = getPhotoshopContent();
    if (type === "artist") content = this.getArtistContent();
    if (type === "compiler") content = this.getCompilerContent();
    if (type === "python") content = this.getPythonContent();
    if (type === "console") content = this.getConsoleContent();
    if (type === "taskman") content = this.getTaskManContent();
    if (type === "chess") content = this.getChessContent();
    if (type === "paint") content = getPaintRoot(initData);
    if (type === "mplayer") content = this.getMediaPlayerContent();
    if (type === "simcity") content = getSimCityContent();
    if (type === "skifree") content = getSkiFreeContent();
    if (type === "linerider") content = getLineRiderContent();
    if (type === "database") content = this.getDatabaseContent();
    if (type === "soundrec") content = this.getSoundRecContent();
    if (type === "radio") content = this.getRadioContent();
    if (type === "beatmaker") content = getBeatMakerContent();
    if (type === "charmap") content = this.getCharMapContent();
    if (type === "winfile") content = getWinFileContent();
    if (type === "clock") content = this.getClockContent();
    if (type === "control") content = this.getControlPanelContent();
    if (type === "clipbrd") content = getClipboardContent();
    if (type === "readme") content = getReadmeContent();
    if (type === "pdfreader") content = this.getPdfReaderContent(initData);
    if (type === "imageviewer") content = this.getImageViewerContent(initData);
    if (type === "markdown") content = this.getMarkdownContent(initData);
    if (type === "reset") content = this.getResetContent();
    if (type === "rss") content = getRssReaderContent();
    if (type === "browser") content = this.getBrowserContent();
    if (type === "radiogarden") content = this.getRadioGardenContent();
    if (type === "discord") content = getDiscordContent();
    if (type === "spotify") content = getSpotifyContent();
    if (type === "irc") content = getIRCContent();
    if (type === "vm") content = this.getVmContent();
    if (type === "doom") content = this.getDoomContent();
    if (type === "minecraft") content = this.getMinecraftContent();
    if (type === "n64") content = this.getN64Content();
    if (type === "ti83") content = this.getTi83Content();
    if (type === "sandspiel") content = this.getSandspielContent();
    if (type === "sandspiel3d") content = this.getSandspiel3DContent();
    if (type === "papers") content = this.getPapersContent();
    if (type === "hexedit") content = this.getHexEditorContent();
    if (!content && getRuntimeInitializer(type)) {
      content = `<div class="runtime-app" data-app="${type}">Loading ${title}...</div>`;
    }
    const winEl = this.createWindowDOM(id, title, resolvedWidth, resolvedHeight, content, stateOverrides);
    this.desktop.appendChild(winEl);
    if (type === "progman") setupProgramManagerMenu(this, winEl);
    const rect = winEl.getBoundingClientRect();
    const initialRect = {
      left: winEl.offsetLeft,
      top: winEl.offsetTop,
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    };
    const winObj = {
      id,
      el: winEl,
      type,
      title,
      minimized: false,
      maximized: false,
      prevRect: stateOverrides.prevRect || null,
      lastRect: initialRect
    };
    if (stateOverrides.zIndex) {
      winEl.style.zIndex = stateOverrides.zIndex;
      this.highestZ = Math.max(this.highestZ, stateOverrides.zIndex);
    }
    this.windows.push(winObj);
    // Register Process
    kernel.registerProcess(id, title);
    if (!this.isRestoring) this.focusWindow(id);
    // Initialize app logic if needed
    const initializer = APP_INITIALIZERS[type] || getRuntimeInitializer(type);
    if (initializer) {
      try {
        initializer(winEl, initData, this);
      } catch (err) {
        console.error(`Initializer for '${type}' failed:`, err);
        this.renderRuntimeError(winEl, err);
      }
    } else if (!APP_INITIALIZERS[type]) {
      this.renderRuntimeError(winEl, new Error(`No initializer registered for ${type}`));
    }
    // Refresh logic
    refreshAllTaskManagers(this);
    if (stateOverrides.maximized) this.maximizeWindow(id);
    if (stateOverrides.minimized) this.minimizeWindow(id);
    this.saveDesktopState();
    return winObj;
  }
  closeWindow(id) {
    const index = this.windows.findIndex((w) => w.id === id);
    if (index > -1) {
      const closingWin = this.windows[index];
      if (typeof closingWin.el.chessCleanup === "function")
        closingWin.el.chessCleanup();
      if (typeof closingWin.el.skifreeCleanup === "function")
        closingWin.el.skifreeCleanup();
      if (typeof closingWin.el.lineRiderCleanup === "function")
        closingWin.el.lineRiderCleanup();
      if (typeof closingWin.el.sandspiel3dCleanup === "function")
        closingWin.el.sandspiel3dCleanup();
      if (typeof closingWin.el.ircCleanup === "function") closingWin.el.ircCleanup();
      if (closingWin.el.doomCI) {
        closingWin.el.doomCI.exit();
        closingWin.el.doomCI = null;
      }
      closingWin.el.remove();
      // Remove minimized icon if exists
      const minIcon = document.getElementById("min-" + id);
      if (minIcon) minIcon.remove();
      this.windows.splice(index, 1);
      delete browserSessions[id];
      // Kill Process
      kernel.unregisterProcess(id);
      refreshAllTaskManagers(this);
      this.saveDesktopState();
    }
  }
  minimizeWindow(id) {
    const win = this.windows.find((w) => w.id === id);
    if (!win) return;
    win.lastRect = this.getWindowRectSnapshot(win);
    if (win.minimized) return;
    win.el.style.display = "none";
    win.minimized = true;
    // Create Icon at bottom
    const existing = document.getElementById("min-" + id);
    if (existing) existing.remove();
    const icon = document.createElement("div");
    icon.id = "min-" + id;
    icon.className = "desktop-icon minimized";
    icon.setAttribute("role", "button");
    icon.setAttribute(
      "aria-label",
      `Restore ${win.el.querySelector(".title-bar-text").innerText} window`
    );
    icon.tabIndex = 0;
    icon.innerHTML = `
                <div class="icon-img">${this.getIconForType(win.type)}</div>
                <div class="icon-label">${
                  win.el.querySelector(".title-bar-text").innerText
                }</div>
            `;
    icon.onclick = () => this.restoreWindow(id);
    this.addKeyboardActivation(icon, () => this.restoreWindow(id));
    this.minimizedContainer.appendChild(icon);
    this.saveDesktopState();
  }
  restoreWindow(id) {
    const win = this.windows.find((w) => w.id === id);
    if (!win) return;
    win.el.style.display = "flex";
    win.minimized = false;
    const minIcon = document.getElementById("min-" + id);
    if (minIcon) minIcon.remove();
    this.focusWindow(id);
    this.saveDesktopState();
  }
  maximizeWindow(id) {
    const win = this.windows.find((w) => w.id === id);
    if (!win) return;
    if (!win.maximized) {
      win.prevRect =
        win.prevRect || {
          top: win.el.style.top,
          left: win.el.style.left,
          width: win.el.style.width,
          height: win.el.style.height
        };
      win.el.style.top = "0";
      win.el.style.left = "0";
      win.el.style.width = "100%";
      win.el.style.height = "100%";
      win.maximized = true;
    } else {
      win.el.style.top = win.prevRect.top;
      win.el.style.left = win.prevRect.left;
      win.el.style.width = win.prevRect.width;
      win.el.style.height = win.prevRect.height;
      win.maximized = false;
    }
    this.focusWindow(id);
    this.saveDesktopState();
  }
  focusWindow(id) {
    if (this.isRestoring) {
      this.windows.forEach((w) =>
        w.el.classList.toggle("active", w.id === id)
      );
      return;
    }
    this.highestZ++;
    this.windows.forEach((w) => {
      if (w.id === id) {
        w.el.style.zIndex = this.highestZ;
        w.el.classList.add("active");
      } else {
        w.el.classList.remove("active");
      }
    });
    this.saveDesktopState();
  }
  // Drag Logic
  startDrag(e, winEl) {
    if (e.target.closest(".win-btn") || e.target.closest(".sys-box")) return;
    this.dragState.isDragging = true;
    this.dragState.currentWin = winEl;
    this.dragState.initialX = e.clientX;
    this.dragState.initialY = e.clientY;
    const rect = winEl.getBoundingClientRect();
    this.dragState.offX = winEl.offsetLeft;
    this.dragState.offY = winEl.offsetTop;
    this.focusWindow(winEl.dataset.id);
  }
  onDrag(e) {
    if (!this.dragState.isDragging) return;
    const dx = e.clientX - this.dragState.initialX;
    const dy = e.clientY - this.dragState.initialY;
    this.dragState.currentWin.style.left = this.dragState.offX + dx + "px";
    this.dragState.currentWin.style.top = this.dragState.offY + dy + "px";
  }
  endDrag() {
    this.dragState.isDragging = false;
    this.dragState.currentWin = null;
    this.saveDesktopState();
  }
  // Resize Logic
  startResize(e, winEl, type) {
    e.stopPropagation();
    e.preventDefault();
    this.resizeState.isResizing = true;
    this.resizeState.currentWin = winEl;
    this.resizeState.handleType = type;
    this.resizeState.initialX = e.clientX;
    this.resizeState.initialY = e.clientY;
    const rect = winEl.getBoundingClientRect();
    this.resizeState.initialW = rect.width;
    this.resizeState.initialH = rect.height;
    this.resizeState.initialL = rect.left;
    this.resizeState.initialT = rect.top;
    this.focusWindow(winEl.dataset.id);
  }
  onResize(e) {
    if (!this.resizeState.isResizing) return;
    const dx = e.clientX - this.resizeState.initialX;
    const dy = e.clientY - this.resizeState.initialY;
    const type = this.resizeState.handleType;
    const win = this.resizeState.currentWin;
    let newW = this.resizeState.initialW;
    let newH = this.resizeState.initialH;
    let newL = this.resizeState.initialL;
    let newT = this.resizeState.initialT;
    if (type.includes("e")) newW += dx;
    if (type.includes("s")) newH += dy;
    if (type.includes("w")) {
      newW -= dx;
      newL += dx;
    }
    if (type.includes("n")) {
      newH -= dy;
      newT += dy;
    }
    if (newW > 100) {
      win.style.width = newW + "px";
      win.style.left = newL + "px";
    }
    if (newH > 100) {
      win.style.height = newH + "px";
      win.style.top = newT + "px";
    }
  }
  endResize() {
    this.resizeState.isResizing = false;
    this.resizeState.currentWin = null;
    this.saveDesktopState();
  }
  restoreWindows(windowsState = []) {
    windowsState.forEach((winState) => {
      const defaults = this.getProgramDefaults(winState.type);
      const width =
        typeof winState.width === "number"
          ? winState.width
          : winState.width || defaults?.width || 500;
      const height =
        typeof winState.height === "number"
          ? winState.height
          : winState.height || defaults?.height || 400;
      this.openWindow(
        winState.type || "progman",
        winState.title || defaults?.title || "Window",
        width,
        height,
        null,
        {
          id: winState.id,
          left: winState.left,
          top: winState.top,
          width,
          height,
          maximized: winState.maximized,
          minimized: winState.minimized,
          prevRect: winState.prevRect,
          zIndex: winState.zIndex
        }
      );
    });
  }
  getWindowStateSnapshot() {
    return this.windows.map((w) => {
      const rect = this.getWindowRectSnapshot(w);
      return {
        id: w.id,
        type: w.type,
        title: w.title,
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        minimized: w.minimized,
        maximized: w.maximized,
        prevRect: w.prevRect,
        zIndex: parseInt(w.el.style.zIndex || `${this.highestZ}`, 10)
      };
    });
  }
  getWindowRectSnapshot(win) {
    if (win.minimized && win.lastRect) return win.lastRect;
    const rect = win.el.getBoundingClientRect();
    const snapshot = {
      left: win.el.offsetLeft,
      top: win.el.offsetTop,
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    };
    win.lastRect = snapshot;
    return snapshot;
  }
  getTopWindowByZ() {
    if (this.windows.length === 0) return null;
    return this.windows.reduce((top, current) => {
      const currentZ = parseInt(current.el.style.zIndex || "0", 10);
      const topZ = parseInt(top.el.style.zIndex || "0", 10);
      return currentZ >= topZ ? current : top;
    });
  }
  cascadeWindows() {
    const openWins = this.windows
      .filter((w) => !w.minimized)
      .sort(
        (a, b) =>
          parseInt(a.el.style.zIndex || "0", 10) -
          parseInt(b.el.style.zIndex || "0", 10)
      );
    if (!openWins.length) return;

    const desktopRect = this.desktop.getBoundingClientRect();
    const width = Math.floor(desktopRect.width * 0.8);
    const height = Math.floor(desktopRect.height * 0.8);

    openWins.forEach((win, idx) => {
      win.maximized = false;
      win.prevRect = null;
      win.el.style.width = `${width}px`;
      win.el.style.height = `${height}px`;
      win.el.style.left = `${idx * 20}px`;
      win.el.style.top = `${idx * 20}px`;
    });
    this.saveDesktopState();
  }
  tileWindows() {
    const openWins = this.windows.filter((w) => !w.minimized);
    if (!openWins.length) return;

    const desktopRect = this.desktop.getBoundingClientRect();
    const count = openWins.length;
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    const width = Math.floor(desktopRect.width / cols);
    const height = Math.floor(desktopRect.height / rows);

    openWins.forEach((win, idx) => {
      const row = Math.floor(idx / cols);
      const col = idx % cols;
      win.maximized = false;
      win.prevRect = null;
      win.el.style.width = `${width}px`;
      win.el.style.height = `${height}px`;
      win.el.style.left = `${col * width}px`;
      win.el.style.top = `${row * height}px`;
    });
    this.saveDesktopState();
  }
  handleWindowShortcuts(event) {
    const active = this.getTopWindowByZ();
    if (!active || event.defaultPrevented) return;
    if (event.altKey && event.key === "F4") {
      event.preventDefault();
      this.closeWindow(active.id);
    }
    if (event.altKey && event.key.toLowerCase() === "m") {
      event.preventDefault();
      this.minimizeWindow(active.id);
    }
    if (event.altKey && event.key.toLowerCase() === "x") {
      event.preventDefault();
      this.maximizeWindow(active.id);
    }
  }
  getAvailablePrograms() {
    return getProgramManagerApps();
  }
  getProgramDefaults(type) {
    return getProgramManagerDefaults(type);
  }
  saveDesktopState() {
    if (this.isRestoring) return;
    const state = {
      windows: this.getWindowStateSnapshot(),
      wallpaper: getWallpaperSettings(),
      themeCustom: getCurrentThemeCustom()
    };
    persistDesktopState(state);
  }
  // Helper: Icons
  getIconForType(type) {
    return getProgramManagerIcon(type);
  }
  renderRuntimeError(winEl, err) {
    const contentArea = winEl?.querySelector(".window-content");
    if (!contentArea) return;
    contentArea.innerHTML = `<div class="runtime-error">Unable to start app: ${err.message}</div>`;
  }
  setupProgramManagerMenu(win) {
    setupProgramManagerMenu(this, win);
  }
  // Content Generators
  getProgramManagerContent() {
    return getProgramManagerContent(this);
  }
  refreshProgramManagerContent() {
    refreshProgramManagerContent(this);
  }
  getPapersContent() {
    return `
                <div class="papers-layout">
                    <div class="papers-header">
                        <div class="papers-title">Checkpoint Alpha</div>
                        <div class="papers-subtitle">"Glory to Orielstotzka"</div>
                    </div>
                    <div class="papers-stats">Day <span class="papers-day">1</span> · Credits: <span class="papers-credits">20</span> · Citations: <span class="papers-mistakes">0</span></div>
                    <div class="papers-body">
                        <div class="papers-docs">
                            <div class="papers-photo"></div>
                            <div class="papers-fields">
                                <div class="papers-field"><span class="papers-label">Name:</span> <span class="papers-name">---</span></div>
                                <div class="papers-field"><span class="papers-label">Nation:</span> <span class="papers-nation">---</span></div>
                                <div class="papers-field"><span class="papers-label">ID:</span> <span class="papers-id">---</span></div>
                                <div class="papers-field"><span class="papers-label">Expires:</span> <span class="papers-expiry">---</span></div>
                                <div class="papers-field"><span class="papers-label">Purpose:</span> <span class="papers-purpose">---</span></div>
                            </div>
                        </div>
                        <div class="papers-reason">Review documents and choose to approve or deny.</div>
                        <div class="papers-actions">
                            <button class="task-btn papers-approve">Approve</button>
                            <button class="task-btn papers-deny">Deny</button>
                            <button class="task-btn papers-next">Next Traveler</button>
                        </div>
                        <div class="papers-log" tabindex="0">Checkpoint initialized.</div>
                    </div>
                </div>
            `;
  }
  getBrowserContent() {
    return `<div class="browser-layout">
              <div class="browser-toolbar">
                <button class="browser-btn" data-action="back" title="Back">◀</button>
                <button class="browser-btn" data-action="forward" title="Forward">▶</button>
                <button class="browser-btn" data-action="refresh" title="Refresh">⟳</button>
                <button class="browser-btn" data-action="home" title="Home">⌂</button>
                <input class="browser-url" type="text" placeholder="${getBrowserPlaceholder()}" spellcheck="false">
                <button class="browser-btn go-btn" data-action="go">Go</button>
              </div>
              <div class="browser-view">
                <iframe class="browser-frame" src="about:blank" sandbox="allow-scripts allow-forms allow-pointer-lock allow-popups"></iframe>
                <div class="browser-status">Enter a URL to begin browsing.</div>
              </div>
            </div>`;
  }
  getRadioGardenContent() {
    return `<div class="radio-garden">
              <div class="radio-header">
                <div>
                  <div class="radio-title">Radio Garden</div>
                  <div class="radio-subtitle">Search the globe and jump to a live station.</div>
                </div>
                <button class="task-btn radio-open-site">Open radio.garden</button>
              </div>
              <div class="radio-search-row">
                <input class="radio-search-input" type="text" placeholder="Search by city, country, or station name" spellcheck="false">
                <button class="task-btn radio-search-btn">Search</button>
              </div>
              <div class="radio-quick-row">
                <span class="radio-quick-label">Quick picks:</span>
                <div class="radio-quick-list">
                  <button class="radio-chip" data-query="Tokyo">Tokyo</button>
                  <button class="radio-chip" data-query="London">London</button>
                  <button class="radio-chip" data-query="São Paulo">São Paulo</button>
                  <button class="radio-chip" data-query="Sydney">Sydney</button>
                  <button class="radio-chip" data-query="Lagos">Lagos</button>
                </div>
              </div>
              <div class="radio-status">Type a query to load stations via the Radio Garden directory.</div>
              <div class="radio-results" role="list"></div>
            </div>`;
  }

  getMinecraftContent() {
    return getMinecraftRoot();
  }

  getN64Content() {
    return getN64Root();
  }

  getTi83Content() {
    return getTi83Root();
  }
  getSandspielContent() {
    return getSandspielRoot();
  }
  getSandspiel3DContent() {
    return getSandspiel3DRoot();
  }
  getRadioContent() {
    return `<div class="radio-layout">
              <div class="radio-toolbar">
                <div class="radio-search">
                  <input type="text" class="radio-query" placeholder="Search stations or genres..." spellcheck="false" />
                  <button class="task-btn radio-search-btn">Search</button>
                  <button class="task-btn radio-top-btn" title="Load popular stations">Top</button>
                </div>
                <div class="radio-status">Find and play live internet radio via the free Radio Browser API.</div>
              </div>
              <div class="radio-body">
                <div class="radio-list" role="listbox" aria-label="Radio stations"></div>
                <div class="radio-player">
                  <div class="radio-now">No station selected.</div>
                  <audio class="radio-audio" controls></audio>
                  <div class="radio-actions">
                    <button class="task-btn radio-play">Play</button>
                    <button class="task-btn radio-stop">Stop</button>
                  </div>
                  <div class="radio-meta">Use search or Top to load stations.</div>
                </div>
              </div>
            </div>`;
  }
  getDoomContent() {
    return `
      <div style="width:100%;height:100%;background:black;display:flex;justify-content:center;align-items:center;">
        <canvas id="doom-container" style="width:640px;height:400px;background:#111;"></canvas>
      </div>
    `;
  }
  getTaskManContent() {
    return `
                <div class="task-mgr-layout">
                    <div class="task-list" id="task-list">
                        <!-- Populated by JS -->
                    </div>
                    <div class="task-btns">
                        <button class="task-btn" onclick="switchTask(event)">Switch To</button>
                        <button class="task-btn" onclick="endTask(event)">End Task</button>
                        <button class="task-btn" onclick="wm.closeWindow(this.closest('.window').dataset.id)">Cancel</button>
                    </div>
                    <div style="font-weight:bold; border-bottom:1px solid gray; margin-bottom:2px;">System Monitor:</div>
                    <div class="task-queue-view" id="task-queue-view">
                        <!-- Queue Data -->
                    </div>
                </div>
            `;
  }
  // ... [Previous Content Methods] ...
  getReversiContent() {
    return `<div class="reversi-layout"><div class="reversi-status">Your Turn (Red)</div><div class="reversi-board" id="reversi-board"></div></div>`;
  }
  getChessContent() {
    return `<div class="chess-layout"><div class="chess-board" aria-label="Chessboard"></div><div class="chess-sidebar"><div class="chess-status">Loading chess engine...</div><div class="chess-controls"><button class="task-btn chess-new">New Game</button><button class="task-btn chess-copy">Copy FEN</button><button class="task-btn chess-paste">Paste FEN</button><button class="task-btn chess-load">Load FEN</button><input type="text" id="chess-fen" class="chess-fen" spellcheck="false" title="Current FEN"></div><div class="chess-moves" aria-label="Move list"></div></div></div>`;
  }
  getMediaPlayerContent() {
    return `<div class="mplayer-layout"><div class="mplayer-screen"><video class="mplayer-video" playsinline></video><canvas id="mplayer-canvas" width="300" height="150"></canvas><div class="mplayer-overlay"><div class="mplayer-track-label">Track: <span class="mplayer-track-name">Loading…</span></div><div class="mplayer-seek-row"><span class="mplayer-time mplayer-current">0:00</span><input type="range" class="mplayer-seek" min="0" max="100" value="0" aria-label="Seek"><span class="mplayer-time mplayer-duration">0:00</span></div></div></div><div class="mplayer-controls"><select class="mplayer-track-select" aria-label="Choose track"></select><div class="mplayer-btn" onclick="toggleMedia(this, 'play')">▶</div><div class="mplayer-btn" onclick="toggleMedia(this, 'pause')">||</div><div class="mplayer-btn" onclick="toggleMedia(this, 'stop')">■</div><label class="mplayer-load-btn">Open<input class="mplayer-file-input" type="file" accept="audio/*,video/*" multiple></label></div><div class="mplayer-status"><span class="mplayer-file-name">Load mp3 or video files from your computer to play them here.</span></div></div>`;
  }
  getSolitaireContent() {
    return `<div class="sol-layout"><div class="sol-top"><div class="sol-deck-area"><div class="card-ph" id="sol-stock"></div><div class="card-ph" id="sol-waste"></div></div><div class="sol-foundations"><div class="card-ph" data-suit="h" id="sol-f-h"></div><div class="card-ph" data-suit="d" id="sol-f-d"></div><div class="card-ph" data-suit="c" id="sol-f-c"></div><div class="card-ph" data-suit="s" id="sol-f-s"></div></div></div><div class="sol-tableau" id="sol-tableau"></div></div>`;
  }
  getSudokuContent() {
    return `
      <div class="sudoku-layout">
        <div class="sudoku-toolbar">
          <label class="sudoku-field">Difficulty
            <select class="sudoku-difficulty">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          <button class="task-btn sudoku-new">New Puzzle</button>
          <button class="task-btn sudoku-check">Check</button>
          <button class="task-btn sudoku-reset">Reset</button>
        </div>
        <div class="sudoku-status">Choose a difficulty to start.</div>
        <div class="sudoku-grid" aria-label="Sudoku board" role="grid"></div>
      </div>
    `;
  }
  getWriteContent(txt) {
    return `<div class="write-layout"><div class="write-toolbar"><select class="write-select write-font" title="Font Family"><option value="Times New Roman">Times New Roman</option><option value="Arial">Arial</option><option value="Courier New">Courier New</option><option value="Georgia">Georgia</option><option value="Verdana">Verdana</option></select><select class="write-select write-size" title="Font Size"><option value="2">10</option><option value="3">12</option><option value="4" selected>14</option><option value="5">18</option><option value="6">24</option><option value="7">32</option></select><button class="fmt-btn" data-cmd="bold" title="Bold">B</button><button class="fmt-btn" data-cmd="italic" title="Italic">I</button><button class="fmt-btn" data-cmd="underline" title="Underline">U</button></div><div class="write-editor" contenteditable="true" spellcheck="false">${
      txt || "Welcome to Oriel Write."
    }</div></div>`;
  }
  getCardfileContent() {
    return `<div class="cardfile-layout"><div class="cardfile-menu"><button class="task-btn" id="card-add-btn">Add</button><button class="task-btn" id="card-del-btn">Delete</button></div><div class="card-container"><div class="card-index-list" id="card-index-list"></div><div class="card-body-view"><div class="card-header-bar" id="card-header-display"></div><textarea class="card-content-area" id="card-content-edit"></textarea></div></div></div>`;
  }
  getSoundRecContent() {
    return `<div class="sound-rec-layout"><div class="sound-vis"><canvas class="sound-wave-canvas" width="246" height="56"></canvas></div><div class="sound-controls"><div class="media-btn" id="btn-rec" title="Record"><div class="symbol-rec"></div></div><div class="media-btn" id="btn-stop" title="Stop"><div class="symbol-stop"></div></div><div class="media-btn" id="btn-play" title="Play"><div class="symbol-play"></div></div></div><div style="margin-top:5px; font-size:12px;" id="sound-status">Ready</div></div>`;
  }
  getCharMapContent() {
    return `<div class="char-map-layout">
              <div class="char-map-toolbar">
                <div class="char-preview" aria-live="polite">A</div>
                <div class="char-meta">
                  <div class="char-code" id="char-code-label">U+0041 · Dec 65</div>
                  <div class="char-font-row">
                    <label for="char-font-select">Font:</label>
                    <select class="char-font" id="char-font-select">
                      <option value="'Times New Roman', serif">Times New Roman</option>
                      <option value="'Arial', sans-serif">Arial</option>
                      <option value="'Courier New', monospace">Courier New</option>
                      <option value="'Segoe UI Symbol', 'Noto Sans Symbols', sans-serif">Symbols</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="char-grid" id="char-grid"></div>
              <div class="char-controls">
                <label>Characters to copy:</label>
                <div class="copy-row">
                  <input type="text" class="char-input" id="char-copy-input" readonly>
                  <button class="task-btn" onclick="copyCharMap(this)" style="width:60px">Copy</button>
                </div>
                <button class="task-btn" onclick="document.getElementById('char-copy-input').value = ''">Clear</button>
              </div>
            </div>`;
  }
  getClockContent() {
    return `<div class="clock-layout" title="Double click to toggle mode"><canvas class="clock-canvas" width="200" height="200"></canvas><div class="clock-digital" style="display:none">12:00</div></div>`;
  }
  getControlPanelContent() {
    return `<div class="control-layout" id="cp-main"><div class="control-icon" onclick="openCPColor(this)">${ICONS.cp_color}<div class="control-label">Color</div></div><div class="control-icon" onclick="openCPDesktop(this)">${ICONS.desktop_cp}<div class="control-label">Desktop</div></div><div class="control-icon" onclick="openCPScreensaver(this)">${ICONS.screensaver}<div class="control-label">Screensaver</div></div><div class="control-icon" onclick="openCPSound(this)">${ICONS.volume}<div class="control-label">Sound</div></div><div class="control-icon" onclick="openCPFonts(this)"><svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="8" width="24" height="16" fill="none" stroke="black"/><text x="16" y="20" font-family="serif" font-size="10" text-anchor="middle">ABC</text></svg><div class="control-label">Fonts</div></div><div class="control-icon"><svg viewBox="0 0 32 32" class="svg-icon"><rect x="10" y="6" width="12" height="20" fill="none" stroke="black"/><circle cx="16" cy="12" r="2" fill="black"/></svg><div class="control-label">Mouse</div></div><div class="control-icon"><svg viewBox="0 0 32 32" class="svg-icon"><rect x="2" y="10" width="28" height="12" fill="none" stroke="black"/></svg><div class="control-label">Keyboard</div></div></div>`;
  }
  getResetContent() {
    return `<div class="reset-layout" style="padding:16px; display:flex; flex-direction:column; gap:12px;">
                <div class="reset-warning" style="background:#fff3cd; border:1px solid #e0c25c; padding:10px;">
                    <strong>Reset Oriel</strong>
                    <div>This will clear all saved desktop windows, wallpaper, volume, network defaults, and file or app data.</div>
                </div>
                <ul style="margin:0 0 4px 20px; padding:0; line-height:1.4;">
                    <li>Desktop layout & wallpaper</li>
                    <li>File system changes</li>
                    <li>Sound levels & network presets</li>
                    <li>App data such as Cardfile or Data Manager</li>
                </ul>
                <button class="task-btn reset-now-btn" style="width:180px;">Reset and Reload</button>
                <div class="reset-status" aria-live="polite">No changes yet.</div>
            </div>`;
  }
  getVmContent() {
    return `<div class="vm-layout">
                <div class="vm-toolbar">
                    <div class="vm-actions">
                        <button class="task-btn vm-boot">Boot VM</button>
                        <button class="task-btn vm-reset" disabled>Power Off</button>
                    </div>
                    <div class="vm-status" aria-live="polite">VM is powered off. Click Boot to start Oriel inside Oriel.</div>
                </div>
                <div class="vm-note">Runs a fresh copy of Oriel in an isolated iframe. Try opening apps inside the VM for true desktop-ception.</div>
                <div class="vm-view">
                    <iframe class="vm-frame" title="Oriel Virtual Machine" src="about:blank"></iframe>
                </div>
            </div>`;
  }
  getNotepadContent(txt) {
    const text = typeof txt === "string" ? txt : txt?.text;
    const showToolbar = Boolean(txt?.nativeFileHandle);
    return `
      <div class="notepad-layout">
        ${
          showToolbar
            ? `<div class="notepad-toolbar"><button class="task-btn notepad-save">Save</button><span class="notepad-status"></span></div>`
            : ""
        }
        <textarea class="notepad-area" spellcheck="false">${
          text || "Welcome to Oriel 1.0!"
        }</textarea>
      </div>
    `;
  }
  getCompilerContent() {
    return `<div class="compiler-layout"><div class="compiler-toolbar"><button class="compiler-btn" onclick="runCompiler(event)">RUN</button></div><textarea class="compiler-editor" spellcheck="false">#include <stdio.h>\n\nint main() {\n    printf("Hello from C!");\n    return 0;\n}</textarea><div class="compiler-output" id="compiler-out"></div></div>`;
  }
  getPythonContent() {
    return `<div class="compiler-layout"><div class="compiler-toolbar"><button class="compiler-btn" onclick="runPython(event)">RUN</button></div><textarea class="compiler-editor" spellcheck="false">print("Hello Python!")\nfor i in range(3):\n    print(i)</textarea><div class="compiler-output" id="python-out"></div></div>`;
  }
  getConsoleContent() {
    return `<div class="console" onclick="document.querySelector('.window.active .console-input')?.focus()"><div>Egg Oriel 1.0</div><br><div class="console-output"></div><div class="console-line"><span>C:\\></span><input type="text" class="console-input" onkeydown="handleConsoleKey(event)" autocomplete="off"></div></div>`;
  }
  getKakuroContent() {
    const keypadButtons = Array.from({ length: 9 }, (_, i) =>
      `<button class="task-btn kakuro-key" data-num="${i + 1}">${i + 1}</button>`
    ).join("");

    return `<div class="kakuro-root">
                <div class="kakuro-toolbar">
                    <div class="kakuro-keypad" role="group" aria-label="Number pad">${keypadButtons}<button class="task-btn kakuro-clear" aria-label="Clear cell">Clear</button></div>
                    <div class="kakuro-actions">
                        <button class="task-btn kakuro-check">Check</button>
                        <button class="task-btn kakuro-reset">Reset</button>
                    </div>
                </div>
                <div class="kakuro-board" role="grid" aria-label="Kakuro board"></div>
                <div class="kakuro-status" aria-live="polite">Fill every run without repeating numbers.</div>
                <div class="kakuro-help">Each clue shows the sum for the across or down run starting beside it.</div>
            </div>`;
  }
  getMinesContent() {
    return `<div style="background:#c0c0c0; height:100%; display:flex; flex-direction:column; align-items:center;"><div class="mines-bar" style="width:200px"><div class="mines-lcd" id="mines-count">010</div><div class="mines-face" id="mines-face" onclick="resetMines()">:)</div><div class="mines-lcd" id="mines-timer">000</div></div><div class="mines-grid" id="mines-grid"></div></div>`;
  }
  getPdfReaderContent(initData) {
    const src = initData?.src || DEFAULT_PDF_DATA_URI;
    const name = initData?.name || "Sample.pdf";
    return `<div class="pdf-reader">
                <div class="pdf-toolbar">
                    <label class="task-btn file-btn">Open File<input type="file" accept="application/pdf" class="pdf-file-input"></label>
                    <input type="text" class="pdf-url-input" placeholder="Paste PDF URL and click Load" value="">
                    <button class="task-btn pdf-load-btn">Load</button>
                    <div class="pdf-status">Loaded ${name}</div>
                </div>
                <div class="pdf-viewer">
                    <iframe class="pdf-frame" src="${src}" title="PDF Viewer"></iframe>
                </div>
            </div>`;
  }
  getImageViewerContent(initData) {
    const name = initData?.name || "";
    const src = initData?.src || "";
    return `<div class="img-viewer">
                <div class="img-toolbar">
                    <label class="task-btn file-btn">Open Image<input type="file" accept="image/*" class="img-file-input"></label>
                    <input type="text" class="img-url-input" placeholder="Paste image URL and click Load" value="${src ? src : ""}">
                    <button class="task-btn img-load-btn">Load</button>
                    <div class="img-status">${src ? `Loaded ${name || "image"}` : "No image loaded"}</div>
                </div>
                <div class="img-display">
                    <div class="img-placeholder" ${src ? "style=\"display:none\"" : ""}>Drop an image or click Open</div>
                    <img class="img-preview" ${src ? `src="${src}"` : "style=\"display:none\""} alt="${name || "Image preview"}">
                </div>
            </div>`;
  }
  getMarkdownContent(initData) {
    const initialText = typeof initData === "string" ? initData : initData || DEFAULT_MD_SAMPLE;
    return `<div class="md-viewer">
                <div class="md-toolbar">
                    <label class="task-btn file-btn">Open .md<input type="file" accept=".md,text/markdown" class="md-file-input"></label>
                    <button class="task-btn md-sample-btn">Sample</button>
                    <div class="md-status">Ready</div>
                </div>
                <div class="md-body">
                    <textarea class="md-input" spellcheck="false" placeholder="Paste Markdown here">${initialText}</textarea>
                    <div class="md-preview" aria-live="polite"></div>
                </div>
            </div>`;
  }
  getHexEditorContent() {
    return `<div class="hex-layout">
                <div class="hex-toolbar">
                    <button class="task-btn hex-new">New</button>
                    <label class="task-btn file-btn">Open File<input type="file" class="hex-file" accept="*/*"></label>
                    <button class="task-btn hex-parse">Parse Hex</button>
                    <button class="task-btn hex-from-ascii">From ASCII</button>
                    <div class="hex-status">Ready</div>
                </div>
                <div class="hex-body">
                    <textarea class="hex-offsets" readonly aria-label="Offsets"></textarea>
                    <textarea class="hex-area" spellcheck="false" aria-label="Hex bytes"></textarea>
                    <textarea class="hex-ascii" spellcheck="false" aria-label="ASCII view"></textarea>
                </div>
                <div class="hex-footer">
                    <div class="hex-summary">0 bytes</div>
                    <div class="hex-hint">Edit hex pairs, then click Parse Hex to refresh the ASCII view.</div>
                </div>
            </div>`;
  }
  getTaskManContent() {
    return `<div class="task-mgr-layout"><div class="task-list" id="task-list"></div><div class="task-btns"><button class="task-btn" onclick="switchTask(event)">Switch To</button><button class="task-btn" onclick="endTask(event)">End Task</button><button class="task-btn" onclick="wm.closeWindow(this.closest('.window').dataset.id)">Cancel</button></div><div style="font-weight:bold; border-bottom:1px solid gray; margin-bottom:2px;">System Monitor:</div><div class="task-queue-view" id="task-queue-view"></div></div>`;
  }
  getArtistContent() {
    const defaultPrompt = "retro desktop art of a cozy computer lab";
    return `
                <div class="artist-app">
                    <div class="artist-toolbar">
                        <input class="artist-prompt" type="text" value="${defaultPrompt}" placeholder="Describe the image you want" spellcheck="false" />
                        <button class="task-btn artist-generate">Generate</button>
                        <span class="artist-status">Enter a prompt and click Generate.</span>
                    </div>
                    <div class="artist-body">
                        <div class="artist-preview-wrap">
                            <div class="artist-placeholder">Image will appear here</div>
                            <img class="artist-preview" alt="AI generated art" />
                        </div>
                        <div class="artist-hint">Uses the free Pollinations image API. Right-click the result to save it.</div>
                        <a class="artist-link" href="#" target="_blank" rel="noreferrer noopener">Open image directly</a>
                    </div>
                </div>`;
  }
  getDatabaseContent() {
    return `<div class="db-layout"><div class="db-form"><div class="db-input-group"><label>Name</label><input type="text" class="db-input" id="db-name"></div><div class="db-input-group"><label>Phone</label><input type="text" class="db-input" id="db-phone"></div><div class="db-input-group"><label>Email</label><input type="text" class="db-input" id="db-email"></div><button class="task-btn" onclick="addDbRecord(this)">Add Record</button><button class="task-btn" onclick="exportDbToCsv(this)">Save CSV</button></div><div class="db-grid-container"><table class="db-table"><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th style="width:50px">Action</th></tr></thead><tbody id="db-tbody"></tbody></table></div></div>`;
  }
}


const initialDesktopState = loadDesktopState();
applySavedTheme(initialDesktopState.themeCustom);
applyWallpaperSettings(
  initialDesktopState.wallpaper?.url ?? DEFAULT_WALLPAPER,
  initialDesktopState.wallpaper?.mode || "cover"
);
let wm = null;
function bootDesktop() {
  if (wm) return wm;
  wm = new WindowManager(initialDesktopState);
  window.wm = wm;
  return wm;
}

function resolveDesktopDirectory() {
  const preferredPaths = ["C\\DESKTOP", "C\\DOCUMENTS\\DESKTOP", "C\\DOCUMENTS"];
  for (const path of preferredPaths) {
    const resolved = resolveFileManagerPath(path);
    if (resolved?.node?.type === "dir") return resolved;
  }
  return null;
}

async function createDesktopFolder() {
  const resolved = resolveDesktopDirectory();
  if (!resolved?.node) {
    alert("Desktop folder is unavailable.");
    return;
  }
  const folderName = getUniqueFolderName(resolved.node);
  const result = await createNamedFolder(resolved.node, folderName);
  if (!result.success) {
    alert(result.message || "Unable to create folder.");
    return;
  }
  refreshOpenFileManagers();
}

function openDesktopProperties() {
  if (!wm) return;
  const existing = wm.windows.find((win) => win.type === "control");
  const controlWin = existing || wm.openWindow("control", "Control Panel", 400, 300);
  if (!controlWin?.el) return;
  wm.focusWindow(controlWin.id);
  const viewArea = controlWin.el.querySelector(".cp-view-area");
  if (viewArea) openCPDesktop(controlPanelContext, viewArea);
}

function initDesktopContextMenu() {
  const desktop = document.getElementById("desktop");
  const menu = document.getElementById("context-menu");
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
    if (action === "new-folder") createDesktopFolder();
    if (action === "properties") openDesktopProperties();
  });
}
let saverActive = false;
let idleTime = 0;
const saverCanvas = document.getElementById("saver-canvas");
const sCtx = saverCanvas.getContext("2d");
const screensaverDiv = document.getElementById("screensaver");
const mazeCanvas = document.getElementById("saver-maze-canvas");
const bsodOverlay = document.getElementById("bsod-overlay");
const bsodCodeText = bsodOverlay?.querySelector(".bsod-code");
let screensaverType = "starfield";
let screensaverTimeout = 60;
let lockPassphrase = "";
let requirePassphrase = false;
let unlockPromptVisible = false;
const saverLock = document.getElementById("saver-lock");
const saverPassInput = document.getElementById("saver-pass-input");
const saverLockError = document.getElementById("saver-lock-error");

controlPanelContext.screensaver = {
  getType: () => screensaverType,
  setType: (value) => {
    screensaverType = value;
  },
  getTimeout: () => screensaverTimeout,
  setTimeout: (value) => {
    screensaverTimeout = value;
  },
  getLockPassphrase: () => lockPassphrase,
  setLockPassphrase: (value) => {
    lockPassphrase = value;
  },
  getRequirePassphrase: () => requirePassphrase,
  setRequirePassphrase: (value) => {
    requirePassphrase = value;
  },
  setIdleTime: (value) => {
    idleTime = value;
  },
  start: (type) => startScreensaver(type)
};

let stars = [];
const numStars = 500;
let sInterval = null;

let pipes = [];

const pipeDirections = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 }
];

const PIPE_COLORS = ["#4bc0ff", "#ff6b6b", "#50fa7b", "#f1fa8c"];

let matrixDrops = [];
const MATRIX_CHARS = "X01Z=+*".split("");
let matrixFontSize = 16;

let dvdLogo = null;
const DVD_COLORS = ["#ff3864", "#3ae374", "#00b3ff", "#ffc600", "#bd93f9", "#ffffff"];

let fireflies = [];
let bubbles = [];
let waveBands = [];
let wavePhase = 0;
let activeCanvasMode = "2d";

let mazeRenderer = null;
let mazeScene = null;
let mazeCamera = null;
let mazeFrameId = null;
let mazeClock = null;
let mazePath = [];
let mazeSegmentIndex = 0;
let mazeCurrentAngle = 0;
let mazeTargetAngle = 0;
let mazeLight = null;
let mazeGroup = null;
const MAZE_CELL_SIZE = 10;
let toasters = [];
const TOASTER_COLORS = [
  "#dfe6f3",
  "#f8fbff",
  "#c9d7ef",
  "#cdd8e8"
];

let castawayScene = null;

function isLockEnabled() {
  return requirePassphrase && lockPassphrase.trim().length > 0;
}

function showUnlockPrompt() {
  if (!isLockEnabled()) {
    stopScreensaver();
    return;
  }

  if (unlockPromptVisible) return;
  unlockPromptVisible = true;

  if (saverLock) saverLock.style.display = "flex";
  if (screensaverDiv) screensaverDiv.classList.add("locked");
  if (saverLockError) saverLockError.textContent = "";
  if (saverPassInput) {
    saverPassInput.value = "";
    saverPassInput.focus();
  }
}

function hideUnlockPrompt() {
  unlockPromptVisible = false;
  if (saverLock) saverLock.style.display = "none";
  if (screensaverDiv) screensaverDiv.classList.remove("locked");
  if (saverPassInput) saverPassInput.value = "";
  if (saverLockError) saverLockError.textContent = "";
}

function submitLockPassphrase() {
  if (!isLockEnabled()) {
    stopScreensaver();
    return;
  }

  const attempted = saverPassInput?.value || "";
  if (attempted === lockPassphrase) {
    hideUnlockPrompt();
    stopScreensaver();
  } else if (saverLockError) {
    saverLockError.textContent = "Incorrect passphrase.";
    saverPassInput?.focus();
  }
}

function initScreensaver() {
  resizeScreensaverCanvases();
  setupStarfield();
  // Global Listeners
  document.body.addEventListener("mousemove", resetTimer);
  document.body.addEventListener("keydown", resetTimer);
  document.body.addEventListener("mousedown", resetTimer);
  window.addEventListener("resize", resizeScreensaverCanvases);
  saverPassInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitLockPassphrase();
  });
  // Timer Check
  setInterval(() => {
    idleTime++;
    if (idleTime > screensaverTimeout && !saverActive) startScreensaver();
  }, 1000);
}

function resetTimer() {
  idleTime = 0;
  if (!saverActive) return;
  if (unlockPromptVisible) return;
  if (isLockEnabled()) {
    showUnlockPrompt();
  } else {
    stopScreensaver();
  }
}

async function startScreensaver(forceType) {
  const saver = forceType || screensaverType;
  saverActive = true;
  screensaverDiv.style.display = "block";
  activeCanvasMode = saver === "maze" ? "3d" : "2d";
  setScreensaverCanvas(activeCanvasMode);
  resizeScreensaverCanvases();
  clearInterval(sInterval);
  stopMaze();
  hideUnlockPrompt();

  const shouldPrank = !forceType && Math.random() < 0.001;
  if (shouldPrank) {
    showFakeBsod();
    return;
  }

  hideFakeBsod();
  if (saver === "maze") {
    await setupMazeScreensaver();
  } else if (saver === "pipes") {
    setupPipes();
    sInterval = setInterval(drawPipes, 50);
  } else if (saver === "matrix") {
    setupMatrix();
    sInterval = setInterval(drawMatrix, 50);
  } else if (saver === "dvd") {
    setupDvd();
    sInterval = setInterval(drawDvd, 30);
  } else if (saver === "fireflies") {
    setupFireflies();
    sInterval = setInterval(drawFireflies, 30);
  } else if (saver === "bubbles") {
    setupBubbles();
    sInterval = setInterval(drawBubbles, 40);
  } else if (saver === "waves") {
    setupNeonWaves();
    sInterval = setInterval(drawNeonWaves, 30);
  } else if (saver === "castaway") {
    setupCastaway();
    sInterval = setInterval(drawCastaway, 40);
  } else if (saver === "toasters") {
    setupFlyingToasters();
    sInterval = setInterval(drawFlyingToasters, 30);
  } else {
    setScreensaverCanvas("2d");
    setupStarfield();
    sInterval = setInterval(drawStars, 30);
  }
}

function stopScreensaver() {
  saverActive = false;
  screensaverDiv.style.display = "none";
  clearInterval(sInterval);
  hideFakeBsod();
  stopMaze();
  activeCanvasMode = "2d";
  setScreensaverCanvas("2d");
  hideUnlockPrompt();
}

function showFakeBsod() {
  if (!bsodOverlay) return;
  const randomCode = Math.random().toString(16).slice(2, 8).toUpperCase();
  if (bsodCodeText) bsodCodeText.textContent = `STOP CODE: ${randomCode}`;
  bsodOverlay.classList.add("visible");
  if (saverCanvas) saverCanvas.style.display = "none";
  if (mazeCanvas) mazeCanvas.style.display = "none";
}

function hideFakeBsod() {
  if (!bsodOverlay) return;
  bsodOverlay.classList.remove("visible");
  setScreensaverCanvas(activeCanvasMode);
}

function setScreensaverCanvas(mode) {
  if (saverCanvas)
    saverCanvas.style.display = mode === "2d" || mode === undefined ? "block" : "none";
  if (mazeCanvas) mazeCanvas.style.display = mode === "3d" ? "block" : "none";
}

function resizeScreensaverCanvases() {
  if (saverCanvas) {
    saverCanvas.width = window.innerWidth;
    saverCanvas.height = window.innerHeight;
  }
  if (mazeCanvas) {
    mazeCanvas.width = window.innerWidth;
    mazeCanvas.height = window.innerHeight;
  }
  if (mazeRenderer) {
    mazeRenderer.setSize(window.innerWidth, window.innerHeight);
  }
  if (mazeCamera) {
    mazeCamera.aspect = window.innerWidth / window.innerHeight;
    mazeCamera.updateProjectionMatrix();
  }
}

function generateMaze(width, height) {
  const grid = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => ({
      x,
      y,
      visited: false,
      walls: { top: true, right: true, bottom: true, left: true }
    }))
  );

  const stack = [];
  const start = grid[0][0];
  start.visited = true;
  stack.push(start);

  const getUnvisitedNeighbors = (cell) => {
    const neighbors = [];
    if (cell.y > 0 && !grid[cell.y - 1][cell.x].visited)
      neighbors.push({ dir: "top", cell: grid[cell.y - 1][cell.x] });
    if (cell.x < width - 1 && !grid[cell.y][cell.x + 1].visited)
      neighbors.push({ dir: "right", cell: grid[cell.y][cell.x + 1] });
    if (cell.y < height - 1 && !grid[cell.y + 1][cell.x].visited)
      neighbors.push({ dir: "bottom", cell: grid[cell.y + 1][cell.x] });
    if (cell.x > 0 && !grid[cell.y][cell.x - 1].visited)
      neighbors.push({ dir: "left", cell: grid[cell.y][cell.x - 1] });
    return neighbors;
  };

  const removeWall = (cell, next, direction) => {
    cell.walls[direction] = false;
    if (direction === "top") next.walls.bottom = false;
    if (direction === "right") next.walls.left = false;
    if (direction === "bottom") next.walls.top = false;
    if (direction === "left") next.walls.right = false;
  };

  while (stack.length) {
    const current = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(current);
    if (neighbors.length === 0) {
      stack.pop();
      continue;
    }
    const { dir, cell: nextCell } =
      neighbors[Math.floor(Math.random() * neighbors.length)];
    removeWall(current, nextCell, dir);
    nextCell.visited = true;
    stack.push(nextCell);
  }

  return grid;
}

function buildMazePath(grid) {
  const height = grid.length;
  const width = grid[0].length;
  const visited = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );
  const path = [];
  const stack = [{ x: 0, y: 0 }];
  visited[0][0] = true;
  path.push({ x: 0, y: 0 });

  const getOpenNeighbors = (x, y) => {
    const cell = grid[y][x];
    const options = [];
    if (!cell.walls.top) options.push({ x, y: y - 1 });
    if (!cell.walls.right) options.push({ x: x + 1, y });
    if (!cell.walls.bottom) options.push({ x, y: y + 1 });
    if (!cell.walls.left) options.push({ x: x - 1, y });
    return options.filter(
      (pos) => pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height
    );
  };

  while (stack.length) {
    const current = stack[stack.length - 1];
    const neighbors = getOpenNeighbors(current.x, current.y).filter(
      (n) => !visited[n.y][n.x]
    );
    if (neighbors.length) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      visited[next.y][next.x] = true;
      stack.push(next);
      path.push(next);
    } else {
      stack.pop();
      if (stack.length) path.push(stack[stack.length - 1]);
    }
  }

  return path;
}

function disposeMazeScene() {
  if (!mazeScene) return;
  mazeScene.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose?.());
    else obj.material?.dispose?.();
  });
  mazeScene.clear();
}

function buildMazeWorld() {
  if (!mazeScene || !mazeCamera) return;
  disposeMazeScene();
  mazeGroup = new THREE.Group();

  const width = 12 + Math.floor(Math.random() * 5);
  const height = 10 + Math.floor(Math.random() * 5);
  const grid = generateMaze(width, height);
  const rawPath = buildMazePath(grid);
  mazePath = rawPath.map((p) => ({
    x: p.x * MAZE_CELL_SIZE - (width * MAZE_CELL_SIZE) / 2 + MAZE_CELL_SIZE / 2,
    z:
      p.y * MAZE_CELL_SIZE - (height * MAZE_CELL_SIZE) / 2 + MAZE_CELL_SIZE / 2
  }));
  mazeSegmentIndex = 0;
  mazeTargetAngle = 0;
  mazeCurrentAngle = 0;

  const start = mazePath[0] || { x: 0, z: 0 };
  mazeCamera.position.set(start.x, 1.6, start.z);

  const fogDensity = 0.03 + Math.random() * 0.01;
  mazeScene.fog = new THREE.FogExp2(0x02060f, fogDensity);

  const floorGeo = new THREE.PlaneGeometry(
    width * MAZE_CELL_SIZE,
    height * MAZE_CELL_SIZE
  );
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x0b1426,
    metalness: 0.25,
    roughness: 0.78,
    emissive: 0x0a365a
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  mazeGroup.add(floor);

  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0x0d0f1a,
    roughness: 0.45,
    metalness: 0.15,
    emissive: 0x081426
  });
  const ceiling = new THREE.Mesh(floorGeo, ceilingMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = 6;
  mazeGroup.add(ceiling);

  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x70f3ff,
    emissive: 0x0c2f49,
    metalness: 0.48,
    roughness: 0.32
  });

  const wallHeight = 6;
  const wallThickness = 0.65;
  const horizWall = new THREE.BoxGeometry(
    MAZE_CELL_SIZE,
    wallHeight,
    wallThickness
  );
  const vertWall = new THREE.BoxGeometry(
    wallThickness,
    wallHeight,
    MAZE_CELL_SIZE
  );

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = grid[y][x];
      const baseX =
        x * MAZE_CELL_SIZE - (width * MAZE_CELL_SIZE) / 2 + MAZE_CELL_SIZE / 2;
      const baseZ =
        y * MAZE_CELL_SIZE - (height * MAZE_CELL_SIZE) / 2 + MAZE_CELL_SIZE / 2;

      if (cell.walls.top) {
        const wall = new THREE.Mesh(horizWall, wallMaterial);
        wall.position.set(baseX, wallHeight / 2, baseZ - MAZE_CELL_SIZE / 2);
        mazeGroup.add(wall);
      }
      if (cell.walls.left) {
        const wall = new THREE.Mesh(vertWall, wallMaterial);
        wall.position.set(baseX - MAZE_CELL_SIZE / 2, wallHeight / 2, baseZ);
        mazeGroup.add(wall);
      }
      if (x === width - 1 && cell.walls.right) {
        const wall = new THREE.Mesh(vertWall, wallMaterial);
        wall.position.set(baseX + MAZE_CELL_SIZE / 2, wallHeight / 2, baseZ);
        mazeGroup.add(wall);
      }
      if (y === height - 1 && cell.walls.bottom) {
        const wall = new THREE.Mesh(horizWall, wallMaterial);
        wall.position.set(baseX, wallHeight / 2, baseZ + MAZE_CELL_SIZE / 2);
        mazeGroup.add(wall);
      }
    }
  }

  const ambient = new THREE.AmbientLight(0x78c8ff, 0.3);
  mazeGroup.add(ambient);
  mazeLight = new THREE.PointLight(0x6df1ff, 1.1, 90, 2.2);
  mazeLight.position.set(start.x, 2.2, start.z);
  mazeGroup.add(mazeLight);

  mazeScene.add(mazeGroup);
}

function moveThroughMaze(delta) {
  if (!mazeCamera || !mazePath.length) return;
  const next = mazePath[mazeSegmentIndex + 1];
  if (!next) {
    buildMazeWorld();
    return;
  }

  const currentPos = new THREE.Vector3(
    mazeCamera.position.x,
    0,
    mazeCamera.position.z
  );
  const targetPos = new THREE.Vector3(next.x, 0, next.z);
  const direction = targetPos.clone().sub(currentPos);
  const distance = direction.length();

  if (distance < 0.1) {
    mazeSegmentIndex++;
    return;
  }

  direction.normalize();
  const speed = 6;
  mazeCamera.position.x += direction.x * speed * delta;
  mazeCamera.position.z += direction.z * speed * delta;

  mazeTargetAngle = Math.atan2(direction.x, direction.z);
  mazeCurrentAngle = THREE.MathUtils.lerp(
    mazeCurrentAngle,
    mazeTargetAngle,
    0.08
  );
  mazeCamera.rotation.y = mazeCurrentAngle;

  const time = mazeClock ? mazeClock.elapsedTime : 0;
  mazeCamera.position.y = 1.6 + Math.sin(time * 3) * 0.05;
  if (mazeLight) {
    mazeLight.position.copy(mazeCamera.position);
    mazeLight.position.y = 2.4;
  }
}

function animateMaze() {
  if (!mazeRenderer || !mazeScene || !mazeCamera) return;
  mazeFrameId = requestAnimationFrame(animateMaze);
  const delta = mazeClock ? mazeClock.getDelta() : 0.016;
  moveThroughMaze(delta);
  mazeRenderer.render(mazeScene, mazeCamera);
}

async function setupMazeScreensaver() {
  await ensureThree();
  if (!mazeCanvas) return;
  setScreensaverCanvas("3d");
  resizeScreensaverCanvases();
  if (!mazeRenderer) {
    mazeRenderer = new THREE.WebGLRenderer({
      canvas: mazeCanvas,
      antialias: true
    });
    mazeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  mazeRenderer.setSize(window.innerWidth, window.innerHeight);
  mazeRenderer.setClearColor(0x000000, 1);

  mazeScene = new THREE.Scene();
  mazeCamera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  mazeClock = new THREE.Clock();
  buildMazeWorld();
  animateMaze();
}

function stopMaze() {
  if (mazeFrameId) cancelAnimationFrame(mazeFrameId);
  mazeFrameId = null;
  mazePath = [];
  mazeSegmentIndex = 0;
  if (mazeRenderer?.setAnimationLoop) mazeRenderer.setAnimationLoop(null);
}

function setupStarfield() {
  stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * saverCanvas.width,
      y: Math.random() * saverCanvas.height,
      z: Math.random() * saverCanvas.width
    });
  }
}

function drawStars() {
  sCtx.fillStyle = "black";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
  sCtx.fillStyle = "white";
  for (let i = 0; i < numStars; i++) {
    let s = stars[i];
    s.z -= 10;
    if (s.z <= 0) {
      s.x = Math.random() * saverCanvas.width;
      s.y = Math.random() * saverCanvas.height;
      s.z = saverCanvas.width;
    }
    let k = 128.0 / s.z;
    let px = (s.x - saverCanvas.width / 2) * k + saverCanvas.width / 2;
    let py = (s.y - saverCanvas.height / 2) * k + saverCanvas.height / 2;
    if (
      px >= 0 &&
      px <= saverCanvas.width &&
      py >= 0 &&
      py <= saverCanvas.height
    ) {
      let size = (1 - s.z / saverCanvas.width) * 3;
      sCtx.fillRect(px, py, size, size);
    }
  }
}

function setupMatrix() {
  matrixFontSize = Math.max(14, Math.floor(saverCanvas.width / 80));
  const columns = Math.floor(saverCanvas.width / matrixFontSize);
  matrixDrops = new Array(columns)
    .fill(0)
    .map(() => Math.floor(Math.random() * -30));
  sCtx.fillStyle = "black";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
  sCtx.font = `${matrixFontSize}px monospace`;
}

function drawMatrix() {
  sCtx.fillStyle = "rgba(0, 0, 0, 0.25)";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
  sCtx.fillStyle = "#00ff7f";
  for (let i = 0; i < matrixDrops.length; i++) {
    const text =
      MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)] || "0";
    sCtx.fillText(text, i * matrixFontSize, matrixDrops[i] * matrixFontSize);
    if (matrixDrops[i] * matrixFontSize > saverCanvas.height && Math.random() > 0.975) {
      matrixDrops[i] = 0;
    }
    matrixDrops[i]++;
  }
}

function setupDvd() {
  const size = Math.max(80, Math.floor(Math.min(saverCanvas.width, saverCanvas.height) / 6));
  const startX = Math.random() * (saverCanvas.width - size);
  const startY = Math.random() * (saverCanvas.height - size / 2);
  dvdLogo = {
    x: startX,
    y: startY,
    dx: 4,
    dy: 3,
    w: size,
    h: size / 2,
    color: DVD_COLORS[Math.floor(Math.random() * DVD_COLORS.length)]
  };
  sCtx.fillStyle = "black";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
  sCtx.font = `${Math.floor(size / 3)}px 'Segoe UI', 'MS Sans Serif', sans-serif`;
}

function drawDvd() {
  if (!dvdLogo) return;
  sCtx.fillStyle = "rgba(0, 0, 0, 0.4)";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);

  dvdLogo.x += dvdLogo.dx;
  dvdLogo.y += dvdLogo.dy;

  const hitX = dvdLogo.x <= 0 || dvdLogo.x + dvdLogo.w >= saverCanvas.width;
  const hitY = dvdLogo.y <= 0 || dvdLogo.y + dvdLogo.h >= saverCanvas.height;

  if (hitX) {
    dvdLogo.dx *= -1;
    dvdLogo.color = DVD_COLORS[Math.floor(Math.random() * DVD_COLORS.length)];
  }
  if (hitY) {
    dvdLogo.dy *= -1;
    dvdLogo.color = DVD_COLORS[Math.floor(Math.random() * DVD_COLORS.length)];
  }

  sCtx.fillStyle = dvdLogo.color;
  sCtx.strokeStyle = "#000";
  sCtx.lineWidth = 4;
  sCtx.beginPath();
  if (sCtx.roundRect) {
    sCtx.roundRect(dvdLogo.x, dvdLogo.y, dvdLogo.w, dvdLogo.h, dvdLogo.h / 4);
  } else {
    sCtx.rect(dvdLogo.x, dvdLogo.y, dvdLogo.w, dvdLogo.h);
  }
  sCtx.fill();
  sCtx.stroke();

  sCtx.fillStyle = "#000";
  sCtx.textAlign = "center";
  sCtx.textBaseline = "middle";
  sCtx.fillText("DVD", dvdLogo.x + dvdLogo.w / 2, dvdLogo.y + dvdLogo.h / 2 + 2);
}

function setupFireflies() {
  const count = Math.max(50, Math.floor((saverCanvas.width + saverCanvas.height) / 16));
  fireflies = new Array(count).fill(0).map(() => ({
    x: Math.random() * saverCanvas.width,
    y: Math.random() * saverCanvas.height,
    vx: (Math.random() - 0.5) * 1.2,
    vy: (Math.random() - 0.5) * 1.2,
    hue: Math.floor(Math.random() * 120) + 40,
    size: Math.random() * 1.8 + 2.2
  }));
  sCtx.fillStyle = "black";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
}

function drawFireflies() {
  sCtx.fillStyle = "rgba(0, 0, 0, 0.12)";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);

  fireflies.forEach((fly) => {
    fly.vx += (Math.random() - 0.5) * 0.18;
    fly.vy += (Math.random() - 0.5) * 0.18;
    const speed = Math.hypot(fly.vx, fly.vy);
    const maxSpeed = 1.8;
    if (speed > maxSpeed) {
      fly.vx = (fly.vx / speed) * maxSpeed;
      fly.vy = (fly.vy / speed) * maxSpeed;
    }

    fly.x = (fly.x + fly.vx + saverCanvas.width) % saverCanvas.width;
    fly.y = (fly.y + fly.vy + saverCanvas.height) % saverCanvas.height;

    const radius = fly.size + Math.sin(Date.now() / 600 + fly.x * 0.02) * 0.8;
    const glow = sCtx.createRadialGradient(
      fly.x,
      fly.y,
      0,
      fly.x,
      fly.y,
      radius * 4
    );
    glow.addColorStop(0, `hsla(${fly.hue}, 100%, 75%, 1)`);
    glow.addColorStop(0.35, `hsla(${fly.hue + 30}, 100%, 65%, 0.7)`);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    sCtx.fillStyle = glow;
    sCtx.beginPath();
    sCtx.arc(fly.x, fly.y, radius * 4, 0, Math.PI * 2);
    sCtx.fill();
  });
}

function setupBubbles() {
  const count = Math.max(35, Math.floor(saverCanvas.width / 24));
  bubbles = new Array(count).fill(0).map(() => ({
    x: Math.random() * saverCanvas.width,
    y: Math.random() * saverCanvas.height,
    r: Math.random() * 30 + 12,
    speed: Math.random() * 1.4 + 0.4,
    hue: Math.random() * 360,
    sway: Math.random() * 0.4 + 0.2,
    wobble: Math.random() * 1.2 + 0.4
  }));
  sCtx.fillStyle = "#00111f";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
}

function drawBubbles() {
  sCtx.fillStyle = "rgba(0, 10, 25, 0.22)";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);

  const time = Date.now() / 1000;
  bubbles.forEach((bubble, idx) => {
    const drift = Math.sin(time * bubble.wobble + idx * 0.6) * bubble.sway;
    bubble.x += drift;
    bubble.y -= bubble.speed;

    if (bubble.y + bubble.r < 0) {
      bubble.y = saverCanvas.height + bubble.r + Math.random() * saverCanvas.height * 0.1;
      bubble.x = Math.random() * saverCanvas.width;
      bubble.hue = Math.random() * 360;
      bubble.r = Math.random() * 30 + 12;
    }

    if (bubble.x < -bubble.r) bubble.x = saverCanvas.width + bubble.r;
    if (bubble.x > saverCanvas.width + bubble.r) bubble.x = -bubble.r;

    const gradient = sCtx.createRadialGradient(
      bubble.x - bubble.r * 0.35,
      bubble.y - bubble.r * 0.35,
      bubble.r * 0.1,
      bubble.x,
      bubble.y,
      bubble.r * 1.4
    );
    gradient.addColorStop(0, `hsla(${bubble.hue}, 100%, 85%, 0.9)`);
    gradient.addColorStop(0.6, `hsla(${bubble.hue}, 80%, 65%, 0.5)`);
    gradient.addColorStop(1, "rgba(0, 20, 40, 0)");

    sCtx.fillStyle = gradient;
    sCtx.beginPath();
    sCtx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
    sCtx.fill();
  });
}

function setupNeonWaves() {
  wavePhase = 0;
  const baseAmp = Math.max(30, Math.min(140, saverCanvas.height / 2.5));
  waveBands = new Array(5).fill(0).map((_, i) => ({
    hue: (i * 70 + Math.random() * 40) % 360,
    speed: 0.5 + Math.random() * 0.9,
    amplitude: baseAmp * (0.35 + Math.random() * 0.9),
    offset: Math.random() * Math.PI * 2
  }));
  sCtx.fillStyle = "#000";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
}

function drawNeonWaves() {
  wavePhase += 0.02;
  sCtx.fillStyle = "rgba(0, 0, 0, 0.25)";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);

  const mid = saverCanvas.height / 2;
  waveBands.forEach((band, idx) => {
    const hue = (band.hue + wavePhase * 120) % 360;
    sCtx.strokeStyle = `hsla(${hue}, 90%, 60%, 0.85)`;
    sCtx.lineWidth = 1.5 + (idx % 2);
    sCtx.beginPath();
    for (let x = -20; x <= saverCanvas.width + 20; x += 12) {
      const y =
        mid +
        Math.sin(wavePhase * band.speed + x * 0.022 + band.offset) * band.amplitude +
        Math.cos(wavePhase * 0.7 + x * 0.015 + idx) * 10;
      if (x === -20) sCtx.moveTo(x, y);
      else sCtx.lineTo(x, y);
    }
    sCtx.stroke();
  });
}

function setupCastaway() {
  const w = saverCanvas.width;
  const h = saverCanvas.height;
  const actionPool = ["nap", "fish", "signal", "stare", "tinker", "campfire"];
  castawayScene = {
    time: 0,
    wave: 0,
    action: actionPool[Math.floor(Math.random() * actionPool.length)],
    actionTimer: 0,
    clouds: new Array(4).fill(0).map(() => ({
      x: Math.random() * w,
      y: h * 0.15 + Math.random() * h * 0.12,
      speed: 0.15 + Math.random() * 0.2,
      size: 50 + Math.random() * 80
    })),
    birds: new Array(6).fill(0).map(() => ({
      x: Math.random() * w,
      y: h * 0.2 + Math.random() * h * 0.15,
      speed: 1 + Math.random() * 0.8,
      flap: Math.random() * Math.PI * 2
    })),
    bottle: {
      x: Math.random() * w,
      y: h * 0.6 + Math.random() * h * 0.1,
      bob: Math.random() * Math.PI * 2
    }
  };
  castawayScene.actionTimer = 200 + Math.floor(Math.random() * 220);
  sCtx.fillStyle = "#000";
  sCtx.fillRect(0, 0, w, h);
}

function drawCastaway() {
  if (!castawayScene) return;
  const w = saverCanvas.width;
  const h = saverCanvas.height;
  castawayScene.time += 1;
  castawayScene.wave += 0.02;
  castawayScene.actionTimer -= 1;

  if (castawayScene.actionTimer <= 0) {
    const actions = ["nap", "fish", "signal", "stare", "tinker", "campfire"];
    const next = actions[Math.floor(Math.random() * actions.length)];
    castawayScene.action = next;
    castawayScene.actionTimer = 180 + Math.floor(Math.random() * 240);
  }

  const dayCycle = (Math.sin(castawayScene.time * 0.00035) + 1) / 2;
  const skyTop = `hsl(${200 - dayCycle * 80}, 80%, ${40 + dayCycle * 20}%)`;
  const skyBottom = `hsl(${210 - dayCycle * 40}, 70%, ${60 + dayCycle * 10}%)`;
  const skyGrad = sCtx.createLinearGradient(0, 0, 0, h);
  skyGrad.addColorStop(0, skyTop);
  skyGrad.addColorStop(1, skyBottom);
  sCtx.fillStyle = skyGrad;
  sCtx.fillRect(0, 0, w, h);

  const sunX = (w * (dayCycle * 0.7 + 0.15)) % (w + 80);
  const sunY = h * (0.25 - 0.15 * Math.cos(dayCycle * Math.PI));
  sCtx.fillStyle = `rgba(255, 230, 150, ${0.4 + dayCycle * 0.3})`;
  sCtx.beginPath();
  sCtx.arc(sunX, sunY, 50, 0, Math.PI * 2);
  sCtx.fill();
  sCtx.fillStyle = `rgba(255, 210, 120, ${0.8})`;
  sCtx.beginPath();
  sCtx.arc(sunX, sunY, 24, 0, Math.PI * 2);
  sCtx.fill();

  const oceanTop = `rgba(0, 70, 130, 0.9)`;
  const oceanBottom = `rgba(0, 30, 70, 0.95)`;
  const seaGrad = sCtx.createLinearGradient(0, h * 0.45, 0, h);
  seaGrad.addColorStop(0, oceanTop);
  seaGrad.addColorStop(1, oceanBottom);
  sCtx.fillStyle = seaGrad;
  sCtx.fillRect(0, h * 0.45, w, h * 0.65);

  sCtx.strokeStyle = "rgba(255,255,255,0.6)";
  sCtx.lineWidth = 2;
  for (let i = 0; i < 6; i++) {
    const waveY = h * 0.5 + i * 30;
    sCtx.beginPath();
    for (let x = 0; x <= w; x += 12) {
      const y =
        waveY +
        Math.sin(castawayScene.wave * (0.8 + i * 0.1) + x * 0.02) * (6 + i);
      if (x === 0) sCtx.moveTo(x, y);
      else sCtx.lineTo(x, y);
    }
    sCtx.stroke();
  }

  const islandX = w * 0.58;
  const islandY = h * 0.72;
  sCtx.fillStyle = "#d0a85b";
  sCtx.beginPath();
  sCtx.ellipse(islandX, islandY, 220, 70, 0, 0, Math.PI * 2);
  sCtx.fill();
  sCtx.fillStyle = "#c28c3b";
  sCtx.beginPath();
  sCtx.ellipse(islandX + 10, islandY + 6, 200, 52, 0, 0, Math.PI * 2);
  sCtx.fill();

  sCtx.save();
  sCtx.translate(islandX - 60, islandY - 120);
  sCtx.fillStyle = "#8b5a2b";
  sCtx.beginPath();
  sCtx.moveTo(0, 120);
  sCtx.lineTo(20, 10);
  sCtx.lineTo(40, 120);
  sCtx.closePath();
  sCtx.fill();
  sCtx.fillStyle = "#1d8c45";
  for (let i = 0; i < 5; i++) {
    sCtx.beginPath();
    sCtx.ellipse(20 + i * 4, 16 + i * 4, 60, 14, (Math.PI / 6) * (i - 2), 0, Math.PI * 2);
    sCtx.fill();
  }
  sCtx.restore();

  castawayScene.clouds.forEach((cloud) => {
    cloud.x += cloud.speed;
    if (cloud.x - cloud.size > w) cloud.x = -cloud.size;
    sCtx.fillStyle = "rgba(255,255,255,0.9)";
    sCtx.beginPath();
    sCtx.ellipse(cloud.x, cloud.y, cloud.size, cloud.size * 0.55, 0, 0, Math.PI * 2);
    sCtx.ellipse(cloud.x - cloud.size * 0.5, cloud.y + 6, cloud.size * 0.6, cloud.size * 0.35, 0, 0, Math.PI * 2);
    sCtx.ellipse(cloud.x + cloud.size * 0.5, cloud.y + 8, cloud.size * 0.7, cloud.size * 0.4, 0, 0, Math.PI * 2);
    sCtx.fill();
  });

  castawayScene.birds.forEach((bird) => {
    bird.x += bird.speed;
    bird.flap += 0.2;
    if (bird.x > w + 30) {
      bird.x = -20;
      bird.y = h * 0.2 + Math.random() * h * 0.15;
    }
    const wing = Math.sin(bird.flap) * 8;
    sCtx.strokeStyle = "rgba(0,0,0,0.6)";
    sCtx.lineWidth = 2;
    sCtx.beginPath();
    sCtx.moveTo(bird.x - 8, bird.y + wing);
    sCtx.quadraticCurveTo(bird.x, bird.y - 6, bird.x + 8, bird.y + wing);
    sCtx.stroke();
  });

  castawayScene.bottle.bob += 0.04;
  castawayScene.bottle.x += 0.4;
  if (castawayScene.bottle.x > w + 20) castawayScene.bottle.x = -20;
  const bottleY =
    castawayScene.bottle.y + Math.sin(castawayScene.bottle.bob) * 6 + Math.sin(castawayScene.wave * 1.4) * 4;
  sCtx.fillStyle = "rgba(220, 255, 255, 0.7)";
  sCtx.beginPath();
  sCtx.ellipse(castawayScene.bottle.x, bottleY, 8, 16, 0.2, 0, Math.PI * 2);
  sCtx.fill();
  sCtx.fillStyle = "rgba(80,120,160,0.9)";
  sCtx.fillRect(castawayScene.bottle.x - 3, bottleY - 16, 6, 6);

  const manX = islandX + 20;
  const manY = islandY - 18;
  const action = castawayScene.action;
  const bob = Math.sin(castawayScene.wave * 3) * 2;
  sCtx.strokeStyle = "#2d2415";
  sCtx.lineWidth = 6;
  sCtx.lineCap = "round";
  sCtx.beginPath();
  sCtx.moveTo(manX, manY - 18 + bob);
  sCtx.lineTo(manX, manY + 12 + bob);
  sCtx.stroke();

  sCtx.fillStyle = "#f4d7b2";
  sCtx.beginPath();
  sCtx.arc(manX, manY - 30 + bob, 10, 0, Math.PI * 2);
  sCtx.fill();

  const leftArm = action === "signal" ? -24 : -14;
  const rightArm = action === "fish" ? 28 : 14;
  sCtx.lineWidth = 4;
  sCtx.strokeStyle = "#3b2f1d";
  sCtx.beginPath();
  sCtx.moveTo(manX, manY - 4 + bob);
  sCtx.lineTo(manX + leftArm, manY + (action === "nap" ? 4 : -2) + bob);
  sCtx.stroke();
  sCtx.beginPath();
  sCtx.moveTo(manX, manY - 4 + bob);
  sCtx.lineTo(manX + rightArm, manY + (action === "fish" ? 16 : 2) + bob);
  sCtx.stroke();

  sCtx.lineWidth = 5;
  sCtx.beginPath();
  sCtx.moveTo(manX, manY + 12 + bob);
  sCtx.lineTo(manX - 10, manY + 32 + bob);
  sCtx.stroke();
  sCtx.beginPath();
  sCtx.moveTo(manX, manY + 12 + bob);
  sCtx.lineTo(manX + 12, manY + 32 + bob);
  sCtx.stroke();

  if (action === "fish") {
    sCtx.strokeStyle = "rgba(40,60,80,0.8)";
    sCtx.lineWidth = 2;
    sCtx.beginPath();
    sCtx.moveTo(manX + 28, manY + 14 + bob);
    sCtx.lineTo(manX + 32, manY - 18);
    sCtx.lineTo(manX + 34, manY - 60);
    sCtx.stroke();
    sCtx.beginPath();
    sCtx.moveTo(manX + 34, manY - 60);
    sCtx.lineTo(manX + 34, manY + 160 + Math.sin(castawayScene.wave * 3) * 18);
    sCtx.stroke();
  } else if (action === "signal") {
    sCtx.fillStyle = "#ffef4a";
    sCtx.beginPath();
    sCtx.ellipse(manX - 30, manY - 18, 12, 28, -0.3, 0, Math.PI * 2);
    sCtx.fill();
  } else if (action === "campfire") {
    const flicker = 6 + Math.sin(castawayScene.time * 0.25) * 3;
    sCtx.fillStyle = "#5b3a1a";
    sCtx.fillRect(manX - 70, manY + 32, 12, 8);
    sCtx.fillRect(manX - 56, manY + 32, 12, 8);
    const grad = sCtx.createRadialGradient(manX - 60, manY + 20, 2, manX - 60, manY + 20, 26);
    grad.addColorStop(0, "rgba(255,200,60,0.9)");
    grad.addColorStop(1, "rgba(255,100,40,0.1)");
    sCtx.fillStyle = grad;
    sCtx.beginPath();
    sCtx.ellipse(manX - 60, manY + 18, 14, flicker, 0, 0, Math.PI * 2);
    sCtx.fill();
  } else if (action === "tinker") {
    sCtx.fillStyle = "#7c7c7c";
    sCtx.fillRect(manX + 16, manY + 4 + bob, 18, 10);
    sCtx.fillRect(manX + 12, manY + 12 + bob, 6, 6);
  }

  sCtx.fillStyle = "rgba(0,0,0,0.2)";
  sCtx.beginPath();
  sCtx.ellipse(islandX + 10, islandY + 10, 220, 60, 0, 0, Math.PI * 2);
  sCtx.fill();
}

function setupFlyingToasters() {
  sCtx.fillStyle = "#020611";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
  const count = Math.max(6, Math.floor((saverCanvas.width + saverCanvas.height) / 230));
  toasters = new Array(count).fill(0).map((_, idx) => createFlyingToaster(idx));
}

function createFlyingToaster(seed) {
  const direction = Math.random() < 0.5 ? -1 : 1;
  const startX =
    direction === 1
      ? -120 - Math.random() * 160
      : saverCanvas.width + 120 + Math.random() * 160;
  return {
    x: startX,
    y: Math.random() * saverCanvas.height * 0.7 + saverCanvas.height * 0.15,
    vx: direction * (Math.random() * 1.6 + 1.2),
    vy: (Math.random() - 0.5) * 0.6,
    flap: Math.random() * Math.PI * 2,
    wobble: Math.random() * 0.8 + 0.4,
    scale: Math.random() * 0.35 + 0.75,
    sparkleOffset: seed + Math.random() * Math.PI,
    tint: TOASTER_COLORS[Math.floor(Math.random() * TOASTER_COLORS.length)]
  };
}

function drawFlyingToasters() {
  sCtx.fillStyle = "rgba(0, 0, 10, 0.25)";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);

  const time = Date.now() / 1000;
  toasters.forEach((toaster, idx) => {
    toaster.x += toaster.vx;
    toaster.y += toaster.vy + Math.sin(time * toaster.wobble + idx) * 0.6;
    toaster.flap += 0.22 + toaster.wobble * 0.04;

    if (toaster.y < saverCanvas.height * 0.08 || toaster.y > saverCanvas.height * 0.92)
      toaster.vy *= -1;

    if (toaster.x < -200 || toaster.x > saverCanvas.width + 200) {
      toasters[idx] = createFlyingToaster(idx);
      return;
    }

    drawFlyingToasterShape(toaster, time);
  });
}

function drawFlyingToasterShape(toaster, time) {
  const baseWidth = 90;
  const baseHeight = 52;
  const wingLength = 38;
  const flapAngle = Math.sin(toaster.flap) * 0.7 + 0.9;

  sCtx.save();
  sCtx.translate(toaster.x, toaster.y);
  const facingLeft = toaster.vx < 0;
  sCtx.scale(toaster.scale * (facingLeft ? -1 : 1), toaster.scale);
  sCtx.rotate(Math.sin(time * 0.9 + toaster.sparkleOffset) * 0.18);

  const glow = sCtx.createRadialGradient(0, 0, 10, 0, 0, 80);
  glow.addColorStop(0, "rgba(200, 230, 255, 0.35)");
  glow.addColorStop(1, "rgba(0, 10, 30, 0)");
  sCtx.fillStyle = glow;
  sCtx.beginPath();
  sCtx.ellipse(0, baseHeight * 0.05, baseWidth * 0.9, baseHeight * 0.95, 0, 0, Math.PI * 2);
  sCtx.fill();

  const drawWing = (flip) => {
    sCtx.save();
    sCtx.scale(flip ? -1 : 1, 1);
    sCtx.translate(baseWidth / 2.4, baseHeight * 0.05);
    sCtx.rotate(-0.7 + flapAngle * 0.6);
    sCtx.beginPath();
    sCtx.moveTo(0, 0);
    sCtx.quadraticCurveTo(wingLength * 0.2, -wingLength * 0.4, wingLength * 0.5, -wingLength * flapAngle);
    sCtx.quadraticCurveTo(wingLength * 0.9, -wingLength * 0.25, wingLength, 0);
    sCtx.quadraticCurveTo(wingLength * 0.7, wingLength * 0.12, wingLength * 0.28, wingLength * 0.06);
    sCtx.closePath();
    sCtx.fillStyle = "#fdfdfd";
    sCtx.strokeStyle = "#c8d9f2";
    sCtx.lineWidth = 2.2;
    sCtx.fill();
    sCtx.stroke();
    sCtx.restore();
  };

  drawWing(false);
  drawWing(true);

  const bodyGradient = sCtx.createLinearGradient(
    -baseWidth / 2,
    -baseHeight / 2,
    baseWidth / 2,
    baseHeight / 2
  );
  bodyGradient.addColorStop(0, toaster.tint);
  bodyGradient.addColorStop(1, "#9fb1cc");

  sCtx.fillStyle = bodyGradient;
  sCtx.strokeStyle = "#5f6c83";
  sCtx.lineWidth = 2.4;
  sCtx.beginPath();
  if (sCtx.roundRect) {
    sCtx.roundRect(-baseWidth / 2, -baseHeight / 2, baseWidth, baseHeight, 12);
  } else {
    sCtx.rect(-baseWidth / 2, -baseHeight / 2, baseWidth, baseHeight);
  }
  sCtx.fill();
  sCtx.stroke();

  sCtx.fillStyle = "#8797af";
  sCtx.fillRect(-baseWidth / 2 + 8, -baseHeight / 2 + 6, baseWidth - 16, 8);
  sCtx.fillStyle = "#cbd5e8";
  sCtx.fillRect(-baseWidth / 2 + 12, -baseHeight / 2 + 8, baseWidth - 24, 6);

  sCtx.fillStyle = "#556076";
  sCtx.fillRect(-baseWidth / 2 + 14, -baseHeight / 2 + 20, baseWidth - 28, 4);
  sCtx.fillRect(-baseWidth / 2 + 14, -baseHeight / 2 + 28, baseWidth - 28, 4);

  const sliceWidth = 18;
  const sliceHeight = 18;
  const sliceOffset = Math.sin(time * 1.4 + toaster.sparkleOffset) * 2;
  sCtx.fillStyle = "#e1b679";
  sCtx.strokeStyle = "#c48f47";
  sCtx.lineWidth = 1.4;
  [
    [-sliceWidth - 6, -baseHeight / 2 - 4 - sliceOffset],
    [sliceWidth + 2, -baseHeight / 2 - 8 + sliceOffset]
  ].forEach(([sx, sy]) => {
    sCtx.beginPath();
    if (sCtx.roundRect) sCtx.roundRect(sx, sy, sliceWidth, sliceHeight, 4);
    else sCtx.rect(sx, sy, sliceWidth, sliceHeight);
    sCtx.fill();
    sCtx.stroke();
    sCtx.fillStyle = "#f3cf9c";
    sCtx.fillRect(sx + 4, sy + 4, sliceWidth - 8, sliceHeight - 10);
    sCtx.fillStyle = "#e1b679";
  });

  sCtx.fillStyle = "#2d3b4f";
  sCtx.beginPath();
  sCtx.arc(baseWidth / 2 - 16, baseHeight / 2 - 14, 6, 0, Math.PI * 2);
  sCtx.fill();
  sCtx.fillStyle = "#7ab2f7";
  sCtx.beginPath();
  sCtx.arc(baseWidth / 2 - 16, baseHeight / 2 - 14, 3, 0, Math.PI * 2);
  sCtx.fill();

  sCtx.restore();
}

function setupPipes() {
  pipes = [];
  sCtx.fillStyle = "black";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
  for (let i = 0; i < 4; i++) {
    pipes.push({
      x: Math.random() * saverCanvas.width,
      y: Math.random() * saverCanvas.height,
      dir: pipeDirections[Math.floor(Math.random() * pipeDirections.length)],
      color: PIPE_COLORS[i % PIPE_COLORS.length],
      stepSize: 14,
      turnCounter: 0
    });
  }
}

function chooseNewPipeDirection(pipe) {
  const options = pipeDirections.filter(
    (d) => !(d.x === -pipe.dir.x && d.y === -pipe.dir.y)
  );
  pipe.dir = options[Math.floor(Math.random() * options.length)];
  pipe.turnCounter = 0;
}

function adjustColor(col, amt) {
  const hex = col.replace("#", "");
  const num = parseInt(hex, 16);
  let r = (num >> 16) + amt;
  let g = ((num >> 8) & 0xff) + amt;
  let b = (num & 0xff) + amt;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `rgb(${r}, ${g}, ${b})`;
}

function drawPipes() {
  sCtx.fillStyle = "rgba(0,0,0,0.08)";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);

  pipes.forEach((pipe) => {
    pipe.turnCounter++;
    const dangerMargin = 30;
    let nextX = pipe.x + pipe.dir.x * pipe.stepSize;
    let nextY = pipe.y + pipe.dir.y * pipe.stepSize;

    if (
      nextX < dangerMargin ||
      nextX > saverCanvas.width - dangerMargin ||
      nextY < dangerMargin ||
      nextY > saverCanvas.height - dangerMargin ||
      Math.random() < 0.1 * (pipe.turnCounter / 6)
    ) {
      chooseNewPipeDirection(pipe);
      nextX = pipe.x + pipe.dir.x * pipe.stepSize;
      nextY = pipe.y + pipe.dir.y * pipe.stepSize;
    }

    const highlight = adjustColor(pipe.color, 80);
    const shadow = adjustColor(pipe.color, -80);
    const grad = sCtx.createLinearGradient(pipe.x, pipe.y, nextX, nextY);
    grad.addColorStop(0, highlight);
    grad.addColorStop(0.5, pipe.color);
    grad.addColorStop(1, shadow);

    sCtx.lineWidth = 12;
    sCtx.lineCap = "round";
    sCtx.strokeStyle = grad;
    sCtx.beginPath();
    sCtx.moveTo(pipe.x, pipe.y);
    sCtx.lineTo(nextX, nextY);
    sCtx.stroke();

    sCtx.fillStyle = highlight;
    sCtx.beginPath();
    sCtx.arc(nextX, nextY, 4, 0, Math.PI * 2);
    sCtx.fill();

    pipe.x = nextX;
    pipe.y = nextY;
  });
}

function initSplash() {
  const splash = document.getElementById("splash-screen");
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


// System / General
window.createFolder = createFolder;
window.switchTask = switchTask;
window.endTask = endTask;
window.kernel = kernel;

registerConsoleCommands();

// Apps
window.handleConsoleKey = handleConsoleKey; // Fixes the Console App
window.calcInput = calcInput;
window.resetMines = resetMines;
//window.toggleMedia = toggleMedia;
window.selectPaintTool = selectPaintTool;
window.clearPaint = clearPaint;
window.copyCharMap = copyCharMap;
window.runCompiler = runCompiler;
window.runPython = runPython;
window.exportFileSystem = exportFileSystem;
window.importFileSystem = importFileSystem;
window.installSelectedManifest = installSelectedManifest;
window.uninstallManifest = uninstallManifest;

// Database App
window.addDbRecord = addDbRecord;
window.exportDbToCsv = exportDbToCsv;
window.deleteDbRecord = deleteDbRecord;

// Photoshop App
window.psTriggerOpen = psTriggerOpen;
window.psNewDocument = psNewDocument;
window.psExport = psExport;
window.setPsTool = setPsTool;
window.psApplyFilter = psApplyFilter;
window.psFillCanvas = psFillCanvas;

// Control Panel
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

window.onload = async () => {
  await fileSystemReady.catch(() => {});
  await installerReady.catch(() => {});
  bootDesktop();
  initDesktopContextMenu();
  initSplash();
  initScreensaver();
  initDragAndDropImport();
};

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
import { getBbsContent, initBbs } from "./apps/bbsDialer.js";
import { getEmailContent, initEmail } from "./apps/email.js";
import { getMessengerContent, initMessenger } from "./apps/messenger.js";
import { getRetroAIContent, initRetroAI } from "./apps/retroAI.js";
import { initKakuro } from "./apps/kakuro.js";
import { initMarkdownViewer } from "./apps/markdown.js";
import { initMinesweeper, resetMines } from "./apps/minesweeper.js";
import { initPdfReader } from "./apps/pdfReader.js";
import { clearPaint, getPaintRoot, initPaint, selectPaintTool } from "./apps/paint.js";
import {
  getPixelStudioContent,
  initPixelStudio
} from "./apps/pixelStudio.js";
import { getPostgresContent, initPostgres } from "./apps/postgres.js";
import { initVm } from "./apps/vm.js";
import { initWrite } from "./apps/write.js";
import { initArtist } from "./apps/artist.js";
import { getSandspielRoot, initSandspiel } from "./apps/sandspiel.js";
import { getSandspiel3DRoot, initSandspiel3d } from "./apps/sandspiel3d.js";
import { getWhiteboardRoot, initWhiteboard } from "./apps/whiteboard.js";
import { initImageViewer } from "./apps/imageViewer.js";
import { initReversi } from "./apps/reversi.js";
import { initSolitaire } from "./apps/solitaire.js";
import { initSudoku } from "./apps/sudoku.js";
import { copyCharMap, initCharMap } from "./apps/charmap.js";
import { getBeatMakerContent, initBeatMaker } from "./apps/beatMaker.js";
import { getMidiSequencerContent, initMidiSequencer } from "./apps/midiSequencer.js";
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
import { getLineRiderContent, initLineRider } from "./apps/linerider.js";
import { getSimCityContent, initSimCity } from "./apps/simcity.js";
import { getNetNewsContent, initNetNews } from "./apps/netnews.js";
import { getSkiFreeContent, initSkiFree } from "./apps/skifree.js";
import { getPinballContent, initPinball } from "./apps/pinball.js";
import { getAngryBirdsContent, initAngryBirds } from "./apps/angrybirds.js";
import { getCannonDuelContent, initCannonDuel } from "./apps/cannonDuel.js";
import { getCalcContent } from "./apps/calc.js";
import { getReadmeContent } from "./apps/readme.js";
import { initMafia } from "./apps/mafia.js";
import { getRssReaderContent } from "./apps/rss.js";
import { getPacketLabContent, initPacketLab } from "./apps/packetLab.js";
import { getClipboardContent } from "./apps/clipboard.js";
import { getTi83Root, initTi83 } from "./apps/ti83.js";
import { getTrackerContent, initTracker } from "./apps/tracker.js";
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
import { getShaderLabRoot, initShaderLab } from "./apps/shaderLab.js";
import {
  hideUnlockPrompt,
  initScreensaver,
  screensaverContext,
  submitLockPassphrase
} from "./apps/screensaver.js";
import { WindowManager, controlPanelContext } from "./windowManager.js";


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

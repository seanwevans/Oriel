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
import { getCeleryManContent, initCeleryMan } from "./apps/celeryman.js";
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
import { getApiClientContent, initApiClient } from "./apps/apiClient.js";
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

export const controlPanelContext = {};
controlPanelContext.screensaver = screensaverContext;

const APP_INITIALIZERS = {
  mines: initMinesweeper,
  kakuro: initKakuro,
  solitaire: initSolitaire,
  reversi: initReversi,
  sudoku: initSudoku,
  mafia: initMafia,
  paint: initPaint,
  pixelstudio: initPixelStudio,
  notepad: initNotepad,
  photoshop: initPhotoshop,
  artist: initArtist,
  mplayer: initMediaPlayer,
  simcity: initSimCity,
  skifree: initSkiFree,
  angrybirds: initAngryBirds,
  cannonduel: initCannonDuel,
  pinball: initPinball,
  linerider: initLineRider,
  database: initDatabase,
  soundrec: initSoundRecorder,
  radio: initRadio,
  beatmaker: initBeatMaker,
  tracker: initTracker,
  midisequencer: initMidiSequencer,
  charmap: initCharMap,
  celeryman: initCeleryMan,
  postgres: initPostgres,
  winfile: initFileManager,
  clock: initClock,
  control: (w, initData, wmInstance) =>
    initControlPanel(controlPanelContext, w, initData, wmInstance),
  reset: initReset,
  chess: initChess,
  console: initConsole,
  packetlab: initPacketLab,
  retroai: initRetroAI,
  apiclient: initApiClient,
  write: initWrite,
  cardfile: initCardfile,
  taskman: initTaskMan,
  pdfreader: initPdfReader,
  imageviewer: initImageViewer,
  markdown: initMarkdownViewer,
  rss: initRssReader,
  netnews: initNetNews,
  browser: initBrowser,
  radiogarden: initRadioGarden,
  discord: initDiscord,
  bbs: initBbs,
  messenger: initMessenger,
  irc: initIRC,
  email: initEmail,
  spotify: initSpotify,
  doom: initDoom,
  minecraft: initMinecraft,
  n64: initN64,
  ti83: initTi83,
  shaderlab: initShaderLab,
  sandspiel: initSandspiel,
  sandspiel3d: initSandspiel3d,
  papers: initPapersPlease,
  whiteboard: initWhiteboard,
  vm: initVm,
  hexedit: initHexEditor
};

export class WindowManager {
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
    if (type === "mafia") content = this.getMafiaContent();
    if (type === "photoshop") content = getPhotoshopContent();
    if (type === "artist") content = this.getArtistContent();
    if (type === "shaderlab") content = getShaderLabRoot();
    if (type === "compiler") content = this.getCompilerContent();
    if (type === "python") content = this.getPythonContent();
    if (type === "console") content = this.getConsoleContent();
    if (type === "packetlab") content = getPacketLabContent();
    if (type === "apiclient") content = getApiClientContent();
    if (type === "retroai") content = getRetroAIContent();
    if (type === "taskman") content = this.getTaskManContent();
    if (type === "chess") content = this.getChessContent();
    if (type === "paint") content = getPaintRoot(initData);
    if (type === "pixelstudio") content = getPixelStudioContent();
    if (type === "mplayer") content = this.getMediaPlayerContent();
    if (type === "simcity") content = getSimCityContent();
    if (type === "skifree") content = getSkiFreeContent();
    if (type === "angrybirds") content = getAngryBirdsContent();
    if (type === "cannonduel") content = getCannonDuelContent();
    if (type === "pinball") content = getPinballContent();
    if (type === "linerider") content = getLineRiderContent();
    if (type === "database") content = this.getDatabaseContent();
    if (type === "postgres") content = getPostgresContent();
    if (type === "soundrec") content = this.getSoundRecContent();
    if (type === "radio") content = this.getRadioContent();
    if (type === "beatmaker") content = getBeatMakerContent();
    if (type === "tracker") content = getTrackerContent();
    if (type === "midisequencer") content = getMidiSequencerContent();
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
    if (type === "netnews") content = getNetNewsContent();
    if (type === "browser") content = this.getBrowserContent();
    if (type === "radiogarden") content = this.getRadioGardenContent();
    if (type === "celeryman") content = getCeleryManContent();
    if (type === "discord") content = getDiscordContent();
    if (type === "bbs") content = getBbsContent();
    if (type === "spotify") content = getSpotifyContent();
    if (type === "messenger") content = getMessengerContent();
    if (type === "irc") content = getIRCContent();
    if (type === "email") content = getEmailContent();
    if (type === "vm") content = this.getVmContent();
    if (type === "doom") content = this.getDoomContent();
    if (type === "minecraft") content = this.getMinecraftContent();
    if (type === "n64") content = this.getN64Content();
    if (type === "ti83") content = this.getTi83Content();
    if (type === "sandspiel") content = this.getSandspielContent();
    if (type === "sandspiel3d") content = this.getSandspiel3DContent();
    if (type === "papers") content = this.getPapersContent();
    if (type === "whiteboard") content = getWhiteboardRoot();
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
      if (typeof closingWin.el.cannonduelCleanup === "function")
        closingWin.el.cannonduelCleanup();
      if (typeof closingWin.el.pinballCleanup === "function")
        closingWin.el.pinballCleanup();
      if (typeof closingWin.el.lineRiderCleanup === "function")
        closingWin.el.lineRiderCleanup();
      if (typeof closingWin.el.sandspiel3dCleanup === "function")
        closingWin.el.sandspiel3dCleanup();
      if (typeof closingWin.el.shaderLabCleanup === "function")
        closingWin.el.shaderLabCleanup();
      if (typeof closingWin.el.whiteboardCleanup === "function")
        closingWin.el.whiteboardCleanup();
      if (typeof closingWin.el.packetLabCleanup === "function")
        closingWin.el.packetLabCleanup();
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
    const existing = loadDesktopState();
    const state = {
      ...existing,
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
  getMafiaContent() {
    return `
      <div class="mafia-layout">
        <div class="mafia-sidebar">
          <div class="mafia-section">
            <label class="mafia-field">Players
              <input type="number" min="6" max="12" value="8" class="mafia-count" aria-label="Number of players">
            </label>
            <label class="mafia-field">AI Provider
              <select class="mafia-provider" aria-label="AI provider">
                <option value="local">Local improv</option>
                <option value="openai">OpenAI</option>
                <option value="google">Google Gemini</option>
                <option value="anthropic">Anthropic</option>
              </select>
            </label>
            <label class="mafia-field">API Key
              <input type="password" class="mafia-api-key" placeholder="Optional for cloud" aria-label="API key">
            </label>
            <label class="mafia-field">Model (optional)
              <input type="text" class="mafia-model" placeholder="gpt-4o-mini / gemini-1.5-flash" aria-label="Model override">
            </label>
            <div class="mafia-hint">Keys stay in-browser. Choose "Local improv" for an offline story.</div>
            <button class="task-btn mafia-start">New Mystery</button>
          </div>
          <div class="mafia-section">
            <div class="mafia-section-title">Roster</div>
            <div class="mafia-roster" aria-label="Player roster"></div>
          </div>
        </div>
        <div class="mafia-main">
          <div class="mafia-status" aria-live="polite">Build your table and begin.</div>
          <div class="mafia-controls">
            <label>Accuse
              <select class="mafia-suspect" aria-label="Pick a suspect"></select>
            </label>
            <button class="task-btn mafia-next">Run Night & Vote</button>
          </div>
          <div class="mafia-log" aria-live="polite"></div>
        </div>
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



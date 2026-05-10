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
import { getDiscordContent } from "./apps/discord.js";
import { getSpotifyContent } from "./apps/spotify.js";
import { getIRCContent } from "./apps/irc.js";
import { getBbsContent } from "./apps/bbsDialer.js";
import { getEmailContent } from "./apps/email.js";
import { getMessengerContent } from "./apps/messenger.js";
import { getRetroAIContent } from "./apps/retroAI.js";
import { resetMines } from "./apps/minesweeper.js";
import { getCeleryManContent } from "./apps/celeryman.js";
import { clearPaint, getPaintRoot, selectPaintTool } from "./apps/paint.js";
import { getPixelStudioContent } from "./apps/pixelStudio.js";
import { getPostgresContent } from "./apps/postgres.js";
import { getSandspielRoot } from "./apps/sandspiel.js";
import { getSandspiel3DRoot } from "./apps/sandspiel3d.js";
import { getWhiteboardRoot } from "./apps/whiteboard.js";
import { copyCharMap } from "./apps/charmap.js";
import { getBeatMakerContent } from "./apps/beatMaker.js";
import { getMidiSequencerContent } from "./apps/midiSequencer.js";
import { addDbRecord, deleteDbRecord, exportDbToCsv } from "./apps/database.js";
import { endTask, refreshAllProcessViews, refreshAllTaskManagers, switchTask } from "./apps/taskman.js";
import { browserSessions, getNetworkDefaults, refreshNetworkedWindows, resetNetworkDefaults, updateNetworkDefaults } from "./networking.js";
import { getWinFileContent, installSelectionFromWindow, rFL, rFT, uninstallSelectionFromWindow } from "./apps/fileManager.js";
import { calcInput, handleConsoleKey, registerConsoleCommands, runCompiler, runPython } from "./apps/console.js";
import { getPhotoshopContent, psApplyFilter, psExport, psFillCanvas, psNewDocument, psTriggerOpen, setPsTool } from "./apps/photoshop.js";
import { getLineRiderContent } from "./apps/linerider.js";
import { getSimCityContent } from "./apps/simcity.js";
import { getNetNewsContent } from "./apps/netnews.js";
import { getSkiFreeContent } from "./apps/skifree.js";
import { getPinballContent } from "./apps/pinball.js";
import { getAngryBirdsContent } from "./apps/angrybirds.js";
import { getCannonDuelContent } from "./apps/cannonDuel.js";
import { getRssReaderContent } from "./apps/rss.js";
import { getPacketLabContent } from "./apps/packetLab.js";
import { getApiClientContent } from "./apps/apiClient.js";
import { getCodePenContent } from "./apps/codepen.js";
import { getTi83Root } from "./apps/ti83.js";
import { getTrackerContent } from "./apps/tracker.js";
import { applyFontSelection, applySavedTheme, applyScreensaver, applyTheme, getCurrentThemeCustom, handleThemeInputChange, openCPColor, openCPDefaults, openCPDesktop, openCPFonts, openCPScreensaver, openCPSound, previewScreensaver, setWallpaper } from "./apps/controlPanel.js";
import { bootstrapInstallations } from "./installer.js";
import { getShaderLabRoot } from "./apps/shaderLab.js";
import { AppRegistry } from "./core/AppRegistry.js";
import { AppHost } from "./core/AppHost.js";
import { getMinecraftRoot } from "./apps/minecraft.js";
import { getN64Root } from "./apps/n64.js";
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
import { SimulatedKernel } from "./kernel.js";
import { getCalcContent } from "./apps/calc.js";
import { getReadmeContent } from "./apps/readme.js";
import { getClipboardContent } from "./apps/clipboard.js";
import {
  getAvailablePrograms as getProgramManagerApps,
  getIconForType as getProgramManagerIcon,
  getProgramDefaults as getProgramManagerDefaults,
  getProgramManagerContent,
  refreshProgramManagerContent,
  setupProgramManagerMenu
} from "./apps/programManager.js";
import {
  hideUnlockPrompt,
  initScreensaver,
  screensaverContext,
  submitLockPassphrase
} from "./apps/screensaver.js";
import { BaseApp } from "./apps/base/BaseApp.js";
import { getWindowBodyContainer } from "./windowContent.js";
import artistLayout from "./layouts/windowManager/artist.html?raw";
import browserLayout from "./layouts/windowManager/browser.html?raw";
import cardfileLayout from "./layouts/windowManager/cardfile.html?raw";
import charMapLayout from "./layouts/windowManager/char-map.html?raw";
import chessLayout from "./layouts/windowManager/chess.html?raw";
import clockLayout from "./layouts/windowManager/clock.html?raw";
import compilerLayout from "./layouts/windowManager/compiler.html?raw";
import consoleLayout from "./layouts/windowManager/console.html?raw";
import controlPanelLayout from "./layouts/windowManager/control-panel.html?raw";
import databaseLayout from "./layouts/windowManager/database.html?raw";
import doomLayout from "./layouts/windowManager/doom.html?raw";
import hexEditorLayout from "./layouts/windowManager/hex-editor.html?raw";
import kakuroLayout from "./layouts/windowManager/kakuro.html?raw";
import mafiaLayout from "./layouts/windowManager/mafia.html?raw";
import mediaPlayerLayout from "./layouts/windowManager/media-player.html?raw";
import minesLayout from "./layouts/windowManager/mines.html?raw";
import papersLayout from "./layouts/windowManager/papers.html?raw";
import pythonLayout from "./layouts/windowManager/python.html?raw";
import radioGardenLayout from "./layouts/windowManager/radio-garden.html?raw";
import radioLayout from "./layouts/windowManager/radio.html?raw";
import resetLayout from "./layouts/windowManager/reset.html?raw";
import reversiLayout from "./layouts/windowManager/reversi.html?raw";
import solitaireLayout from "./layouts/windowManager/solitaire.html?raw";
import soundRecLayout from "./layouts/windowManager/sound-rec.html?raw";
import sudokuLayout from "./layouts/windowManager/sudoku.html?raw";
import taskManagerLayout from "./layouts/windowManager/task-manager.html?raw";
import vmLayout from "./layouts/windowManager/vm.html?raw";
import writeLayout from "./layouts/windowManager/write.html?raw";

export const controlPanelContext = {};
controlPanelContext.screensaver = screensaverContext;

function renderTemplate(template, values = {}) {
  return Object.entries(values).reduce(
    (html, [token, value]) => html.replaceAll(`{{${token}}}`, String(value)),
    template
  );
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return entities[char];
  });
}

class LegacyFunctionApp extends BaseApp {
  constructor({ initializer, ...args }) {
    super(args);
    this.initializer = initializer;
  }

  mount() {
    return this.initializer(
      this.windowEl,
      this.initData,
      this.services.windowManager
    );
  }
}

function createLegacyAppAdapter(initializer) {
  return ({ windowEl, initData, services }) =>
    new LegacyFunctionApp({ windowEl, initData, services, initializer });
}

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
    this.appRegistry = new AppRegistry({ controlPanelContext });
    this.appHost = new AppHost({
      onMountError: ({ err, winEl, type }) => {
        console.error(`Initializer for '${type}' failed:`, err);
        this.renderRuntimeError(winEl, err);
      }
    });
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
  createWindowDOM(id, type, title, width, height, content, stateOverrides = {}) {
    const win = document.createElement("div");
    win.classList.add("window");
    const resolvedWidth =
      typeof width === "number" ? `${width}px` : width || width === 0 ? width : "";
    const resolvedHeight =
      typeof height === "number" ? `${height}px` : height || height === 0 ? height : "";
    win.setAttribute("role", "dialog");
    win.setAttribute("aria-label", title);
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
    win.dataset.appType = type;
    win.dataset.title = title;

    const resizeHandles = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];
    resizeHandles.forEach((handleType) => {
      const resizer = document.createElement("div");
      resizer.classList.add("resizer", handleType);
      resizer.dataset.resize = handleType;
      win.appendChild(resizer);
    });

    const titleBar = document.createElement("div");
    titleBar.classList.add("title-bar");

    const closeBtn = document.createElement("div");
    closeBtn.classList.add("sys-box");
    closeBtn.textContent = "-";
    closeBtn.addEventListener("click", () => this.closeWindow(id));
    titleBar.appendChild(closeBtn);

    const titleText = document.createElement("div");
    titleText.classList.add("title-bar-text");
    titleText.textContent = title;
    titleBar.appendChild(titleText);

    const controls = document.createElement("div");
    controls.classList.add("win-controls-right");

    const minimizeBtn = document.createElement("div");
    minimizeBtn.classList.add("win-btn");
    minimizeBtn.textContent = "▼";
    minimizeBtn.addEventListener("click", () => this.minimizeWindow(id));
    controls.appendChild(minimizeBtn);

    const maximizeBtn = document.createElement("div");
    maximizeBtn.classList.add("win-btn");
    maximizeBtn.textContent = "▲";
    maximizeBtn.addEventListener("click", () => this.maximizeWindow(id));
    controls.appendChild(maximizeBtn);

    titleBar.appendChild(controls);
    win.appendChild(titleBar);

    const menuBar = document.createElement("div");
    menuBar.classList.add("menu-bar");
    ["File", "Edit", "Help"].forEach((label) => {
      const menuItem = document.createElement("div");
      menuItem.classList.add("menu-item");
      menuItem.textContent = label;
      menuBar.appendChild(menuItem);
    });
    win.appendChild(menuBar);

    const windowBody = document.createElement("div");
    windowBody.classList.add("window-body");
    win.appendChild(windowBody);
    const contentArea = getWindowBodyContainer(win);
    if (contentArea) {
      if (typeof content === "string") {
        contentArea.innerHTML = content;
      } else if (content instanceof Node) {
        contentArea.appendChild(content);
      }
    }
    // Drag Start
    titleBar.addEventListener("mousedown", (e) => {
      if (
        e.target.classList.contains("sys-box") ||
        e.target.classList.contains("win-btn")
      )
        return;
      this.startDrag(e, win);
    });
    // Accessibility: make window controls keyboard operable
    closeBtn.setAttribute("role", "button");
    closeBtn.setAttribute("aria-label", `Close ${title}`);
    closeBtn.tabIndex = 0;
    this.addKeyboardActivation(closeBtn, () => this.closeWindow(id));

    minimizeBtn.setAttribute("role", "button");
    minimizeBtn.setAttribute("aria-label", `Minimize ${title}`);
    minimizeBtn.tabIndex = 0;
    this.addKeyboardActivation(minimizeBtn, () => this.minimizeWindow(id));

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
    if (type === "codepen") content = initData?.mode === "viewer" ? "" : getCodePenContent();
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
    const initializer = this.appRegistry.resolve(type);
    if (!content && this.appRegistry.getRuntimeInitializer(type)) {
      content = `<div class="runtime-app" data-app="${type}">Loading ${title}...</div>`;
    }
    const winEl = this.createWindowDOM(
      id,
      type,
      title,
      resolvedWidth,
      resolvedHeight,
      content,
      stateOverrides
    );
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
      appInstance: null,
      pendingMountPromise: null,
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
    // Initialize app logic when an app has behavior beyond its rendered content.
    if (initializer) {
      const mountResult = this.appHost.mount({ initializer, winEl, winObj, initData, wmInstance: this, type });
      if (mountResult && typeof mountResult.then === "function") {
        winObj.pendingMountPromise = mountResult;
        winEl.pendingMountPromise = mountResult;
        mountResult.finally(() => {
          if (this.windows.includes(winObj)) refreshAllTaskManagers(this);
        });
      }
    } else if (!content) {
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
      this.appHost.unmount(closingWin);
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

    const wasActive = win.el.classList.contains("active");
    win.el.style.display = "none";
    win.el.classList.remove("active");
    if (wasActive && typeof win.appInstance?.onBlur === "function") {
      win.appInstance.onBlur();
    }
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
    const iconImage = document.createElement("div");
    iconImage.classList.add("icon-img");
    iconImage.innerHTML = this.getIconForType(win.type);
    icon.appendChild(iconImage);

    const iconLabel = document.createElement("div");
    iconLabel.classList.add("icon-label");
    iconLabel.textContent = win.el.querySelector(".title-bar-text").innerText;
    icon.appendChild(iconLabel);

    icon.addEventListener("click", () => this.restoreWindow(id));
    this.addKeyboardActivation(icon, () => this.restoreWindow(id));
    this.minimizedContainer?.appendChild(icon);

    if (wasActive && !this.isRestoring) {
      const nextActive = this.getTopWindowByZ();
      if (nextActive) this.focusWindow(nextActive.id);
    }
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
    const target = this.windows.find((w) => w.id === id);
    if (!target || target.minimized) return;
    if (this.isRestoring) {
      this.windows.forEach((w) =>
        w.el.classList.toggle("active", w.id === id && !w.minimized)
      );
      return;
    }
    this.highestZ++;
    this.windows.forEach((w) => {
      if (w.id === id) {
        w.el.style.zIndex = this.highestZ;
        w.el.classList.add("active");
        if (typeof w.appInstance?.onFocus === "function") {
          w.appInstance.onFocus();
        }
      } else {
        const wasActive = w.el.classList.contains("active");
        w.el.classList.remove("active");
        if (wasActive && typeof w.appInstance?.onBlur === "function") {
          w.appInstance.onBlur();
        }
      }
    });
    this.saveDesktopState();
  }
  instantiateApp(appDefinition, windowEl, initData) {
    const services = {
      windowManager: this,
      kernel,
      publish,
      subscribe
    };
    const appParams = { windowEl, initData, services };
    if (typeof appDefinition !== "function") return null;
    if (appDefinition.prototype instanceof BaseApp) {
      return new appDefinition(appParams);
    }
    const maybeInstance = appDefinition(appParams);
    if (maybeInstance && typeof maybeInstance.mount === "function") {
      return maybeInstance;
    }
    return new LegacyFunctionApp({
      windowEl,
      initData,
      services,
      initializer: appDefinition
    });
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
  getTopWindowByZ({ includeMinimized = false } = {}) {
    const candidates = includeMinimized
      ? this.windows
      : this.windows.filter((w) => !w.minimized);
    if (candidates.length === 0) return null;
    return candidates.reduce((top, current) => {
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
    const contentArea = getWindowBodyContainer(winEl);
    if (!contentArea) return;
    contentArea.replaceChildren();
    const errorEl = document.createElement("div");
    errorEl.classList.add("runtime-error");
    errorEl.textContent = `Unable to start app: ${err.message}`;
    contentArea.appendChild(errorEl);
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
    return papersLayout;
  }
  getBrowserContent() {
    return renderTemplate(browserLayout, { BROWSER_PLACEHOLDER: getBrowserPlaceholder() });
  }
  getRadioGardenContent() {
    return radioGardenLayout;
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
    return radioLayout;
  }
  getDoomContent() {
    return doomLayout;
  }
  getReversiContent() {
    return reversiLayout;
  }
  getChessContent() {
    return chessLayout;
  }
  getMediaPlayerContent() {
    return mediaPlayerLayout;
  }
  getSolitaireContent() {
    return solitaireLayout;
  }
  getSudokuContent() {
    return sudokuLayout;
  }
  getMafiaContent() {
    return mafiaLayout;
  }
  getWriteContent(txt) {
    return renderTemplate(writeLayout, { WRITE_CONTENT: escapeHtml(txt || "Welcome to Oriel Write.") });
  }
  getCardfileContent() {
    return cardfileLayout;
  }
  getSoundRecContent() {
    return soundRecLayout;
  }
  getCharMapContent() {
    return charMapLayout;
  }
  getClockContent() {
    return clockLayout;
  }
  getControlPanelContent() {
    return renderTemplate(controlPanelLayout, {
      ICON_CP_COLOR: ICONS.cp_color,
      ICON_DESKTOP_CP: ICONS.desktop_cp,
      ICON_SCREENSAVER: ICONS.screensaver,
      ICON_VOLUME: ICONS.volume
    });
  }
  getResetContent() {
    return resetLayout;
  }
  getVmContent() {
    return vmLayout;
  }
  getNotepadContent(txt) {
    const text = typeof txt === "string" ? txt : txt?.text;
    const showToolbar = Boolean(txt?.nativeFileHandle);
    const layout = document.createElement("div");
    layout.classList.add("notepad-layout");

    if (showToolbar) {
      const toolbar = document.createElement("div");
      toolbar.classList.add("notepad-toolbar");

      const saveButton = document.createElement("button");
      saveButton.classList.add("task-btn", "notepad-save");
      saveButton.textContent = "Save";
      toolbar.appendChild(saveButton);

      const status = document.createElement("span");
      status.classList.add("notepad-status");
      toolbar.appendChild(status);

      layout.appendChild(toolbar);
    }

    const textarea = document.createElement("textarea");
    textarea.classList.add("notepad-area");
    textarea.spellcheck = false;
    textarea.value = text ?? "Welcome to Oriel 1.0!";
    layout.appendChild(textarea);

    return layout;
  }
  getCompilerContent() {
    return compilerLayout;
  }
  getPythonContent() {
    return pythonLayout;
  }
  getConsoleContent() {
    return consoleLayout;
  }
  getKakuroContent() {
    const keypadButtons = Array.from({ length: 9 }, (_, i) =>
      `<button class="task-btn kakuro-key" data-num="${i + 1}">${i + 1}</button>`
    ).join("");
    return renderTemplate(kakuroLayout, { KEYPAD_BUTTONS: keypadButtons });
  }
  getMinesContent() {
    return minesLayout;
  }
  getPdfReaderContent(initData) {
    const src = initData?.src || DEFAULT_PDF_DATA_URI;
    const name = initData?.name || "Sample.pdf";

    const root = document.createElement("div");
    root.classList.add("pdf-reader");

    const toolbar = document.createElement("div");
    toolbar.classList.add("pdf-toolbar");

    const fileLabel = document.createElement("label");
    fileLabel.classList.add("task-btn", "file-btn");
    const fileLabelText = document.createElement("span");
    fileLabelText.textContent = "Open File";
    fileLabel.appendChild(fileLabelText);
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "application/pdf";
    fileInput.classList.add("pdf-file-input");
    fileLabel.appendChild(fileInput);
    toolbar.appendChild(fileLabel);

    const urlInput = document.createElement("input");
    urlInput.type = "text";
    urlInput.classList.add("pdf-url-input");
    urlInput.placeholder = "Paste PDF URL and click Load";
    urlInput.value = "";
    toolbar.appendChild(urlInput);

    const loadButton = document.createElement("button");
    loadButton.classList.add("task-btn", "pdf-load-btn");
    loadButton.textContent = "Load";
    toolbar.appendChild(loadButton);

    const status = document.createElement("div");
    status.classList.add("pdf-status");
    status.textContent = `Loaded ${name}`;
    toolbar.appendChild(status);

    root.appendChild(toolbar);

    const viewer = document.createElement("div");
    viewer.classList.add("pdf-viewer");
    const frame = document.createElement("iframe");
    frame.classList.add("pdf-frame");
    frame.title = "PDF Viewer";
    frame.src = src;
    viewer.appendChild(frame);
    root.appendChild(viewer);

    return root;
  }
  getImageViewerContent(initData) {
    const name = initData?.name || "";
    const src = initData?.src || "";

    const root = document.createElement("div");
    root.classList.add("img-viewer");

    const toolbar = document.createElement("div");
    toolbar.classList.add("img-toolbar");

    const fileLabel = document.createElement("label");
    fileLabel.classList.add("task-btn", "file-btn");
    const fileLabelText = document.createElement("span");
    fileLabelText.textContent = "Open Image";
    fileLabel.appendChild(fileLabelText);
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.classList.add("img-file-input");
    fileLabel.appendChild(fileInput);
    toolbar.appendChild(fileLabel);

    const urlInput = document.createElement("input");
    urlInput.type = "text";
    urlInput.classList.add("img-url-input");
    urlInput.placeholder = "Paste image URL and click Load";
    urlInput.value = src || "";
    toolbar.appendChild(urlInput);

    const loadButton = document.createElement("button");
    loadButton.classList.add("task-btn", "img-load-btn");
    loadButton.textContent = "Load";
    toolbar.appendChild(loadButton);

    const status = document.createElement("div");
    status.classList.add("img-status");
    status.textContent = src ? `Loaded ${name || "image"}` : "No image loaded";
    toolbar.appendChild(status);

    root.appendChild(toolbar);

    const display = document.createElement("div");
    display.classList.add("img-display");

    const placeholder = document.createElement("div");
    placeholder.classList.add("img-placeholder");
    placeholder.textContent = "Drop an image or click Open";
    if (src) placeholder.style.display = "none";
    display.appendChild(placeholder);

    const preview = document.createElement("img");
    preview.classList.add("img-preview");
    preview.alt = name || "Image preview";
    if (src) {
      preview.src = src;
    } else {
      preview.style.display = "none";
    }
    display.appendChild(preview);

    root.appendChild(display);

    return root;
  }
  getMarkdownContent(initData) {
    const initialText =
      typeof initData === "string"
        ? initData
        : typeof initData?.text === "string"
        ? initData.text
        : DEFAULT_MD_SAMPLE;

    const root = document.createElement("div");
    root.classList.add("md-viewer");

    const toolbar = document.createElement("div");
    toolbar.classList.add("md-toolbar");

    const fileLabel = document.createElement("label");
    fileLabel.classList.add("task-btn", "file-btn");
    const fileLabelText = document.createElement("span");
    fileLabelText.textContent = "Open .md";
    fileLabel.appendChild(fileLabelText);
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".md,text/markdown";
    fileInput.classList.add("md-file-input");
    fileLabel.appendChild(fileInput);
    toolbar.appendChild(fileLabel);

    const sampleButton = document.createElement("button");
    sampleButton.classList.add("task-btn", "md-sample-btn");
    sampleButton.textContent = "Sample";
    toolbar.appendChild(sampleButton);

    const status = document.createElement("div");
    status.classList.add("md-status");
    status.textContent = "Ready";
    toolbar.appendChild(status);

    root.appendChild(toolbar);

    const body = document.createElement("div");
    body.classList.add("md-body");

    const textarea = document.createElement("textarea");
    textarea.classList.add("md-input");
    textarea.spellcheck = false;
    textarea.placeholder = "Paste Markdown here";
    textarea.value = initialText;
    body.appendChild(textarea);

    const preview = document.createElement("div");
    preview.classList.add("md-preview");
    preview.setAttribute("aria-live", "polite");
    body.appendChild(preview);

    root.appendChild(body);

    return root;
  }
  getHexEditorContent() {
    return hexEditorLayout;
  }
  getTaskManContent() {
    return taskManagerLayout;
  }
  getArtistContent() {
    return artistLayout;
  }
  getDatabaseContent() {
    return databaseLayout;
  }
}

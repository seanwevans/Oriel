import { loadDesktopState, persistDesktopState } from "./state.js";
import { getWallpaperSettings } from "./wallpaper.js";
import { refreshAllTaskManagers } from "./apps/taskman.js";
import { browserSessions } from "./networking.js";
import { getCurrentThemeCustom } from "./apps/controlPanel.js";
import { AppRegistry } from "./core/AppRegistry.js";
import { AppHost } from "./core/AppHost.js";
import { publish, subscribe } from "./eventBus.js";
import {
  getAvailablePrograms as getProgramManagerApps,
  getIconForType as getProgramManagerIcon,
  createIconElementForType as getProgramManagerIconElement,
  getProgramDefaults as getProgramManagerDefaults,
  getProgramManagerContent,
  refreshProgramManagerContent,
  setupProgramManagerMenu
} from "./apps/programManager.js";
import { screensaverContext } from "./apps/screensaver.js";
import { getWindowBodyContainer } from "./windowContent.js";

export const controlPanelContext = {};
controlPanelContext.screensaver = screensaverContext;


export class WindowManager {
  constructor(initialState = null) {
    this.desktop = document.getElementById("desktop");
    this.minimizedContainer = document.getElementById("minimized-container");
    this.windows = [];
    this.nextWindowId = 1;
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
  generateWindowId() {
    if (!Number.isInteger(this.nextWindowId) || this.nextWindowId < 1) {
      this.nextWindowId = 1;
    }

    let id;
    do {
      id = `win-${this.nextWindowId++}`;
    } while (this.windows.some((win) => win.id === id));

    return id;
  }
  resolveWindowId(stateOverrides = {}) {
    const requestedId = stateOverrides.id;
    if (requestedId && !this.windows.some((win) => win.id === requestedId)) {
      return requestedId;
    }

    return this.generateWindowId();
  }
  openWindow(type, title, w, h, initData = null, stateOverrides = {}) {
    const id = this.resolveWindowId(stateOverrides);
    const defaults = getProgramManagerDefaults(type) || {};
    const resolvedWidth = w || defaults.width || 500;
    const resolvedHeight = h || defaults.height || 400;
    const services = {
      windowManager: this,
      kernel,
      publish,
      subscribe
    };
    const appInstance = this.appRegistry.createApp(type, {
      windowEl: null,
      initData,
      services
    });
    let content =
      typeof appInstance?.getWindowContent === "function"
        ? appInstance.getWindowContent()
        : "";
    const initializer = appInstance ? null : this.appRegistry.resolve(type);
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
      isUnmounted: false,
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
    if (appInstance) {
      const mountResult = this.appHost.mountInstance({ appInstance, winEl, winObj, type });
      if (mountResult && typeof mountResult.then === "function") {
        winObj.pendingMountPromise = mountResult;
        winEl.pendingMountPromise = mountResult;
        mountResult.finally(() => {
          if (this.windows.includes(winObj)) refreshAllTaskManagers(this);
        });
      }
    } else if (initializer) {
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
      closingWin.isUnmounted = true;
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
    iconImage.appendChild(this.getIconElementForType(win.type));
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
  getIconElementForType(type) {
    return getProgramManagerIconElement(type);
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
  getAppContent(type, initData = null) {
    const registry = this.appRegistry || new AppRegistry({ controlPanelContext });
    const app = registry.createApp(type, {
      windowEl: null,
      initData,
      services: {
        windowManager: this,
        kernel: globalThis.kernel || null,
        publish,
        subscribe
      }
    });
    return typeof app?.getWindowContent === "function" ? app.getWindowContent() : "";
  }
  getCardfileContent(initData) {
    return this.getAppContent("cardfile", initData);
  }
  getNotepadContent(initData) {
    return this.getAppContent("notepad", initData);
  }
  getMarkdownContent(initData) {
    return this.getAppContent("markdown", initData);
  }
  getPdfReaderContent(initData) {
    return this.getAppContent("pdfreader", initData);
  }
  getImageViewerContent(initData) {
    return this.getAppContent("imageviewer", initData);
  }
  // Compatibility proxies for callers that still ask the manager for app content.
  getProgramManagerContent() {
    return getProgramManagerContent(this);
  }
  refreshProgramManagerContent() {
    refreshProgramManagerContent(this);
  }

}

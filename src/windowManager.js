import { refreshAllTaskManagers } from "./apps/taskman.js";
import { browserSessions } from "./apps/browser.js";
import { AppRegistry } from "./core/AppRegistry.js";
import { AppHost } from "./core/AppHost.js";
import { publish, subscribe } from "./eventBus.js";
import { createSystemServices, updateSystemServices } from "./core/systemServices.js";
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
import { WindowDragResizeController } from "./window/WindowDragResizeController.js";
import { WindowLayoutService } from "./window/WindowLayoutService.js";
import { WindowStatePersistence } from "./window/WindowStatePersistence.js";
import {
  addKeyboardActivation,
  createWindowDOM as buildWindowDOM,
  setupMenuBar as setupWindowMenuBar
} from "./window/windowDom.js";

export const controlPanelContext = {};
controlPanelContext.screensaver = screensaverContext;


export class WindowManager {
  constructor(initialState = null, { services = {} } = {}) {
    this.desktop = document.getElementById("desktop");
    this.minimizedContainer = document.getElementById("minimized-container");
    this.windows = [];
    this.nextWindowId = 1;
    this.highestZ = 100;
    this.isRestoring = false;
    this.statePersistence = new WindowStatePersistence({
      getWindows: () => this.windows,
      getHighestZ: () => this.highestZ,
      isRestoring: () => this.isRestoring
    });
    this.dragResizeController = new WindowDragResizeController({
      focusWindow: (id) => this.focusWindow(id),
      saveDesktopState: () => this.saveDesktopState()
    });
    this.layoutService = new WindowLayoutService({
      getWindows: () => this.windows,
      getDesktop: () => this.desktop,
      saveDesktopState: () => this.saveDesktopState()
    });
    const compatibilityKernel = services.kernel || globalThis.kernel || globalThis.window?.kernel || null;
    this.services = updateSystemServices(createSystemServices({
      publish,
      subscribe,
      kernel: compatibilityKernel,
      ...services
    }), { windowManager: this });
    this.appServices = this.services;
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
    addKeyboardActivation(el, handler);
  }
  setupMenuBar(win) {
    setupWindowMenuBar(win);
  }
  createWindowDOM(id, type, title, width, height, content, stateOverrides = {}) {
    return buildWindowDOM({
      id,
      type,
      title,
      width,
      height,
      content,
      stateOverrides,
      windowCount: this.windows.length,
      onClose: (windowId) => this.closeWindow(windowId),
      onMinimize: (windowId) => this.minimizeWindow(windowId),
      onMaximize: (windowId) => this.maximizeWindow(windowId),
      onFocus: (windowId) => this.focusWindow(windowId),
      onStartDrag: (event, winEl) => this.startDrag(event, winEl),
      onStartResize: (event, winEl, resizeType) =>
        this.startResize(event, winEl, resizeType)
    });
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
    const services = this.services || createSystemServices({ windowManager: this, kernel: globalThis.kernel || globalThis.window?.kernel || null, publish, subscribe });
    const appInstance = this.appRegistry.createApp(type, {
      windowEl: null,
      initData,
      services
    });
    let content =
      typeof appInstance?.getWindowContent === "function"
        ? appInstance.getWindowContent()
        : "";
    const initializer = null;
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
    services.kernel?.registerProcess?.(id, title);
    if (!this.isRestoring) this.focusWindow(id);
    // Initialize app logic when an app has behavior beyond its rendered content.
    this._mountWindowApp({
      appInstance,
      initializer,
      winEl,
      winObj,
      initData,
      type,
      hasContent: Boolean(content)
    });
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
      this.services?.kernel?.unregisterProcess?.(id);
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
      win.prevRect = {
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
      win.prevRect = null;
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
    this.dragResizeController.startDrag(e, winEl);
  }
  onDrag(e) {
    this.dragResizeController.onDrag(e);
  }
  endDrag() {
    this.dragResizeController.endDrag();
  }
  // Resize Logic
  startResize(e, winEl, type) {
    this.dragResizeController.startResize(e, winEl, type);
  }
  onResize(e) {
    this.dragResizeController.onResize(e);
  }
  endResize() {
    this.dragResizeController.endResize();
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
  getStatePersistence() {
    if (!this.statePersistence) {
      this.statePersistence = new WindowStatePersistence({
        getWindows: () => this.windows,
        getHighestZ: () => this.highestZ,
        isRestoring: () => this.isRestoring
      });
    }
    return this.statePersistence;
  }
  getWindowStateSnapshot() {
    return this.getStatePersistence().getWindowStateSnapshot();
  }
  getWindowRectSnapshot(win) {
    return this.getStatePersistence().getWindowRectSnapshot(win);
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
    this.layoutService.cascadeWindows();
  }
  tileWindows() {
    this.layoutService.tileWindows();
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
    this.getStatePersistence().saveDesktopState();
  }
  // Helper: Icons
  getIconForType(type) {
    return getProgramManagerIcon(type);
  }
  getIconElementForType(type) {
    return getProgramManagerIconElement(type);
  }
  _mountWindowApp({ appInstance, initializer, winEl, winObj, initData, type, hasContent }) {
    let mountResult = null;
    if (appInstance) {
      mountResult = this.appHost.mountInstance({ appInstance, winEl, winObj, type });
    } else if (initializer) {
      mountResult = this.appHost.mount({
        initializer,
        winEl,
        winObj,
        initData,
        wmInstance: this,
        services: this.services || createSystemServices({ windowManager: this, kernel: globalThis.kernel || globalThis.window?.kernel || null, publish, subscribe }),
        type
      });
    } else if (!hasContent) {
      this.renderRuntimeError(winEl, new Error(`No initializer registered for ${type}`));
      return;
    }

    if (mountResult && typeof mountResult.then === "function") {
      winObj.pendingMountPromise = mountResult;
      winEl.pendingMountPromise = mountResult;
      mountResult.finally(() => {
        if (this.windows.includes(winObj)) refreshAllTaskManagers(this);
      });
    }
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
      services: this.services || createSystemServices({ windowManager: this, kernel: globalThis.kernel || globalThis.window?.kernel || null, publish, subscribe })
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

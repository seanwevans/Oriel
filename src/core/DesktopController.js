export class DesktopController {
  constructor({
    desktop,
    contextMenu,
    fileSystemActions,
    getWindowManager,
    alertUser = globalThis.alert,
    controlPanel,
    viewport = globalThis.window
  } = {}) {
    this.desktop = desktop;
    this.contextMenu = contextMenu;
    this.fileSystemActions = fileSystemActions;
    this.getWindowManager = getWindowManager;
    this.alertUser = alertUser;
    this.controlPanel = controlPanel;
    this.viewport = viewport;
  }

  initDesktopContextMenu() {
    const desktop = this.desktop;
    const menu = this.contextMenu;
    if (!desktop || !menu) return;

    const hideMenu = () => {
      menu.style.display = "none";
    };

    const positionMenu = (x, y) => {
      menu.style.display = "block";
      menu.style.left = `${x}px`;
      menu.style.top = `${y}px`;
      const rect = menu.getBoundingClientRect();
      const adjustedLeft = Math.min(x, this.viewport.innerWidth - rect.width - 4);
      const adjustedTop = Math.min(y, this.viewport.innerHeight - rect.height - 4);
      menu.style.left = `${Math.max(0, adjustedLeft)}px`;
      menu.style.top = `${Math.max(0, adjustedTop)}px`;
    };

    desktop.addEventListener("contextmenu", (e) => {
      if (e.target.closest(".window")) return;
      e.preventDefault();
      positionMenu(e.clientX, e.clientY);
    });

    this.viewport.addEventListener("click", (e) => {
      if (!menu.contains(e.target)) hideMenu();
    });

    this.viewport.addEventListener("keydown", (e) => {
      if (e.key === "Escape") hideMenu();
    });

    this.viewport.addEventListener("resize", hideMenu);

    menu.addEventListener("click", (e) => {
      const item = e.target.closest(".context-menu-item");
      if (!item) return;
      hideMenu();
      const action = item.dataset.action;
      if (action === "new-folder") this.createDesktopFolder();
      if (action === "program-manager") this.openProgramManager();
      if (action === "properties") this.openDesktopProperties();
    });
  }

  resolveDesktopDirectory() {
    const preferredPaths = ["C\\DESKTOP", "C\\DOCUMENTS\\DESKTOP", "C\\DOCUMENTS"];
    for (const path of preferredPaths) {
      const resolved = this.fileSystemActions.resolveFileManagerPath(path);
      if (resolved?.node?.type === "dir") return resolved;
    }
    return null;
  }

  async createDesktopFolder() {
    const resolved = this.resolveDesktopDirectory();
    if (!resolved?.node) {
      this.alertUser("Desktop folder is unavailable.");
      return;
    }
    const folderName = this.fileSystemActions.getUniqueFolderName(resolved.node);
    const result = await this.fileSystemActions.createNamedFolder(resolved.node, folderName);
    if (!result.success) {
      this.alertUser(result.message || "Unable to create folder.");
      return;
    }
    this.fileSystemActions.refreshOpenFileManagers();
  }

  openDesktopProperties() {
    const windowManager = this.getWindowManager?.();
    if (!windowManager) return;
    const existing = windowManager.windows.find((win) => win.type === "control");
    const controlWin =
      existing || windowManager.openWindow("control", "Control Panel", 400, 300);
    if (!controlWin?.el) return;
    windowManager.focusWindow(controlWin.id);
    const viewArea = controlWin.el.querySelector(".cp-view-area");
    if (viewArea) this.controlPanel.openDesktop(this.controlPanel.context, viewArea);
  }

  openProgramManager() {
    const windowManager = this.getWindowManager?.();
    if (!windowManager) return;
    const existing = windowManager.windows.find((win) => win.type === "progman");
    const programManagerWin =
      existing || windowManager.openWindow("progman", "Program Manager", 500, 480);
    if (!programManagerWin) return;
    if (programManagerWin.minimized) windowManager.restoreWindow(programManagerWin.id);
    else windowManager.focusWindow(programManagerWin.id);
  }
}

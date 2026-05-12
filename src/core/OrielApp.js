import { DEFAULT_SPLASH_IMAGE, DEFAULT_WALLPAPER } from "../defaults.js";
import { loadDesktopState } from "../state.js";
import { applyWallpaperSettings, getWallpaperSettings } from "../wallpaper.js";
import * as audioActions from "../audio.js";
import * as networkActions from "../networking.js";
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
import { refreshNetworkedWindows } from "../network/config.js";
import { refreshAllProcessViews } from "../apps/taskman.js";
import { initScreensaver } from "../apps/screensaver.js";
import {
  applySavedTheme,
  openCPDesktop
} from "../apps/controlPanel.js";
import { registerConsoleCommands } from "../apps/console.js";
import { controlPanelContext } from "../windowManager.js";
import { bootstrapInstallations } from "../installer.js";
import { FileSystemActions } from "./FileSystemActions.js";
import { DesktopController } from "./DesktopController.js";
import { DesktopImportController } from "./DesktopImportController.js";
import { createSystemServices, updateSystemServices } from "./systemServices.js";

export const ALLOWED_WINDOW_GLOBALS = Object.freeze(["kernel"]);

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
    audio = audioActions,
    network = networkActions,
    installer = { bootstrapInstallations },
    screensaver = { initScreensaver }
  } = {}) {
    this.WindowManager = WindowManager;
    this.SimulatedKernel = SimulatedKernel;
    this.fs = filesystem;
    this.state = state;
    this.wallpaper = wallpaper;
    this.audio = audio;
    this.network = network;
    this.installer = installer;
    this.screensaver = screensaver;

    this.services = createSystemServices({
      windowManager: null,
      kernel: null,
      publish,
      subscribe,
      filesystem: this.fs,
      fileSystemActions: null,
      wallpaper: {
        ...this.wallpaper,
        getWallpaperSettings,
        applyWallpaperSettings: (...args) => applyWallpaperSettings(...args, this.services)
      },
      audio: this.audio,
      network: this.network,
      alertUser: (message) => alert(message)
    });

    this.windowManager = null;
    this.dom = {};
    this.initialDesktopState = null;
    this.installerReady = null;
    this.kernel = null;
    this.fileSystemActions = null;
    this.desktopController = null;
    this.desktopImportController = null;
  }

  cacheDom() {
    this.dom.desktop = document.getElementById("desktop");
    this.dom.contextMenu = document.getElementById("context-menu");
    this.dom.splash = document.getElementById("splash-screen");
    this.dom.dragDropTarget = this.dom.desktop || document.body;
  }

  async start() {
    this.cacheDom();

    subscribe("fs:change", () => this.fileSystemActions?.refreshOpenFileManagers());
    subscribe("network:config-update", () =>
      refreshNetworkedWindows(this.windowManager || this.services.windowManager)
    );

    this.installerReady = this.installer.bootstrapInstallations().catch((err) => {
      console.warn("Failed to bootstrap installed apps", err);
    });

    this.kernel = new this.SimulatedKernel(() => refreshAllProcessViews(this.services));
    updateSystemServices(this.services, { kernel: this.kernel });

    const initialDesktopState = this.state.loadDesktopState();
    this.initialDesktopState = initialDesktopState;

    applySavedTheme(initialDesktopState.themeCustom);
    this.wallpaper.applyWallpaperSettings(
      initialDesktopState.wallpaper?.url ?? DEFAULT_WALLPAPER,
      initialDesktopState.wallpaper?.mode || "cover"
    );

    this.#initializeControllers();
    this.#registerShellGlobals();

    await this.fs.fileSystemReady.catch(() => {});
    await this.installerReady.catch(() => {});
    this.#bootDesktop();
    this.desktopController.initDesktopContextMenu();
    this.#initSplash();
    this.screensaver.initScreensaver();
    this.desktopImportController.initDragAndDropImport();
  }

  #initializeControllers() {
    this.fileSystemActions = new FileSystemActions({
      filesystem: this.fs,
      getWindowManager: () => this.windowManager,
      alertUser: (message) => alert(message)
    });

    this.desktopController = new DesktopController({
      desktop: this.dom.desktop,
      contextMenu: this.dom.contextMenu,
      fileSystemActions: this.fileSystemActions,
      getWindowManager: () => this.windowManager,
      alertUser: (message) => alert(message),
      controlPanel: { context: controlPanelContext, openDesktop: openCPDesktop },
      viewport: window
    });

    this.desktopImportController = new DesktopImportController({
      dragDropTarget: this.dom.dragDropTarget,
      filesystem: this.fs,
      publish
    });

    updateSystemServices(this.services, { fileSystemActions: this.fileSystemActions });
  }

  #bootDesktop() {
    if (this.windowManager) return this.windowManager;
    this.windowManager = new this.WindowManager(this.initialDesktopState, {
      services: this.services
    });
    updateSystemServices(this.services, { windowManager: this.windowManager });
    return this.windowManager;
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

  #registerShellGlobals() {
    // Intentional debugging/boot compatibility alias while callers migrate to services.kernel.
    window.kernel = this.kernel;
    registerConsoleCommands(this.services);
  }
}

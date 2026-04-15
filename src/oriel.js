import { WindowManager } from "./windowManager.js";
import { SimulatedKernel } from "./kernel.js";
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
import { loadDesktopState, persistDesktopState } from "./state.js";
import { applyWallpaperSettings, getWallpaperSettings } from "./wallpaper.js";
import {
  getLastNonZeroVolume,
  getMediaPlayerTracks,
  getSystemVolume,
  playVolumeTest,
  registerMediaElement,
  setSystemVolume
} from "./audio.js";
import { OrielApp } from "./core/OrielApp.js";

const app = new OrielApp({
  WindowManager,
  SimulatedKernel,
  filesystem: {
    MOCK_FS,
    exportFileSystemAsJson,
    hydrateNativeDirectory,
    isNativeFsSupported,
    mountNativeFolder,
    replaceFileSystem,
    saveFileSystem,
    fileSystemReady
  },
  state: {
    loadDesktopState,
    persistDesktopState
  },
  wallpaper: {
    applyWallpaperSettings,
    getWallpaperSettings
  },
  audio: {
    getLastNonZeroVolume,
    getMediaPlayerTracks,
    getSystemVolume,
    playVolumeTest,
    registerMediaElement,
    setSystemVolume
  }
});

window.onload = () => app.start();

export { app };

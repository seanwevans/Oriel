import { loadDesktopState, persistDesktopState } from "../state.js";
import { getWallpaperSettings } from "../wallpaper.js";
import { getCurrentThemeCustom } from "../apps/controlPanel.js";

export class WindowStatePersistence {
  constructor({ getWindows, getHighestZ, isRestoring }) {
    this.getWindows = getWindows;
    this.getHighestZ = getHighestZ;
    this.isRestoring = isRestoring;
  }

  saveDesktopState() {
    if (this.isRestoring()) return;
    const existing = loadDesktopState();
    const state = {
      ...existing,
      windows: this.getWindowStateSnapshot(),
      wallpaper: getWallpaperSettings(),
      themeCustom: getCurrentThemeCustom()
    };
    persistDesktopState(state);
  }

  getWindowStateSnapshot() {
    return this.getWindows().map((w) => {
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
        zIndex: parseInt(w.el.style.zIndex || `${this.getHighestZ()}`, 10)
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
}

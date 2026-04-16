const LEGACY_CLEANUP_KEYS = [
  "chessCleanup",
  "skifreeCleanup",
  "cannonduelCleanup",
  "pinballCleanup",
  "lineRiderCleanup",
  "sandspiel3dCleanup",
  "shaderLabCleanup",
  "whiteboardCleanup",
  "packetLabCleanup",
  "ircCleanup"
];

export class AppHost {
  constructor({ onMountError } = {}) {
    this.onMountError = onMountError;
  }

  mount({ initializer, winEl, winObj, initData = null, wmInstance = null, type = "unknown" }) {
    if (!initializer) return null;
    try {
      const appInstance = initializer(winEl, initData, wmInstance) || null;
      if (winObj) winObj.appInstance = appInstance;
      if (winEl) winEl.appInstance = appInstance;
      return appInstance;
    } catch (err) {
      this.onMountError?.({ err, winEl, type });
      return null;
    }
  }

  unmount(winObj) {
    const winEl = winObj?.el;
    const appInstance = winObj?.appInstance || winEl?.appInstance || null;

    if (appInstance && typeof appInstance.dispose === "function") {
      try {
        appInstance.dispose();
      } catch (err) {
        console.error("App dispose failed:", err);
      }
    }

    LEGACY_CLEANUP_KEYS.forEach((key) => {
      if (typeof winEl?.[key] === "function") winEl[key]();
    });

    if (winEl?.doomCI) {
      winEl.doomCI.exit();
      winEl.doomCI = null;
    }
  }
}

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

function isPromiseLike(value) {
  return (
    value !== null &&
    (typeof value === "object" || typeof value === "function") &&
    typeof value.then === "function"
  );
}

function assignAppInstance({ appInstance, winEl, winObj }) {
  if (winObj) winObj.appInstance = appInstance;
  if (winEl) winEl.appInstance = appInstance;
}

function assignPendingMountPromise({ pendingMountPromise, winEl, winObj }) {
  if (winObj) winObj.pendingMountPromise = pendingMountPromise;
  if (winEl) winEl.pendingMountPromise = pendingMountPromise;
}

export class AppHost {
  constructor({ onMountError } = {}) {
    this.onMountError = onMountError;
  }

  mount({ initializer, winEl, winObj, initData = null, wmInstance = null, type = "unknown" }) {
    if (!initializer) return null;
    try {
      const initializerResult = initializer(winEl, initData, wmInstance);

      if (isPromiseLike(initializerResult)) {
        const pendingMountPromise = Promise.resolve(initializerResult)
          .then((resolvedAppInstance) => {
            const appInstance = resolvedAppInstance || null;
            assignAppInstance({ appInstance, winEl, winObj });
            assignPendingMountPromise({ pendingMountPromise: null, winEl, winObj });
            return appInstance;
          })
          .catch((err) => {
            assignPendingMountPromise({ pendingMountPromise: null, winEl, winObj });
            this.onMountError?.({ err, winEl, type });
            return null;
          });

        assignPendingMountPromise({ pendingMountPromise, winEl, winObj });
        return pendingMountPromise;
      }

      const appInstance = initializerResult || null;
      assignAppInstance({ appInstance, winEl, winObj });
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

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

  mount({
    appInstance = null,
    initializer = null,
    winEl,
    winObj,
    initData = null,
    wmInstance = null,
    type = "unknown"
  }) {
    if (!appInstance && !initializer) return null;

    try {
      if (appInstance) assignAppInstance({ appInstance, winEl, winObj });

      const mountResult = appInstance
        ? appInstance.mount?.()
        : initializer(winEl, initData, wmInstance);

      if (isPromiseLike(mountResult)) {
        const pendingMountPromise = Promise.resolve(mountResult)
          .then((resolvedAppInstance) => {
            const mountedAppInstance = appInstance || resolvedAppInstance || null;
            assignAppInstance({ appInstance: mountedAppInstance, winEl, winObj });
            assignPendingMountPromise({ pendingMountPromise: null, winEl, winObj });
            return mountedAppInstance;
          })
          .catch((err) => {
            assignPendingMountPromise({ pendingMountPromise: null, winEl, winObj });
            this.onMountError?.({ err, winEl, type });
            return null;
          });

        assignPendingMountPromise({ pendingMountPromise, winEl, winObj });
        return pendingMountPromise;
      }

      const mountedAppInstance = appInstance || mountResult || null;
      assignAppInstance({ appInstance: mountedAppInstance, winEl, winObj });
      return mountedAppInstance;
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

    if (winEl?.doomCI) {
      winEl.doomCI.exit();
      winEl.doomCI = null;
    }
  }
}

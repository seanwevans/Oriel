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

  mountInstance({ appInstance, winEl, winObj, type = "unknown" }) {
    if (!appInstance) return null;
    try {
      if (typeof appInstance.setWindowElement === "function") {
        appInstance.setWindowElement(winEl);
      } else {
        appInstance.windowEl = winEl;
      }

      const mountResult =
        typeof appInstance.mount === "function" ? appInstance.mount() : null;

      if (isPromiseLike(mountResult)) {
        const pendingMountPromise = Promise.resolve(mountResult)
          .then((resolvedAppInstance) => {
            const mountedAppInstance = resolvedAppInstance || appInstance;
            assignAppInstance({ appInstance: mountedAppInstance, winEl, winObj });
            assignPendingMountPromise({ pendingMountPromise: null, winEl, winObj });
            return mountedAppInstance;
          })
          .catch((err) => {
            assignPendingMountPromise({ pendingMountPromise: null, winEl, winObj });
            this.onMountError?.({ err, winEl, type });
            return null;
          });

        assignAppInstance({ appInstance, winEl, winObj });
        assignPendingMountPromise({ pendingMountPromise, winEl, winObj });
        return pendingMountPromise;
      }

      const mountedAppInstance = mountResult || appInstance;
      assignAppInstance({ appInstance: mountedAppInstance, winEl, winObj });
      return mountedAppInstance;
    } catch (err) {
      this.onMountError?.({ err, winEl, type });
      return null;
    }
  }

  mount({ initializer, winEl, winObj, initData = null, wmInstance = null, type = "unknown" }) {
    if (!initializer) return null;
    try {
      // Execute the legacy initializer safely
      const mountResult = initializer(winEl, initData, wmInstance);

      if (isPromiseLike(mountResult)) {
        const pendingMountPromise = Promise.resolve(mountResult)
          .then((resolvedAppInstance) => {
            const mountedAppInstance = resolvedAppInstance || null;
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

      const mountedAppInstance = mountResult || null;
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

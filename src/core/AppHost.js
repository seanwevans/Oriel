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

function disposeAppInstance(appInstance) {
  if (!appInstance || typeof appInstance.dispose !== "function") return;

  try {
    appInstance.dispose();
  } catch (err) {
    console.error("App dispose failed:", err);
  }
}

function isWindowUnmounted(winObj) {
  return winObj?.isUnmounted === true;
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
            if (isWindowUnmounted(winObj)) {
              if (resolvedAppInstance && resolvedAppInstance !== appInstance) {
                disposeAppInstance(resolvedAppInstance);
              } else if (winObj?.appInstance === appInstance || winEl?.appInstance === appInstance) {
                disposeAppInstance(appInstance);
              }
              assignPendingMountPromise({ pendingMountPromise: null, winEl, winObj });
              return null;
            }

            assignAppInstance({ appInstance: mountedAppInstance, winEl, winObj });
            assignPendingMountPromise({ pendingMountPromise: null, winEl, winObj });
            return mountedAppInstance;
          })
          .catch((err) => {
            assignPendingMountPromise({ pendingMountPromise: null, winEl, winObj });
            this.onMountError?.({ err, winEl, type });
            return null;
          });

        if (isWindowUnmounted(winObj)) {
          disposeAppInstance(appInstance);
          assignPendingMountPromise({ pendingMountPromise, winEl, winObj });
          return pendingMountPromise;
        }

        assignAppInstance({ appInstance, winEl, winObj });
        assignPendingMountPromise({ pendingMountPromise, winEl, winObj });
        return pendingMountPromise;
      }

      const mountedAppInstance = mountResult || appInstance;
      if (isWindowUnmounted(winObj)) {
        disposeAppInstance(mountedAppInstance);
        return null;
      }

      assignAppInstance({ appInstance: mountedAppInstance, winEl, winObj });
      return mountedAppInstance;
    } catch (err) {
      this.onMountError?.({ err, winEl, type });
      return null;
    }
  }

  mount({ initializer, winEl, winObj, initData = null, wmInstance = null, services = {}, type = "unknown" }) {
    if (!initializer) return null;
    try {
      const initializerResult = initializer(winEl, initData, wmInstance, services);

      if (isPromiseLike(initializerResult)) {
        const pendingMountPromise = Promise.resolve(initializerResult)
          .then((resolvedAppInstance) => {
            const appInstance = resolvedAppInstance || null;
            if (isWindowUnmounted(winObj)) {
              disposeAppInstance(appInstance);
              assignPendingMountPromise({ pendingMountPromise: null, winEl, winObj });
              return null;
            }

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
      if (isWindowUnmounted(winObj)) {
        disposeAppInstance(appInstance);
        return null;
      }

      assignAppInstance({ appInstance, winEl, winObj });
      return appInstance;
    } catch (err) {
      this.onMountError?.({ err, winEl, type });
      return null;
    }
  }

  unmount(winObj) {
    if (winObj) winObj.isUnmounted = true;

    const winEl = winObj?.el;
    const appInstance = winObj?.appInstance || winEl?.appInstance || null;

    disposeAppInstance(appInstance);

    if (winEl?.doomCI) {
      winEl.doomCI.exit();
      winEl.doomCI = null;
    }

    assignAppInstance({ appInstance: null, winEl, winObj });
  }
}

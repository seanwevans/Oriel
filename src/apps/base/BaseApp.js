/**
 * Target app lifecycle contract.
 *
 * BaseApp subclasses receive all runtime dependencies through the constructor:
 * - windowEl: the app's root window element. It is null while rendering window
 *   content and is assigned before mount() runs.
 * - initData: optional launch payload from callers such as File Manager.
 * - services: stable host services such as windowManager, kernel, publish, and
 *   subscribe. Apps should use these injected dependencies instead of importing
 *   host singletons when possible.
 *
 * Subclasses implement these lifecycle hooks:
 * - getWindowContent(): return the initial DOM node or HTML string for the
 *   window body. It must not register listeners, timers, or external resources.
 * - mount(): attach behavior after windowEl exists. It may return this, another
 *   app instance, void, or a promise for either value.
 * - dispose(): release every resource owned by the instance, including event
 *   listeners, timers, object URLs, media elements, subscriptions, workers, and
 *   network handles. Subclasses overriding dispose() must call super.dispose().
 */
export class BaseApp {
  constructor({ windowEl = null, initData = null, services = {} } = {}) {
    this.windowEl = windowEl;
    this.initData = initData;
    this.services = services;
    this.disposables = new Set();
    this.isDisposed = false;
  }

  getWindowContent() {
    return "";
  }

  setWindowElement(windowEl) {
    this.windowEl = windowEl;
  }

  mount() {}

  onFocus() {}

  onBlur() {}

  registerDisposable(disposable) {
    if (typeof disposable !== "function") return disposable;

    if (this.isDisposed) {
      disposable();
      return disposable;
    }

    this.disposables.add(disposable);
    return disposable;
  }

  unregisterDisposable(disposable) {
    this.disposables.delete(disposable);
  }

  listen(target, type, listener, options) {
    if (!target || typeof target.addEventListener !== "function") return null;

    target.addEventListener(type, listener, options);
    const disposable = () => {
      if (typeof target.removeEventListener === "function") {
        target.removeEventListener(type, listener, options);
      }
    };
    return this.registerDisposable(disposable);
  }

  setTimeout(callback, delay, ...args) {
    const timerId = globalThis.setTimeout(callback, delay, ...args);
    const disposable = () => globalThis.clearTimeout(timerId);
    this.registerDisposable(disposable);
    return timerId;
  }

  clearTimeout(timerId) {
    globalThis.clearTimeout(timerId);
  }

  setInterval(callback, delay, ...args) {
    const intervalId = globalThis.setInterval(callback, delay, ...args);
    const disposable = () => globalThis.clearInterval(intervalId);
    this.registerDisposable(disposable);
    return intervalId;
  }

  clearInterval(intervalId) {
    globalThis.clearInterval(intervalId);
  }

  trackObjectUrl(objectUrl) {
    if (!objectUrl) return objectUrl;
    this.registerDisposable(() => URL.revokeObjectURL(objectUrl));
    return objectUrl;
  }

  trackMediaElement(mediaElement) {
    if (!mediaElement) return mediaElement;
    this.registerDisposable(() => {
      if (typeof mediaElement.pause === "function") mediaElement.pause();
      mediaElement.removeAttribute?.("src");
      mediaElement.load?.();
    });
    return mediaElement;
  }

  dispose() {
    if (this.isDisposed) return;
    this.isDisposed = true;

    const disposables = Array.from(this.disposables).reverse();
    this.disposables.clear();
    for (const disposable of disposables) {
      try {
        disposable();
      } catch (err) {
        console.error("App cleanup failed:", err);
      }
    }
  }
}

export class LegacyFunctionApp extends BaseApp {
  constructor({ initializer, contentProvider = null, ...args }) {
    super(args);
    this.initializer = initializer;
    this.contentProvider = contentProvider;
  }

  getWindowContent() {
    if (!this.contentProvider) return "";
    return this.contentProvider(this.initData, this.services);
  }

  mount() {
    if (!this.initializer) return null;
    return this.initializer(
      this.windowEl,
      this.initData,
      this.services.windowManager,
      this.services
    );
  }
}

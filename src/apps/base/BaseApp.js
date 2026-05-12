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
 * Apps expose only these lifecycle hooks to host code; the host must not know
 * app-specific cleanup names, DOM events such as legacy app:destroy, or other
 * compatibility shims.
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
    this.timeoutDisposables = new Map();
    this.intervalDisposables = new Map();
    this.frameDisposables = new Map();
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
    let disposable;
    const timerId = globalThis.setTimeout((...callbackArgs) => {
      this.unregisterDisposable(disposable);
      this.timeoutDisposables.delete(timerId);
      callback(...callbackArgs);
    }, delay, ...args);
    disposable = () => globalThis.clearTimeout(timerId);
    this.timeoutDisposables.set(timerId, disposable);
    this.registerDisposable(disposable);
    return timerId;
  }

  clearTimeout(timerId) {
    globalThis.clearTimeout(timerId);
    const disposable = this.timeoutDisposables.get(timerId);
    if (disposable) {
      this.unregisterDisposable(disposable);
      this.timeoutDisposables.delete(timerId);
    }
  }

  setInterval(callback, delay, ...args) {
    const intervalId = globalThis.setInterval(callback, delay, ...args);
    const disposable = () => globalThis.clearInterval(intervalId);
    this.intervalDisposables.set(intervalId, disposable);
    this.registerDisposable(disposable);
    return intervalId;
  }

  clearInterval(intervalId) {
    globalThis.clearInterval(intervalId);
    const disposable = this.intervalDisposables.get(intervalId);
    if (disposable) {
      this.unregisterDisposable(disposable);
      this.intervalDisposables.delete(intervalId);
    }
  }

  requestAnimationFrame(callback) {
    let disposable;
    const frameId = globalThis.requestAnimationFrame((timestamp) => {
      this.unregisterDisposable(disposable);
      this.frameDisposables.delete(frameId);
      callback(timestamp);
    });
    disposable = () => globalThis.cancelAnimationFrame(frameId);
    this.frameDisposables.set(frameId, disposable);
    this.registerDisposable(disposable);
    return frameId;
  }

  cancelAnimationFrame(frameId) {
    globalThis.cancelAnimationFrame(frameId);
    const disposable = this.frameDisposables.get(frameId);
    if (disposable) {
      this.unregisterDisposable(disposable);
      this.frameDisposables.delete(frameId);
    }
  }

  createAbortController() {
    const controller = new AbortController();
    return this.trackAbortController(controller);
  }

  trackAbortController(controller) {
    if (!controller) return controller;
    this.registerDisposable(() => controller.abort());
    return controller;
  }

  createBroadcastChannel(name) {
    if (!("BroadcastChannel" in globalThis)) return null;
    return this.trackBroadcastChannel(new BroadcastChannel(name));
  }

  trackBroadcastChannel(channel) {
    if (!channel) return channel;
    this.registerDisposable(() => channel.close?.());
    return channel;
  }

  trackMediaStream(stream) {
    if (!stream) return stream;
    this.registerDisposable(() => {
      stream.getTracks?.().forEach((track) => track.stop?.());
    });
    return stream;
  }

  trackAudioContext(audioContext) {
    if (!audioContext) return audioContext;
    this.registerDisposable(() => audioContext.close?.());
    return audioContext;
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
    this.timeoutDisposables.clear();
    this.intervalDisposables.clear();
    this.frameDisposables.clear();
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

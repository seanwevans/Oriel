export class BaseApp {
  constructor({ windowEl, initData = null, services = {} } = {}) {
    this.windowEl = windowEl;
    this.initData = initData;
    this.services = services;
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

  dispose() {}
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
      this.services.windowManager
    );
  }
}

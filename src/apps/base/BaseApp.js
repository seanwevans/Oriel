export class BaseApp {
  constructor({ windowEl, initData = null, services = {} } = {}) {
    this.windowEl = windowEl;
    this.initData = initData;
    this.services = services;
  }

  mount() {}

  onFocus() {}

  onBlur() {}

  dispose() {}
}

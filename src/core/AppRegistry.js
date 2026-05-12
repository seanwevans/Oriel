import { APP_MANIFEST } from "../apps/manifest.js";
import { composeRuntimeManifest, runtimeBindings } from "../apps/runtimeBindings.js";

export class AppRegistry {
  constructor({
    controlPanelContext = {},
    manifest = APP_MANIFEST,
    bindings = runtimeBindings
  } = {}) {
    this.controlPanelContext = controlPanelContext;
    this.manifest = composeRuntimeManifest(manifest, bindings);
    this.definitions = Object.values(this.manifest);
  }

  createApp(type, { windowEl = null, initData = null, services = {} } = {}) {
    const definition = this.manifest[type] || null;
    if (!definition?.appClass) return null;

    return new definition.appClass({
      windowEl,
      initData,
      services: {
        ...services,
        controlPanelContext: this.controlPanelContext
      }
    });
  }
}

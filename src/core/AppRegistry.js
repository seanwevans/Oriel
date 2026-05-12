import { APP_MANIFEST } from "../apps/manifest.js";
import { composeRuntimeManifest, runtimeBindings } from "../apps/runtimeBindings.js";
import { LegacyFunctionApp } from "../apps/base/BaseApp.js";
import { getRuntimeInitializer } from "../installer.js";

export class AppRegistry {
  constructor({
    controlPanelContext = {},
    runtimeInitializerResolver = getRuntimeInitializer,
    manifest = APP_MANIFEST,
    bindings = runtimeBindings
  } = {}) {
    this.controlPanelContext = controlPanelContext;
    this.runtimeInitializerResolver = runtimeInitializerResolver;
    this.manifest = composeRuntimeManifest(manifest, bindings);
    this.definitions = Object.values(this.manifest);
    this.initializers = this.createInitializers();
    this.contentProviders = this.createContentProviders();
  }

  createInitializers() {
    return Object.fromEntries(
      this.definitions
        .map((definition) => [definition.type, this.createInitializer(definition)])
        .filter(([, initializer]) => initializer)
    );
  }

  createInitializer(definition) {
    const { initializer } = definition;
    if (!initializer) return null;
    if (!definition.usesControlPanelContext) return initializer;
    return (windowEl, initData, wmInstance, services) =>
      initializer(this.controlPanelContext, windowEl, initData, wmInstance, services);
  }

  createContentProviders() {
    return Object.fromEntries(
      this.definitions
        .map((definition) => [definition.type, definition.contentProvider || null])
        .filter(([, contentProvider]) => contentProvider)
    );
  }

  createApp(type, { windowEl = null, initData = null, services = {} } = {}) {
    const definition = this.manifest[type] || null;
    if (definition?.appClass) {
      return new definition.appClass({ windowEl, initData, services });
    }

    const initializer = this.resolve(type);
    const contentProvider = this.contentProviders[type] || null;
    if (!initializer && !contentProvider) return null;
    return new LegacyFunctionApp({ windowEl, initData, services, initializer, contentProvider });
  }

  resolve(type) {
    return this.initializers[type] || this.getRuntimeInitializer(type);
  }

  getRuntimeInitializer(type) {
    return this.runtimeInitializerResolver(type);
  }
}

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
    // type -> Promise<AppClass>. Memoises the in-flight load so opening the same
    // app twice in quick succession does not start two module fetches.
    this.pendingClasses = new Map();
    // type -> AppClass, once resolved. Backs the synchronous open path.
    this.resolvedClasses = new Map();
  }

  // True when `type` names an app the registry can construct at all, whether or
  // not its module has been fetched yet.
  hasApp(type) {
    const definition = this.manifest[type] || null;
    return Boolean(definition?.appClass || definition?.loadAppClass);
  }

  // The class for `type` if it is already in memory, otherwise null. Callers use
  // this to stay synchronous on the common path — an app that has been opened
  // before, or one bound to a class directly.
  getLoadedAppClass(type) {
    const definition = this.manifest[type] || null;
    if (definition?.appClass) return definition.appClass;
    return this.resolvedClasses.get(type) || null;
  }

  // Fetches the app's module if needed and resolves its class. Repeated calls
  // share one promise; the result is cached so later opens take the sync path.
  loadAppClass(type) {
    const loaded = this.getLoadedAppClass(type);
    if (loaded) return Promise.resolve(loaded);

    const definition = this.manifest[type] || null;
    if (!definition?.loadAppClass) return Promise.resolve(null);

    if (!this.pendingClasses.has(type)) {
      const pending = Promise.resolve(definition.loadAppClass())
        .then((AppClass) => {
          if (AppClass) this.resolvedClasses.set(type, AppClass);
          this.pendingClasses.delete(type);
          return AppClass || null;
        })
        .catch((err) => {
          // Drop the rejected promise so a transient chunk-load failure does not
          // poison every later attempt to open the app.
          this.pendingClasses.delete(type);
          throw err;
        });
      this.pendingClasses.set(type, pending);
    }

    return this.pendingClasses.get(type);
  }

  buildApp(AppClass, { windowEl = null, initData = null, services = {} } = {}) {
    return new AppClass({
      windowEl,
      initData,
      services: {
        ...services,
        controlPanelContext: this.controlPanelContext
      }
    });
  }

  // Synchronous construction. Returns null when the app's module has not been
  // loaded yet — callers that can wait should use `createAppAsync`.
  createApp(type, { windowEl = null, initData = null, services = {} } = {}) {
    const AppClass = this.getLoadedAppClass(type);
    if (!AppClass) return null;

    return this.buildApp(AppClass, { windowEl, initData, services });
  }

  async createAppAsync(type, { windowEl = null, initData = null, services = {} } = {}) {
    const AppClass = await this.loadAppClass(type);
    if (!AppClass) return null;

    return this.buildApp(AppClass, { windowEl, initData, services });
  }
}

import { APP_DEFINITIONS, APP_MANIFEST } from "../apps/runtimeManifest.js";
import { LegacyFunctionApp } from "../apps/base/BaseApp.js";
import { getProgramManagerContent } from "../apps/programManager.js";
import {
  getBrowserContent,
  getRadioContent,
  getRadioGardenContent,
  initBrowser,
  initRadio,
  initRadioGarden,
  initRssReader
} from "../networking.js";
import { getRuntimeInitializer } from "../installer.js";

export class AppRegistry {
  constructor({ controlPanelContext = {}, runtimeInitializerResolver = getRuntimeInitializer } = {}) {
    this.controlPanelContext = controlPanelContext;
    this.runtimeInitializerResolver = runtimeInitializerResolver;
    this.initializers = this.createInitializers();
    this.contentProviders = this.createContentProviders();
  }

  createInitializers() {
    return Object.fromEntries(
      APP_DEFINITIONS
        .map((definition) => [definition.type, this.createInitializer(definition)])
        .filter(([, initializer]) => initializer)
    );
  }

  createInitializer(definition) {
    const initializer = definition.initializer || this.getInitializerByKey(definition.initializerKey);
    if (!initializer) return null;
    if (!definition.usesControlPanelContext) return initializer;
    return (windowEl, initData, wmInstance) =>
      initializer(this.controlPanelContext, windowEl, initData, wmInstance);
  }

  createContentProviders() {
    return Object.fromEntries(
      APP_DEFINITIONS
        .map((definition) => [definition.type, this.createContentProvider(definition)])
        .filter(([, contentProvider]) => contentProvider)
    );
  }

  createContentProvider(definition) {
    if (definition.contentProvider) return definition.contentProvider;
    if (definition.contentProviderKey === "programManager") {
      return (_initData, services) => getProgramManagerContent(services.windowManager);
    }
    return this.getContentProviderByKey(definition.contentProviderKey);
  }

  getInitializerByKey(key) {
    return {
      browser: initBrowser,
      radio: initRadio,
      radiogarden: initRadioGarden,
      rss: initRssReader
    }[key] || null;
  }

  getContentProviderByKey(key) {
    return {
      browser: getBrowserContent,
      radio: getRadioContent,
      radiogarden: getRadioGardenContent
    }[key] || null;
  }

  createApp(type, { windowEl = null, initData = null, services = {} } = {}) {
    const definition = APP_MANIFEST[type] || null;
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

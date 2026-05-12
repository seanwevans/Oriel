import test from "node:test";
import assert from "node:assert/strict";

import { AppRegistry } from "./AppRegistry.js";
import { APP_DEFINITIONS, APP_MANIFEST, getExecutableEntries } from "../apps/manifest.js";

class TestClassApp {
  constructor(args) {
    this.args = args;
  }
}

function createRegistryHarness() {
  const calls = [];
  const initializer = (...args) => calls.push({ kind: "initializer", args });
  const controlInitializer = (...args) => calls.push({ kind: "control", args });
  const contentProvider = (initData, services) => ({ initData, services, kind: "content" });
  const runtimeInitializer = (...args) => calls.push({ kind: "runtime", args });

  const registry = new AppRegistry({
    controlPanelContext: { panel: true },
    runtimeInitializerResolver: (type) => (type === "runtime-only" ? runtimeInitializer : null),
    manifest: {
      initApp: {
        type: "initApp",
        title: "Initializer App",
        initializer: "init"
      },
      controlApp: {
        type: "controlApp",
        title: "Control App",
        initializer: "controlInit",
        usesControlPanelContext: true
      },
      contentApp: {
        type: "contentApp",
        title: "Content App",
        contentProvider: "content"
      },
      classApp: {
        type: "classApp",
        title: "Class App",
        appClass: "TestClassApp"
      },
      emptyApp: {
        type: "emptyApp",
        title: "Empty App"
      }
    },
    bindings: {
      initializers: { init: initializer, controlInit: controlInitializer },
      contentProviders: { content: contentProvider },
      appClasses: { TestClassApp },
      initializerKeys: {},
      contentProviderKeys: {}
    }
  });

  return { calls, contentProvider, controlInitializer, initializer, registry, runtimeInitializer };
}

test("manifest apps resolve a content provider or initializer", () => {
  const registry = new AppRegistry({ runtimeInitializerResolver: () => null });

  for (const definition of APP_DEFINITIONS) {
    const initializer = registry.initializers[definition.type] || null;
    const contentProvider = registry.contentProviders[definition.type] || null;

    assert.ok(
      initializer || contentProvider || definition.appClass,
      `${definition.type} should resolve an initializer, content provider, or app class`
    );
  }
});

test("custom manifests resolve initializer and control-panel initializer bindings", () => {
  const { calls, controlInitializer, initializer, registry } = createRegistryHarness();

  assert.equal(registry.manifest.initApp.initializer, initializer);
  assert.equal(registry.initializers.initApp, initializer);

  const controlWrapped = registry.initializers.controlApp;
  assert.notEqual(controlWrapped, controlInitializer);
  controlWrapped("window", "data", "wm", "services");

  assert.deepEqual(calls, [
    {
      kind: "control",
      args: [{ panel: true }, "window", "data", "wm", "services"]
    }
  ]);
});

test("content providers are exposed and used by LegacyFunctionApp instances", () => {
  const { contentProvider, registry } = createRegistryHarness();
  const services = { answer: 42 };
  const app = registry.createApp("contentApp", { initData: { file: "readme" }, services });

  assert.equal(registry.contentProviders.contentApp, contentProvider);
  assert.equal(app.constructor.name, "LegacyFunctionApp");
  assert.deepEqual(app.getWindowContent(), {
    initData: { file: "readme" },
    services,
    kind: "content"
  });
});

test("runtime initializer lookup backs apps that are absent from the manifest", () => {
  const { calls, registry, runtimeInitializer } = createRegistryHarness();
  const app = registry.createApp("runtime-only", {
    windowEl: "window",
    initData: "payload",
    services: { windowManager: "wm" }
  });

  assert.equal(registry.resolve("runtime-only"), runtimeInitializer);
  app.mount();
  assert.deepEqual(calls, [
    { kind: "runtime", args: ["window", "payload", "wm", { windowManager: "wm" }] }
  ]);
});

test("appClass entries construct the registered class with host arguments", () => {
  const { registry } = createRegistryHarness();
  const args = { windowEl: "window", initData: { doc: 1 }, services: { fs: true } };
  const app = registry.createApp("classApp", args);

  assert.equal(app.constructor, TestClassApp);
  assert.deepEqual(app.args, args);
});

test("missing apps without runtime initializers return null", () => {
  const { registry } = createRegistryHarness();

  assert.equal(registry.resolve("missing"), null);
  assert.equal(registry.createApp("missing"), null);
  assert.equal(registry.createApp("emptyApp"), null);
});


test("BaseApp migrations are resolved through app classes", () => {
  const registry = new AppRegistry({ runtimeInitializerResolver: () => null });

  for (const [type, className] of [
    ["notepad", "NotepadApp"],
    ["console", "ConsoleApp"],
    ["winfile", "FileManagerApp"]
  ]) {
    const app = registry.createApp(type, { initData: "hello" });

    assert.equal(app?.constructor.name, className);
    assert.equal(registry.initializers[type], undefined);
    assert.equal(registry.contentProviders[type], undefined);
  }
});

test("manifest executable names point at valid app types", () => {
  const executableEntries = getExecutableEntries();

  for (const [executableName, entry] of Object.entries(executableEntries)) {
    assert.match(executableName, /^[A-Z0-9]+\.EXE$/);
    assert.equal(entry.type, "file");
    assert.ok(APP_MANIFEST[entry.app], `${executableName} should reference a manifest app type`);
  }
});

test("manifest runtime bindings fail fast when a key is missing", () => {
  assert.throws(
    () =>
      new AppRegistry({
        manifest: {
          broken: {
            type: "broken",
            title: "Broken",
            width: 100,
            height: 100,
            icon: "broken",
            label: "Broken",
            initializer: "missingInitializer"
          }
        },
        bindings: {
          initializers: {},
          contentProviders: {},
          appClasses: {},
          initializerKeys: {},
          contentProviderKeys: {}
        }
      }),
    /Missing app runtime bindings: broken\.initializer: missingInitializer/
  );
});

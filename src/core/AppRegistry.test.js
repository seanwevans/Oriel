import test from "node:test";
import assert from "node:assert/strict";

import { AppRegistry } from "./AppRegistry.js";
import { lazyApp } from "../apps/runtimeBindings.js";
import { APP_DEFINITIONS, APP_MANIFEST, getExecutableEntries } from "../apps/manifest.js";

class TestClassApp {
  constructor(args) {
    this.args = args;
  }
}

function createRegistryHarness() {
  const registry = new AppRegistry({
    controlPanelContext: { panel: true },
    manifest: {
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
      appClasses: { TestClassApp }
    }
  });

  return { registry };
}

test("manifest apps resolve through app class loaders", () => {
  const registry = new AppRegistry();

  for (const definition of APP_DEFINITIONS) {
    assert.ok(definition.appClass, `${definition.type} should declare an appClass`);
    assert.equal(
      typeof registry.manifest[definition.type]?.loadAppClass,
      "function",
      `${definition.type} should resolve an app class binding`
    );
    assert.ok(
      registry.hasApp(definition.type),
      `${definition.type} should be constructible`
    );
  }
});

test("manifest apps are not loaded until they are first constructed", () => {
  const registry = new AppRegistry();

  // Nothing has been opened yet, so no app module should be in memory. This is
  // what keeps ~80 applications out of the entry chunk.
  for (const definition of APP_DEFINITIONS) {
    assert.equal(
      registry.getLoadedAppClass(definition.type),
      null,
      `${definition.type} should not be resolved before first use`
    );
  }
});

test("loading an app caches its class for later synchronous construction", async () => {
  const registry = new AppRegistry();

  assert.equal(registry.createApp("notepad"), null);

  const app = await registry.createAppAsync("notepad", { initData: "hello" });
  assert.equal(app?.constructor.name, "NotepadApp");

  // Once loaded, the synchronous path works — this is what lets openWindow
  // render a reopened app without a placeholder frame.
  assert.equal(registry.getLoadedAppClass("notepad")?.name, "NotepadApp");
  assert.equal(registry.createApp("notepad")?.constructor.name, "NotepadApp");
});

test("concurrent loads of the same app share a single module fetch", async () => {
  let loadCount = 0;
  class SharedApp {}
  const registry = new AppRegistry({
    manifest: { shared: { type: "shared", title: "Shared", appClass: "SharedApp" } },
    bindings: {
      appClasses: {
        SharedApp: lazyApp(() => {
          loadCount += 1;
          return Promise.resolve(SharedApp);
        })
      }
    }
  });

  const [first, second] = await Promise.all([
    registry.createAppAsync("shared"),
    registry.createAppAsync("shared")
  ]);

  assert.equal(loadCount, 1);
  assert.equal(first.constructor, SharedApp);
  assert.equal(second.constructor, SharedApp);
});

test("a failed app load is not cached, so reopening retries", async () => {
  let attempts = 0;
  class RecoveringApp {}
  const registry = new AppRegistry({
    manifest: { flaky: { type: "flaky", title: "Flaky", appClass: "RecoveringApp" } },
    bindings: {
      appClasses: {
        RecoveringApp: lazyApp(() => {
          attempts += 1;
          return attempts === 1
            ? Promise.reject(new Error("chunk load failed"))
            : Promise.resolve(RecoveringApp);
        })
      }
    }
  });

  await assert.rejects(() => registry.createAppAsync("flaky"), /chunk load failed/);

  const app = await registry.createAppAsync("flaky");
  assert.equal(app.constructor, RecoveringApp);
  assert.equal(attempts, 2);
});

test("appClass entries construct the registered class with host arguments and control panel context", () => {
  const { registry } = createRegistryHarness();
  const args = { windowEl: "window", initData: { doc: 1 }, services: { fs: true } };
  const app = registry.createApp("classApp", args);

  assert.equal(app.constructor, TestClassApp);
  assert.deepEqual(app.args, {
    ...args,
    services: {
      fs: true,
      controlPanelContext: { panel: true }
    }
  });
});

test("missing apps and metadata-only entries without app classes return null", () => {
  const { registry } = createRegistryHarness();

  assert.equal(registry.createApp("missing"), null);
  assert.equal(registry.createApp("emptyApp"), null);
});

test("BaseApp migrations are resolved through app classes", async () => {
  const registry = new AppRegistry();

  for (const [type, className] of [
    ["notepad", "NotepadApp"],
    ["console", "ConsoleApp"],
    ["winfile", "FileManagerApp"],
    ["tracker", "TrackerApp"],
    ["midisequencer", "MidiSequencerApp"],
    ["netnews", "NetNewsApp"],
    ["messenger", "MessengerApp"],
    ["whiteboard", "WhiteboardApp"],
    ["rss", "RssApp"],
    ["mplayer", "MediaPlayerApp"],
    ["soundrec", "SoundRecorderApp"]
  ]) {
    const app = await registry.createAppAsync(type, { initData: "hello" });

    assert.equal(app?.constructor.name, className);
  }
});

test("manifest entries do not keep legacy initializer or content-provider wiring", () => {
  const legacyWiringFields = [
    "initializer",
    "initializerKey",
    "contentProvider",
    "contentProviderKey"
  ];

  for (const definition of APP_DEFINITIONS) {
    const legacyFields = legacyWiringFields.filter((field) => definition[field]);

    assert.deepEqual(
      legacyFields,
      [],
      `${definition.type} must not use legacy runtime wiring: ${legacyFields.join(", ")}`
    );
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

test("manifest runtime bindings fail fast when an app class is missing", () => {
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
            appClass: "MissingApp"
          }
        },
        bindings: {
          appClasses: {}
        }
      }),
    /Missing app runtime bindings: broken\.appClass: MissingApp/
  );
});

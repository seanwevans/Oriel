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

test("manifest apps resolve through app classes", () => {
  const registry = new AppRegistry();

  for (const definition of APP_DEFINITIONS) {
    assert.ok(definition.appClass, `${definition.type} should declare an appClass`);
    assert.equal(
      typeof registry.manifest[definition.type]?.appClass,
      "function",
      `${definition.type} should resolve an app class binding`
    );
  }
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

test("BaseApp migrations are resolved through app classes", () => {
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
    const app = registry.createApp(type, { initData: "hello" });

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

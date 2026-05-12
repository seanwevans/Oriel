import test from "node:test";
import assert from "node:assert/strict";

import { AppRegistry } from "./AppRegistry.js";
import { APP_DEFINITIONS, APP_MANIFEST, getExecutableEntries } from "../apps/manifest.js";

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


test("notepad is resolved through its BaseApp app class", () => {
  const registry = new AppRegistry({ runtimeInitializerResolver: () => null });
  const app = registry.createApp("notepad", { initData: "hello" });

  assert.equal(app?.constructor.name, "NotepadApp");
  assert.equal(registry.initializers.notepad, undefined);
  assert.equal(registry.contentProviders.notepad, undefined);
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

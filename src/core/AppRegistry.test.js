import test from "node:test";
import assert from "node:assert/strict";

import { AppRegistry } from "./AppRegistry.js";
import { APP_DEFINITIONS, APP_MANIFEST } from "../apps/runtimeManifest.js";
import { getExecutableEntries } from "../apps/manifest.js";

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

test("manifest executable names point at valid app types", () => {
  const executableEntries = getExecutableEntries();

  for (const [executableName, entry] of Object.entries(executableEntries)) {
    assert.match(executableName, /^[A-Z0-9]+\.EXE$/);
    assert.equal(entry.type, "file");
    assert.ok(APP_MANIFEST[entry.app], `${executableName} should reference a manifest app type`);
  }
});

import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import { fileSystemReady, MOCK_FS, replaceFileSystem } from "./filesystem.js";

let originalFileSystem;

beforeEach(async () => {
  await fileSystemReady;
  originalFileSystem = structuredClone(MOCK_FS);
});

afterEach(async () => {
  await replaceFileSystem(originalFileSystem, { persist: false });
});

test("replaceFileSystem copies imported directory children into null-prototype objects", async () => {
  const imported = {
    "C\\": {
      type: "dir",
      children: {
        DOCUMENTS: {
          type: "dir",
          children: {
            "README.TXT": { type: "file", content: "safe" }
          }
        }
      }
    }
  };

  await replaceFileSystem(imported, { persist: false });

  assert.equal(Object.getPrototypeOf(MOCK_FS["C\\"].children), null);
  assert.equal(Object.getPrototypeOf(MOCK_FS["C\\"].children.DOCUMENTS.children), null);
  assert.equal(MOCK_FS["C\\"].children.DOCUMENTS.children["README.TXT"].content, "safe");
});

test("replaceFileSystem copies __proto__ entries without invoking prototype setters", async () => {
  const imported = JSON.parse(
    '{"C\\\\":{"type":"dir","children":{"__proto__":{"type":"file","content":"data"}}}}'
  );

  await replaceFileSystem(imported, { persist: false });

  const children = MOCK_FS["C\\"].children;
  assert.equal(Object.getPrototypeOf(children), null);
  assert.equal(Object.hasOwn(children, "__proto__"), true);
  assert.equal(children.__proto__.content, "data");
  assert.equal(Object.prototype.content, undefined);
});

// The store degrades to localStorage, or to the default tree, when IndexedDB is
// missing — a browser with site data blocked, a private window, or the Node test
// runner. That fallback is the designed path, so it has to be silent: warning on
// it trains readers to ignore the console, and it printed a stack trace on every
// import of this module under `npm test`.
test("an environment without IndexedDB falls back quietly instead of warning", async () => {
  assert.equal(
    typeof globalThis.indexedDB,
    "undefined",
    "this test only proves something in an environment that has no IndexedDB"
  );

  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (...args) => warnings.push(args.map(String).join(" "));

  try {
    // A distinct specifier gives a fresh module instance, so the top-level
    // initialization this is checking runs again under the captured console.
    const fresh = await import("./filesystem.js?fresh-without-indexeddb");
    await fresh.fileSystemReady;

    assert.deepEqual(warnings, [], "initializing the file system warned");

    await fresh.writeFileStoreValue("oriel-fallback-probe", { ok: true });
    assert.equal(await fresh.readFileStoreValue("oriel-fallback-probe"), null);

    // The default tree is still handed out, so callers get a usable filesystem.
    assert.ok(fresh.MOCK_FS["C\\"], "the default drive was not hydrated");
  } finally {
    console.warn = originalWarn;
  }

  assert.deepEqual(warnings, [], `unexpected warnings: ${warnings.join(" | ")}`);
});

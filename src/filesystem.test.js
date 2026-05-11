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

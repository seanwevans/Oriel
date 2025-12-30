import assert from "node:assert/strict";
import { test } from "node:test";

import {
  clearKeyValueStore,
  deleteKeyValue,
  getKeyValue,
  getKeyValueStoreSnapshot,
  listKeyValues,
  setKeyValue
} from "./keyValueStore.js";

function createMockStorage() {
  const backing = new Map();
  return {
    getItem: (key) => (backing.has(key) ? backing.get(key) : null),
    setItem: (key, value) => backing.set(key, value),
    removeItem: (key) => backing.delete(key)
  };
}

test("key value store can set, get, list, delete, and clear entries", () => {
  const storage = createMockStorage();

  assert.equal(getKeyValue("foo", { storage }), null);

  setKeyValue("foo", "bar", { storage });
  assert.equal(getKeyValue("foo", { storage }), "bar");

  setKeyValue("hello", "world", { storage });

  const listed = listKeyValues({ storage });
  assert.deepEqual(listed.sort(), [
    ["foo", "bar"],
    ["hello", "world"]
  ]);

  assert.equal(deleteKeyValue("foo", { storage }), true);
  assert.equal(getKeyValue("foo", { storage }), null);

  clearKeyValueStore({ storage });
  assert.deepEqual(getKeyValueStoreSnapshot({ storage }), {});
});

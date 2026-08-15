import assert from "node:assert/strict";
import { test } from "node:test";

// The Oriel VM boots a nested copy of Oriel in a same-origin iframe, so it shares
// localStorage with the desktop hosting it. The nested instance must persist its
// desktop state under its own key, or opening apps inside the VM overwrites the
// windows of the desktop it is running in.
//
// The storage key is resolved when state.js is first evaluated, so each case
// imports a fresh copy of the module with its own fake location.

function createFakeStorage() {
  const store = new Map();
  return {
    store,
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key)
  };
}

async function loadStateModule({ search, storage, cacheBuster }) {
  const originalLocation = globalThis.location;
  const originalLocalStorage = globalThis.localStorage;

  globalThis.location = { search };
  globalThis.localStorage = storage;

  try {
    return await import(`./state.js?vm-isolation=${cacheBuster}`);
  } finally {
    globalThis.location = originalLocation;
    globalThis.localStorage = originalLocalStorage;
  }
}

test("a nested VM instance persists desktop state under its own key", async () => {
  const storage = createFakeStorage();

  const host = await loadStateModule({ search: "", storage, cacheBuster: "host" });
  const vm = await loadStateModule({ search: "?oriel-vm=1", storage, cacheBuster: "vm" });

  const originalLocalStorage = globalThis.localStorage;
  globalThis.localStorage = storage;
  try {
    host.persistDesktopState({ windows: [{ id: "host-window" }], appState: {} });
    vm.persistDesktopState({ windows: [{ id: "vm-window" }], appState: {} });

    // Two distinct keys, so neither instance can clobber the other.
    const keys = [...storage.store.keys()].sort();
    assert.deepEqual(keys, ["oriel-desktop-state", "oriel-desktop-state:vm"]);

    assert.deepEqual(host.loadDesktopState().windows, [{ id: "host-window" }]);
    assert.deepEqual(vm.loadDesktopState().windows, [{ id: "vm-window" }]);
  } finally {
    globalThis.localStorage = originalLocalStorage;
  }
});

test("the VM flag is detected among other query parameters", async () => {
  const storage = createFakeStorage();
  const vm = await loadStateModule({
    search: "?theme=dark&oriel-vm=1&debug=1",
    storage,
    cacheBuster: "vm-mixed"
  });

  const originalLocalStorage = globalThis.localStorage;
  globalThis.localStorage = storage;
  try {
    vm.persistDesktopState({ windows: [], appState: {} });
    assert.deepEqual([...storage.store.keys()], ["oriel-desktop-state:vm"]);
  } finally {
    globalThis.localStorage = originalLocalStorage;
  }
});

test("desktop state falls back to memory when storage access throws", async () => {
  // Reading `localStorage` throws outright in a sandboxed frame or when a
  // browser blocks storage, rather than being undefined.
  const originalLocation = globalThis.location;
  const originalLocalStorage = globalThis.localStorage;
  const originalWarn = console.warn;
  console.warn = () => {};

  globalThis.location = { search: "" };
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    get() {
      throw new Error("access denied");
    }
  });

  try {
    const state = await import("./state.js?vm-isolation=blocked");

    assert.doesNotThrow(() => state.persistDesktopState({ windows: [], appState: {} }));
    assert.deepEqual(state.loadDesktopState().windows, []);
  } finally {
    delete globalThis.localStorage;
    globalThis.localStorage = originalLocalStorage;
    globalThis.location = originalLocation;
    console.warn = originalWarn;
  }
});

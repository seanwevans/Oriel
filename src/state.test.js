import assert from "node:assert/strict";
import { test } from "node:test";

import { loadDesktopState, persistDesktopState } from "./state.js";

const DEFAULT_DESKTOP_STATE = {
  windows: [],
  wallpaper: null,
  themeCustom: null,
  appState: {}
};

function withSuppressedWarnings(callback) {
  const originalWarn = console.warn;
  const warnings = [];
  console.warn = (...args) => warnings.push(args);

  try {
    const result = callback(warnings);
    return { result, warnings };
  } finally {
    console.warn = originalWarn;
  }
}

test("loadDesktopState falls back to the default state when localStorage.getItem throws", () => {
  const originalLocalStorage = globalThis.localStorage;
  globalThis.localStorage = {
    getItem() {
      throw new Error("getItem failed");
    },
    setItem() {}
  };

  try {
    const { result, warnings } = withSuppressedWarnings(() => loadDesktopState());

    assert.deepEqual(result, DEFAULT_DESKTOP_STATE);
    assert.equal(warnings.length, 1);
    assert.match(warnings[0][0], /Failed to read desktop state/);
  } finally {
    globalThis.localStorage = originalLocalStorage;
  }
});

test("persistDesktopState falls back to memory when localStorage.setItem throws", () => {
  const originalLocalStorage = globalThis.localStorage;
  const fallbackState = {
    windows: [{ id: "notes" }],
    wallpaper: "aurora.png",
    themeCustom: { accent: "#49f" },
    appState: { notes: { open: true } }
  };

  globalThis.localStorage = {
    getItem() {
      throw new Error("getItem failed");
    },
    setItem() {
      throw new Error("setItem failed");
    }
  };

  try {
    const { warnings } = withSuppressedWarnings(() => persistDesktopState(fallbackState));
    const { result: loaded } = withSuppressedWarnings(() => loadDesktopState());

    assert.deepEqual(loaded, fallbackState);
    assert.equal(warnings.length, 1);
    assert.match(warnings[0][0], /Failed to persist desktop state/);
  } finally {
    globalThis.localStorage = originalLocalStorage;
  }
});

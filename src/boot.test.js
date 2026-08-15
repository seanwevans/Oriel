import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs/promises";

import { DEFAULT_SPLASH_IMAGE } from "./defaults.js";

test("boot renders the splash image", async () => {
  const imageUrl = new URL(DEFAULT_SPLASH_IMAGE);
  const imageBuffer = await fs.readFile(imageUrl);

  assert.ok(imageBuffer.byteLength > 0, "splash2.webp should be readable");

  // WebP is a RIFF container: "RIFF" <4-byte length> "WEBP".
  const hasWebpSignature =
    imageBuffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    imageBuffer.subarray(8, 12).toString("ascii") === "WEBP";

  assert.ok(hasWebpSignature, "splash2.webp should be a valid WebP");
});

test("boot images stay small enough to ship on the first paint", async () => {
  // These three assets were 10.6 MB of PNG/JPEG before conversion, which
  // dominated first load. Guard the budget so a future re-export cannot
  // silently reintroduce multi-megabyte artwork.
  const budgetsKb = {
    "splash2.webp": 600,
    "wallpaper.webp": 400,
    "screen.webp": 400
  };

  for (const [name, budgetKb] of Object.entries(budgetsKb)) {
    const { size } = await fs.stat(new URL(`./assets/${name}`, import.meta.url));
    assert.ok(
      size / 1024 < budgetKb,
      `${name} is ${(size / 1024).toFixed(0)}KB, over its ${budgetKb}KB budget`
    );
  }
});

test("boot registers console commands after exposing the kernel globally", async () => {
  const originalDocument = globalThis.document;
  const originalWindow = globalThis.window;
  const originalLocalStorage = globalThis.localStorage;

  const storage = new Map();
  globalThis.localStorage = {
    getItem(key) {
      return storage.has(key) ? storage.get(key) : null;
    },
    setItem(key, value) {
      storage.set(key, String(value));
    },
    removeItem(key) {
      storage.delete(key);
    }
  };

  const style = { setProperty() {} };
  const createElement = () => ({
    style: {},
    dataset: {},
    getContext() {
      return {};
    },
    addEventListener() {},
    querySelector() {
      return null;
    }
  });
  globalThis.window = {};
  globalThis.document = {
    body: { style },
    documentElement: { style },
    getElementById() {
      return createElement();
    },
    addEventListener() {}
  };

  const { OrielApp } = await import("./core/OrielApp.js");

  class TestKernel {
    constructor() {
      this.commandHandlers = new Map();
    }

    normalizeCommandName(name) {
      return typeof name === "string" ? name.trim().toLowerCase() : "";
    }

    registerCommand(name, handler) {
      this.commandHandlers.set(this.normalizeCommandName(name), handler);
      return () => {};
    }

    getCommandHandler(name) {
      return this.commandHandlers.get(this.normalizeCommandName(name));
    }
  }

  try {
    const app = new OrielApp({
      WindowManager: class {},
      SimulatedKernel: TestKernel,
      filesystem: {
        MOCK_FS: {},
        exportFileSystemAsJson() {},
        hydrateNativeDirectory() {},
        isNativeFsSupported() {
          return false;
        },
        mountNativeFolder() {},
        replaceFileSystem() {},
        saveFileSystem() {},
        fileSystemReady: new Promise(() => {})
      },
      state: {
        loadDesktopState() {
          return {};
        }
      },
      wallpaper: {
        applyWallpaperSettings() {}
      }
    });

    const bootPromise = app.start();
    bootPromise.catch(() => {});

    assert.equal(globalThis.window.kernel, app.kernel);
    assert.equal(typeof globalThis.window.kernel.getCommandHandler("ls"), "function");
    await app.installerReady.catch(() => {});
  } finally {
    globalThis.document = originalDocument;
    globalThis.window = originalWindow;
    globalThis.localStorage = originalLocalStorage;
  }
});

import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs/promises";

import { DEFAULT_SPLASH_IMAGE } from "./defaults.js";

test("boot renders the splash image", async () => {
  const imageUrl = new URL(DEFAULT_SPLASH_IMAGE);
  const imageBuffer = await fs.readFile(imageUrl);

  assert.ok(imageBuffer.byteLength > 0, "splash2.jpeg should be readable");

  const hasJpegSignature =
    imageBuffer[0] === 0xff &&
    imageBuffer[1] === 0xd8 &&
    imageBuffer[imageBuffer.length - 2] === 0xff &&
    imageBuffer[imageBuffer.length - 1] === 0xd9;

  assert.ok(hasJpegSignature, "splash2.jpeg should be a valid JPEG");
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

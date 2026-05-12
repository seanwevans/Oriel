import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";

class FakeElement {
  constructor() {
    this.style = {};
    this.dataset = {};
    this.children = [];
    this.classList = { add() {}, remove() {} };
  }

  addEventListener() {}
  appendChild(child) {
    this.children.push(child);
    return child;
  }
  click() {}
  closest() {
    return null;
  }
  contains() {
    return false;
  }
  getBoundingClientRect() {
    return { width: 0, height: 0 };
  }
  getContext() {
    return {
      canvas: this,
      fillRect() {},
      clearRect() {},
      beginPath() {},
      arc() {},
      fill() {},
      stroke() {},
      moveTo() {},
      lineTo() {},
      createLinearGradient() {
        return { addColorStop() {} };
      },
      measureText() {
        return { width: 0 };
      },
      fillText() {},
      save() {},
      restore() {},
      translate() {},
      rotate() {},
      drawImage() {}
    };
  }
  querySelector() {
    return new FakeElement();
  }
}

class FakeFileReader {
  readAsText(file) {
    this.onload({ target: { result: file.content } });
  }
}

let originalDocument;
let originalWindow;
let originalLocalStorage;
let originalFileReader;
let originalAlert;
let originalSetInterval;
let originalClearInterval;
let OrielApp;

before(async () => {
  originalDocument = globalThis.document;
  originalWindow = globalThis.window;
  originalLocalStorage = globalThis.localStorage;
  originalFileReader = globalThis.FileReader;
  originalAlert = globalThis.alert;
  originalSetInterval = globalThis.setInterval;
  originalClearInterval = globalThis.clearInterval;

  globalThis.document = createFakeDocument();
  globalThis.window = createFakeWindow();
  globalThis.localStorage = { getItem() { return null; }, setItem() {}, removeItem() {} };
  globalThis.FileReader = FakeFileReader;
  globalThis.alert = () => {};
  globalThis.setInterval = () => 0;
  globalThis.clearInterval = () => {};

  ({ OrielApp } = await import("./OrielApp.js"));
});

after(() => {
  globalThis.document = originalDocument;
  globalThis.window = originalWindow;
  globalThis.localStorage = originalLocalStorage;
  globalThis.FileReader = originalFileReader;
  globalThis.alert = originalAlert;
  globalThis.setInterval = originalSetInterval;
  globalThis.clearInterval = originalClearInterval;
});

beforeEach(() => {
  globalThis.document = createFakeDocument();
  globalThis.window = createFakeWindow();
  globalThis.alert = () => {};
});

function createFakeDocument() {
  return {
    body: new FakeElement(),
    createElement() {
      return new FakeElement();
    },
    getElementById() {
      return new FakeElement();
    }
  };
}

function createFakeWindow() {
  return {
    addEventListener() {},
    innerWidth: 1024,
    innerHeight: 768
  };
}

function deferred() {
  let resolve;
  const promise = new Promise((next) => {
    resolve = next;
  });
  return { promise, resolve };
}

test("start waits for filesystem and installer readiness before desktop and screensaver boot", async () => {
  const order = [];
  const fsReady = deferred();
  const installerReady = deferred();
  const initialDesktopState = {
    wallpaper: { url: "wallpaper.png", mode: "contain" },
    themeCustom: null
  };
  const filesystem = {
    MOCK_FS: { "C\\": { type: "dir", children: {} } },
    exportFileSystemAsJson: async () => "{}",
    hydrateNativeDirectory: async (node) => node,
    isNativeFsSupported: () => false,
    mountNativeFolder: async () => null,
    replaceFileSystem: async () => {},
    saveFileSystem: async () => {},
    fileSystemReady: fsReady.promise.then(() => order.push("filesystem ready"))
  };
  let constructedWindowManager = null;

  class TestKernel {
    constructor(refreshProcesses) {
      this.refreshProcesses = refreshProcesses;
      order.push("kernel");
    }

    registerCommand() {}
  }

  class TestWindowManager {
    constructor(initialState, { services }) {
      this.initialState = initialState;
      this.services = services;
      this.windows = [];
      constructedWindowManager = this;
      order.push("window manager");
    }
  }

  const app = new OrielApp({
    WindowManager: TestWindowManager,
    SimulatedKernel: TestKernel,
    filesystem,
    state: {
      loadDesktopState() {
        order.push("desktop state");
        return initialDesktopState;
      }
    },
    wallpaper: {
      applyWallpaperSettings(url, mode) {
        order.push(`wallpaper ${url} ${mode}`);
      }
    },
    installer: {
      bootstrapInstallations() {
        order.push("installer bootstrap");
        return installerReady.promise.then(() => order.push("installer ready"));
      }
    },
    screensaver: {
      initScreensaver() {
        order.push("screensaver");
      }
    }
  });

  const startPromise = app.start();
  await Promise.resolve();

  assert.deepEqual(order, [
    "installer bootstrap",
    "kernel",
    "desktop state",
    "wallpaper wallpaper.png contain"
  ]);
  assert.equal(globalThis.window.kernel, app.kernel);
  assert.equal(globalThis.window.wm, undefined);

  fsReady.resolve();
  await Promise.resolve();
  assert.deepEqual(order, [
    "installer bootstrap",
    "kernel",
    "desktop state",
    "wallpaper wallpaper.png contain",
    "filesystem ready"
  ]);
  assert.equal(globalThis.window.wm, undefined);

  installerReady.resolve();
  await startPromise;

  assert.deepEqual(order, [
    "installer bootstrap",
    "kernel",
    "desktop state",
    "wallpaper wallpaper.png contain",
    "filesystem ready",
    "installer ready",
    "window manager",
    "screensaver"
  ]);
  assert.equal(app.windowManager, constructedWindowManager);
  assert.equal(constructedWindowManager.initialState, initialDesktopState);
  assert.equal(constructedWindowManager.services.kernel, app.kernel);
  assert.equal(constructedWindowManager.services.windowManager, constructedWindowManager);
  assert.equal(globalThis.window.wm, constructedWindowManager);
  assert.equal(typeof globalThis.window.handleConsoleKey, "function");
  assert.equal(typeof globalThis.window.openCPDesktop, "function");
  assert.equal(typeof globalThis.window.applyWallpaperSettings, "function");
  assert.equal(typeof globalThis.window.submitLockPassphrase, "function");
  assert.equal(typeof globalThis.window.getBrowserPlaceholder, "function");
});

function createImportHarness() {
  const alerts = [];
  const replaceCalls = [];
  globalThis.alert = (message) => alerts.push(message);

  const filesystem = {
    MOCK_FS: { "C\\": { type: "dir", children: {} } },
    exportFileSystemAsJson: async () => "{}",
    hydrateNativeDirectory: async (node) => node,
    isNativeFsSupported: () => false,
    mountNativeFolder: async () => null,
    replaceFileSystem: async (nextFs) => {
      replaceCalls.push(nextFs);
      filesystem.MOCK_FS = nextFs;
    },
    saveFileSystem: async () => {},
    fileSystemReady: Promise.resolve()
  };

  const app = new OrielApp({
    WindowManager: class {
      constructor() {
        this.windows = [];
      }
    },
    SimulatedKernel: class {
      registerCommand() {}
    },
    filesystem,
    state: { loadDesktopState: () => ({}) },
    wallpaper: { applyWallpaperSettings() {} }
  });

  return { alerts, app, replaceCalls };
}

async function importFileSystem(json) {
  const { alerts, app, replaceCalls } = createImportHarness();
  await app.start();
  app.fileSystemActions.importFileSystem({
    target: { files: [{ content: json }], value: "selected" }
  });
  await Promise.resolve();
  return { alerts, replaceCalls };
}

test("imports valid file system trees", async () => {
  const validTree = {
    "C\\": {
      type: "dir",
      children: {
        DOCUMENTS: {
          type: "dir",
          children: {
            "README.TXT": { type: "file", app: "notepad", content: "hello" }
          }
        }
      }
    }
  };

  const { alerts, replaceCalls } = await importFileSystem(JSON.stringify(validTree));

  assert.equal(replaceCalls.length, 1);
  assert.deepEqual(replaceCalls[0], validTree);
  assert.deepEqual(alerts, ["File system imported successfully."]);
});

test("imports and preserves multiple normalized drive keys", async () => {
  const importedTree = {
    "C\\": {
      type: "dir",
      children: {
        "CFILE.TXT": { type: "file", app: "notepad", content: "from C" }
      }
    },
    "D\\": {
      type: "dir",
      children: {
        "DFILE.TXT": { type: "file", app: "notepad", content: "from D" }
      }
    }
  };

  const { alerts, replaceCalls } = await importFileSystem(JSON.stringify(importedTree));

  assert.equal(replaceCalls.length, 1);
  assert.deepEqual(replaceCalls[0], importedTree);
  assert.deepEqual(alerts, ["File system imported successfully."]);
});

test("rejects imported trees with __proto__ child names", async () => {
  const json = '{"C\\\\":{"type":"dir","children":{"__proto__":{"type":"dir","children":{}}}}}';

  const { alerts, replaceCalls } = await importFileSystem(json);

  assert.equal(replaceCalls.length, 0);
  assert.match(alerts[0], /Import file system structure is invalid/);
});

test("rejects imported trees with reserved or invalid child names", async () => {
  for (const childName of ["CON", "BAD/NAME", "TRAILING.", "TRAILING ", "constructor"]) {
    const tree = {
      "C\\": {
        type: "dir",
        children: {
          [childName]: { type: "file", content: "blocked" }
        }
      }
    };

    const { alerts, replaceCalls } = await importFileSystem(JSON.stringify(tree));

    assert.equal(replaceCalls.length, 0, `${childName} should be rejected`);
    assert.match(
      alerts[0],
      /Import file system structure is invalid/,
      `${childName} should alert`
    );
  }
});

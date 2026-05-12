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
let CompilerApp;
let ConsoleApp;
let OrielApp;
let PythonApp;

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
  ({ CompilerApp, ConsoleApp, PythonApp } = await import("../apps/console.js"));
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


class EventTargetElement {
  constructor({ selectorMap = {}, closestMap = {} } = {}) {
    this.children = [];
    this.dataset = {};
    this.eventListeners = new Map();
    this.focusCount = 0;
    this.innerHTML = "";
    this.selectorMap = selectorMap;
    this.closestMap = closestMap;
    this.style = {};
    this.textContent = "";
    this.value = "";
  }

  addEventListener(type, listener) {
    const listeners = this.eventListeners.get(type) || [];
    listeners.push(listener);
    this.eventListeners.set(type, listeners);
  }

  removeEventListener(type, listener) {
    const listeners = this.eventListeners.get(type) || [];
    this.eventListeners.set(type, listeners.filter((candidate) => candidate !== listener));
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  closest(selector) {
    return this.closestMap[selector] || null;
  }

  dispatch(type, event = {}) {
    const listeners = this.eventListeners.get(type) || [];
    return Promise.all(listeners.map((listener) => listener({ target: this, ...event })));
  }

  focus() {
    this.focusCount += 1;
  }

  querySelector(selector) {
    return this.selectorMap[selector] || null;
  }

  setSelectionRange(start, end) {
    this.selection = { start, end };
  }
}

test("console app owns console focus and keydown behavior", async () => {
  const consoleEl = new EventTargetElement();
  const input = new EventTargetElement();
  const prompt = new EventTargetElement();
  const output = new EventTargetElement();
  const windowEl = new EventTargetElement({
    selectorMap: {
      ".console": consoleEl,
      ".console-input": input,
      ".console-line span": prompt,
      ".console-output": output
    }
  });
  input.closestMap[".window"] = windowEl;

  const app = new ConsoleApp({ windowEl });
  const content = app.getWindowContent();

  assert.equal(content.includes("onclick="), false);
  assert.equal(content.includes("onkeydown="), false);

  app.mount();
  assert.equal(input.focusCount, 1);
  assert.equal(consoleEl.eventListeners.get("click").length, 1);
  assert.equal(input.eventListeners.get("keydown").length, 1);

  await consoleEl.dispatch("click");
  assert.equal(input.focusCount, 2);

  windowEl.consoleState.history.push("help");
  let prevented = false;
  await input.dispatch("keydown", {
    key: "ArrowUp",
    preventDefault() {
      prevented = true;
    }
  });

  assert.equal(prevented, true);
  assert.equal(input.value, "help");
  assert.deepEqual(input.selection, { start: 4, end: 4 });
});

test("compiler and python apps own runner click behavior", async () => {
  const compilerButton = new EventTargetElement();
  const compilerEditor = new EventTargetElement();
  const compilerOutput = new EventTargetElement();
  const compilerWindow = new EventTargetElement({
    selectorMap: {
      ".compiler-btn": compilerButton,
      ".compiler-editor": compilerEditor,
      "#compiler-out": compilerOutput
    }
  });
  compilerButton.closestMap[".window"] = compilerWindow;

  const compilerApp = new CompilerApp({ windowEl: compilerWindow });
  const compilerContent = compilerApp.getWindowContent();
  assert.equal(compilerContent.includes("onclick="), false);
  compilerEditor.value = "";
  compilerApp.mount();
  assert.equal(compilerButton.eventListeners.get("click").length, 1);
  await compilerButton.dispatch("click");
  assert.equal(compilerOutput.children[0].textContent, "No source code provided.");

  const pythonButton = new EventTargetElement();
  const pythonEditor = new EventTargetElement();
  const pythonOutput = new EventTargetElement();
  const pythonWindow = new EventTargetElement({
    selectorMap: {
      ".compiler-btn": pythonButton,
      ".compiler-editor": pythonEditor,
      "#python-out": pythonOutput
    }
  });
  pythonButton.closestMap[".window"] = pythonWindow;

  const pythonApp = new PythonApp({ windowEl: pythonWindow });
  const pythonContent = pythonApp.getWindowContent();
  assert.equal(pythonContent.includes("onclick="), false);
  pythonEditor.value = "";
  pythonApp.mount();
  assert.equal(pythonButton.eventListeners.get("click").length, 1);
  await pythonButton.dispatch("click");
  assert.equal(pythonOutput.innerHTML, "<pre>No script provided.</pre>");
});

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
  assert.equal(globalThis.window.handleConsoleKey, undefined);
  assert.equal(globalThis.window.runCompiler, undefined);
  assert.equal(globalThis.window.runPython, undefined);
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

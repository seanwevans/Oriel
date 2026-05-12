import assert from "node:assert/strict";
import { test } from "node:test";

class FakeClassList {
  constructor(element) {
    this.element = element;
    this.classes = new Set();
  }

  add(...classes) {
    classes.forEach((className) => this.classes.add(className));
  }

  contains(className) {
    return this.classes.has(className);
  }

  remove(...classes) {
    classes.forEach((className) => this.classes.delete(className));
  }

  toggle(className, force) {
    if (force === true) {
      this.classes.add(className);
      return true;
    }
    if (force === false) {
      this.classes.delete(className);
      return false;
    }
    if (this.classes.has(className)) {
      this.classes.delete(className);
      return false;
    }
    this.classes.add(className);
    return true;
  }
}

class FakeElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.attributes = new Map();
    this.dataset = {};
    this.style = {};
    this.classList = new FakeClassList(this);
    this.eventListeners = new Map();
    this.tabIndex = -1;
    this._textContent = "";
    this._innerHTML = "";
  }

  set className(value) {
    this.classList = new FakeClassList(this);
    String(value)
      .split(/\s+/)
      .filter(Boolean)
      .forEach((className) => this.classList.add(className));
  }

  get className() {
    return Array.from(this.classList.classes).join(" ");
  }

  set textContent(value) {
    this.children = [];
    this._innerHTML = "";
    this._textContent = String(value);
  }

  get textContent() {
    return this._textContent + this.children.map((child) => child.textContent).join("");
  }

  set innerText(value) {
    this.textContent = value;
  }

  get innerText() {
    return this.textContent;
  }

  set innerHTML(value) {
    this.children = [];
    this._textContent = "";
    this._innerHTML = String(value);
  }

  get innerHTML() {
    return this._innerHTML;
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  remove() {
    if (!this.parentNode) return;
    const siblings = this.parentNode.children;
    const index = siblings.indexOf(this);
    if (index >= 0) siblings.splice(index, 1);
    this.parentNode = null;
  }

  get offsetLeft() {
    return parseInt(this.style.left || "0", 10) || 0;
  }

  get offsetTop() {
    return parseInt(this.style.top || "0", 10) || 0;
  }

  getBoundingClientRect() {
    return {
      left: this.offsetLeft,
      top: this.offsetTop,
      width: parseInt(this.style.width || "0", 10) || 0,
      height: parseInt(this.style.height || "0", 10) || 0
    };
  }

  replaceChildren(...children) {
    this.children = [];
    this._textContent = "";
    this._innerHTML = "";
    children.forEach((child) => this.appendChild(child));
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  addEventListener(type, listener) {
    if (!this.eventListeners.has(type)) this.eventListeners.set(type, []);
    this.eventListeners.get(type).push(listener);
  }

  dispatchEvent(event) {
    event.target ??= this;
    for (const listener of this.eventListeners.get(event.type) ?? []) {
      listener(event);
    }
  }

  focus() {}
  blur() {}
  getContext() {
    return {};
  }

  matches(selector) {
    if (selector.startsWith(".")) return this.classList.contains(selector.slice(1));
    return this.tagName.toLowerCase() === selector.toLowerCase();
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  querySelectorAll(selector) {
    const nthChildMatch = selector.match(/^(\.[\w-]+):nth-child\((\d+)\)$/);
    const matchesSelector = (element) => {
      if (nthChildMatch) {
        const [, classSelector, index] = nthChildMatch;
        const siblings = element.parentNode?.children ?? [];
        return (
          element.classList.contains(classSelector.slice(1)) &&
          siblings.indexOf(element) === Number(index) - 1
        );
      }
      return element.matches(selector);
    };

    const results = [];
    const visit = (element) => {
      for (const child of element.children) {
        if (matchesSelector(child)) results.push(child);
        visit(child);
      }
    };
    visit(this);
    return results;
  }

  closest(selector) {
    let current = this;
    while (current) {
      if (current.matches(selector)) return current;
      current = current.parentNode;
    }
    return null;
  }
}

const originalDocument = globalThis.document;
const originalNode = globalThis.Node;
const originalLocalStorage = globalThis.localStorage;
const originalWindow = globalThis.window;
const originalKernel = globalThis.kernel;

function createTestKernel() {
  return {
    processes: [],
    registerProcess(pid, name) {
      this.processes.push({ pid, name, state: "READY", priority: 1, cpuTime: 0 });
    },
    unregisterProcess(pid) {
      const index = this.processes.findIndex((process) => process.pid === pid);
      if (index >= 0) this.processes.splice(index, 1);
    }
  };
}

const testKernel = createTestKernel();
globalThis.kernel = testKernel;
globalThis.window = { kernel: testKernel };

globalThis.localStorage = {
  getItem() {
    return null;
  },
  setItem() {},
  removeItem() {}
};
globalThis.Node = FakeElement;
globalThis.document = {
  createElement(tagName) {
    return new FakeElement(tagName);
  },
  getElementById(id) {
    const element = new FakeElement(id.includes("canvas") ? "canvas" : "div");
    element.id = id;
    return element;
  },
  querySelectorAll() {
    return [];
  }
};

const { WindowManager } = await import("./windowManager.js");
const { createRuntimeIconElement } = await import("./apps/programManager.js");

test.after(() => {
  globalThis.document = originalDocument;
  globalThis.Node = originalNode;
  globalThis.localStorage = originalLocalStorage;
  globalThis.window = originalWindow;
  globalThis.kernel = originalKernel;
});

function createTestWindowManager() {
  const wm = Object.create(WindowManager.prototype);
  wm.windows = [];
  wm.nextWindowId = 1;
  wm.addKeyboardActivation = WindowManager.prototype.addKeyboardActivation;
  wm.setupMenuBar = WindowManager.prototype.setupMenuBar;
  wm.startDrag = () => {};
  wm.startResize = () => {};
  wm.focusWindow = () => {};
  wm.closeWindowCalls = [];
  wm.minimizeWindowCalls = [];
  wm.maximizeWindowCalls = [];
  wm.closeWindow = (id) => wm.closeWindowCalls.push(id);
  wm.minimizeWindow = (id) => wm.minimizeWindowCalls.push(id);
  wm.maximizeWindow = (id) => wm.maximizeWindowCalls.push(id);
  return wm;
}

function createOpenWindowManager({ appInstance = null, initializer = null } = {}) {
  const wm = createTestWindowManager();
  const kernel = createTestKernel();
  wm.desktop = new FakeElement("div");
  wm.minimizedContainer = new FakeElement("div");
  wm.highestZ = 100;
  wm.isRestoring = false;
  wm.services = { kernel, windowManager: wm };
  wm.appRegistry = {
    createApp(_type, args) {
      wm.createAppArgs = args;
      return appInstance;
    },
    resolve() {
      return initializer;
    },
    getRuntimeInitializer() {
      return initializer;
    }
  };
  wm.appHost = {
    mountCalls: [],
    unmountCalls: [],
    mount({ winObj }) {
      this.mountCalls.push(winObj.id);
      return null;
    },
    mountInstance({ appInstance: mountedInstance, winEl, winObj }) {
      this.mountCalls.push(winObj.id);
      mountedInstance.setWindowElement?.(winEl);
      const result = mountedInstance.mount?.();
      if (result && typeof result.then === "function") {
        winObj.appInstance = mountedInstance;
        winEl.appInstance = mountedInstance;
        return result.then((resolved) => {
          winObj.appInstance = resolved || mountedInstance;
          winEl.appInstance = winObj.appInstance;
          return winObj.appInstance;
        });
      }
      winObj.appInstance = result || mountedInstance;
      winEl.appInstance = winObj.appInstance;
      return winObj.appInstance;
    },
    unmount(winObj) {
      this.unmountCalls.push(winObj.id);
      winObj.appInstance?.dispose?.();
      winObj.appInstance = null;
    }
  };
  wm.saveCalls = 0;
  wm.saveDesktopState = () => {
    wm.saveCalls += 1;
  };
  wm.getIconForType = () => "";
  wm.getIconElementForType = () => new FakeElement("span");
  wm.focusWindow = () => {};
  wm.closeWindow = WindowManager.prototype.closeWindow;
  wm.minimizeWindow = WindowManager.prototype.minimizeWindow;
  wm.maximizeWindow = WindowManager.prototype.maximizeWindow;
  wm.restoreWindow = WindowManager.prototype.restoreWindow;
  wm.getTopWindowByZ = WindowManager.prototype.getTopWindowByZ;
  wm.getWindowRectSnapshot = WindowManager.prototype.getWindowRectSnapshot;
  wm.getStatePersistence = WindowManager.prototype.getStatePersistence;
  wm.getWindowStateSnapshot = WindowManager.prototype.getWindowStateSnapshot;
  return wm;
}

function deferred() {
  let resolve;
  const promise = new Promise((next) => {
    resolve = next;
  });
  return { promise, resolve };
}

test("createWindowDOM renders a hostile title as text, not markup", () => {
  const wm = createTestWindowManager();
  const hostileTitle = "<img src=x onerror=alert(1)>";

  const win = wm.createWindowDOM("hostile-id", "notes", hostileTitle, 320, 240, "");

  assert.equal(win.querySelector(".title-bar-text").textContent, hostileTitle);
  assert.equal(win.querySelector("img"), null);
  assert.equal(win.dataset.title, hostileTitle);
  assert.equal(win.getAttribute("aria-label"), hostileTitle);
});

test("createWindowDOM wires window controls with event listeners", () => {
  const wm = createTestWindowManager();
  const win = wm.createWindowDOM("event-id", "notes", "Safe", 320, 240, "");

  win.querySelector(".sys-box").dispatchEvent({ type: "click" });
  win.querySelector(".win-btn:nth-child(1)").dispatchEvent({ type: "click" });
  win.querySelector(".win-btn:nth-child(2)").dispatchEvent({ type: "click" });

  assert.deepEqual(wm.closeWindowCalls, ["event-id"]);
  assert.deepEqual(wm.minimizeWindowCalls, ["event-id"]);
  assert.deepEqual(wm.maximizeWindowCalls, ["event-id"]);
});


test("maximize restore captures fresh geometry after move and resize", () => {
  const wm = createTestWindowManager();
  wm.maximizeWindow = WindowManager.prototype.maximizeWindow;
  wm.saveDesktopState = () => {};
  wm.focusWindow = () => {};

  const winEl = wm.createWindowDOM("max-id", "notes", "Max Test", 320, 240, "");
  winEl.style.top = "24px";
  winEl.style.left = "36px";
  winEl.style.width = "320px";
  winEl.style.height = "240px";
  const win = { id: "max-id", el: winEl, maximized: false, prevRect: null, minimized: false };
  wm.windows = [win];

  wm.maximizeWindow("max-id");
  wm.maximizeWindow("max-id");

  assert.deepEqual(
    {
      top: winEl.style.top,
      left: winEl.style.left,
      width: winEl.style.width,
      height: winEl.style.height
    },
    { top: "24px", left: "36px", width: "320px", height: "240px" }
  );
  assert.equal(win.prevRect, null);

  winEl.style.top = "72px";
  winEl.style.left = "84px";
  winEl.style.width = "480px";
  winEl.style.height = "300px";

  wm.maximizeWindow("max-id");
  wm.maximizeWindow("max-id");

  assert.deepEqual(
    {
      top: winEl.style.top,
      left: winEl.style.left,
      width: winEl.style.width,
      height: winEl.style.height
    },
    { top: "72px", left: "84px", width: "480px", height: "300px" }
  );
  assert.equal(win.prevRect, null);
});

test("openWindow generates unique IDs when Date.now is fixed", () => {
  const originalDateNow = Date.now;
  Date.now = () => 1234567890;
  testKernel.processes = [];

  try {
    const wm = createTestWindowManager();
    wm.desktop = new FakeElement("div");
    wm.minimizedContainer = new FakeElement("div");
    wm.highestZ = 100;
    wm.isRestoring = false;
    wm.appRegistry = {
      createApp() {
        return null;
      },
      resolve() {
        return null;
      },
      getRuntimeInitializer() {
        return false;
      }
    };
    wm.appHost = {
      mount() {},
      mountInstance() {},
      unmount() {}
    };
    wm.saveDesktopState = () => {};
    wm.getIconForType = () => "";
    wm.getIconElementForType = () => new FakeElement("span");
    wm.focusWindow = () => {};
    wm.closeWindow = WindowManager.prototype.closeWindow;
    wm.minimizeWindow = WindowManager.prototype.minimizeWindow;
    wm.restoreWindow = WindowManager.prototype.restoreWindow;
    wm.getTopWindowByZ = WindowManager.prototype.getTopWindowByZ;
    wm.getWindowRectSnapshot = WindowManager.prototype.getWindowRectSnapshot;

    const restored = wm.openWindow("notepad", "Restored", 320, 240, null, {
      id: "restored-id",
      minimized: true
    });
    const duplicateRestore = wm.openWindow("calc", "Duplicate Restored", 320, 240, null, {
      id: "restored-id",
      minimized: true
    });
    const generatedA = wm.openWindow("paint", "Generated A", 320, 240, null, {
      minimized: true
    });
    const generatedB = wm.openWindow("write", "Generated B", 320, 240, null, {
      minimized: true
    });

    const windows = [restored, duplicateRestore, generatedA, generatedB];
    const windowIds = windows.map((win) => win.id);
    const datasetIds = windows.map((win) => win.el.dataset.id);
    const minimizedIconIds = wm.minimizedContainer.children.map((icon) => icon.id);
    const processIds = testKernel.processes.map((process) => process.pid);

    assert.equal(restored.id, "restored-id");
    assert.notEqual(duplicateRestore.id, "restored-id");
    assert.equal(new Set(windowIds).size, windows.length);
    assert.deepEqual(datasetIds, windowIds);
    assert.equal(new Set(minimizedIconIds).size, minimizedIconIds.length);
    assert.deepEqual(minimizedIconIds, windowIds.map((id) => `min-${id}`));
    assert.equal(new Set(processIds).size, processIds.length);
    assert.deepEqual(processIds, windowIds);
  } finally {
    Date.now = originalDateNow;
    testKernel.processes = [];
  }
});

test("openWindow renders app content, registers a process, and persists state", () => {
  const appInstance = {
    getWindowContent() {
      const content = new FakeElement("section");
      content.textContent = "Mounted content";
      return content;
    },
    mount() {
      return this;
    },
    setWindowElement(winEl) {
      this.windowEl = winEl;
    }
  };
  const wm = createOpenWindowManager({ appInstance });

  const win = wm.openWindow("notes", "Notes", 320, 240, { text: "hello" });

  assert.equal(win.id, "win-1");
  assert.equal(win.type, "notes");
  assert.equal(wm.desktop.children[0], win.el);
  assert.equal(wm.createAppArgs.initData.text, "hello");
  assert.equal(wm.createAppArgs.services.windowManager, wm);
  assert.deepEqual(wm.services.kernel.processes, [
    { pid: "win-1", name: "Notes", state: "READY", priority: 1, cpuTime: 0 }
  ]);
  assert.equal(wm.saveCalls, 1);
  assert.equal(appInstance.windowEl, win.el);
  assert.equal(win.appInstance, appInstance);
});

test("openWindow tracks async app mount promises until resolution", async () => {
  const ready = deferred();
  const resolvedInstance = { mounted: true };
  const appInstance = {
    getWindowContent: () => "Loading",
    mount: () => ready.promise,
    setWindowElement(winEl) {
      this.windowEl = winEl;
    }
  };
  const wm = createOpenWindowManager({ appInstance });

  const win = wm.openWindow("async", "Async", 320, 240);

  assert.equal(win.pendingMountPromise, win.el.pendingMountPromise);
  assert.ok(win.pendingMountPromise instanceof Promise);
  assert.equal(win.appInstance, appInstance);

  ready.resolve(resolvedInstance);
  await win.pendingMountPromise;
  assert.equal(win.appInstance, resolvedInstance);
});

test("closeWindow unmounts apps, removes windows, unregisters processes, and saves", () => {
  let disposed = false;
  const appInstance = {
    getWindowContent: () => "Closable",
    mount: () => appInstance,
    dispose: () => {
      disposed = true;
    }
  };
  const wm = createOpenWindowManager({ appInstance });
  const win = wm.openWindow("close-me", "Close Me", 320, 240);
  wm.saveCalls = 0;

  wm.closeWindow(win.id);

  assert.equal(disposed, true);
  assert.deepEqual(wm.appHost.unmountCalls, [win.id]);
  assert.equal(wm.desktop.children.includes(win.el), false);
  assert.equal(wm.windows.length, 0);
  assert.deepEqual(wm.services.kernel.processes, []);
  assert.equal(wm.saveCalls, 1);
});

test("state snapshots persist minimized last geometry and active z-index", () => {
  const wm = createOpenWindowManager();
  wm.highestZ = 123;
  const winEl = wm.createWindowDOM("snap", "notes", "Snap", 320, 240, "");
  winEl.style.left = "20px";
  winEl.style.top = "30px";
  winEl.style.width = "320px";
  winEl.style.height = "240px";
  winEl.style.zIndex = "222";
  const win = {
    id: "snap",
    el: winEl,
    type: "notes",
    title: "Snap",
    minimized: true,
    maximized: false,
    prevRect: null,
    lastRect: { left: 7, top: 8, width: 90, height: 91 }
  };
  wm.windows = [win];

  assert.deepEqual(wm.getWindowStateSnapshot(), [
    {
      id: "snap",
      type: "notes",
      title: "Snap",
      left: 7,
      top: 8,
      width: 90,
      height: 91,
      minimized: true,
      maximized: false,
      prevRect: null,
      zIndex: 222
    }
  ]);
});

test("restored minimized and maximized windows apply saved state overrides", () => {
  const wm = createOpenWindowManager();
  wm.getProgramDefaults = () => ({ title: "Restored", width: 500, height: 400 });
  const minimized = [];
  const maximized = [];
  wm.minimizeWindow = (id) => minimized.push(id);
  wm.maximizeWindow = (id) => maximized.push(id);
  wm.openWindow = WindowManager.prototype.openWindow;

  wm.restoreWindows([
    {
      id: "restored-a",
      type: "notes",
      title: "Restored A",
      left: 11,
      top: 12,
      width: 333,
      height: 222,
      minimized: true,
      maximized: true,
      prevRect: { left: "1px" },
      zIndex: 444
    }
  ]);

  assert.equal(wm.windows[0].id, "restored-a");
  assert.equal(wm.windows[0].el.style.left, "11px");
  assert.equal(wm.windows[0].el.style.top, "12px");
  assert.equal(wm.windows[0].el.style.width, "333px");
  assert.equal(wm.windows[0].el.style.height, "222px");
  assert.equal(wm.windows[0].el.style.zIndex, 444);
  assert.deepEqual(wm.windows[0].prevRect, { left: "1px" });
  assert.deepEqual(maximized, ["restored-a"]);
  assert.deepEqual(minimized, ["restored-a"]);
});

test("renderRuntimeError renders hostile error messages as text", () => {
  const wm = createTestWindowManager();
  const win = wm.createWindowDOM("error-id", "runtime", "Runtime", 320, 240, "");
  const hostileMessage = "<img src=x onerror=alert(1)>";

  wm.renderRuntimeError(win, new Error(hostileMessage));

  const errorEl = win.querySelector(".runtime-error");
  assert.equal(errorEl.textContent, `Unable to start app: ${hostileMessage}`);
  assert.equal(win.querySelector("img"), null);
});

test("Cardfile content exposes the controls its initializer wires", () => {
  const wm = createTestWindowManager();
  const content = wm.getCardfileContent();

  assert.match(content, /id="card-add"/);
  assert.match(content, /id="card-del"/);
  assert.doesNotMatch(content, /id="card-add-btn"/);
  assert.doesNotMatch(content, /id="card-del-btn"/);
});

test("minimizing the active window hides it and activates the next visible window", () => {
  const wm = createTestWindowManager();
  wm.highestZ = 102;
  wm.minimizedContainer = new FakeElement("div");
  wm.saveDesktopState = () => {};
  wm.getIconForType = () => "";
  wm.getIconElementForType = () => new FakeElement("span");
  wm.focusWindow = WindowManager.prototype.focusWindow;
  wm.minimizeWindow = WindowManager.prototype.minimizeWindow;
  wm.getTopWindowByZ = WindowManager.prototype.getTopWindowByZ;
  wm.getWindowRectSnapshot = WindowManager.prototype.getWindowRectSnapshot;

  const first = wm.createWindowDOM("first", "notes", "First", 320, 240, "");
  const second = wm.createWindowDOM("second", "calc", "Second", 320, 240, "");
  first.style.zIndex = "101";
  second.style.zIndex = "102";
  second.classList.add("active");
  wm.windows = [
    { id: "first", el: first, type: "notes", title: "First", minimized: false },
    { id: "second", el: second, type: "calc", title: "Second", minimized: false }
  ];

  wm.minimizeWindow("second");

  assert.equal(second.style.display, "none");
  assert.equal(wm.windows[1].minimized, true);
  assert.equal(second.classList.contains("active"), false);
  assert.equal(first.classList.contains("active"), true);
  assert.equal(wm.minimizedContainer.children.length, 1);
});

test("minimized runtime icon manifest quotes stay in image properties", () => {
  const wm = createTestWindowManager();
  const manifest = {
    icon: 'https://example.test/icon" onerror="alert(1).png',
    name: 'Quoted App" onclick="alert(1)'
  };
  const win = wm.createWindowDOM("runtime-id", "runtime-app", "Runtime", 320, 240, "");

  wm.minimizedContainer = new FakeElement("div");
  wm.windows = [
    { id: "runtime-id", el: win, type: "runtime-app", title: "Runtime", minimized: false }
  ];
  wm.saveDesktopState = () => {};
  wm.restoreWindow = () => {};
  wm.getTopWindowByZ = () => null;
  wm.getWindowRectSnapshot = WindowManager.prototype.getWindowRectSnapshot;
  wm.getIconElementForType = (type) => createRuntimeIconElement(manifest, type);
  wm.minimizeWindow = WindowManager.prototype.minimizeWindow;

  wm.minimizeWindow("runtime-id");

  const minimizedIcon = wm.minimizedContainer.children[0];
  const iconImage = minimizedIcon.querySelector(".icon-img");
  const img = iconImage.querySelector("img");

  assert.equal(iconImage.innerHTML, "");
  assert.equal(img.src, manifest.icon);
  assert.equal(img.alt, `${manifest.name} icon`);
  assert.equal(img.getAttribute("onerror"), null);
  assert.equal(img.getAttribute("onclick"), null);
  assert.equal(img.className, "runtime-icon");
});

test("top window lookup and shortcuts ignore minimized windows", () => {
  const wm = createTestWindowManager();
  const visible = wm.createWindowDOM("visible", "notes", "Visible", 320, 240, "");
  const hidden = wm.createWindowDOM("hidden", "calc", "Hidden", 320, 240, "");
  visible.style.zIndex = "10";
  hidden.style.zIndex = "999";
  wm.windows = [
    { id: "visible", el: visible, type: "notes", title: "Visible", minimized: false },
    { id: "hidden", el: hidden, type: "calc", title: "Hidden", minimized: true }
  ];

  assert.equal(wm.getTopWindowByZ().id, "visible");
  assert.equal(wm.getTopWindowByZ({ includeMinimized: true }).id, "hidden");

  const event = {
    altKey: true,
    key: "F4",
    defaultPrevented: false,
    preventDefault() {
      this.defaultPrevented = true;
    }
  };
  WindowManager.prototype.handleWindowShortcuts.call(wm, event);

  assert.equal(event.defaultPrevented, true);
  assert.deepEqual(wm.closeWindowCalls, ["visible"]);
});

test("Notepad file content remains textarea value text", () => {
  const wm = createTestWindowManager();
  const hostileText = "notes </textarea> \"quoted\" <img src=x onerror=alert(1)>";

  const content = wm.getNotepadContent({
    text: hostileText,
    nativeFileHandle: { createWritable() {} }
  });
  const win = wm.createWindowDOM("notepad-hostile", "notepad", "note.txt", 320, 240, content);

  assert.equal(win.querySelector(".notepad-area").value, hostileText);
  assert.equal(win.querySelector(".notepad-status").textContent, "");
  assert.equal(win.querySelector("img"), null);
});

test("Markdown file content remains textarea value text", () => {
  const wm = createTestWindowManager();
  const hostileText = "# Title\n</textarea> \"quoted\" <img src=x onerror=alert(1)>";

  const content = wm.getMarkdownContent(hostileText);
  const win = wm.createWindowDOM("markdown-hostile", "markdown", "README.md", 320, 240, content);

  assert.equal(win.querySelector(".md-input").value, hostileText);
  assert.equal(win.querySelector(".md-preview").textContent, "");
  assert.equal(win.querySelector("img"), null);
});

test("PDF reader file name and source are assigned without HTML interpolation", () => {
  const wm = createTestWindowManager();
  const hostileName = "manual </textarea> \"quoted\" <img src=x onerror=alert(1)>.pdf";
  const hostileSrc = 'https://example.test/manual.pdf?name="quoted"&literal=<img>';

  const content = wm.getPdfReaderContent({ name: hostileName, src: hostileSrc });
  const win = wm.createWindowDOM("pdf-hostile", "pdfreader", hostileName, 320, 240, content);

  assert.equal(win.querySelector(".pdf-status").textContent, `Loaded ${hostileName}`);
  assert.equal(win.querySelector(".pdf-frame").src, hostileSrc);
  assert.equal(win.querySelector(".pdf-url-input").value, "");
  assert.equal(win.querySelector("img"), null);
});

test("Image viewer file name and URL remain DOM property values", () => {
  const wm = createTestWindowManager();
  const hostileName = "photo </textarea> \"quoted\" <img src=x onerror=alert(1)>.png";
  const hostileSrc = 'data:image/png;base64,PHRleHQ+IjwvaW1nPiI=';

  const content = wm.getImageViewerContent({ name: hostileName, src: hostileSrc });
  const win = wm.createWindowDOM("image-hostile", "imageviewer", hostileName, 320, 240, content);
  const preview = win.querySelector(".img-preview");

  assert.equal(win.querySelector(".img-status").textContent, `Loaded ${hostileName}`);
  assert.equal(win.querySelector(".img-url-input").value, hostileSrc);
  assert.equal(preview.src, hostileSrc);
  assert.equal(preview.alt, hostileName);
  assert.equal(win.querySelectorAll("img").length, 1);
});

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
  }
};

const { WindowManager } = await import("./windowManager.js");

test.after(() => {
  globalThis.document = originalDocument;
  globalThis.Node = originalNode;
  globalThis.localStorage = originalLocalStorage;
});

function createTestWindowManager() {
  const wm = Object.create(WindowManager.prototype);
  wm.windows = [];
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

test("browser sandbox omits script and pointer-lock capabilities", () => {
  const wm = createTestWindowManager();
  const originalGetBrowserPlaceholder = globalThis.getBrowserPlaceholder;
  globalThis.getBrowserPlaceholder = () => "Enter URL";
  let content;
  try {
    content = wm.getBrowserContent();
  } finally {
    if (originalGetBrowserPlaceholder === undefined) delete globalThis.getBrowserPlaceholder;
    else globalThis.getBrowserPlaceholder = originalGetBrowserPlaceholder;
  }

  assert.match(content, /sandbox="allow-forms allow-popups"/);
  assert.doesNotMatch(content, /allow-scripts/);
  assert.doesNotMatch(content, /allow-pointer-lock/);
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

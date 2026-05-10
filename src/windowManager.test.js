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

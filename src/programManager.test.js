import assert from "node:assert/strict";
import { test } from "node:test";
import { ICONS } from "./icons.js";
import { getIconForType, getProgramManagerContent, refreshProgramManagerContent } from "./apps/programManager.js";

class FakeElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.attributes = new Map();
    this.className = "";
    this.textContent = "";
    this.parentNode = null;
    this.tabIndex = -1;
    this._innerHTML = "";
    this.listeners = new Map();
  }

  get() {
    return `HTML${this.tagName[0]}${this.tagName.slice(1).toLowerCase()}Element`;
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(value) {
    this.children = [];
    this._innerHTML = String(value);
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  addEventListener(type, listener) {
    this.listeners.set(type, listener);
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  setAttribute(name, value) {
    this.attributes.set(name, value);
  }

  addEventListener(name, listener) {
    this.listeners.set(name, listener);
  }
}

function withFakeDocument(callback) {
  const originalDocument = globalThis.document;
  globalThis.document = {
    createElement(tagName) {
      if (tagName === "template") {
        return {
          content: { firstElementChild: null },
          set innerHTML(value) {
            this.content.firstElementChild = { markup: value };
          }
        };
      }
      return new FakeElement(tagName);
    },
    createTextNode(text) {
      return { text };
    }
  };

  try {
    return callback();
  } finally {
    globalThis.document = originalDocument;
  }
}

function findProgramIcon(grid, labelText) {
  return grid.children.find((iconButton) =>
    iconButton.children.some((child) => child.className === "prog-label" && child.textContent === labelText)
  );
}

test("getIconForType uses program default icon keys before falling back to type keys", () => {
  assert.equal(getIconForType("clipbrd"), ICONS.clipboard);
  assert.equal(getIconForType("compiler"), ICONS.ccompiler);
});

test("program manager renders default icons for programs whose type differs from icon key", () => {
  withFakeDocument(() => {
    const grid = getProgramManagerContent({ openWindow() {} });

    const clipboardIcon = findProgramIcon(grid, "Clipboard");
    const compilerIcon = findProgramIcon(grid, "Tiny C");

    assert.equal(clipboardIcon.children[0].markup, ICONS.clipboard.trim());
    assert.equal(compilerIcon.children[0].markup, ICONS.ccompiler.trim());
  });
    child.parentNode = this;
    this._innerHTML = "";
    return child;
  }

  replaceChildren(...nodes) {
    this.children = [];
    this._innerHTML = "";
    nodes.forEach((node) => this.appendChild(node));
  }

  querySelector(selector) {
    if (selector.startsWith(".")) {
      const className = selector.slice(1);
      return this.find((node) =>
        node.className
          .split(/\s+/)
          .filter(Boolean)
          .includes(className)
      );
    }
    return null;
  }

  find(predicate) {
    if (predicate(this)) return this;
    for (const child of this.children) {
      if (typeof child.find !== "function") continue;
      const found = child.find(predicate);
      if (found) return found;
    }
    return null;
  }
}

class FakeTemplateElement extends FakeElement {
  constructor() {
    super("template");
    this.content = { firstElementChild: null };
  }

  set innerHTML(value) {
    this._innerHTML = String(value);
    const tagMatch = this._innerHTML.match(/^<\s*([a-z0-9-]+)/i);
    this.content.firstElementChild = new FakeElement(tagMatch?.[1] || "span");
  }
}

function createFakeDocument() {
  return {
    createElement(tagName) {
      if (tagName === "template") return new FakeTemplateElement();
      return new FakeElement(tagName);
    },
    createTextNode(text) {
      const node = new FakeElement("#text");
      node.textContent = String(text);
      return node;
    }
  };
}

test("refreshProgramManagerContent appends the Program Manager DOM node", () => {
  const originalDocument = globalThis.document;
  const originalWindow = globalThis.window;

  globalThis.document = createFakeDocument();
  globalThis.window = { location: { origin: "https://example.test" } };

  try {
    const contentArea = document.createElement("div");
    contentArea.className = "window-body";
    contentArea.innerHTML = "old content";

    const windowEl = document.createElement("div");
    windowEl.appendChild(contentArea);

    refreshProgramManagerContent({
      windows: [{ type: "progman", el: windowEl }],
      openWindow() {}
    });

    assert.ok(contentArea.querySelector(".prog-man-grid"));
    assert.notEqual(contentArea.innerHTML, "[object HTMLDivElement]");
  } finally {
    globalThis.document = originalDocument;
    globalThis.window = originalWindow;
  }
});

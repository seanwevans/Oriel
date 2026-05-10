import assert from "node:assert/strict";
import { test } from "node:test";

import { refreshProgramManagerContent } from "./apps/programManager.js";

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

  get [Symbol.toStringTag]() {
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

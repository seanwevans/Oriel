import assert from "node:assert/strict";
import { test } from "node:test";

class FakeElement {
  constructor(tagName = "div") {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.parentElement = null;
    this._textContent = "";
    this.value = "";
    this.className = "";
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  // Mirrors the innerHTML tag-parsing approach used in database.test.js so
  // markup smuggled into strings shows up as child elements.
  set innerHTML(value) {
    this.children = [];
    this._innerHTML = value;

    const tagPattern = /<\s*([a-z][\w-]*)\b[^>]*>/gi;
    let match;
    while ((match = tagPattern.exec(value)) !== null) {
      this.appendChild(new FakeElement(match[1]));
    }
  }

  get innerHTML() {
    return this._innerHTML || "";
  }

  set textContent(value) {
    this._textContent = String(value ?? "");
    this.children = [];
  }

  get textContent() {
    return this._textContent;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  querySelectorAll(selector) {
    const matches = [];
    const visit = (element) => {
      if (matchesSelector(element, selector)) matches.push(element);
      for (const child of element.children) visit(child);
    };
    visit(this);
    return matches;
  }
}

function matchesSelector(element, selector) {
  if (selector.startsWith("#")) return element.id === selector.slice(1);
  return element.tagName.toLowerCase() === selector.toLowerCase();
}

function withFakeDom(fn) {
  const originalDocument = globalThis.document;
  const originalLocalStorage = globalThis.localStorage;

  globalThis.document = {
    createElement(tagName) {
      return new FakeElement(tagName);
    }
  };
  globalThis.localStorage = {
    values: new Map(),
    getItem(key) {
      return this.values.get(key) ?? null;
    },
    setItem(key, value) {
      this.values.set(key, value);
    }
  };

  try {
    return fn();
  } finally {
    globalThis.document = originalDocument;
    globalThis.localStorage = originalLocalStorage;
  }
}

const { initCardfile } = await import("./cardfile.js");

function createCardfileWindow() {
  const windowElement = new FakeElement("div");
  windowElement.className = "window";

  for (const id of [
    "card-index-list",
    "card-header-display",
    "card-content-edit",
    "card-add",
    "card-del"
  ]) {
    const el = new FakeElement("div");
    el.id = id;
    windowElement.appendChild(el);
  }

  return windowElement;
}

test("cardfile index renders card headers as text, not markup", () => {
  withFakeDom(() => {
    const header = '<img src=x onerror="alert(1)">Rolodex';
    localStorage.setItem(
      "w31-cards",
      JSON.stringify([{ id: 1, header, content: "" }])
    );
    const windowElement = createCardfileWindow();

    initCardfile(windowElement);

    const list = windowElement.querySelector("#card-index-list");
    assert.equal(list.querySelector("img"), null);

    const label = list.querySelector("span");
    assert.equal(label.textContent, header);
  });
});

test("cardfile index labels blank headers", () => {
  withFakeDom(() => {
    localStorage.setItem(
      "w31-cards",
      JSON.stringify([{ id: 1, header: "", content: "" }])
    );
    const windowElement = createCardfileWindow();

    initCardfile(windowElement);

    const label = windowElement.querySelector("#card-index-list").querySelector("span");
    assert.equal(label.textContent, "(blank)");
  });
});

import assert from "node:assert/strict";
import { test } from "node:test";

import { initPostgres } from "./postgres.js";

class FakeElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.parentElement = null;
    this.attributes = {};
    this.eventListeners = {};
    this.id = "";
    this.value = "";
    this.checked = false;
    this._className = "";
    this._textContent = "";
    this._innerHTML = "";
    this.classList = {
      toggle: (className, force) => {
        const classes = new Set(this._className.split(/\s+/).filter(Boolean));
        const shouldAdd = force ?? !classes.has(className);
        if (shouldAdd) classes.add(className);
        else classes.delete(className);
        this.className = Array.from(classes).join(" ");
        return shouldAdd;
      }
    };
  }

  set className(value) {
    this._className = String(value ?? "");
    this.attributes.class = this._className;
  }

  get className() {
    return this._className;
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }

  getAttribute(name) {
    return this.attributes[name] ?? null;
  }

  set innerHTML(value) {
    this.children = [];
    this._innerHTML = String(value ?? "");

    const tagPattern = /<\s*([a-z][\w-]*)\b[^>]*>/gi;
    let match;
    while ((match = tagPattern.exec(this._innerHTML)) !== null) {
      this.appendChild(new FakeElement(match[1]));
    }
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set textContent(value) {
    this._textContent = String(value ?? "");
    this.children = [];
    this._innerHTML = "";
  }

  get textContent() {
    return `${this._textContent}${this.children.map((child) => child.textContent).join("")}`;
  }

  addEventListener(type, handler) {
    this.eventListeners[type] ||= [];
    this.eventListeners[type].push(handler);
  }

  click() {
    for (const handler of this.eventListeners.click || []) {
      handler({ target: this });
    }
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
  if (selector.startsWith(".")) {
    return element.className.split(/\s+/).includes(selector.slice(1));
  }
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
      this.values.set(key, String(value));
    },
    removeItem(key) {
      this.values.delete(key);
    }
  };

  try {
    return fn();
  } finally {
    globalThis.document = originalDocument;
    globalThis.localStorage = originalLocalStorage;
  }
}

function appendElement(parent, tagName, className) {
  const element = new FakeElement(tagName);
  element.className = className;
  parent.appendChild(element);
  return element;
}

function createPostgresWindow() {
  const windowElement = new FakeElement("div");
  appendElement(windowElement, "div", "pg-status");
  const results = appendElement(windowElement, "div", "pg-results");
  appendElement(windowElement, "select", "pg-sample-query");
  appendElement(windowElement, "div", "pg-query-hint");
  const sqlInput = appendElement(windowElement, "textarea", "pg-sql");
  sqlInput.value = "SELECT name, owner, size_mb FROM databases;";
  appendElement(windowElement, "div", "pg-schema-list");
  appendElement(windowElement, "input", "pg-host");
  appendElement(windowElement, "input", "pg-port");
  appendElement(windowElement, "input", "pg-db");
  appendElement(windowElement, "input", "pg-user");
  appendElement(windowElement, "input", "pg-password");
  appendElement(windowElement, "input", "pg-ssl");
  appendElement(windowElement, "button", "pg-save");
  appendElement(windowElement, "button", "pg-reset");
  appendElement(windowElement, "button", "pg-test");
  const runButton = appendElement(windowElement, "button", "pg-run");

  return { results, runButton, sqlInput, windowElement };
}

test("postgres query headers render HTML-like column names as text only", () => {
  withFakeDom(() => {
    const { results, runButton, sqlInput, windowElement } = createPostgresWindow();
    const maliciousColumn = "<img src=x onerror=alert(1)>";

    initPostgres(windowElement);
    sqlInput.value = `SELECT ${maliciousColumn} FROM databases;`;
    runButton.click();

    assert.equal(results.querySelector("img"), null);
    assert.equal(results.querySelector("th").textContent, maliciousColumn);
    assert.match(results.textContent, /<img src=x onerror=alert\(1\)>/);
  });
});

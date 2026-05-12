import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

const storage = new Map();

global.localStorage = {
  getItem: (key) => (storage.has(key) ? storage.get(key) : null),
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: (key) => storage.delete(key)
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

class FakeClassList {
  constructor(element) {
    this.element = element;
    this.classes = new Set();
  }

  add(className) {
    this.classes.add(className);
    this.sync();
  }

  remove(className) {
    this.classes.delete(className);
    this.sync();
  }

  toggle(className, force) {
    const shouldAdd = force ?? !this.classes.has(className);
    if (shouldAdd) this.classes.add(className);
    else this.classes.delete(className);
    this.sync();
    return shouldAdd;
  }

  sync() {
    this.element.className = Array.from(this.classes).join(" ");
  }
}

class FakeElement {
  constructor(tagName, ownerDocument = null) {
    this.tagName = tagName.toLowerCase();
    this.ownerDocument = ownerDocument;
    this.attributes = new Map();
    this.children = [];
    this.dataset = {};
    this.eventListeners = new Map();
    this._textContent = "";
    this._className = "";
    this.classList = new FakeClassList(this);
    this.value = "";
    this.disabled = false;
  }

  set className(value) {
    this._className = String(value);
    if (this._className) this.attributes.set("class", this._className);
    else this.attributes.delete("class");
  }

  get className() {
    return this._className;
  }

  set textContent(value) {
    this._textContent = String(value);
    this.children = [];
  }

  get textContent() {
    return `${this._textContent}${this.children.map((child) => child.textContent).join("")}`;
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  replaceChildren(...nodes) {
    this._textContent = "";
    this.children = nodes;
  }

  addEventListener(type, listener) {
    this.eventListeners.set(type, listener);
  }

  async dispatchEvent(event) {
    const listener = this.eventListeners.get(event.type);
    if (listener) await listener(event);
  }

  querySelector(selector) {
    if (!selector.startsWith(".")) return null;
    const className = selector.slice(1);
    return this.find((node) => node.className.split(/\s+/).includes(className));
  }

  find(predicate) {
    if (predicate(this)) return this;
    for (const child of this.children) {
      const match = child.find(predicate);
      if (match) return match;
    }
    return null;
  }

  get innerHTML() {
    return `${escapeHtml(this._textContent)}${this.children.map((child) => child.outerHTML).join("")}`;
  }

  get outerHTML() {
    const attrs = Array.from(this.attributes, ([name, value]) => ` ${name}="${escapeHtml(value)}"`).join("");
    return `<${this.tagName}${attrs}>${this.innerHTML}</${this.tagName}>`;
  }
}

const fakeDocument = {
  createElement(tagName) {
    return new FakeElement(tagName, fakeDocument);
  }
};

global.document = fakeDocument;

const { initApiClient } = await import("./apiClient.js");

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  storage.clear();
});

function createApiClientWindow() {
  const selectors = {
    ".httpclient-form": fakeDocument.createElement("form"),
    ".httpclient-method": fakeDocument.createElement("select"),
    ".httpclient-url": fakeDocument.createElement("input"),
    ".httpclient-headers-input": fakeDocument.createElement("textarea"),
    ".httpclient-body-input": fakeDocument.createElement("textarea"),
    ".httpclient-send": fakeDocument.createElement("button"),
    ".httpclient-status": fakeDocument.createElement("div"),
    ".httpclient-timing": fakeDocument.createElement("div"),
    ".httpclient-response-body": fakeDocument.createElement("pre"),
    ".httpclient-response-headers": fakeDocument.createElement("div"),
    ".httpclient-preview": fakeDocument.createElement("div")
  };

  selectors[".httpclient-method"].value = "GET";
  selectors[".httpclient-url"].value = "https://example.test/api";

  return {
    selectors,
    querySelector(selector) {
      return selectors[selector] || null;
    }
  };
}

test("API Client response headers render HTML-looking values as literal text", async () => {
  const headerValue = '<img src=x onerror=alert("api")><script>alert(1)</script>';
  const headers = {
    forEach(callback) {
      callback(headerValue, "x-html-looking");
    },
    get(name) {
      return name.toLowerCase() === "content-type" ? "text/plain" : null;
    }
  };

  globalThis.fetch = async () => ({
    status: 200,
    statusText: "OK",
    ok: true,
    headers,
    clone() {
      return { text: async () => "done" };
    },
    text: async () => "done"
  });

  const win = createApiClientWindow();
  initApiClient(win);

  await win.selectors[".httpclient-form"].dispatchEvent({
    type: "submit",
    preventDefault() {}
  });

  const responseHeaders = win.selectors[".httpclient-response-headers"];
  const [line] = responseHeaders.children;

  assert.equal(responseHeaders.children.length, 1);
  assert.equal(line.className, "httpclient-header-line");
  assert.equal(line.children.length, 0);
  assert.equal(line.textContent, `x-html-looking: ${headerValue}`);
  assert.doesNotMatch(responseHeaders.innerHTML, /<img\b/i);
  assert.doesNotMatch(responseHeaders.innerHTML, /<script\b/i);
  assert.match(responseHeaders.innerHTML, /&lt;img src=x onerror=alert\(&quot;api&quot;\)&gt;/);
});

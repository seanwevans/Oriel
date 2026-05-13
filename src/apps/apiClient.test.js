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

  removeEventListener(type, listener) {
    if (this.eventListeners.get(type) === listener) {
      this.eventListeners.delete(type);
    }
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

function createHeaders(contentType = "text/plain", entries = []) {
  return {
    forEach(callback) {
      entries.forEach(([key, value]) => callback(value, key));
    },
    get(name) {
      return name.toLowerCase() === "content-type" ? contentType : null;
    }
  };
}

function createResponse(body, options = {}) {
  const headers = options.headers || createHeaders(options.contentType);
  return {
    status: options.status || 200,
    statusText: options.statusText || "OK",
    ok: options.ok ?? true,
    headers,
    clone() {
      return { text: async () => body };
    },
    text: async () => body
  };
}

function createFakeApp() {
  const disposables = new Set();
  const app = {
    isDisposed: false,
    controllers: [],
    listened: [],
    registerDisposable(disposable) {
      if (app.isDisposed) disposable();
      else disposables.add(disposable);
      return disposable;
    },
    listen(target, type, listener, options) {
      app.listened.push({ target, type, listener, options });
      target.addEventListener(type, listener, options);
      return app.registerDisposable(() => target.removeEventListener(type, listener, options));
    },
    createAbortController() {
      const controller = new AbortController();
      app.controllers.push(controller);
      return app.trackAbortController(controller);
    },
    trackAbortController(controller) {
      app.registerDisposable(() => controller.abort());
      return controller;
    },
    dispose() {
      app.isDisposed = true;
      for (const disposable of [...disposables]) disposable();
      disposables.clear();
    }
  };
  return app;
}

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
  const headers = createHeaders("text/plain", [["x-html-looking", headerValue]]);

  globalThis.fetch = async () => createResponse("done", { headers });

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

test("API Client aborts a pending request and skips stale updates when disposed", async () => {
  let resolveFetch;
  let fetchSignal;

  globalThis.fetch = async (_url, init) => {
    fetchSignal = init.signal;
    return new Promise((resolve) => {
      resolveFetch = () => resolve(createResponse("stale body"));
    });
  };

  const win = createApiClientWindow();
  const app = createFakeApp();
  initApiClient(win, null, null, null, app);

  const submitPromise = win.selectors[".httpclient-form"].dispatchEvent({
    type: "submit",
    preventDefault() {}
  });

  await new Promise((resolve) => setTimeout(resolve, 0));

  assert.equal(app.listened.length, 1);
  assert.equal(app.listened[0].type, "submit");
  assert.equal(app.controllers.length, 1);
  assert.equal(fetchSignal, app.controllers[0].signal);
  assert.equal(fetchSignal.aborted, false);
  assert.equal(win.selectors[".httpclient-status"].textContent, "Waiting for response...");

  app.dispose();

  assert.equal(fetchSignal.aborted, true);

  resolveFetch();
  await submitPromise;

  assert.equal(win.selectors[".httpclient-status"].textContent, "Waiting for response...");
  assert.equal(win.selectors[".httpclient-response-body"].textContent, "");
  assert.notEqual(win.selectors[".httpclient-response-body"].textContent, "stale body");
});

test("API Client aborts the previous pending request for a new submit", async () => {
  const requests = [];

  globalThis.fetch = async (_url, init) => {
    requests.push(init);
    return new Promise(() => {});
  };

  const win = createApiClientWindow();
  const app = createFakeApp();
  initApiClient(win, null, null, null, app);

  win.selectors[".httpclient-form"].dispatchEvent({
    type: "submit",
    preventDefault() {}
  });

  await new Promise((resolve) => setTimeout(resolve, 0));

  win.selectors[".httpclient-form"].dispatchEvent({
    type: "submit",
    preventDefault() {}
  });

  await new Promise((resolve) => setTimeout(resolve, 0));

  assert.equal(requests.length, 2);
  assert.equal(app.controllers.length, 2);
  assert.equal(requests[0].signal, app.controllers[0].signal);
  assert.equal(requests[1].signal, app.controllers[1].signal);
  assert.equal(requests[0].signal.aborted, true);
  assert.equal(requests[1].signal.aborted, false);
});

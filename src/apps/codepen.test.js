import assert from "node:assert/strict";
import { test } from "node:test";

const { getGeneratedEntrySource } = await import("./codepen.js");

class FakeElement {
  constructor(tagName = "div") {
    this.tagName = tagName.toLowerCase();
    this.className = "";
    this.title = "";
    this.loading = "";
    this.allow = "";
    this.src = "";
    this.children = [];
    this.attributes = {};
    this._innerHTML = "";
  }

  set innerHTML(value) {
    this._innerHTML = value;
    if (value === "") this.children = [];
  }

  get innerHTML() {
    return this._innerHTML;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  querySelector(selector) {
    if (selector.startsWith(".")) {
      const cls = selector.slice(1);
      return this._find((el) => el.className.split(/\s+/).includes(cls));
    }
    return this._find((el) => el.tagName === selector.toLowerCase());
  }

  _find(predicate) {
    for (const child of this.children) {
      if (predicate(child)) return child;
      const nested = child._find?.(predicate);
      if (nested) return nested;
    }
    return null;
  }
}

async function importGenerated(source) {
  const url = `data:text/javascript;charset=utf-8,${encodeURIComponent(source)}`;
  return import(url);
}

function withFakeDom(fn) {
  const originalDocument = globalThis.document;
  globalThis.document = {
    createElement(tagName) {
      return new FakeElement(tagName);
    }
  };
  try {
    return fn();
  } finally {
    globalThis.document = originalDocument;
  }
}

test("installed CodePen app renders only the pen iframe, no toolbar chrome", async () => {
  const source = getGeneratedEntrySource({
    appName: "Blorpis",
    embedUrl: "https://codepen.io/goosethe/embed/azmPzyE?default-tab=result"
  });

  const module = await importGenerated(source);

  await withFakeDom(() => {
    const body = new FakeElement("div");
    body.className = "window-body";
    const win = new FakeElement("div");
    win.appendChild(body);

    module.default(win);

    const iframe = body.querySelector("iframe");
    assert.ok(iframe, "expected an embed iframe");
    assert.equal(iframe.src, "https://codepen.io/goosethe/embed/azmPzyE?default-tab=result");
    assert.equal(iframe.title, "Blorpis");

    // The "Open on CodePen" toolbar must be gone.
    assert.equal(body.querySelector(".codepen-installed-toolbar"), null);
    assert.equal(body.querySelector("a"), null);
    assert.equal(body.querySelector("strong"), null);
  });
});

test("generated entry source no longer references the original CodePen URL", () => {
  const source = getGeneratedEntrySource({
    appName: "Dolf",
    embedUrl: "https://codepen.io/goosethe/embed/JoRwJjd?default-tab=result"
  });

  assert.doesNotMatch(source, /Open on CodePen/);
  assert.doesNotMatch(source, /ORIGINAL_URL/);
});

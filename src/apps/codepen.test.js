import assert from "node:assert/strict";
import { test } from "node:test";

const { getGeneratedEntrySource, buildPenDocument } = await import("./codepen.js");

class FakeElement {
  constructor(tagName = "div") {
    this.tagName = tagName.toLowerCase();
    this.className = "";
    this.title = "";
    this.loading = "";
    this.srcdoc = "";
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

test("buildPenDocument compiles html, css, and js into one document", () => {
  const doc = buildPenDocument({
    html: "<main>hi</main>",
    css: ".x{color:red}",
    js: "console.log(1)"
  });

  assert.match(doc, /<!DOCTYPE html>/);
  assert.match(doc, /<style>\n\.x\{color:red\}\n<\/style>/);
  assert.match(doc, /<main>hi<\/main>/);
  assert.match(doc, /console\.log\(1\)/);
});

test("buildPenDocument neutralizes a closing script tag inside js", () => {
  const doc = buildPenDocument({ js: 'document.write("</script>")' });
  // The literal closing tag must be broken so it cannot end the injected block.
  assert.doesNotMatch(doc, /write\("<\/script>"\)/);
  assert.match(doc, /write\("<\\\/script>"\)/);
});

test("installed pen app renders only the srcdoc iframe, no toolbar chrome", async () => {
  const source = getGeneratedEntrySource({
    appName: "Starfield",
    html: "<canvas></canvas>",
    css: "body{margin:0}",
    js: "console.log('go')"
  });

  const module = await importGenerated(source);

  await withFakeDom(() => {
    const body = new FakeElement("div");
    body.className = "window-body";
    const win = new FakeElement("div");
    win.appendChild(body);

    module.default(win);

    const iframe = body.querySelector("iframe");
    assert.ok(iframe, "expected a preview iframe");
    assert.equal(iframe.title, "Starfield");
    assert.match(iframe.srcdoc, /<canvas><\/canvas>/);
    assert.match(iframe.srcdoc, /body\{margin:0\}/);
    assert.match(iframe.srcdoc, /console\.log\('go'\)/);

    // No CodePen chrome or "Open on CodePen" toolbar.
    assert.equal(body.querySelector(".codepen-installed-toolbar"), null);
    assert.equal(body.querySelector("a"), null);
    assert.equal(body.querySelector("strong"), null);
  });
});

test("generated entry source is self-contained and never references CodePen", () => {
  const source = getGeneratedEntrySource({
    appName: "Matrix Rain",
    html: "<canvas></canvas>",
    css: "",
    js: "1"
  });

  assert.doesNotMatch(source, /codepen\.io/i);
  assert.doesNotMatch(source, /cdpn\.io/i);
  assert.doesNotMatch(source, /EMBED_URL/);
  assert.doesNotMatch(source, /Open on CodePen/);
  assert.match(source, /iframe\.srcdoc/);
});

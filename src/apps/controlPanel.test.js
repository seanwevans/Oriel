import assert from "node:assert/strict";
import { test } from "node:test";

let controlPanelModule;

async function importControlPanel() {
  globalThis.localStorage ||= {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  };
  controlPanelModule ||= await import("./controlPanel.js");
  return controlPanelModule;
}

class FakeStyle {
  constructor() {
    this.properties = new Map();
  }

  setProperty(name, value) {
    this.properties.set(name, value);
  }

  getPropertyValue(name) {
    return this.properties.get(name) || "";
  }
}

class FakeElement {
  constructor(tagName = "div") {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.parentElement = null;
    this.id = "";
    this.className = "";
    this.value = "";
    this.checked = false;
    this.textContent = "";
    this.style = new FakeStyle();
    this.attributes = {};
  }

  get classList() {
    return {
      contains: (className) => this.className.split(/\s+/).includes(className)
    };
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  matches(selector) {
    return matchesSelector(this, selector);
  }

  closest(selector) {
    let current = this;
    while (current) {
      if (matchesSelector(current, selector)) return current;
      current = current.parentElement;
    }
    return null;
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

function input(id, value = "") {
  const element = new FakeElement("input");
  element.id = id;
  element.value = value;
  return element;
}

function button() {
  return new FakeElement("button");
}

function createControlPanelWindow() {
  const win = new FakeElement("div");
  win.className = "window";
  const viewArea = new FakeElement("div");
  viewArea.className = "cp-view-area";
  win.appendChild(viewArea);
  return { win, viewArea };
}

async function withFakeDocument(fn) {
  const originalDocument = globalThis.document;
  const originalWindow = globalThis.window;

  const documentElement = new FakeElement("html");
  const head = new FakeElement("head");
  const body = new FakeElement("body");
  const document = {
    documentElement,
    head,
    body,
    createElement: (tagName) => new FakeElement(tagName),
    getElementById(id) {
      return documentElement.querySelector(`#${id}`) || head.querySelector(`#${id}`) || body.querySelector(`#${id}`);
    },
    querySelector(selector) {
      return documentElement.querySelector(selector) || head.querySelector(selector) || body.querySelector(selector);
    }
  };

  globalThis.document = document;
  globalThis.window = {};

  try {
    return await fn({ documentElement, head, body });
  } finally {
    globalThis.document = originalDocument;
    globalThis.window = originalWindow;
  }
}

test("wallpaper Apply buttons read the controls from their own Control Panel window", async () => {
  await withFakeDocument(async ({ body }) => {
    const first = createControlPanelWindow();
    const second = createControlPanelWindow();
    body.appendChild(first.win);
    body.appendChild(second.win);

    first.viewArea.appendChild(input("bg-url", "https://example.test/first.png"));
    first.viewArea.appendChild(input("bg-mode", "contain"));
    const firstApply = first.viewArea.appendChild(button());

    second.viewArea.appendChild(input("bg-url", "https://example.test/second.png"));
    second.viewArea.appendChild(input("bg-mode", "cover"));
    const secondApply = second.viewArea.appendChild(button());

    const { setWallpaper } = await importControlPanel();

    setWallpaper(secondApply);
    assert.equal(body.style.backgroundImage, "url('https://example.test/second.png')");
    assert.equal(body.style.backgroundSize, "cover");

    setWallpaper(firstApply);
    assert.equal(body.style.backgroundImage, "url('https://example.test/first.png')");
  });
});

test("font Apply buttons update the clicked window preview after reading scoped controls", async () => {
  await withFakeDocument(async ({ documentElement, body }) => {
    const first = createControlPanelWindow();
    const second = createControlPanelWindow();
    body.appendChild(first.win);
    body.appendChild(second.win);

    first.viewArea.appendChild(input("cp-font-custom", "First Font"));
    first.viewArea.appendChild(input("cp-font-select", "Inter"));
    const firstPreview = first.viewArea.appendChild(input("cp-font-preview-text"));
    const firstApply = first.viewArea.appendChild(button());

    second.viewArea.appendChild(input("cp-font-custom", "Second Font"));
    second.viewArea.appendChild(input("cp-font-select", "Roboto"));
    const secondPreview = second.viewArea.appendChild(input("cp-font-preview-text"));
    const secondApply = second.viewArea.appendChild(button());

    const { applyFontSelection } = await importControlPanel();

    applyFontSelection(secondApply);

    assert.equal(documentElement.style.getPropertyValue("--font-main"), "'Second Font', sans-serif");
    assert.equal(secondPreview.style.fontFamily, "'Second Font', sans-serif");
    assert.match(secondPreview.textContent, /Second Font/);
    assert.equal(firstPreview.textContent, "");

    applyFontSelection(firstApply);

    assert.equal(documentElement.style.getPropertyValue("--font-main"), "'First Font', sans-serif");
    assert.equal(firstPreview.style.fontFamily, "'First Font', sans-serif");
    assert.match(firstPreview.textContent, /First Font/);
  });
});

test("screensaver Apply and Preview buttons read their own scoped form", async () => {
  await withFakeDocument(async ({ body }) => {
    const first = createControlPanelWindow();
    const second = createControlPanelWindow();
    body.appendChild(first.win);
    body.appendChild(second.win);

    first.viewArea.appendChild(input("cp-saver-select", "matrix"));
    first.viewArea.appendChild(input("cp-saver-delay", "25"));
    first.viewArea.appendChild(input("cp-saver-passphrase", "alpha"));
    const firstRequire = first.viewArea.appendChild(input("cp-saver-require"));
    firstRequire.checked = true;
    const firstStatus = first.viewArea.appendChild(input("cp-saver-status"));
    const firstApply = first.viewArea.appendChild(button());

    second.viewArea.appendChild(input("cp-saver-select", "pipes"));
    second.viewArea.appendChild(input("cp-saver-delay", "45"));
    second.viewArea.appendChild(input("cp-saver-passphrase", "beta"));
    const secondRequire = second.viewArea.appendChild(input("cp-saver-require"));
    secondRequire.checked = true;
    const secondStatus = second.viewArea.appendChild(input("cp-saver-status"));
    const secondApply = second.viewArea.appendChild(button());
    const secondPreview = second.viewArea.appendChild(button());

    const calls = [];
    const state = { type: "starfield", timeout: 60, passphrase: "", requirePassphrase: false };
    const context = {
      screensaver: {
        setType(value) {
          state.type = value;
          calls.push(["setType", value]);
        },
        getType: () => state.type,
        setTimeout(value) {
          state.timeout = value;
          calls.push(["setTimeout", value]);
        },
        getTimeout: () => state.timeout,
        setLockPassphrase(value) {
          state.passphrase = value;
          calls.push(["setLockPassphrase", value]);
        },
        setRequirePassphrase(value) {
          state.requirePassphrase = value;
          calls.push(["setRequirePassphrase", value]);
        },
        getRequirePassphrase: () => state.requirePassphrase,
        setIdleTime(value) {
          calls.push(["setIdleTime", value]);
        },
        start(value) {
          calls.push(["start", value]);
        }
      }
    };

    const { applyScreensaver, previewScreensaver } = await importControlPanel();

    applyScreensaver(context, secondApply);
    assert.equal(state.type, "pipes");
    assert.equal(state.timeout, 45);
    assert.equal(state.passphrase, "beta");
    assert.equal(secondStatus.textContent, "Current saver: pipes (starts after 45s idle, locked)");
    assert.equal(firstStatus.textContent, "");

    previewScreensaver(context, firstApply);
    assert.equal(state.type, "matrix");
    assert.equal(state.timeout, 25);
    assert.equal(state.passphrase, "alpha");
    assert.deepEqual(calls.at(-1), ["start", "matrix"]);

    previewScreensaver(context, secondPreview);
    assert.deepEqual(calls.at(-1), ["start", "pipes"]);
  });
});

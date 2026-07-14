import assert from "node:assert/strict";
import { test } from "node:test";

const { getIRCContent, initIRC } = await import("./irc.js");

function collectMarkupClasses(markup) {
  const classes = new Set();
  for (const match of markup.matchAll(/class="([^"]+)"/g)) {
    match[1].split(/\s+/).forEach((cls) => cls && classes.add(cls));
  }
  return classes;
}

function createStubElement() {
  return {
    value: "",
    disabled: false,
    textContent: "",
    innerHTML: "",
    style: {},
    scrollTop: 0,
    scrollHeight: 0,
    listeners: [],
    addEventListener(type, listener) {
      this.listeners.push([type, listener]);
    },
    removeEventListener(type, listener) {
      this.listeners = this.listeners.filter(
        ([t, l]) => t !== type || l !== listener
      );
    },
    appendChild() {}
  };
}

function createFakeWindow(markup) {
  const classes = collectMarkupClasses(markup);
  const elements = new Map();
  return {
    elements,
    querySelector(selector) {
      if (!selector.startsWith(".")) return null;
      const cls = selector.slice(1);
      if (!classes.has(cls)) return null;
      if (!elements.has(cls)) elements.set(cls, createStubElement());
      return elements.get(cls);
    }
  };
}

test("IRC markup provides every element the app logic queries", () => {
  const classes = collectMarkupClasses(getIRCContent());
  const required = [
    "irc-server",
    "irc-nick",
    "irc-channel",
    "irc-connect",
    "irc-join",
    "irc-send",
    "irc-input",
    "irc-log",
    "irc-users"
  ];
  for (const cls of required) {
    assert.ok(classes.has(cls), `markup is missing .${cls}`);
  }
});

test("initIRC wires up against its own markup and returns a disposable", () => {
  const win = createFakeWindow(getIRCContent());
  const app = initIRC(win);

  assert.equal(typeof app?.dispose, "function");

  const connectBtn = win.querySelector(".irc-connect");
  assert.ok(
    connectBtn.listeners.some(([type]) => type === "click"),
    "connect button has no click handler"
  );

  app.dispose();
  assert.equal(connectBtn.listeners.length, 0, "dispose did not remove listeners");
});

test("initIRC leaves the channel field editable while disconnected", () => {
  const win = createFakeWindow(getIRCContent());
  initIRC(win);

  assert.equal(win.querySelector(".irc-channel").disabled, false);
  assert.equal(win.querySelector(".irc-input").disabled, true);
  assert.equal(win.querySelector(".irc-send").disabled, true);
});

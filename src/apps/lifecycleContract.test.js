import assert from "node:assert/strict";
import { test } from "node:test";

// `getWindowContent()` is documented as side-effect free, with all runtime
// wiring deferred to `mount()`. Nothing enforced that before, so an app could
// register a global listener, start a timer, or open an audio context at render
// time — work that `dispose()` would never undo, because an app's disposable
// pool is only wired up during `mount()`.
//
// What counts as a side effect here is specifically a resource that *escapes*
// the returned markup: a listener on `window`/`document`, a timer, an animation
// frame, a network request, an audio context. Listeners bound to elements the
// function itself creates and returns are fine — those are released along with
// the window's DOM when it closes, which is why Program Manager can wire its own
// icon grid at render time.
//
// Apps are bound to lazy loaders, so their classes are not in memory until the
// registry has fetched them. The suite resolves every class up front and asserts
// that it did, otherwise a binding that stopped resolving would silently shrink
// the contract's coverage to nothing instead of failing.
//
// This arms traps on the escaping globals, then constructs and renders every app
// in the registry against them.

const sideEffects = [];

function trap(name) {
  return (...args) => {
    sideEffects.push(`${name}(${String(args[0]).slice(0, 30)})`);
  };
}

function createFakeElement(tagName = "div") {
  const element = {
    tagName: String(tagName).toUpperCase(),
    style: {},
    dataset: {},
    children: [],
    classList: { add() {}, remove() {}, contains: () => false, toggle: () => false },
    appendChild(child) {
      this.children.push(child);
      return child;
    },
    append() {},
    remove() {},
    setAttribute() {},
    getAttribute: () => null,
    removeAttribute() {},
    // Element-local listeners are owned by the returned tree, so they are not
    // trapped — only the escaping globals below are.
    addEventListener() {},
    querySelector: () => null,
    querySelectorAll: () => [],
    getContext: () => ({}),
    focus() {},
    insertAdjacentHTML() {},
    // `<template>` elements are used to turn icon markup into nodes.
    content: { firstElementChild: null }
  };
  return element;
}

const originals = {};
const globalKeys = [
  "window",
  "document",
  "localStorage",
  "setInterval",
  "setTimeout",
  "requestAnimationFrame",
  "fetch",
  "AudioContext"
];

function installFakeGlobals() {
  for (const key of globalKeys) originals[key] = globalThis[key];

  globalThis.window = {
    addEventListener: trap("window.addEventListener"),
    location: { origin: "http://oriel.test", pathname: "/", search: "", href: "http://oriel.test/" },
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    devicePixelRatio: 1
  };
  globalThis.document = {
    createElement: (tagName) => createFakeElement(tagName),
    createTextNode: (text) => ({ nodeValue: text }),
    createDocumentFragment: () => createFakeElement("fragment"),
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    body: createFakeElement("body"),
    documentElement: createFakeElement("html"),
    addEventListener: trap("document.addEventListener")
  };
  globalThis.localStorage = {
    getItem: () => null,
    setItem() {},
    removeItem() {}
  };
  globalThis.setInterval = trap("setInterval");
  globalThis.setTimeout = trap("setTimeout");
  globalThis.requestAnimationFrame = trap("requestAnimationFrame");
  globalThis.fetch = trap("fetch");
  globalThis.AudioContext = function FakeAudioContext() {
    sideEffects.push("new AudioContext()");
  };
}

function restoreGlobals() {
  for (const key of globalKeys) globalThis[key] = originals[key];
}

installFakeGlobals();
const { AppRegistry } = await import("../core/AppRegistry.js");
const registry = new AppRegistry();

// App modules are fetched with the fakes installed because their top-level code
// may touch `window`/`document`. Anything they trap on the way in belongs to
// module evaluation rather than to a single app, so the log is reset afterwards.
const loadFailures = [];
for (const { type } of registry.definitions) {
  try {
    const AppClass = await registry.loadAppClass(type);
    if (!AppClass) loadFailures.push(`${type}: loader resolved no class`);
  } catch (err) {
    loadFailures.push(`${type}: loading the app module threw — ${err.message}`);
  }
}
sideEffects.length = 0;
restoreGlobals();

test("every registered app resolves to a class the contract can inspect", () => {
  assert.notEqual(registry.definitions.length, 0, "the registry exposed no apps");
  assert.deepEqual(loadFailures, [], `apps that never loaded:\n${loadFailures.join("\n")}`);
});

test("every registered app constructs and renders without side effects", () => {
  installFakeGlobals();
  const failures = [];

  try {
    for (const definition of registry.definitions) {
      const { type } = definition;
      sideEffects.length = 0;

      let app;
      try {
        app = registry.createApp(type, { windowEl: null, initData: null, services: {} });
      } catch (err) {
        failures.push(`${type}: construction threw — ${err.message}`);
        continue;
      }

      if (!app) {
        failures.push(`${type}: registry returned no instance`);
        continue;
      }

      let content;
      try {
        content = app.getWindowContent();
      } catch (err) {
        failures.push(`${type}: getWindowContent() threw — ${err.message}`);
        continue;
      }

      if (content === undefined || content === null) {
        failures.push(`${type}: getWindowContent() returned ${String(content)}`);
      }

      if (sideEffects.length > 0) {
        failures.push(
          `${type}: getWindowContent() must be side-effect free, but called ${sideEffects.join(", ")}`
        );
      }
    }
  } finally {
    restoreGlobals();
  }

  assert.deepEqual(failures, [], `app lifecycle contract violations:\n${failures.join("\n")}`);
});

test("every registered app exposes the full lifecycle surface", () => {
  installFakeGlobals();
  const failures = [];

  try {
    for (const definition of registry.definitions) {
      const app = registry.createApp(definition.type, { windowEl: null, initData: null, services: {} });
      if (!app) {
        failures.push(`${definition.type}: registry returned no instance`);
        continue;
      }

      for (const hook of ["getWindowContent", "setWindowElement", "mount", "dispose"]) {
        if (typeof app[hook] !== "function") {
          failures.push(`${definition.type}: missing ${hook}()`);
        }
      }
    }
  } finally {
    restoreGlobals();
  }

  assert.deepEqual(failures, [], `apps missing lifecycle hooks:\n${failures.join("\n")}`);
});

test("disposing an app that was never mounted is safe", () => {
  installFakeGlobals();
  const failures = [];

  try {
    for (const definition of registry.definitions) {
      const app = registry.createApp(definition.type, { windowEl: null, initData: null, services: {} });
      if (!app) {
        failures.push(`${definition.type}: registry returned no instance`);
        continue;
      }

      // Windows can be closed before an app finishes mounting, so dispose() has
      // to tolerate being called against a bare instance.
      try {
        app.dispose();
      } catch (err) {
        failures.push(`${definition.type}: dispose() before mount threw — ${err.message}`);
      }
    }
  } finally {
    restoreGlobals();
  }

  assert.deepEqual(failures, [], `apps that fail to dispose cleanly:\n${failures.join("\n")}`);
});

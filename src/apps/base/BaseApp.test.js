import assert from "node:assert/strict";
import { test } from "node:test";

import { BaseApp } from "./BaseApp.js";

function createFakeTarget() {
  const added = [];
  const removed = [];
  return {
    added,
    removed,
    addEventListener(type, listener, options) {
      added.push({ type, listener, options });
    },
    removeEventListener(type, listener, options) {
      removed.push({ type, listener, options });
    }
  };
}

test("listen() registers a listener and dispose() removes it with the same options", () => {
  const app = new BaseApp();
  const target = createFakeTarget();
  const listener = () => {};
  const options = { passive: true };

  app.listen(target, "click", listener, options);

  assert.deepEqual(target.added, [{ type: "click", listener, options }]);
  assert.deepEqual(target.removed, []);

  app.dispose();

  // The options object matters: removeEventListener only matches a listener
  // registered with the same capture flag.
  assert.deepEqual(target.removed, [{ type: "click", listener, options }]);
});

test("listen() ignores targets that cannot receive listeners", () => {
  const app = new BaseApp();

  assert.equal(app.listen(null, "click", () => {}), null);
  assert.equal(app.listen({}, "click", () => {}), null);
  assert.equal(app.disposables.size, 0);
});

test("registerDisposable runs immediately once the app is disposed", () => {
  const app = new BaseApp();
  app.dispose();

  let ran = false;
  app.registerDisposable(() => {
    ran = true;
  });

  // A late-arriving resource — an async mount that resolves after the window
  // closed — must be released rather than silently retained.
  assert.equal(ran, true);
  assert.equal(app.disposables.size, 0);
});

test("dispose() releases resources in reverse registration order", () => {
  const app = new BaseApp();
  const order = [];

  app.registerDisposable(() => order.push("first"));
  app.registerDisposable(() => order.push("second"));
  app.registerDisposable(() => order.push("third"));

  app.dispose();

  assert.deepEqual(order, ["third", "second", "first"]);
});

test("dispose() is idempotent", () => {
  const app = new BaseApp();
  let disposeCount = 0;
  app.registerDisposable(() => {
    disposeCount += 1;
  });

  app.dispose();
  app.dispose();

  assert.equal(disposeCount, 1);
});

test("dispose() keeps going when one disposable throws", () => {
  const app = new BaseApp();
  const originalConsoleError = console.error;
  const logged = [];
  console.error = (...args) => logged.push(args);

  let laterRan = false;
  try {
    // Registered first, so it runs last — proving a throw partway through the
    // reversed pass does not strand the remaining resources.
    app.registerDisposable(() => {
      laterRan = true;
    });
    app.registerDisposable(() => {
      throw new Error("cleanup exploded");
    });

    app.dispose();
  } finally {
    console.error = originalConsoleError;
  }

  assert.equal(laterRan, true);
  assert.equal(logged.length, 1);
});

test("a fired timeout unregisters itself so dispose() does not clear a reused id", () => {
  const app = new BaseApp();
  const originalSetTimeout = globalThis.setTimeout;
  const originalClearTimeout = globalThis.clearTimeout;
  const cleared = [];
  let pending = null;

  globalThis.setTimeout = (callback) => {
    pending = callback;
    return 7;
  };
  globalThis.clearTimeout = (id) => cleared.push(id);

  try {
    app.setTimeout(() => {}, 10);
    assert.equal(app.disposables.size, 1);

    pending();

    // Once the callback has run there is nothing left to cancel; clearing a
    // stale id could cancel an unrelated timer that reused the number.
    assert.equal(app.disposables.size, 0);
    app.dispose();
    assert.deepEqual(cleared, []);
  } finally {
    globalThis.setTimeout = originalSetTimeout;
    globalThis.clearTimeout = originalClearTimeout;
  }
});

test("intervals stay registered until cleared or disposed", () => {
  const app = new BaseApp();
  const originalSetInterval = globalThis.setInterval;
  const originalClearInterval = globalThis.clearInterval;
  const cleared = [];

  globalThis.setInterval = () => 11;
  globalThis.clearInterval = (id) => cleared.push(id);

  try {
    const intervalId = app.setInterval(() => {}, 10);
    assert.equal(app.disposables.size, 1);

    app.clearInterval(intervalId);
    assert.deepEqual(cleared, [11]);
    assert.equal(app.disposables.size, 0);

    // Already cleared, so dispose() must not clear the id a second time.
    app.dispose();
    assert.deepEqual(cleared, [11]);
  } finally {
    globalThis.setInterval = originalSetInterval;
    globalThis.clearInterval = originalClearInterval;
  }
});

test("a fired animation frame unregisters itself", () => {
  const app = new BaseApp();
  const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
  const originalCancelAnimationFrame = globalThis.cancelAnimationFrame;
  const cancelled = [];
  let pending = null;

  globalThis.requestAnimationFrame = (callback) => {
    pending = callback;
    return 3;
  };
  globalThis.cancelAnimationFrame = (id) => cancelled.push(id);

  try {
    app.requestAnimationFrame(() => {});
    assert.equal(app.disposables.size, 1);

    pending(0);

    assert.equal(app.disposables.size, 0);
    app.dispose();
    assert.deepEqual(cancelled, []);
  } finally {
    globalThis.requestAnimationFrame = originalRequestAnimationFrame;
    globalThis.cancelAnimationFrame = originalCancelAnimationFrame;
  }
});

test("tracked media elements are paused and detached from their source", () => {
  const app = new BaseApp();
  const calls = [];
  const media = {
    pause: () => calls.push("pause"),
    removeAttribute: (name) => calls.push(`removeAttribute:${name}`),
    load: () => calls.push("load")
  };

  app.trackMediaElement(media);
  app.dispose();

  assert.deepEqual(calls, ["pause", "removeAttribute:src", "load"]);
});

test("tracked media streams stop every track", () => {
  const app = new BaseApp();
  const stopped = [];
  const stream = {
    getTracks: () => [
      { stop: () => stopped.push("audio") },
      { stop: () => stopped.push("video") }
    ]
  };

  app.trackMediaStream(stream);
  app.dispose();

  assert.deepEqual(stopped, ["audio", "video"]);
});

test("tracking helpers ignore missing resources and return their argument", () => {
  const app = new BaseApp();

  // Apps call these with values that may be null on unsupported browsers.
  assert.equal(app.trackObjectUrl(null), null);
  assert.equal(app.trackMediaElement(undefined), undefined);
  assert.equal(app.trackAbortController(null), null);
  assert.equal(app.trackAudioContext(null), null);
  assert.equal(app.trackMediaStream(null), null);
  assert.equal(app.disposables.size, 0);
});

test("subclasses receive their host arguments", () => {
  class ExampleApp extends BaseApp {}
  const services = { windowManager: {} };
  const app = new ExampleApp({ windowEl: "el", initData: { doc: 1 }, services });

  assert.equal(app.windowEl, "el");
  assert.deepEqual(app.initData, { doc: 1 });
  assert.equal(app.services, services);
  assert.equal(app.isDisposed, false);
});

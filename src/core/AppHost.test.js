import assert from "node:assert/strict";
import { test } from "node:test";

import { MessengerApp } from "../apps/messenger.js";
import { publish } from "../eventBus.js";
import { AppHost } from "./AppHost.js";

test("mountInstance mounts a class app and assigns the window element before mount", () => {
  const calls = [];
  const winEl = {};
  const winObj = { el: winEl };

  class TestApp {
    setWindowElement(windowEl) {
      calls.push(["setWindowElement", windowEl]);
      this.windowEl = windowEl;
    }

    mount() {
      calls.push(["mount", this.windowEl]);
      return this;
    }
  }

  const appInstance = new TestApp();
  const mountedAppInstance = new AppHost().mountInstance({
    appInstance,
    winEl,
    winObj,
    type: "class-app"
  });

  assert.equal(mountedAppInstance, appInstance);
  assert.equal(winObj.appInstance, appInstance);
  assert.equal(winEl.appInstance, appInstance);
  assert.deepEqual(calls, [
    ["setWindowElement", winEl],
    ["mount", winEl]
  ]);
});

test("mountInstance awaits an async class app mount result", async () => {
  const winEl = {};
  const winObj = { el: winEl };
  const resolvedAppInstance = { dispose() {} };

  class AsyncTestApp {
    mount() {
      return Promise.resolve(resolvedAppInstance);
    }

    dispose() {}
  }

  const initialAppInstance = new AsyncTestApp();
  const pendingMountPromise = new AppHost().mountInstance({
    appInstance: initialAppInstance,
    winEl,
    winObj,
    type: "async-class-app"
  });

  assert.equal(winObj.appInstance, initialAppInstance);
  assert.equal(winEl.appInstance, initialAppInstance);
  assert.equal(winObj.pendingMountPromise, pendingMountPromise);

  assert.equal(await pendingMountPromise, resolvedAppInstance);
  assert.equal(winObj.appInstance, resolvedAppInstance);
  assert.equal(winEl.appInstance, resolvedAppInstance);
  assert.equal(winObj.pendingMountPromise, null);
  assert.equal(winEl.pendingMountPromise, null);
});

test("mount reports asynchronous initializer rejection", async () => {
  const winEl = {};
  const winObj = {};
  const expectedError = new Error("boom");
  const mountErrors = [];
  const appHost = new AppHost({
    onMountError(errorInfo) {
      mountErrors.push(errorInfo);
    }
  });

  const pendingMountPromise = appHost.mount({
    initializer: () => Promise.reject(expectedError),
    winEl,
    winObj,
    type: "async-boom"
  });

  assert.equal(winObj.pendingMountPromise, pendingMountPromise);
  assert.equal(winEl.pendingMountPromise, pendingMountPromise);
  assert.equal(await pendingMountPromise, null);
  assert.equal(mountErrors.length, 1);
  assert.deepEqual(mountErrors[0], {
    err: expectedError,
    winEl,
    type: "async-boom"
  });
  assert.equal(winObj.pendingMountPromise, null);
  assert.equal(winEl.pendingMountPromise, null);
});

test("mount assigns resolved asynchronous app instances to window state and element", async () => {
  const winEl = {};
  const winObj = {};
  const appInstance = { dispose() {} };
  const appHost = new AppHost();

  const pendingMountPromise = appHost.mount({
    initializer: () => Promise.resolve(appInstance),
    winEl,
    winObj,
    type: "async-ok"
  });

  assert.equal(await pendingMountPromise, appInstance);
  assert.equal(winObj.appInstance, appInstance);
  assert.equal(winEl.appInstance, appInstance);
  assert.equal(winObj.pendingMountPromise, null);
  assert.equal(winEl.pendingMountPromise, null);
});

class MessengerTestElement {
  constructor() {
    this.children = [];
    this.listeners = new Map();
    this.value = "";
    this.textContent = "";
    this.scrollTop = 0;
    this.scrollHeight = 0;
    this._innerHTML = "";
  }

  set innerHTML(value) {
    this._innerHTML = value;
    this.children = [];
  }

  get innerHTML() {
    return this._innerHTML;
  }

  appendChild(child) {
    this.children.push(child);
    this.scrollHeight = this.children.length;
    return child;
  }

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(listener);
  }

  removeEventListener(type, listener) {
    const listeners = this.listeners.get(type) || [];
    this.listeners.set(
      type,
      listeners.filter((candidate) => candidate !== listener)
    );
  }

  dispatchEvent(event) {
    for (const listener of this.listeners.get(event.type) || []) listener(event);
  }
}

function createMessengerWindow() {
  const elements = {
    ".messenger-log": new MessengerTestElement(),
    ".messenger-message": new MessengerTestElement(),
    ".messenger-send": new MessengerTestElement(),
    ".messenger-name": new MessengerTestElement(),
    ".messenger-status": new MessengerTestElement(),
    ".messenger-clear": new MessengerTestElement()
  };
  const winEl = new MessengerTestElement();
  winEl.querySelector = (selector) => elements[selector] || null;
  return { winEl, elements };
}

test("mount disposes asynchronous initializer result that resolves after unmount", async () => {
  let resolveInitializer;
  const disposeCalls = [];
  const winEl = {};
  const winObj = { el: winEl };
  const appInstance = {
    dispose() {
      disposeCalls.push("late-dispose");
    }
  };
  const appHost = new AppHost();

  const pendingMountPromise = appHost.mount({
    initializer: () =>
      new Promise((resolve) => {
        resolveInitializer = resolve;
      }),
    winEl,
    winObj,
    type: "async-late"
  });

  appHost.unmount(winObj);
  resolveInitializer(appInstance);

  assert.equal(await pendingMountPromise, null);
  assert.deepEqual(disposeCalls, ["late-dispose"]);
  assert.equal(winObj.appInstance, null);
  assert.equal(winEl.appInstance, null);
  assert.equal(winObj.pendingMountPromise, null);
  assert.equal(winEl.pendingMountPromise, null);
});

test("mountInstance disposes asynchronous mount result that resolves after unmount", async () => {
  let resolveMount;
  const disposeCalls = [];
  const winEl = {};
  const winObj = { el: winEl };
  const initialAppInstance = {
    mount() {
      return new Promise((resolve) => {
        resolveMount = resolve;
      });
    },
    dispose() {
      disposeCalls.push("initial-dispose");
    }
  };
  const resolvedAppInstance = {
    dispose() {
      disposeCalls.push("late-dispose");
    }
  };
  const appHost = new AppHost();

  const pendingMountPromise = appHost.mountInstance({
    appInstance: initialAppInstance,
    winEl,
    winObj,
    type: "async-late-instance"
  });

  appHost.unmount(winObj);
  resolveMount(resolvedAppInstance);

  assert.equal(await pendingMountPromise, null);
  assert.deepEqual(disposeCalls, ["initial-dispose", "late-dispose"]);
  assert.equal(winObj.appInstance, null);
  assert.equal(winEl.appInstance, null);
  assert.equal(winObj.pendingMountPromise, null);
  assert.equal(winEl.pendingMountPromise, null);
});

test("unmount no longer invokes win.*Cleanup legacy hooks", () => {
  const calls = [];
  const winEl = new MessengerTestElement();
  winEl.chessCleanup = () => calls.push("legacy");

  new AppHost().unmount({ el: winEl, appInstance: null });

  assert.deepEqual(calls, []);
});

test("unmount disposes each migrated app through its app instance", () => {
  const migratedTypes = [
    "chess",
    "skifree",
    "cannonduel",
    "pinball",
    "linerider",
    "sandspiel3d",
    "shaderlab",
    "whiteboard",
    "packetlab",
    "irc",
    "mplayer",
    "soundrec"
  ];
  const disposed = [];
  const appHost = new AppHost();

  for (const type of migratedTypes) {
    const winEl = new MessengerTestElement();
    appHost.unmount({
      el: winEl,
      appInstance: {
        dispose() {
          disposed.push(type);
        }
      }
    });
  }

  assert.deepEqual(disposed, migratedTypes);
});

test("unmount disposes app instances idempotently", () => {
  const calls = [];
  const winEl = {};
  const winObj = {
    el: winEl,
    appInstance: {
      dispose() {
        calls.push("dispose");
      }
    }
  };
  const appHost = new AppHost();

  appHost.unmount(winObj);
  appHost.unmount(winObj);

  assert.deepEqual(calls, ["dispose"]);
  assert.equal(winObj.appInstance, null);
  assert.equal(winEl.appInstance, null);
});

test("closing Messenger through AppHost unsubscribes and closes BroadcastChannel", () => {
  const originalDocument = globalThis.document;
  const originalLocalStorage = globalThis.localStorage;
  const originalWindow = globalThis.window;
  const originalBroadcastChannel = globalThis.BroadcastChannel;

  const channels = [];
  class FakeBroadcastChannel {
    constructor(name) {
      this.name = name;
      this.closed = false;
      this.listeners = new Map();
      channels.push(this);
    }

    addEventListener(type, listener) {
      if (!this.listeners.has(type)) this.listeners.set(type, []);
      this.listeners.get(type).push(listener);
    }

    removeEventListener(type, listener) {
      const listeners = this.listeners.get(type) || [];
      this.listeners.set(
        type,
        listeners.filter((candidate) => candidate !== listener)
      );
    }

    postMessage() {}

    close() {
      this.closed = true;
    }
  }

  globalThis.document = {
    createElement() {
      return new MessengerTestElement();
    }
  };
  globalThis.localStorage = {
    getItem() {
      return null;
    },
    setItem() {},
    removeItem() {}
  };
  globalThis.BroadcastChannel = FakeBroadcastChannel;
  globalThis.window = { BroadcastChannel: FakeBroadcastChannel };

  try {
    const { winEl, elements } = createMessengerWindow();
    const winObj = { el: winEl };
    const appHost = new AppHost();

    const appInstance = appHost.mountInstance({
      appInstance: new MessengerApp(),
      winEl,
      winObj,
      type: "messenger"
    });
    assert.equal(winObj.appInstance, appInstance);
    assert.equal(channels.length, 1);
    assert.equal(winEl.listeners.get("app:destroy")?.length || 0, 0);

    appHost.unmount(winObj);

    assert.equal(channels[0].closed, true);
    assert.equal(channels[0].listeners.get("message")?.length, 0);

    publish("messenger:event", {
      type: "chat",
      message: {
        id: "after-destroy",
        sender: "Peer",
        text: "This should not render",
        timestamp: Date.now()
      }
    });

    assert.equal(elements[".messenger-log"].children.length, 0);
  } finally {
    globalThis.document = originalDocument;
    globalThis.localStorage = originalLocalStorage;
    globalThis.window = originalWindow;
    globalThis.BroadcastChannel = originalBroadcastChannel;
  }
});

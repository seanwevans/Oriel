import assert from "node:assert/strict";
import { test } from "node:test";

import { initMessenger } from "../apps/messenger.js";
import { publish } from "../eventBus.js";
import { AppHost } from "./AppHost.js";

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

test("unmount dispatches app:destroy for event-based apps without dispose", () => {
  const events = [];
  const winEl = new MessengerTestElement();
  winEl.addEventListener("app:destroy", (event) => events.push(event.type));

  new AppHost().unmount({ el: winEl, appInstance: null });

  assert.deepEqual(events, ["app:destroy"]);
});

test("unmount prefers app dispose over app:destroy to avoid duplicate cleanup", () => {
  const calls = [];
  const winEl = new MessengerTestElement();
  winEl.addEventListener("app:destroy", () => calls.push("event"));

  new AppHost().unmount({
    el: winEl,
    appInstance: {
      dispose() {
        calls.push("dispose");
      }
    }
  });

  assert.deepEqual(calls, ["dispose"]);
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

    const appInstance = appHost.mount({
      initializer: initMessenger,
      winEl,
      winObj,
      type: "messenger"
    });
    assert.equal(winObj.appInstance, appInstance);
    assert.equal(channels.length, 1);

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

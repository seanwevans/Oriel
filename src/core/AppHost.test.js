import "../test-setup.js";
import assert from "node:assert/strict";
import { test } from "node:test";

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

test("mount accepts a standard app instance and stores it before mounting", () => {
  const winEl = {};
  const winObj = {};
  const events = [];
  const appInstance = {
    mount() {
      events.push(
        winObj.appInstance === appInstance
          ? "assigned-before-mount"
          : "missing-before-mount"
      );
    },
    dispose() {
      events.push("disposed");
    }
  };
  const appHost = new AppHost();

  const mountedAppInstance = appHost.mount({
    appInstance,
    winEl,
    winObj,
    type: "standard-app"
  });
  appHost.unmount(winObj);

  assert.equal(mountedAppInstance, appInstance);
  assert.equal(winObj.appInstance, appInstance);
  assert.equal(winEl.appInstance, appInstance);
  assert.deepEqual(events, ["assigned-before-mount", "disposed"]);
});

test("unmount relies on app dispose instead of legacy window cleanup keys", () => {
  const cleanupCalls = [];
  const appHost = new AppHost();
  const winObj = {
    el: {
      chessCleanup() {
        cleanupCalls.push("legacy cleanup");
      }
    },
    appInstance: {
      dispose() {
        cleanupCalls.push("dispose");
      }
    }
  };

  appHost.unmount(winObj);

  assert.deepEqual(cleanupCalls, ["dispose"]);
});

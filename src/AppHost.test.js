import assert from "node:assert/strict";
import { test } from "node:test";

import { initClock } from "./apps/clock.js";
import { AppHost } from "./core/AppHost.js";

test("closing a timer-backed app runs its interval cleanup", () => {
  const clearedTimers = [];
  const originalSetInterval = globalThis.setInterval;
  const originalClearInterval = globalThis.clearInterval;

  globalThis.setInterval = (callback, delay) => ({ callback, delay, id: "clock-timer" });
  globalThis.clearInterval = (timer) => clearedTimers.push(timer);

  const canvas = {
    width: 120,
    style: {},
    getContext() {
      return {
        clearRect() {},
        fillRect() {},
        beginPath() {},
        arc() {},
        stroke() {},
        moveTo() {},
        lineTo() {},
        fillText() {},
        set fillStyle(_value) {},
        set strokeStyle(_value) {},
        set lineWidth(_value) {},
        set font(_value) {}
      };
    }
  };
  const digital = { style: {}, innerText: "" };
  const layout = { addEventListener() {} };
  const winEl = {
    querySelector(selector) {
      return {
        ".clock-canvas": canvas,
        ".clock-digital": digital,
        ".clock-layout": layout
      }[selector] || null;
    }
  };

  try {
    const winObj = { el: winEl, appInstance: null };
    const appHost = new AppHost();

    appHost.mount({ winEl, winObj, initializer: initClock, type: "clock" });
    appHost.unmount(winObj);

    assert.equal(clearedTimers.length, 1);
    assert.equal(clearedTimers[0].id, "clock-timer");
    assert.equal(clearedTimers[0].delay, 1000);
  } finally {
    globalThis.setInterval = originalSetInterval;
    globalThis.clearInterval = originalClearInterval;
  }
});

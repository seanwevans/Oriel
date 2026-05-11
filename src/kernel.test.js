import assert from "node:assert/strict";
import { test } from "node:test";
import { SimulatedKernel } from "./kernel.js";

test("unregisterProcess clears scheduler interval when the last process exits", () => {
  const previousSetInterval = global.setInterval;
  const previousClearInterval = global.clearInterval;
  const interval = { id: 1 };
  let clearedInterval = null;

  global.setInterval = () => interval;
  global.clearInterval = (id) => {
    clearedInterval = id;
  };

  try {
    const kernel = new SimulatedKernel();

    kernel.registerProcess(1, "Test Process");
    assert.equal(kernel.schedulerInterval, interval);

    kernel.unregisterProcess(1);

    assert.equal(clearedInterval, interval);
    assert.equal(kernel.schedulerInterval, null);
    assert.equal(kernel.currentProcessIndex, 0);
    assert.equal(kernel.processes.length, 0);
  } finally {
    global.setInterval = previousSetInterval;
    global.clearInterval = previousClearInterval;
  }
});

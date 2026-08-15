import assert from "node:assert/strict";
import { test } from "node:test";

import { publish, subscribe, unsubscribe } from "./eventBus.js";

// The bus is a module-level singleton shared by every window, so each test uses
// its own event name and unsubscribes what it adds.

test("subscribe delivers published payloads and returns an unsubscribe handle", () => {
  const received = [];
  const off = subscribe("test:deliver", (payload) => received.push(payload));

  publish("test:deliver", { id: 1 });
  publish("test:deliver", { id: 2 });

  off();
  publish("test:deliver", { id: 3 });

  assert.deepEqual(received, [{ id: 1 }, { id: 2 }]);
});

test("every subscriber for an event receives the payload", () => {
  const seen = [];
  const offFirst = subscribe("test:fanout", () => seen.push("first"));
  const offSecond = subscribe("test:fanout", () => seen.push("second"));

  try {
    publish("test:fanout", null);
    assert.deepEqual(seen, ["first", "second"]);
  } finally {
    offFirst();
    offSecond();
  }
});

test("subscribing the same handler twice registers it once", () => {
  let calls = 0;
  const handler = () => {
    calls += 1;
  };

  const offFirst = subscribe("test:dedupe", handler);
  const offSecond = subscribe("test:dedupe", handler);

  try {
    publish("test:dedupe", null);
    // Handlers live in a Set, so a repeated subscribe is idempotent.
    assert.equal(calls, 1);
  } finally {
    offFirst();
    offSecond();
  }
});

test("a throwing subscriber does not stop the others", () => {
  const originalConsoleError = console.error;
  const logged = [];
  console.error = (...args) => logged.push(args);

  const seen = [];
  const offBad = subscribe("test:throw", () => {
    throw new Error("handler exploded");
  });
  const offGood = subscribe("test:throw", () => seen.push("still ran"));

  try {
    publish("test:throw", null);
  } finally {
    console.error = originalConsoleError;
    offBad();
    offGood();
  }

  assert.deepEqual(seen, ["still ran"]);
  assert.equal(logged.length, 1);
});

test("a subscriber that unsubscribes during dispatch still sees the current publish", () => {
  const seen = [];
  let offSecond;

  const offFirst = subscribe("test:mutate", () => {
    seen.push("first");
    // Removing another handler mid-dispatch must not skip it or throw — the bus
    // iterates a snapshot for exactly this reason.
    offSecond();
  });
  offSecond = subscribe("test:mutate", () => seen.push("second"));

  try {
    publish("test:mutate", null);
    assert.deepEqual(seen, ["first", "second"]);

    publish("test:mutate", null);
    assert.deepEqual(seen, ["first", "second", "first"]);
  } finally {
    offFirst();
  }
});

test("non-function handlers are ignored and return a no-op handle", () => {
  const off = subscribe("test:invalid", null);

  assert.equal(typeof off, "function");
  // Must not throw when the caller releases a handler that was never stored.
  off();
  publish("test:invalid", null);
});

test("publishing an event with no subscribers is a no-op", () => {
  assert.doesNotThrow(() => publish("test:nobody-listening", { id: 1 }));
});

test("unsubscribe tolerates unknown events and handlers", () => {
  assert.doesNotThrow(() => unsubscribe("test:never-registered", () => {}));

  const handler = () => {};
  const off = subscribe("test:unsub", handler);
  unsubscribe("test:unsub", handler);
  // The returned handle removing an already-removed handler must stay safe.
  assert.doesNotThrow(off);
});

test("handlers receive the exact payload reference", () => {
  const payload = { nested: { value: 1 } };
  let received = null;
  const off = subscribe("test:identity", (value) => {
    received = value;
  });

  try {
    publish("test:identity", payload);
    assert.equal(received, payload);
  } finally {
    off();
  }
});

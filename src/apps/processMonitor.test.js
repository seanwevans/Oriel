import assert from "node:assert/strict";
import { test } from "node:test";

import { BaseApp } from "./base/BaseApp.js";
import {
  ProcessMonitorApp,
  formatCpuTime,
  getProcessMonitorContent,
  initProcessMonitor,
  pushSample,
  renderProcessTable,
  schedulerLoad,
  summarizeProcesses
} from "./processMonitor.js";

class FakeElement {
  constructor(tagName = "div") {
    this.tagName = tagName;
    this.className = "";
    this.innerHTML = "";
    this.innerText = "";
    this.textContent = "";
    this.style = {};
    this.dataset = {};
    this.children = [];
    this.listeners = [];
    this.width = 0;
    this.height = 0;
  }
  appendChild(child) {
    this.children.push(child);
    return child;
  }
  addEventListener(type, fn) {
    this.listeners.push({ type, fn, active: true });
  }
  removeEventListener(type, fn) {
    for (const entry of this.listeners) {
      if (entry.type === type && entry.fn === fn) entry.active = false;
    }
  }
  getContext() {
    return null;
  }
}

global.document = { createElement: (tag) => new FakeElement(tag) };

test("summarizeProcesses counts states and accumulates CPU time", () => {
  const summary = summarizeProcesses([
    { pid: "win-1", state: "RUNNING", cpuTime: 400 },
    { pid: "win-2", state: "READY", cpuTime: 200 },
    { pid: "win-3", state: "WAITING", cpuTime: 0 },
    { pid: "win-4", state: "READY", cpuTime: 600 }
  ]);
  assert.equal(summary.total, 4);
  assert.equal(summary.RUNNING, 1);
  assert.equal(summary.READY, 2);
  assert.equal(summary.WAITING, 1);
  assert.equal(summary.totalCpu, 1200);
});

test("summarizeProcesses tolerates empty input and unknown states", () => {
  const summary = summarizeProcesses([{ pid: 1, state: "ZOMBIE", cpuTime: 10 }]);
  assert.equal(summary.total, 1);
  assert.equal(summary.RUNNING, 0);
  assert.equal(summary.totalCpu, 10);
  assert.deepEqual(summarizeProcesses(), { total: 0, totalCpu: 0, RUNNING: 0, READY: 0, WAITING: 0 });
});

test("schedulerLoad is the runnable fraction and guards divide-by-zero", () => {
  assert.equal(schedulerLoad({ total: 4, RUNNING: 1, READY: 1 }), 0.5);
  assert.equal(schedulerLoad({ total: 0, RUNNING: 0, READY: 0 }), 0);
  assert.equal(schedulerLoad(null), 0);
});

test("pushSample keeps history bounded to the maximum length", () => {
  let history = [];
  for (let i = 0; i < 10; i++) history = pushSample(history, i, 5);
  assert.deepEqual(history, [5, 6, 7, 8, 9]);
});

test("formatCpuTime renders seconds with sensible precision", () => {
  assert.equal(formatCpuTime(0), "0.0s");
  assert.equal(formatCpuTime(1500), "1.5s");
  assert.equal(formatCpuTime(120000), "120s");
});

test("renderProcessTable sorts by CPU time and strips the win- pid prefix", () => {
  const table = new FakeElement();
  const count = renderProcessTable(table, [
    { pid: "win-7", name: "Notepad", state: "READY", cpuTime: 200 },
    { pid: "win-3", name: "Doom", state: "RUNNING", cpuTime: 4000 },
    { pid: "daemon", name: "Kernel", state: "WAITING", cpuTime: 0 }
  ]);
  assert.equal(count, 3);
  assert.equal(table.children.length, 3);
  // Highest CPU time first.
  assert.equal(table.children[0].children[0].innerText, "3");
  assert.equal(table.children[0].children[1].innerText, "Doom");
  assert.equal(table.children[0].children[2].style.color, "lime");
  assert.equal(table.children[2].children[0].innerText, "daemon");
});

test("Process Monitor content exposes tiles and carries no inline handlers", () => {
  const content = getProcessMonitorContent();
  assert.match(content, /data-tile="total"/);
  assert.match(content, /data-graph/);
  assert.match(content, /data-table/);
  assert.doesNotMatch(content, /onclick=/);
});

function createMonitorWindow() {
  const table = new FakeElement();
  const graph = new FakeElement();
  const pause = new FakeElement();
  const refresh = new FakeElement();
  const tileEls = {
    total: Object.assign(new FakeElement(), { dataset: { tile: "total" } }),
    RUNNING: Object.assign(new FakeElement(), { dataset: { tile: "RUNNING" } }),
    READY: Object.assign(new FakeElement(), { dataset: { tile: "READY" } }),
    WAITING: Object.assign(new FakeElement(), { dataset: { tile: "WAITING" } }),
    totalCpu: Object.assign(new FakeElement(), { dataset: { tile: "totalCpu" } })
  };
  const map = {
    "[data-table]": table,
    "[data-graph]": graph,
    '[data-action="pause"]': pause,
    '[data-action="refresh"]': refresh
  };
  return {
    table,
    pause,
    tileEls,
    elements: [table, graph, pause, refresh, ...Object.values(tileEls)],
    querySelector: (sel) => map[sel] ?? null,
    querySelectorAll: () => Object.values(tileEls)
  };
}

test("initProcessMonitor renders kernel state and releases its timer and listeners on dispose", () => {
  const originalSetInterval = globalThis.setInterval;
  const originalClearInterval = globalThis.clearInterval;
  const cleared = [];
  let nextId = 1;
  globalThis.setInterval = () => nextId++;
  globalThis.clearInterval = (id) => cleared.push(id);

  try {
    const app = new BaseApp();
    const win = createMonitorWindow();
    const kernel = {
      processes: [
        { pid: "win-1", name: "Program Manager", state: "RUNNING", cpuTime: 1000 },
        { pid: "win-2", name: "Notepad", state: "READY", cpuTime: 400 }
      ]
    };

    const api = initProcessMonitor(win, null, null, { kernel }, app);

    assert.equal(win.tileEls.total.textContent, "2");
    assert.equal(win.tileEls.RUNNING.textContent, "1");
    assert.equal(win.table.children.length, 2);
    assert.equal(api.isRunning(), true);

    const registered = win.elements.flatMap((el) => el.listeners);
    assert.ok(registered.length > 0, "expected listeners to be registered");

    app.dispose();

    assert.ok(cleared.length > 0, "the polling timer should be cleared on dispose");
    assert.ok(
      registered.every((entry) => !entry.active),
      "every registered listener should be removed on dispose"
    );
  } finally {
    globalThis.setInterval = originalSetInterval;
    globalThis.clearInterval = originalClearInterval;
  }
});

test("initProcessMonitor shows an empty state when the kernel has no processes", () => {
  const app = new BaseApp();
  const win = createMonitorWindow();
  initProcessMonitor(win, null, null, { kernel: { processes: [] } }, app);
  assert.match(win.table.innerHTML, /No active processes/);
  app.dispose();
});

test("ProcessMonitorApp exposes the monitor content through the app class", () => {
  const app = new ProcessMonitorApp({ services: {} });
  assert.match(app.getWindowContent(), /procmon-layout/);
});

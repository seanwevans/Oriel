import assert from "node:assert/strict";
import { test } from "node:test";

class FakeElement {
  constructor(tagName = "div") {
    this.tagName = tagName.toLowerCase();
    this.className = "";
    this.innerHTML = "";
    this.innerText = "";
    this.style = {};
    this.children = [];
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }
}

global.document = {
  createElement(tagName) {
    return new FakeElement(tagName);
  }
};

const { refreshProcessView } = await import("./taskman.js");

function renderRows(processes) {
  const view = new FakeElement();
  refreshProcessView(view, { kernel: { processes } });
  return view.children;
}

test("Task Manager process view shows the window number as PID", () => {
  const rows = renderRows([
    { pid: "win-7", name: "Notepad", state: "RUNNING", priority: 5, cpuTime: 3000 }
  ]);

  assert.equal(rows.length, 1);
  assert.match(rows[0].innerText, /^7\s+\|/);
  assert.match(rows[0].innerText, /Notepad$/);
});

test("Task Manager process view tolerates pids without the win- prefix", () => {
  const rows = renderRows([
    { pid: 1, name: "Test Process", state: "READY", priority: 1, cpuTime: 0 },
    { pid: "daemon", name: "Daemon", state: "WAITING", priority: 2, cpuTime: 0 }
  ]);

  assert.match(rows[0].innerText, /^1\s+\|/);
  assert.match(rows[1].innerText, /^daemon\s*\|/);
});

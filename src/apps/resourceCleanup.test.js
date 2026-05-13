import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { BaseApp } from "./base/BaseApp.js";
import { FileManagerApp } from "./fileManager.js";

const readApp = (file) => readFileSync(new URL(file, import.meta.url), "utf8");

test("BaseApp disposes timers and object URLs", () => {
  const originalSetInterval = globalThis.setInterval;
  const originalClearInterval = globalThis.clearInterval;
  const originalSetTimeout = globalThis.setTimeout;
  const originalClearTimeout = globalThis.clearTimeout;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  let nextTimerId = 1;
  const clearedIntervals = [];
  const clearedTimeouts = [];
  const revokedObjectUrls = [];

  globalThis.setInterval = () => nextTimerId++;
  globalThis.clearInterval = (id) => clearedIntervals.push(id);
  globalThis.setTimeout = () => nextTimerId++;
  globalThis.clearTimeout = (id) => clearedTimeouts.push(id);
  URL.revokeObjectURL = (url) => revokedObjectUrls.push(url);

  try {
    const app = new BaseApp();
    const intervalId = app.setInterval(() => {}, 1000);
    const timeoutId = app.setTimeout(() => {}, 1000);
    app.trackObjectUrl("blob:oriel-test");

    app.dispose();

    assert.deepEqual(clearedIntervals, [intervalId]);
    assert.deepEqual(clearedTimeouts, [timeoutId]);
    assert.deepEqual(revokedObjectUrls, ["blob:oriel-test"]);
  } finally {
    globalThis.setInterval = originalSetInterval;
    globalThis.clearInterval = originalClearInterval;
    globalThis.setTimeout = originalSetTimeout;
    globalThis.clearTimeout = originalClearTimeout;
    URL.revokeObjectURL = originalRevokeObjectURL;
  }
});

test("BaseApp disposes animation frames, abort controllers, media streams, and broadcast channels", () => {
  const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
  const originalCancelAnimationFrame = globalThis.cancelAnimationFrame;
  const originalAbortController = globalThis.AbortController;
  const originalBroadcastChannel = globalThis.BroadcastChannel;

  const cancelledFrames = [];
  const stoppedTracks = [];
  const closedChannels = [];
  const abortedControllers = [];

  globalThis.requestAnimationFrame = () => 42;
  globalThis.cancelAnimationFrame = (id) => cancelledFrames.push(id);
  globalThis.AbortController = class FakeAbortController {
    abort() {
      abortedControllers.push(this);
    }
  };
  globalThis.BroadcastChannel = class FakeBroadcastChannel {
    constructor(name) {
      this.name = name;
    }
    close() {
      closedChannels.push(this.name);
    }
  };

  try {
    const app = new BaseApp();
    app.requestAnimationFrame(() => {});
    app.createAbortController();
    app.trackMediaStream({
      getTracks() {
        return [{ stop: () => stoppedTracks.push("audio") }];
      }
    });
    app.createBroadcastChannel("cleanup-test");

    app.dispose();

    assert.deepEqual(cancelledFrames, [42]);
    assert.equal(abortedControllers.length, 1);
    assert.deepEqual(stoppedTracks, ["audio"]);
    assert.deepEqual(closedChannels, ["cleanup-test"]);
  } finally {
    globalThis.requestAnimationFrame = originalRequestAnimationFrame;
    globalThis.cancelAnimationFrame = originalCancelAnimationFrame;
    globalThis.AbortController = originalAbortController;
    globalThis.BroadcastChannel = originalBroadcastChannel;
  }
});

class FileManagerTestElement {
  constructor({ action = null } = {}) {
    this.children = [];
    this.classList = { add() {}, remove() {} };
    this.dataset = action ? { action } : {};
    this.listeners = new Map();
    this.style = {};
    this.textContent = "";
    this.innerText = "";
    this.innerHTML = "";
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

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  closest(selector) {
    if (selector === "[data-action]" && this.dataset.action) return this;
    return null;
  }

  dispatchEvent(event) {
    event.target ??= this;
    for (const listener of [...(this.listeners.get(event.type) || [])]) {
      listener(event);
    }
  }

  listenerCount(type) {
    return this.listeners.get(type)?.length || 0;
  }
}

function createFileManagerWindow() {
  const elements = {
    "#file-tree-root": new FileManagerTestElement(),
    "#file-list-view": new FileManagerTestElement(),
    "#file-list-header": new FileManagerTestElement(),
    ".winfile-tree .winfile-pane-header": new FileManagerTestElement(),
    '[data-action="import-file-system"]': new FileManagerTestElement({
      action: "import-file-system"
    })
  };
  const winEl = new FileManagerTestElement();
  winEl.querySelector = (selector) => elements[selector] || null;
  winEl.querySelectorAll = () => [];
  winEl.contains = () => true;
  return { winEl, elements };
}

test("FileManagerApp dispose unregisters toolbar and import listeners", async () => {
  const originalDocument = globalThis.document;
  const calls = [];
  const { winEl, elements } = createFileManagerWindow();
  const actionTriggers = Object.fromEntries(
    [
      "create-folder",
      "export-file-system",
      "install-manifest",
      "uninstall-manifest",
      "mount-local-folder"
    ].map((action) => [action, new FileManagerTestElement({ action })])
  );
  const services = {
    fileSystemActions: {
      createFolder: (trigger) => calls.push(["create-folder", trigger]),
      exportFileSystem: () => calls.push(["export-file-system"]),
      installSelectedManifest: (trigger) =>
        calls.push(["install-manifest", trigger]),
      uninstallManifest: (trigger) => calls.push(["uninstall-manifest", trigger]),
      mountLocalFolder: (trigger) => calls.push(["mount-local-folder", trigger]),
      importFileSystem: (event) =>
        calls.push(["import-file-system", event.target])
    }
  };

  globalThis.document = {
    createElement: () => new FileManagerTestElement()
  };

  try {
    const app = new FileManagerApp({ windowEl: winEl, services });
    await app.mount();

    assert.equal(winEl.listenerCount("click"), 1);
    assert.equal(
      elements['[data-action="import-file-system"]'].listenerCount("change"),
      1
    );

    for (const trigger of Object.values(actionTriggers)) {
      winEl.dispatchEvent({ type: "click", target: trigger });
    }
    elements['[data-action="import-file-system"]'].dispatchEvent({
      type: "change"
    });

    assert.deepEqual(
      calls.map(([action]) => action),
      [
        "create-folder",
        "export-file-system",
        "install-manifest",
        "uninstall-manifest",
        "mount-local-folder",
        "import-file-system"
      ]
    );
    assert.equal(calls[0][1], actionTriggers["create-folder"]);
    assert.equal(calls[2][1], actionTriggers["install-manifest"]);
    assert.equal(calls[3][1], actionTriggers["uninstall-manifest"]);
    assert.equal(calls[4][1], actionTriggers["mount-local-folder"]);
    assert.equal(calls[5][1], elements['[data-action="import-file-system"]']);

    app.dispose();

    assert.equal(winEl.listenerCount("click"), 0);
    assert.equal(
      elements['[data-action="import-file-system"]'].listenerCount("change"),
      0
    );

    winEl.dispatchEvent({ type: "click", target: actionTriggers["create-folder"] });
    elements['[data-action="import-file-system"]'].dispatchEvent({
      type: "change"
    });

    assert.deepEqual(
      calls.map(([action]) => action),
      [
        "create-folder",
        "export-file-system",
        "install-manifest",
        "uninstall-manifest",
        "mount-local-folder",
        "import-file-system"
      ]
    );
  } finally {
    globalThis.document = originalDocument;
  }
});
test("BaseApp cleanup completion gate covers migrated resource categories", () => {
  const expectations = {
    "whiteboard.js": {
      category: "timer-backed",
      patterns: [/(?:extends BaseApp|new BaseApp\()/, /app\.setInterval\(/, /(?:super\.dispose\(\)|app\.dispose\(\))/]
    },
    "soundRecorder.js": {
      category: "animation-frame",
      patterns: [/(?:extends BaseApp|new BaseApp\()/, /app\.requestAnimationFrame\(/, /(?:super\.dispose\(\)|app\.dispose\(\))/]
    },
    "mediaPlayer.js": {
      category: "media/object-URL",
      patterns: [
        /(?:extends BaseApp|new BaseApp\()/,
        /app\.trackObjectUrl\(/,
        /video\.removeAttribute\("src"\)/,
        /(?:super\.dispose\(\)|app\.dispose\(\))/
      ]
    },
    "rss.js": {
      category: "network/AbortController",
      patterns: [
        /(?:extends BaseApp|new BaseApp\()/,
        /app\.trackAbortController\(/,
        /trackedFetch\([^,]+, \{ signal \}\)/,
        /(?:super\.dispose\(\)|app\.dispose\(\))/
      ]
    }
  };

  for (const [file, { category, patterns }] of Object.entries(expectations)) {
    const source = readApp(file);
    for (const pattern of patterns) {
      assert.match(source, pattern, `${file} should keep ${category} cleanup under BaseApp lifecycle`);
    }
  }
});

test("high-risk legacy apps use BaseApp helpers for listeners, timers, and external resources", () => {
  const expectations = {
    "whiteboard.js": [/(?:extends BaseApp|new BaseApp\()/, /app\.createBroadcastChannel\(/, /app\.setInterval\(/, /app\.listen\(/],
    "soundRecorder.js": [/(?:extends BaseApp|new BaseApp\()/, /app\.requestAnimationFrame\(/, /app\.trackMediaStream\(/, /app\.trackAudioContext\(/, /app\.trackObjectUrl\(/],
    "mediaPlayer.js": [/(?:extends BaseApp|new BaseApp\()/, /app\.setInterval\(/, /app\.trackObjectUrl\(/, /app\.listen\(/],
    "tracker.js": [/(?:extends BaseApp|new BaseApp\()/, /app\.setInterval\(/, /app\.setTimeout\(/, /app\.trackAudioContext\(/, /app\.trackObjectUrl\(/],
    "midiSequencer.js": [/(?:extends BaseApp|new BaseApp\()/, /app\.setInterval\(/, /app\.setTimeout\(/, /app\.trackAudioContext\(/, /app\.listen\(/]
  };

  for (const [file, patterns] of Object.entries(expectations)) {
    const source = readApp(file);
    for (const pattern of patterns) {
      assert.match(source, pattern, `${file} should use ${pattern}`);
    }
    assert.match(source, /dispose[\s\S]*(?:super\.dispose\(\)|app\.dispose\(\))/, `${file} should flush BaseApp disposables`);
  }
});

test("high-risk network apps use tracked fetch and lifecycle-scoped aborts", () => {
  const expectations = {
    "email.js": [/trackedFetch\(/, /app\?\.createAbortController\?\.\(/, /app\?\.listen\?\.\(syncBtn/],
    "discord.js": [/trackedFetch\(/, /app\?\.createAbortController\?\.\(/, /app\?\.listen\?\.\(fetchBtn/],
    "mafia.js": [/trackedFetch\(/, /app\?\.createAbortController\?\.\(/, /app\?\.listen\?\.\(roundBtn/],
    "console.js": [/trackedFetch\(/, /app\?\.createAbortController\?\.\(/, /this\.listen\(runButton/],
    "shaderLab.js": [/trackedFetch\(/, /app\?\.createAbortController\?\.\(/, /app\?\.listen\?\.\(loadBtn/],
    "chess.js": [/trackedFetch\(/, /app\.createAbortController\(\)\.signal/, /app\?\.listen\?\.\(newBtn/]
  };

  for (const [file, patterns] of Object.entries(expectations)) {
    const source = readApp(file);
    assert.doesNotMatch(source, /(?<!tracked)fetch\s*\(/, `${file} should avoid direct fetch calls`);
    for (const pattern of patterns) {
      assert.match(source, pattern, `${file} should keep network work observable and disposable`);
    }
  }
});

const animationApps = [
  "angrybirds.js",
  "cannonDuel.js",
  "linerider.js",
  "pinball.js",
  "sandspiel3d.js",
  "shaderLab.js",
  "skifree.js",
  "soundRecorder.js"
];

test("animation-frame apps cancel outstanding frames in dispose", () => {
  for (const file of animationApps) {
    const source = readApp(file);
    assert.match(source, /requestAnimationFrame\(/, `${file} should be an animation-frame app`);
    assert.match(source, /return\s+\{[\s\S]*dispose|return\s+\{\s*dispose:|return\s+this/, `${file} should return a disposable owner`);
    assert.match(source, /cancelAnimationFrame|super\.dispose\(\)|app\.dispose\(\)/, `${file} should cancel frames during cleanup`);
  }
});

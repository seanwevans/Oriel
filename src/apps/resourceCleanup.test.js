import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { BaseApp } from "./base/BaseApp.js";

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

test("BaseApp cleanup completion gate covers migrated resource categories", () => {
  const expectations = {
    "whiteboard.js": {
      category: "timer-backed",
      patterns: [/new BaseApp\(/, /app\.setInterval\(/, /app\.dispose\(\)/]
    },
    "soundRecorder.js": {
      category: "animation-frame",
      patterns: [/new BaseApp\(/, /app\.requestAnimationFrame\(/, /app\.dispose\(\)/]
    },
    "mediaPlayer.js": {
      category: "media/object-URL",
      patterns: [
        /new BaseApp\(/,
        /app\.trackObjectUrl\(/,
        /video\.removeAttribute\("src"\)/,
        /app\.dispose\(\)/
      ]
    },
    "rss.js": {
      category: "network/AbortController",
      patterns: [
        /new BaseApp\(/,
        /app\.trackAbortController\(/,
        /trackedFetch\([^,]+, \{ signal \}\)/,
        /app\.dispose\(\)/
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
    "whiteboard.js": [/new BaseApp\(/, /app\.createBroadcastChannel\(/, /app\.setInterval\(/, /app\.listen\(/],
    "soundRecorder.js": [/new BaseApp\(/, /app\.requestAnimationFrame\(/, /app\.trackMediaStream\(/, /app\.trackAudioContext\(/, /app\.trackObjectUrl\(/],
    "mediaPlayer.js": [/new BaseApp\(/, /app\.setInterval\(/, /app\.trackObjectUrl\(/, /app\.listen\(/],
    "tracker.js": [/new BaseApp\(/, /app\.setInterval\(/, /app\.setTimeout\(/, /app\.trackAudioContext\(/, /app\.trackObjectUrl\(/],
    "midiSequencer.js": [/new BaseApp\(/, /app\.setInterval\(/, /app\.setTimeout\(/, /app\.trackAudioContext\(/, /app\.listen\(/]
  };

  for (const [file, patterns] of Object.entries(expectations)) {
    const source = readApp(file);
    for (const pattern of patterns) {
      assert.match(source, pattern, `${file} should use ${pattern}`);
    }
    assert.match(source, /dispose[\s\S]*app\.dispose\(\)/, `${file} should flush BaseApp disposables`);
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
    assert.match(source, /return\s+\{[\s\S]*dispose|return\s+\{\s*dispose:/, `${file} should return a disposable owner`);
    assert.match(source, /cancelAnimationFrame|app\.dispose\(\)/, `${file} should cancel frames during cleanup`);
  }
});

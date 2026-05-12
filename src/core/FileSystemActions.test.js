import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";

import { FileSystemActions } from "./FileSystemActions.js";

class FakeFileReader {
  readAsText(file) {
    this.onload({ target: { result: file.content } });
  }
}

const originalFileReader = globalThis.FileReader;

before(() => {
  globalThis.FileReader = FakeFileReader;
});

after(() => {
  globalThis.FileReader = originalFileReader;
});

let alerts;
let fs;
let refreshed;

beforeEach(() => {
  alerts = [];
  refreshed = 0;
  fs = {
    MOCK_FS: { "C\\": { type: "dir", children: {} } },
    exportFileSystemAsJson: async () => '{"C\\\\":{"type":"dir","children":{}}}',
    hydrateNativeDirectory: async (node) => node,
    isNativeFsSupported: () => true,
    mountNativeFolder: async () => ({ type: "dir", children: {}, mounted: true }),
    replaceFileSystem: async (nextFs) => {
      fs.MOCK_FS = nextFs;
    },
    saveFileSystem() {
      fs.saved = true;
    }
  };
});

function createActions(overrides = {}) {
  const actions = new FileSystemActions({
    filesystem: { ...fs, ...overrides.filesystem },
    getWindowManager: () => overrides.windowManager || { windows: [] },
    alertUser: (message) => alerts.push(message)
  });
  actions.refreshOpenFileManagers = () => {
    refreshed += 1;
  };
  return actions;
}

test("exportFileSystem downloads the serialized file system with a dated filename", async () => {
  const actions = createActions();
  const downloads = [];
  actions.downloadJson = (content, filename) => downloads.push({ content, filename });

  await actions.exportFileSystem();

  assert.equal(downloads.length, 1);
  assert.equal(downloads[0].content, '{"C\\\\":{"type":"dir","children":{}}}');
  assert.match(downloads[0].filename, /^oriel-fs-\d{4}-\d{2}-\d{2}\.json$/);
});

test("importFileSystem replaces valid trees, refreshes file managers, alerts, and clears input", async () => {
  const actions = createActions();
  const input = {
    files: [
      {
        content: JSON.stringify({
          "c:": { type: "dir", children: { "README.TXT": { type: "file", content: "hi" } } }
        })
      }
    ],
    value: "selected"
  };

  actions.importFileSystem({ target: input });
  await Promise.resolve();

  assert.deepEqual(Object.keys(fs.MOCK_FS), ["C\\"]);
  assert.equal(fs.MOCK_FS["C\\"].children["README.TXT"].content, "hi");
  assert.equal(refreshed, 1);
  assert.deepEqual(alerts, ["File system imported successfully."]);
  assert.equal(input.value, "");
});

test("importFileSystem rejects invalid JSON or unsafe trees without replacing the filesystem", async () => {
  const actions = createActions();
  const originalFs = fs.MOCK_FS;
  const input = { files: [{ content: '{"C\\\\":{"type":"dir","children":{"CON":{"type":"file"}}}}' }], value: "selected" };

  actions.importFileSystem({ target: input });
  await Promise.resolve();

  assert.equal(fs.MOCK_FS, originalFs);
  assert.equal(refreshed, 0);
  assert.match(alerts[0], /Failed to import file system: Import file system structure is invalid/);
  assert.equal(input.value, "");
});

test("mountLocalFolder warns when native mounts are unavailable", async () => {
  const actions = createActions({ filesystem: { isNativeFsSupported: () => false } });

  await actions.mountLocalFolder({ closest: () => null });

  assert.deepEqual(alerts, ["Mounting a local folder requires a compatible browser."]);
});

test("mountLocalFolder hydrates mounted drives and ignores user aborts", async () => {
  const hydrated = [];
  const mountedDrive = { type: "dir", children: {}, nativeHandle: {} };
  const actions = createActions({
    filesystem: {
      mountNativeFolder: async () => mountedDrive,
      hydrateNativeDirectory: async (node) => hydrated.push(node)
    }
  });

  await actions.mountLocalFolder({ closest: () => null });

  assert.deepEqual(hydrated, [mountedDrive]);
  assert.deepEqual(alerts, []);

  const abortingActions = createActions({
    filesystem: {
      mountNativeFolder: async () => {
        const err = new Error("cancelled");
        err.name = "AbortError";
        throw err;
      }
    }
  });

  await abortingActions.mountLocalFolder({ closest: () => null });

  assert.deepEqual(alerts, []);
});

test("install and uninstall actions surface file manager selection errors", async () => {
  const actions = createActions();
  const win = { selectedEntry: null };
  const button = { closest: () => win };

  await actions.installSelectedManifest(button);
  await actions.uninstallManifest(button);

  assert.deepEqual(alerts, ["Select a manifest file first.", "Select a manifest file first."]);
});

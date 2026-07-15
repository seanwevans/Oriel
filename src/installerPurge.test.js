import assert from "node:assert/strict";
import { test } from "node:test";

const { MOCK_FS, saveFileSystem, fileSystemReady } = await import("./filesystem.js");
const { installFromManifestPath, purgeLegacyCodePenApps, getInstalledPrograms } = await import(
  "./installer.js"
);

// Install an app directly from a manifest placed at an arbitrary virtual path so
// the test can control whether it lands under the legacy CODEPEN root.
async function installAt(dirPath, id) {
  await fileSystemReady;
  const parts = dirPath.split("\\").filter(Boolean);
  const driveKey = `${parts.shift().toUpperCase()}\\`;
  if (!MOCK_FS[driveKey]) MOCK_FS[driveKey] = { type: "dir", children: {} };
  let node = MOCK_FS[driveKey];
  for (const part of parts) {
    const key = part.toUpperCase();
    if (!node.children[key]) node.children[key] = { type: "dir", children: {} };
    node = node.children[key];
  }
  const manifest = {
    id,
    name: id,
    version: "1.0.0",
    entry: "APP.JS",
    permissions: ["iframe"]
  };
  node.children["APP.JS"] = { type: "file", content: "export default function () {}" };
  node.children["MANIFEST.JSON"] = { type: "file", content: JSON.stringify(manifest) };
  await saveFileSystem(MOCK_FS);
  await installFromManifestPath(`${dirPath}\\MANIFEST.JSON`);
}

test("purgeLegacyCodePenApps removes only apps under the legacy CODEPEN root", async () => {
  await installAt("C\\ORIEL\\CODEPEN\\LEGACY-A", "legacy-a");
  await installAt("C\\ORIEL\\CODEPEN\\LEGACY-B", "legacy-b");
  await installAt("C\\ORIEL\\PENS\\PEN-KEEP", "pen-keep");

  const beforeIds = getInstalledPrograms().map((p) => p.type);
  assert.ok(beforeIds.includes("legacy-a"));
  assert.ok(beforeIds.includes("pen-keep"));

  const { removed } = await purgeLegacyCodePenApps();
  assert.deepEqual(removed.sort(), ["legacy-a", "legacy-b"]);

  const afterIds = getInstalledPrograms().map((p) => p.type);
  assert.ok(!afterIds.includes("legacy-a"));
  assert.ok(!afterIds.includes("legacy-b"));
  assert.ok(afterIds.includes("pen-keep"), "self-contained pen must survive");
});

test("purgeLegacyCodePenApps is a no-op when nothing is legacy", async () => {
  const { removed } = await purgeLegacyCodePenApps();
  assert.deepEqual(removed, []);
});

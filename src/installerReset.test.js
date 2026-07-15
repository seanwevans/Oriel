import assert from "node:assert/strict";
import { test } from "node:test";

const { installPenApp } = await import("./apps/codepen.js");
const { uninstallAllApps, getInstalledPrograms, getRegistrySnapshot } = await import("./installer.js");

test("uninstallAllApps removes every installed (non-native) app", async () => {
  await installPenApp({ id: "reset-a", name: "Reset A", html: "<i>a</i>" });
  await installPenApp({ id: "reset-b", name: "Reset B", html: "<i>b</i>" });

  const before = getInstalledPrograms().map((p) => p.type);
  assert.ok(before.includes("pen-reset-a"));
  assert.ok(before.includes("pen-reset-b"));

  const { ids } = await uninstallAllApps();
  assert.ok(ids.includes("pen-reset-a"));
  assert.ok(ids.includes("pen-reset-b"));

  assert.deepEqual(getInstalledPrograms(), []);
  assert.deepEqual(getRegistrySnapshot(), []);
});

test("uninstallAllApps on an empty registry is a no-op", async () => {
  const { ids } = await uninstallAllApps();
  assert.deepEqual(ids, []);
  assert.deepEqual(getInstalledPrograms(), []);
});

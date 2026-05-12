import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const migratedApps = [
  "chess.js",
  "skifree.js",
  "cannonDuel.js",
  "pinball.js",
  "linerider.js",
  "sandspiel3d.js",
  "shaderLab.js",
  "packetLab.js",
  "irc.js"
];

test("migrated apps no longer publish win.*Cleanup legacy hooks", () => {
  for (const file of migratedApps) {
    const source = readFileSync(new URL(file, import.meta.url), "utf8");

    assert.doesNotMatch(source, /\b\w+\.[A-Za-z0-9_]*Cleanup\s*=/, `${file} must return a disposable app instance instead`);
  }
});

test("runtime bindings import explicit app classes instead of runtime adapters", () => {
  const source = readFileSync(new URL("runtimeBindings.js", import.meta.url), "utf8");

  assert.doesNotMatch(source, /createRuntimeAppClass/, "runtime bindings should not define new adapter classes");
  assert.doesNotMatch(source, /class RuntimeApp extends BaseApp/, "runtime bindings should not own app lifecycles");
  assert.doesNotMatch(source, /const\s+\w+App\s*=\s*createRuntimeAppClass/, "app classes should be imported from owning modules");
});

test("migrated legacy initializers own cleanup through dispose return values", () => {
  for (const file of migratedApps) {
    const source = readFileSync(new URL(file, import.meta.url), "utf8");

    assert.match(source, /return\s+\{[\s\S]*\bdispose\b[\s\S]*\}/, `${file} should return an object with dispose()`);
  }
});

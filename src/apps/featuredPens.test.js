import assert from "node:assert/strict";
import { test } from "node:test";

const { FEATURED_CODEPEN_PENS, installFeaturedCodePenApps } = await import("./featuredPens.js");
const { getManifestForApp, getInstalledPrograms, uninstallApp } = await import("../installer.js");

test("every featured pen entry has a unique id, a name, and inline source", () => {
  const ids = new Set();
  for (const pen of FEATURED_CODEPEN_PENS) {
    assert.ok(pen.id && typeof pen.id === "string", "missing id");
    assert.ok(!ids.has(pen.id), `duplicate featured pen id: ${pen.id}`);
    ids.add(pen.id);
    assert.ok(pen.name && typeof pen.name === "string", `missing name for ${pen.id}`);
    const source = `${pen.html || ""}${pen.css || ""}${pen.js || ""}`;
    assert.ok(source.trim().length > 0, `featured pen ${pen.id} has no source`);
  }
});

test("featured pens install once and record the seed marker", async () => {
  const installedIds = [];
  let savedIds = null;

  const installed = await installFeaturedCodePenApps({
    pens: [
      { id: "starfield", name: "Starfield", html: "<i></i>" },
      { id: "bouncing-logo", name: "Bouncing Logo", html: "<i></i>" },
      { id: "matrix-rain", name: "Matrix Rain", html: "<i></i>" }
    ],
    installApp: async ({ id }) => {
      installedIds.push(id);
      return { manifest: { id: `pen-${id}` } };
    },
    isInstalled: () => false,
    loadSeededIds: async () => [],
    saveSeededIds: async (ids) => {
      savedIds = ids;
    }
  });

  assert.deepEqual(installed, ["pen-starfield", "pen-bouncing-logo", "pen-matrix-rain"]);
  assert.deepEqual(installedIds, ["starfield", "bouncing-logo", "matrix-rain"]);
  assert.deepEqual(savedIds, ["pen-starfield", "pen-bouncing-logo", "pen-matrix-rain"]);
});

test("featured pens that were seeded before are never resurrected", async () => {
  let installCalls = 0;
  let saveCalls = 0;

  const installed = await installFeaturedCodePenApps({
    pens: [{ id: "starfield", name: "Starfield", html: "<i></i>" }],
    installApp: async () => {
      installCalls += 1;
      return { manifest: { id: "pen-starfield" } };
    },
    isInstalled: () => false,
    loadSeededIds: async () => ["pen-starfield"],
    saveSeededIds: async () => {
      saveCalls += 1;
    }
  });

  assert.deepEqual(installed, []);
  assert.equal(installCalls, 0);
  assert.equal(saveCalls, 0, "seed marker rewritten without changes");
});

test("already installed pens are marked seeded without reinstalling", async () => {
  let installCalls = 0;
  let savedIds = null;

  const installed = await installFeaturedCodePenApps({
    pens: [{ id: "starfield", name: "Starfield", html: "<i></i>" }],
    installApp: async () => {
      installCalls += 1;
      return { manifest: { id: "pen-starfield" } };
    },
    isInstalled: () => true,
    loadSeededIds: async () => [],
    saveSeededIds: async (ids) => {
      savedIds = ids;
    }
  });

  assert.deepEqual(installed, []);
  assert.equal(installCalls, 0);
  assert.deepEqual(savedIds, ["pen-starfield"]);
});

test("a failed install stays unseeded so the next boot retries", async () => {
  let savedIds = null;

  const installed = await installFeaturedCodePenApps({
    pens: [
      { id: "starfield", name: "Starfield", html: "<i></i>" },
      { id: "matrix-rain", name: "Matrix Rain", html: "<i></i>" }
    ],
    installApp: async ({ id }) => {
      if (id === "starfield") throw new Error("boom");
      return { manifest: { id: `pen-${id}` } };
    },
    isInstalled: () => false,
    loadSeededIds: async () => [],
    saveSeededIds: async (ids) => {
      savedIds = ids;
    }
  });

  assert.deepEqual(installed, ["pen-matrix-rain"]);
  assert.deepEqual(savedIds, ["pen-matrix-rain"]);
});

test("featured pens install end-to-end through the real installer pipeline", async () => {
  const installed = await installFeaturedCodePenApps({
    loadSeededIds: async () => [],
    saveSeededIds: async () => {}
  });

  try {
    assert.deepEqual(installed.sort(), ["pen-bouncing-logo", "pen-matrix-rain", "pen-starfield"]);

    const starfield = getManifestForApp("pen-starfield");
    assert.equal(starfield.name, "Starfield");
    assert.equal(starfield.icon, "codepen");
    assert.equal(starfield.window.width, 720);

    const titles = getInstalledPrograms().map((p) => p.title);
    assert.ok(titles.includes("Starfield"));
    assert.ok(titles.includes("Bouncing Logo"));
    assert.ok(titles.includes("Matrix Rain"));
  } finally {
    for (const id of installed) {
      await uninstallApp(id).catch(() => {});
    }
  }
});

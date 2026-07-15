import assert from "node:assert/strict";
import { test } from "node:test";

const { FEATURED_CODEPEN_PENS, installFeaturedCodePenApps } = await import("./featuredPens.js");
const { getCodePenAppId, parseCodePenUrl } = await import("./codepen.js");
const { getManifestForApp, getInstalledPrograms, uninstallApp } = await import("../installer.js");

test("every featured pen entry is a valid CodePen URL with a unique app id", () => {
  const ids = new Set();
  for (const pen of FEATURED_CODEPEN_PENS) {
    assert.ok(parseCodePenUrl(pen.url), `invalid CodePen URL: ${pen.url}`);
    const id = getCodePenAppId(pen.url);
    assert.ok(id, `no app id derived for ${pen.url}`);
    assert.ok(!ids.has(id), `duplicate featured app id: ${id}`);
    ids.add(id);
    assert.ok(pen.name && typeof pen.name === "string", `missing name for ${pen.url}`);
  }
});

test("featured pens install once and record the seed marker", async () => {
  const installedUrls = [];
  let savedIds = null;

  const installed = await installFeaturedCodePenApps({
    pens: [
      { url: "https://codepen.io/goosethe/pen/azmPzyE", name: "Blorpis" },
      { url: "https://codepen.io/goosethe/pen/JoRwJjd", name: "Dolf" },
      { url: "https://codepen.io/goosethe/pen/GgjNXOX", name: "Bro Bater" }
    ],
    installApp: async ({ rawUrl }) => {
      installedUrls.push(rawUrl);
      return { manifest: { id: getCodePenAppId(rawUrl) } };
    },
    isInstalled: () => false,
    loadSeededIds: async () => [],
    saveSeededIds: async (ids) => {
      savedIds = ids;
    }
  });

  assert.deepEqual(installed, ["codepen-azmpzye", "codepen-jorwjjd", "codepen-ggjnxox"]);
  assert.equal(installedUrls.length, 3);
  assert.deepEqual(savedIds, ["codepen-azmpzye", "codepen-jorwjjd", "codepen-ggjnxox"]);
});

test("featured pens that were seeded before are never resurrected", async () => {
  let installCalls = 0;
  let saveCalls = 0;

  const installed = await installFeaturedCodePenApps({
    pens: [{ url: "https://codepen.io/goosethe/pen/azmPzyE", name: "Blorpis" }],
    installApp: async () => {
      installCalls += 1;
      return { manifest: { id: "codepen-azmpzye" } };
    },
    isInstalled: () => false,
    loadSeededIds: async () => ["codepen-azmpzye"],
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
    pens: [{ url: "https://codepen.io/goosethe/pen/azmPzyE", name: "Blorpis" }],
    installApp: async () => {
      installCalls += 1;
      return { manifest: { id: "codepen-azmpzye" } };
    },
    isInstalled: () => true,
    loadSeededIds: async () => [],
    saveSeededIds: async (ids) => {
      savedIds = ids;
    }
  });

  assert.deepEqual(installed, []);
  assert.equal(installCalls, 0);
  assert.deepEqual(savedIds, ["codepen-azmpzye"]);
});

test("a failed install stays unseeded so the next boot retries", async () => {
  let savedIds = null;

  const installed = await installFeaturedCodePenApps({
    pens: [
      { url: "https://codepen.io/goosethe/pen/azmPzyE", name: "Blorpis" },
      { url: "https://codepen.io/goosethe/pen/JoRwJjd", name: "Dolf" }
    ],
    installApp: async ({ rawUrl }) => {
      if (rawUrl.includes("azmPzyE")) throw new Error("boom");
      return { manifest: { id: getCodePenAppId(rawUrl) } };
    },
    isInstalled: () => false,
    loadSeededIds: async () => [],
    saveSeededIds: async (ids) => {
      savedIds = ids;
    }
  });

  assert.deepEqual(installed, ["codepen-jorwjjd"]);
  assert.deepEqual(savedIds, ["codepen-jorwjjd"]);
});

test("featured pens install end-to-end through the real installer pipeline", async () => {
  const installed = await installFeaturedCodePenApps({
    loadSeededIds: async () => [],
    saveSeededIds: async () => {}
  });

  try {
    assert.deepEqual(installed.sort(), ["codepen-azmpzye", "codepen-ggjnxox", "codepen-jorwjjd"]);

    const blorpis = getManifestForApp("codepen-azmpzye");
    assert.equal(blorpis.name, "Blorpis");
    assert.equal(blorpis.icon, "codepen");
    assert.equal(blorpis.window.width, 900);

    const titles = getInstalledPrograms().map((p) => p.title);
    assert.ok(titles.includes("Blorpis"));
    assert.ok(titles.includes("Dolf"));
    assert.ok(titles.includes("Bro Bater"));
  } finally {
    for (const id of installed) {
      await uninstallApp(id).catch(() => {});
    }
  }
});

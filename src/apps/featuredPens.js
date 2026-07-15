import { getCodePenAppId, installCodePenApp } from "./codepen.js";
import { getManifestForApp } from "../installer.js";
import { readFileStoreValue, writeFileStoreValue } from "../filesystem.js";

// Curated pens that ship pre-installed as Oriel apps. Each entry is installed
// once through the regular CodePen install pipeline (virtual-filesystem
// manifest + runtime registry); uninstalling one keeps it uninstalled because
// the seed marker below remembers which ids have already been offered.
export const FEATURED_CODEPEN_PENS = [
  {
    url: "https://codepen.io/goosethe/pen/azmPzyE",
    name: "Blorpis",
    width: 900,
    height: 640
  },
  {
    url: "https://codepen.io/goosethe/pen/JoRwJjd",
    name: "Dolf",
    width: 900,
    height: 640
  },
  {
    url: "https://codepen.io/goosethe/pen/GgjNXOX",
    name: "Bro Bater",
    width: 900,
    height: 640
  }
];

export const FEATURED_PENS_SEED_KEY = "oriel-featured-codepen-seeded";

async function readSeededIds() {
  try {
    const stored = await readFileStoreValue(FEATURED_PENS_SEED_KEY);
    if (Array.isArray(stored?.ids)) {
      return stored.ids.filter((id) => typeof id === "string");
    }
  } catch (err) {
    console.warn("Failed to read featured CodePen seed marker", err);
  }
  return [];
}

async function writeSeededIds(ids) {
  try {
    await writeFileStoreValue(FEATURED_PENS_SEED_KEY, { ids });
  } catch (err) {
    console.warn("Failed to persist featured CodePen seed marker", err);
  }
}

export async function installFeaturedCodePenApps({
  pens = FEATURED_CODEPEN_PENS,
  installApp = installCodePenApp,
  isInstalled = (id) => Boolean(getManifestForApp(id)),
  loadSeededIds = readSeededIds,
  saveSeededIds = writeSeededIds
} = {}) {
  const seeded = new Set(await loadSeededIds());
  const installed = [];
  let seedChanged = false;

  for (const pen of pens) {
    const id = getCodePenAppId(pen.url);
    if (!id) {
      console.warn(`Skipping featured CodePen entry with invalid URL: ${pen.url}`);
      continue;
    }
    // Seeded before: the user may have uninstalled it since, so never resurrect.
    if (seeded.has(id)) continue;
    if (isInstalled(id)) {
      seeded.add(id);
      seedChanged = true;
      continue;
    }

    try {
      const { manifest } = await installApp({
        rawUrl: pen.url,
        name: pen.name,
        width: pen.width,
        height: pen.height
      });
      installed.push(manifest.id);
      seeded.add(id);
      seedChanged = true;
    } catch (err) {
      // Leave the pen unseeded so the next boot retries the install.
      console.warn(`Failed to install featured CodePen app '${pen.name}':`, err);
    }
  }

  if (seedChanged) await saveSeededIds(Array.from(seeded));
  return installed;
}

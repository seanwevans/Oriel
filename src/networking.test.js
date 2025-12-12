import assert from "node:assert/strict";
import { test } from "node:test";

const storage = new Map();
const storageKey = "oriel-network-defaults";

global.localStorage = {
  getItem: (key) => (storage.has(key) ? storage.get(key) : null),
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: (key) => storage.delete(key)
};

const { NETWORK_CONFIG } = await import("./config.js");
const networking = await import("./networking.js");
const { getNetworkDefaults, resetNetworkDefaults, updateNetworkDefaults } = networking;

test("partial overrides do not clear defaults", () => {
  resetNetworkDefaults();
  updateNetworkDefaults({ browserProxyPrefix: "", radioBrowserBase: undefined });

  const merged = getNetworkDefaults();
  assert.equal(merged.browserProxyPrefix, NETWORK_CONFIG.browserProxyPrefix);
  assert.equal(merged.radioBrowserBase, NETWORK_CONFIG.radioBrowserBase);

  const stored = storage.get(storageKey);
  assert.deepEqual(JSON.parse(stored), {});
});

test("explicit overrides are stored and merged", () => {
  resetNetworkDefaults();
  const proxyPrefix = "https://example-proxy.test/";
  const baseUrl = "https://custom-radio.example/json";

  updateNetworkDefaults({ browserProxyPrefix: proxyPrefix, radioBrowserBase: baseUrl });

  const merged = getNetworkDefaults();
  assert.equal(merged.browserProxyPrefix, proxyPrefix);
  assert.equal(merged.radioBrowserBase, baseUrl);

  const stored = storage.get(storageKey);
  assert.deepEqual(JSON.parse(stored), {
    browserProxyPrefix: proxyPrefix,
    radioBrowserBase: baseUrl
  });
});

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
const { getNetworkDefaults, refreshNetworkedWindows, resetNetworkDefaults, updateNetworkDefaults } = networking;


test("refreshNetworkedWindows reloads browser windows once", () => {
  const previousWindow = global.window;
  let reloadCount = 0;

  global.window = {
    wm: {
      windows: [
        {
          type: "browser",
          el: {
            browserReload: () => {
              reloadCount += 1;
            }
          }
        }
      ]
    }
  };

  try {
    refreshNetworkedWindows();
    assert.equal(reloadCount, 1);
  } finally {
    if (previousWindow === undefined) {
      delete global.window;
    } else {
      global.window = previousWindow;
    }
  }
});

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

test("overrides can be cleared without resetting defaults", () => {
  resetNetworkDefaults();
  const proxyPrefix = "https://example-proxy.test/";

  updateNetworkDefaults({ browserProxyPrefix: proxyPrefix });

  let stored = storage.get(storageKey);
  assert.deepEqual(JSON.parse(stored), {
    browserProxyPrefix: proxyPrefix
  });

  updateNetworkDefaults({ browserProxyPrefix: null });

  const merged = getNetworkDefaults();
  assert.equal(merged.browserProxyPrefix, NETWORK_CONFIG.browserProxyPrefix);

  stored = storage.get(storageKey);
  assert.deepEqual(JSON.parse(stored), {});
});

test("RSS proxy text responses are read without attempting JSON first", async () => {
  const xml = "<?xml version=\"1.0\"?><rss><channel><title>Example</title></channel></rss>";
  const response = new Response(xml, {
    headers: { "content-type": "application/rss+xml" }
  });

  const text = await networking.readRssResponseText(response);

  assert.equal(text, xml);
});

test("RSS proxy JSON envelopes return their contents field", async () => {
  const xml = "<?xml version=\"1.0\"?><rss><channel><title>Example</title></channel></rss>";
  const response = new Response(JSON.stringify({ contents: xml }), {
    headers: { "content-type": "application/json" }
  });

  const text = await networking.readRssResponseText(response);

  assert.equal(text, xml);
});

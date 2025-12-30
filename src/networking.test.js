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
const { getNetworkDefaults, parseRssXml, resetNetworkDefaults, stripHtmlText, updateNetworkDefaults } = networking;

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

test("RSS parsing works without DOM globals", () => {
  const originalDOMParser = global.DOMParser;
  const originalDocument = global.document;

  // Ensure DOM globals are absent to exercise server-side code paths
  delete global.DOMParser;
  delete global.document;

  try {
    const xml = `
      <rss version="2.0">
        <channel>
          <title>Sample Feed</title>
          <item>
            <title>Hello World</title>
            <link>https://example.com/hello</link>
            <pubDate>Tue, 31 Dec 2024 23:59:00 GMT</pubDate>
            <description><![CDATA[<p>Hi <em>there</em>!</p><script>ignored()</script>]]></description>
          </item>
        </channel>
      </rss>
    `;

    const parsed = parseRssXml(xml);
    assert.equal(parsed.title, "Sample Feed");
    assert.equal(parsed.items.length, 1);
    const [item] = parsed.items;
    assert.equal(item.title, "Hello World");
    assert.equal(item.link, "https://example.com/hello");
    assert.equal(stripHtmlText("<div>Hi <strong>there</strong><style>body{}</style></div>"), "Hi there");
    assert.equal(item.summary, "Hi there!");
  } finally {
    global.DOMParser = originalDOMParser;
    global.document = originalDocument;
  }
});

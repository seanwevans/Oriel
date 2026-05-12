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
const configModule = await import("./network/config.js");
const rssClientModule = await import("./network/rssClient.js");
const trackedFetchModule = await import("./network/trackedFetch.js");
const { getNetworkDefaults, refreshNetworkedWindows, resetNetworkDefaults, updateNetworkDefaults } = networking;


test("split networking modules expose the compatibility barrel implementations", () => {
  assert.equal(configModule.normalizeHttpUrl, networking.normalizeHttpUrl);
  assert.equal(configModule.stripScriptTags, networking.stripScriptTags);
  assert.equal(rssClientModule.parseRssXml, networking.parseRssXml);
  assert.equal(rssClientModule.fetchRssFeed, networking.fetchRssFeed);
  assert.equal(trackedFetchModule.trackedFetch, networking.trackedFetch);
  assert.equal(trackedFetchModule.subscribeToNetworkEvents, networking.subscribeToNetworkEvents);
});

test("refreshNetworkedWindows reloads parameterized network window collections", () => {
  const calls = [];
  const windows = [
    { type: "browser", el: { browserReload: () => calls.push("browser") } },
    { type: "rss", el: { reloadRssWithDefaults: () => calls.push("rss") } },
    { type: "radio", el: { reloadRadioWithDefaults: () => calls.push("radio") } },
    {
      type: "radiogarden",
      el: { refreshRadioGardenWithDefaults: () => calls.push("radiogarden") }
    },
    { type: "browser", el: null },
    { type: "notes", el: { reload: () => calls.push("notes") } }
  ];

  refreshNetworkedWindows({ windows });
  refreshNetworkedWindows(windows);

  assert.deepEqual(calls, [
    "browser",
    "rss",
    "radio",
    "radiogarden",
    "browser",
    "rss",
    "radio",
    "radiogarden"
  ]);
});

test("refreshNetworkedWindows preserves legacy window manager fallback", () => {
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

test("config helpers normalize only HTTP(S) URLs and strip script markup", () => {
  assert.equal(networking.normalizeHttpUrl("example.com/path"), "https://example.com/path");
  assert.equal(networking.normalizeHttpUrl("localhost:5173/app"), "https://localhost:5173/app");
  assert.equal(networking.normalizeHttpUrl("https://example.test"), "https://example.test");
  assert.equal(networking.normalizeHttpUrl("ftp://example.test/file"), null);
  assert.equal(networking.normalizeHttpUrl("   "), null);
  assert.equal(networking.stripScriptTags("<p>Safe</p><script>alert(1)</script>"), "<p>Safe</p>");
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

test("parseRssXml extracts channel metadata, Atom links, dates, and stripped summaries", () => {
  const previousDOMParser = global.DOMParser;
  const previousDocument = global.document;
  global.DOMParser = installRssDomParser([
    {
      title: "Story One",
      link: "https://example.test/story-one",
      pubDate: "Tue, 12 May 2026 10:00:00 GMT",
      description: "<p>Hello <strong>feed</strong></p><script>bad()</script>"
    },
    {
      title: "Story Two",
      href: "https://example.test/story-two",
      updated: "2026-05-12T11:00:00Z",
      summary: "Atom summary"
    }
  ]);
  global.document = {
    createElement: () => new FakeElement()
  };

  try {
    const parsed = networking.parseRssXml("<rss></rss>");

    assert.equal(parsed.title, "Example Feed");
    assert.deepEqual(parsed.items, [
      {
        title: "Story One",
        link: "https://example.test/story-one",
        date: "Tue, 12 May 2026 10:00:00 GMT",
        summary: "Hello feed"
      },
      {
        title: "Story Two",
        link: "https://example.test/story-two",
        date: "2026-05-12T11:00:00Z",
        summary: "Atom summary"
      }
    ]);
  } finally {
    if (previousDOMParser === undefined) delete global.DOMParser;
    else global.DOMParser = previousDOMParser;
    if (previousDocument === undefined) delete global.document;
    else global.document = previousDocument;
  }
});

test("fetchRssFeed proxies normalized URLs and returns parsed feed metadata", async () => {
  const previousDOMParser = global.DOMParser;
  const previousDocument = global.document;
  const previousFetch = global.fetch;
  const requested = [];
  global.DOMParser = installRssDomParser([
    { title: "Fetched", link: "https://example.test/fetched", description: "Fetched summary" }
  ]);
  global.document = { createElement: () => new FakeElement() };
  global.fetch = async (url, options) => {
    requested.push({ url, options });
    return new Response("<rss></rss>", { status: 200 });
  };

  try {
    const signal = AbortSignal.timeout(1000);
    const parsed = await networking.fetchRssFeed("example.test/feed.xml", { signal });

    assert.equal(requested.length, 1);
    assert.equal(
      requested[0].url,
      `${networking.RSS_PROXY_ROOT}${encodeURIComponent("https://example.test/feed.xml")}`
    );
    assert.equal(requested[0].options.signal, signal);
    assert.equal(parsed.sourceUrl, "https://example.test/feed.xml");
    assert.equal(parsed.items[0].title, "Fetched");
  } finally {
    if (previousDOMParser === undefined) delete global.DOMParser;
    else global.DOMParser = previousDOMParser;
    if (previousDocument === undefined) delete global.document;
    else global.document = previousDocument;
    if (previousFetch === undefined) delete global.fetch;
    else global.fetch = previousFetch;
  }
});

test("trackedFetch publishes request and response activity with compact previews", async () => {
  const previousFetch = global.fetch;
  const events = [];
  const unsubscribe = networking.subscribeToNetworkEvents((event) => events.push(event));
  global.fetch = async () =>
    new Response("Response body", {
      status: 201,
      headers: { "content-type": "text/plain" }
    });

  try {
    const response = await networking.trackedFetch("https://api.example.test/items", {
      method: "post",
      body: "Request body"
    });

    assert.equal(response.status, 201);
    assert.equal(events.length, 2);
    assert.equal(events[0].phase, "request");
    assert.equal(events[0].method, "POST");
    assert.equal(events[0].bodyPreview, "Request body");
    assert.equal(events[1].phase, "response");
    assert.equal(events[1].id, events[0].id);
    assert.equal(events[1].status, 201);
    assert.equal(events[1].ok, true);
    assert.equal(events[1].bodyPreview, "Response body");
    assert.equal(events[1].contentType, "text/plain");
  } finally {
    unsubscribe();
    if (previousFetch === undefined) delete global.fetch;
    else global.fetch = previousFetch;
  }
});

test("trackedFetch publishes an error activity before rethrowing", async () => {
  const previousFetch = global.fetch;
  const events = [];
  const unsubscribe = networking.subscribeToNetworkEvents((event) => events.push(event));
  global.fetch = async () => {
    throw new Error("network down");
  };

  try {
    await assert.rejects(
      () => networking.trackedFetch(new Request("https://api.example.test/fail")),
      /network down/
    );
    assert.equal(events.length, 2);
    assert.equal(events[0].phase, "request");
    assert.equal(events[1].phase, "error");
    assert.equal(events[1].id, events[0].id);
    assert.equal(events[1].status, "error");
    assert.equal(events[1].ok, false);
    assert.equal(events[1].error, "network down");
  } finally {
    unsubscribe();
    if (previousFetch === undefined) delete global.fetch;
    else global.fetch = previousFetch;
  }
});

class FakeElement {
  constructor(className = "") {
    this.className = className;
    this.children = [];
    this.dataset = {};
    this.listeners = {};
    this.attributes = new Map();
    this.assignmentLog = [];
    this.style = {};
    this.value = "";
    this.textContent = "";
    this.classList = {
      toggle: () => {}
    };
  }

  set innerHTML(value) {
    this._innerHTML = value;
    this.children = [];
    this.textContent = String(value || "")
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<[^>]*>/g, "");
  }

  get innerHTML() {
    return this._innerHTML || "";
  }

  set srcdoc(value) {
    this.assignmentLog.push({
      type: "srcdoc",
      value: String(value),
      sandbox: this.getAttribute("sandbox")
    });
    this._srcdoc = String(value);
  }

  get srcdoc() {
    return this._srcdoc || "";
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
    if (name === "href") this.href = String(value);
  }

  getAttribute(name) {
    return this.attributes.get(name) || null;
  }

  removeAttribute(name) {
    this.attributes.delete(name);
    if (name === "href") this.href = "";
  }

  addEventListener(type, handler) {
    this.listeners[type] = handler;
  }

  querySelectorAll() {
    return [];
  }

  closest(selector) {
    if (!selector.startsWith(".")) return null;
    const className = selector.slice(1);
    return this.className.split(/\s+/).includes(className) ? this : null;
  }
}


function createBrowserWindow() {
  const elements = new Map(
    [
      ".browser-url",
      ".browser-frame",
      ".browser-status",
      '[data-action="back"]',
      '[data-action="forward"]',
      '[data-action="refresh"]',
      '[data-action="home"]',
      '[data-action="go"]'
    ].map((selector) => [selector, new FakeElement(selector.replace(/^[.#]/, ""))])
  );

  return {
    dataset: { id: "browser-test" },
    elements,
    querySelector(selector) {
      return elements.get(selector) || null;
    }
  };
}

async function waitFor(predicate) {
  for (let i = 0; i < 20; i += 1) {
    if (predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

test("browser iframe is sandboxed before proxied HTML is assigned", async () => {
  const previousFetch = global.fetch;
  const win = createBrowserWindow();
  const frame = win.elements.get(".browser-frame");

  updateNetworkDefaults({
    browserHome: "https://example.test/",
    browserProxyPrefix: "https://proxy.test/"
  });

  global.fetch = async () => new Response(
    '<main>Safe preview</main><script>globalThis.evil = true;</script>',
    { headers: { "content-type": "text/html" } }
  );

  try {
    networking.initBrowser(win, {});
    await waitFor(() => frame.srcdoc.includes("Safe preview"));

    assert.ok(frame.assignmentLog.length >= 2);
    assert.ok(
      frame.assignmentLog.every((entry) => entry.sandbox === networking.BROWSER_FRAME_SANDBOX),
      "sandbox must be present before every srcdoc assignment"
    );
    assert.equal(frame.getAttribute("sandbox"), "allow-forms allow-popups");
    assert.equal(frame.getAttribute("sandbox").includes("allow-same-origin"), false);
    assert.equal(frame.getAttribute("sandbox").includes("allow-scripts"), false);
    assert.equal(frame.srcdoc.includes("<script"), false);
  } finally {
    if (previousFetch === undefined) {
      delete global.fetch;
    } else {
      global.fetch = previousFetch;
    }
    resetNetworkDefaults();
  }
});

function createRssWindow() {
  const elements = new Map(
    [
      ".rss-url",
      ".rss-preset",
      ".rss-load",
      ".rss-status",
      ".rss-list",
      ".rss-preview-title",
      ".rss-preview-meta",
      ".rss-preview-text",
      ".rss-preview-link"
    ].map((selector) => [selector, new FakeElement(selector.slice(1))])
  );
  elements.get(".rss-url").value = "https://example.test/feed.xml";

  return {
    elements,
    querySelector(selector) {
      return elements.get(selector) || null;
    }
  };
}

function installRssDomParser(feedItems) {
  return class FakeDOMParser {
    parseFromString() {
      return {
        querySelector(selector) {
          if (selector === "parsererror") return null;
          if (selector === "channel > title, feed > title") return { textContent: "Example Feed" };
          return null;
        },
        querySelectorAll(selector) {
          if (selector !== "item, entry") return [];
          return feedItems.map((item) => ({
            querySelector(itemSelector) {
              if (itemSelector === "link[href]") {
                if (!item.href) return null;
                return { getAttribute: (name) => (name === "href" ? item.href : null) };
              }
              if (item[itemSelector] === undefined) return null;
              return { textContent: item[itemSelector] };
            }
          }));
        }
      };
    }
  };
}

test("RSS preview only exposes normalized HTTP(S) item links", async () => {
  const previousDocument = global.document;
  const previousDOMParser = global.DOMParser;
  const previousFetch = global.fetch;
  const previousConsoleError = console.error;
  const win = createRssWindow();
  const feedItems = [
    {
      title: "Unsafe script URL",
      link: "javascript:alert(1)",
      pubDate: "2024-01-01T00:00:00Z",
      description: "Should not expose a link"
    },
    {
      title: "Empty URL",
      link: "",
      pubDate: "2024-01-02T00:00:00Z",
      description: "Should not expose a link"
    },
    {
      title: "Normal URL",
      link: "https://example.com/story",
      pubDate: "2024-01-03T00:00:00Z",
      description: "Should expose a link"
    }
  ];

  global.document = {
    createElement: (tagName) => new FakeElement(tagName)
  };
  global.DOMParser = installRssDomParser(feedItems);
  global.fetch = async () => new Response("<rss></rss>", {
    headers: { "content-type": "application/rss+xml" }
  });
  console.error = () => {};

  try {
    new networking.RssApp({ windowEl: win }).mount();
    await new Promise((resolve) => setTimeout(resolve, 0));

    const listEl = win.elements.get(".rss-list");
    const linkEl = win.elements.get(".rss-preview-link");

    assert.equal(linkEl.style.display, "none");
    assert.equal(linkEl.getAttribute("href"), null);
    assert.equal(linkEl.href, "");

    listEl.listeners.click({ target: listEl.children[1] });
    assert.equal(linkEl.style.display, "none");
    assert.equal(linkEl.getAttribute("href"), null);
    assert.equal(linkEl.href, "");

    listEl.listeners.click({ target: listEl.children[2] });
    assert.equal(linkEl.style.display, "inline");
    assert.equal(linkEl.href, "https://example.com/story");
  } finally {
    if (previousDocument === undefined) {
      delete global.document;
    } else {
      global.document = previousDocument;
    }
    if (previousDOMParser === undefined) {
      delete global.DOMParser;
    } else {
      global.DOMParser = previousDOMParser;
    }
    if (previousFetch === undefined) {
      delete global.fetch;
    } else {
      global.fetch = previousFetch;
    }
    console.error = previousConsoleError;
  }
});

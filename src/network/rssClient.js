import { RSS_PROXY_ROOT, normalizeHttpUrl, stripHtmlText } from "./config.js";

export function formatRssDate(value) {
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "No date";
  return dt.toLocaleString();
}

export function parseRssXml(xmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "application/xml");
  if (doc.querySelector("parsererror")) throw new Error("Invalid feed");
  const feedTitle = doc.querySelector("channel > title, feed > title")?.textContent?.trim() || "";
  const nodes = doc.querySelectorAll("item, entry");
  const items = Array.from(nodes).map((node) => {
    const get = (sel) => node.querySelector(sel)?.textContent?.trim() || "";
    const resolveLink = () => {
      const linkEl = node.querySelector("link[href]");
      if (linkEl) return linkEl.getAttribute("href") || "";
      return get("link");
    };
    return {
      title: get("title"),
      link: resolveLink(),
      date: get("pubDate") || get("updated") || get("published"),
      summary: stripHtmlText(get("description") || get("summary") || get("content"))
    };
  });
  return { title: feedTitle, items };
}

export async function readRssResponseText(res) {
  const fallbackRes = res.clone();
  const contentType = res.headers?.get?.("content-type") || "";

  if (contentType.includes("json")) {
    try {
      const data = await res.json();
      return data?.contents || data?.body || data?.data || "";
    } catch (jsonErr) {
      console.warn("RSS proxy JSON response could not be parsed, falling back to text", jsonErr);
      return fallbackRes.text();
    }
  }

  try {
    return await fallbackRes.text();
  } catch (textErr) {
    console.warn("RSS proxy text response could not be read, trying JSON envelope", textErr);
    const data = await res.json();
    return data?.contents || data?.body || data?.data || "";
  }
}

export async function fetchRssFeed(rawUrl, options = {}) {
  const normalized = normalizeHttpUrl(rawUrl);
  if (!normalized) throw new Error("Feed URL is required");
  const { signal } = options;
  const proxyUrl = `${RSS_PROXY_ROOT}${encodeURIComponent(normalized)}`;
  const res = await fetch(proxyUrl, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await readRssResponseText(res);
  const parsed = parseRssXml(text);
  return { ...parsed, sourceUrl: normalized };
}

export async function fetchGroupedRssFeeds(feeds = [], options = {}) {
  const tasks = (feeds || []).map(async (feed) => {
    try {
      const { items, title } = await fetchRssFeed(feed.url, options);
      return items.map((item) => ({
        ...item,
        feedId: feed.id || feed.url,
        feedTitle: feed.title || feed.label || title || feed.url
      }));
    } catch (err) {
      console.warn("Failed to load feed", feed?.url, err);
      return [];
    }
  });
  const results = await Promise.all(tasks);
  return results.flat();
}

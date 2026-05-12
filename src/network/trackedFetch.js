import { publish, subscribe } from "../eventBus.js";

const NETWORK_ACTIVITY_EVENT = "network:activity";

let networkEventCounter = 0;

function nextNetworkEventId() {
  networkEventCounter += 1;
  return networkEventCounter;
}

function normalizePreviewText(text) {
  if (!text) return "";
  const compact = text.replace(/\s+/g, " ").trim();
  if (compact.length <= 240) return compact;
  return `${compact.slice(0, 237)}...`;
}

export function publishNetworkEvent(event = {}) {
  publish(NETWORK_ACTIVITY_EVENT, {
    id: event.id ?? nextNetworkEventId(),
    timestamp: event.timestamp || Date.now(),
    ...event
  });
}

export function subscribeToNetworkEvents(handler) {
  return subscribe(NETWORK_ACTIVITY_EVENT, handler);
}

export async function trackedFetch(input, init = {}) {
  const url = typeof input === "string" ? input : input?.url || String(input);
  const method = (init.method || "GET").toUpperCase();
  const bodyPreview = normalizePreviewText(
    typeof init.body === "string" ? init.body : ""
  );
  const id = nextNetworkEventId();

  publishNetworkEvent({
    id,
    url,
    method,
    phase: "request",
    status: "pending",
    bodyPreview
  });

  try {
    const response = await fetch(input, init);
    let responsePreview = "";
    try {
      const clone = response.clone();
      const text = await clone.text();
      responsePreview = normalizePreviewText(text);
    } catch (err) {
      responsePreview = "(unreadable payload)";
    }
    publishNetworkEvent({
      id,
      url,
      method,
      phase: "response",
      status: response.status,
      ok: response.ok,
      bodyPreview: responsePreview,
      contentType: response.headers?.get?.("content-type") || ""
    });
    return response;
  } catch (err) {
    publishNetworkEvent({
      id,
      url,
      method,
      phase: "error",
      status: "error",
      ok: false,
      error: err?.message || "Unknown network error"
    });
    throw err;
  }
}

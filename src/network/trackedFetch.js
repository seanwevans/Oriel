import { publish, subscribe } from "../eventBus.js";

const NETWORK_ACTIVITY_EVENT = "network:activity";

const DEFAULT_PREVIEW_CHARACTER_LIMIT = 240;
const DEFAULT_RESPONSE_PREVIEW_BYTE_LIMIT = 4096;
const SKIPPED_RESPONSE_PREVIEW_CONTENT_TYPES = [
  "application/octet-stream",
  "application/pdf",
  "application/x-ndjson",
  "text/event-stream"
];
const SKIPPED_RESPONSE_PREVIEW_PREFIXES = ["audio/", "image/", "video/"];

let networkEventCounter = 0;

function nextNetworkEventId() {
  networkEventCounter += 1;
  return networkEventCounter;
}

function normalizePreviewText(
  text,
  { characterLimit = DEFAULT_PREVIEW_CHARACTER_LIMIT, truncated = false } = {}
) {
  if (!text) return "";
  const compact = text.replace(/\s+/g, " ").trim();
  if (characterLimit <= 0) return truncated ? "..." : "";
  const suffix = truncated ? "..." : "";
  const availableLength = Math.max(0, characterLimit - suffix.length);
  if (compact.length + suffix.length <= characterLimit) return `${compact}${suffix}`;
  return `${compact.slice(0, availableLength)}${suffix}`;
}

function getTrackingOptions(initTracking = {}, helperTracking = {}) {
  return {
    ...initTracking,
    ...helperTracking
  };
}

function shouldCaptureResponsePreview(tracking = {}) {
  return ![
    tracking.responsePreview,
    tracking.responsePreviews,
    tracking.previewResponseBody
  ].some((value) => value === false);
}

function getPreviewByteLimit(tracking = {}) {
  const configured = Number(
    tracking.maxResponsePreviewBytes ?? tracking.responsePreviewByteLimit
  );
  if (Number.isFinite(configured) && configured >= 0) return configured;
  return DEFAULT_RESPONSE_PREVIEW_BYTE_LIMIT;
}

function shouldSkipResponsePreview(contentType = "") {
  const mimeType = contentType.split(";")[0].trim().toLowerCase();
  if (!mimeType) return false;
  return (
    SKIPPED_RESPONSE_PREVIEW_PREFIXES.some((prefix) => mimeType.startsWith(prefix)) ||
    SKIPPED_RESPONSE_PREVIEW_CONTENT_TYPES.includes(mimeType)
  );
}

async function readLimitedResponsePreview(response, tracking = {}) {
  const maxBytes = getPreviewByteLimit(tracking);
  if (maxBytes <= 0 || !response.body?.getReader) return "";

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const chunks = [];
  let bytesRead = 0;
  let truncated = false;

  try {
    while (bytesRead < maxBytes) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = value instanceof Uint8Array ? value : new TextEncoder().encode(String(value));
      const remaining = maxBytes - bytesRead;
      if (chunk.byteLength > remaining) {
        chunks.push(decoder.decode(chunk.slice(0, remaining), { stream: true }));
        bytesRead += remaining;
        truncated = true;
        break;
      }
      chunks.push(decoder.decode(chunk, { stream: true }));
      bytesRead += chunk.byteLength;
    }

    if (!truncated && bytesRead >= maxBytes) {
      truncated = true;
    }

    if (truncated) {
      reader.cancel().catch(() => {});
    }
  } finally {
    reader.releaseLock?.();
  }

  chunks.push(decoder.decode());
  return normalizePreviewText(chunks.join(""), { truncated });
}

async function getResponsePreview(response, tracking = {}) {
  const contentType = response.headers?.get?.("content-type") || "";
  if (!shouldCaptureResponsePreview(tracking) || shouldSkipResponsePreview(contentType)) {
    return "";
  }

  const clone = response.clone();
  if (clone.body?.getReader) {
    return readLimitedResponsePreview(clone, tracking);
  }

  const text = await clone.text();
  return normalizePreviewText(text);
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

export async function trackedFetch(input, init = {}, trackingOptions = {}) {
  const { tracking: initTracking = {}, ...fetchInit } = init || {};
  const tracking = getTrackingOptions(initTracking, trackingOptions);
  const url = typeof input === "string" ? input : input?.url || String(input);
  const method = (fetchInit.method || "GET").toUpperCase();
  const bodyPreview = normalizePreviewText(
    typeof fetchInit.body === "string" ? fetchInit.body : ""
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
    const response = await fetch(input, fetchInit);
    let responsePreview = "";
    try {
      responsePreview = await getResponsePreview(response, tracking);
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

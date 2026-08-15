import assert from "node:assert/strict";
import { test } from "node:test";

import { subscribeToNetworkEvents, trackedFetch } from "./trackedFetch.js";

// Runs one trackedFetch call against a stubbed global fetch and collects the
// network-activity events it publishes — the pair Packet Lab renders.
async function runTracked(fetchImpl, run) {
  const originalFetch = globalThis.fetch;
  const events = [];
  const off = subscribeToNetworkEvents((event) => events.push(event));
  globalThis.fetch = fetchImpl;

  let value = null;
  let error = null;
  try {
    value = await run();
  } catch (err) {
    error = err;
  } finally {
    off();
    globalThis.fetch = originalFetch;
  }

  return { events, value, error };
}

function jsonResponse(body, { status = 200, contentType = "application/json" } = {}) {
  return new Response(body, { status, headers: { "content-type": contentType } });
}

test("a successful request publishes a request event then a response event", async () => {
  const { events, error } = await runTracked(
    async () => jsonResponse('{"ok":true}'),
    () => trackedFetch("https://oriel.test/data")
  );

  assert.equal(error, null);
  assert.equal(events.length, 2);

  const [request, response] = events;
  assert.equal(request.phase, "request");
  assert.equal(request.status, "pending");
  assert.equal(request.url, "https://oriel.test/data");
  assert.equal(request.method, "GET");

  assert.equal(response.phase, "response");
  assert.equal(response.status, 200);
  assert.equal(response.ok, true);
  assert.equal(response.contentType, "application/json");
  assert.equal(response.bodyPreview, '{"ok":true}');

  // Both events share an id so a viewer can pair them into one exchange.
  assert.equal(request.id, response.id);
});

test("the response body stays readable by the caller after preview capture", async () => {
  const { value } = await runTracked(
    async () => jsonResponse('{"value":42}'),
    () => trackedFetch("https://oriel.test/data")
  );

  // trackedFetch clones the response for its preview; consuming the original
  // must still work or every calling app would break.
  assert.deepEqual(await value.json(), { value: 42 });
});

test("the method and a string request body are reported", async () => {
  const { events } = await runTracked(
    async () => jsonResponse("{}"),
    () =>
      trackedFetch("https://oriel.test/submit", {
        method: "post",
        body: '{"name":"oriel"}'
      })
  );

  assert.equal(events[0].method, "POST");
  assert.equal(events[0].bodyPreview, '{"name":"oriel"}');
});

test("whitespace in previews is collapsed", async () => {
  const { events } = await runTracked(
    async () => jsonResponse("line one\n\n   line   two\t", { contentType: "text/plain" }),
    () => trackedFetch("https://oriel.test/text")
  );

  assert.equal(events[1].bodyPreview, "line one line two");
});

test("binary content types are not previewed", async () => {
  for (const contentType of ["image/png", "audio/mpeg", "video/mp4", "application/pdf"]) {
    const { events } = await runTracked(
      async () => jsonResponse("binary-ish payload", { contentType }),
      () => trackedFetch("https://oriel.test/blob")
    );

    assert.equal(events[1].bodyPreview, "", `${contentType} should not be previewed`);
  }
});

test("previews can be disabled per request", async () => {
  const { events } = await runTracked(
    async () => jsonResponse("secret payload"),
    () =>
      trackedFetch("https://oriel.test/private", { tracking: { responsePreview: false } })
  );

  assert.equal(events[1].bodyPreview, "");
});

test("long responses are truncated and marked", async () => {
  const { events } = await runTracked(
    async () => jsonResponse("x".repeat(5000), { contentType: "text/plain" }),
    () => trackedFetch("https://oriel.test/long", {}, { maxResponsePreviewBytes: 64 })
  );

  // The byte limit bounds how much of the stream is read; the truncation marker
  // is appended on top of that budget rather than counted against it.
  assert.equal(events[1].bodyPreview, `${"x".repeat(64)}...`);
});

test("the preview reader stops early instead of draining a huge response", async () => {
  let bytesPulled = 0;
  const hugeResponse = () =>
    new Response(
      new ReadableStream({
        pull(controller) {
          bytesPulled += 1024;
          controller.enqueue(new TextEncoder().encode("y".repeat(1024)));
          if (bytesPulled >= 1024 * 512) controller.close();
        }
      }),
      { headers: { "content-type": "text/plain" } }
    );

  const { events } = await runTracked(hugeResponse, () =>
    trackedFetch("https://oriel.test/stream", {}, { maxResponsePreviewBytes: 128 })
  );

  assert.ok(events[1].bodyPreview.startsWith("y"));
  // Reading the whole stream to build a 128-byte preview would stall Packet Lab
  // on a large download.
  assert.ok(bytesPulled < 1024 * 512, `preview drained ${bytesPulled} bytes`);
});

test("a preview limit of zero disables the preview", async () => {
  const { events } = await runTracked(
    async () => jsonResponse("some text", { contentType: "text/plain" }),
    () => trackedFetch("https://oriel.test/nopreview", {}, { maxResponsePreviewBytes: 0 })
  );

  assert.equal(events[1].bodyPreview, "");
});

test("a failed request publishes an error event and rethrows", async () => {
  const failure = new Error("connection refused");
  const { events, error } = await runTracked(
    async () => {
      throw failure;
    },
    () => trackedFetch("https://oriel.test/down")
  );

  assert.equal(error, failure, "the caller must still see the failure");
  assert.equal(events.length, 2);
  assert.equal(events[1].phase, "error");
  assert.equal(events[1].ok, false);
  assert.equal(events[1].error, "connection refused");
  assert.equal(events[0].id, events[1].id);
});

test("an error status still resolves and is reported with ok false", async () => {
  const { events, value } = await runTracked(
    async () => jsonResponse("not found", { status: 404, contentType: "text/plain" }),
    () => trackedFetch("https://oriel.test/missing")
  );

  assert.equal(value.status, 404);
  assert.equal(events[1].status, 404);
  assert.equal(events[1].ok, false);
});

test("a Request object is reported by its url", async () => {
  const { events } = await runTracked(
    async () => jsonResponse("{}"),
    () => trackedFetch(new Request("https://oriel.test/from-request"))
  );

  assert.equal(events[0].url, "https://oriel.test/from-request");
});

test("every event carries an id and a timestamp", async () => {
  const before = Date.now();
  const { events } = await runTracked(
    async () => jsonResponse("{}"),
    () => trackedFetch("https://oriel.test/data")
  );

  for (const event of events) {
    assert.equal(typeof event.id, "number");
    assert.ok(event.timestamp >= before);
  }
});

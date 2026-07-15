import assert from "node:assert/strict";
import { test } from "node:test";

import {
  formatHexDump,
  getHexEditorContent,
  parseHexString
} from "./hexEditor.js";

test("formatHexDump returns aligned offset and hex rows", () => {
  // 20 bytes spans two 16-byte rows.
  const bytes = new Uint8Array(20).map((_, i) => i);
  const dump = formatHexDump(bytes);
  const offsetLines = dump.offsetText.split("\n");
  const hexLines = dump.hexText.split("\n");
  const asciiLines = dump.asciiText.split("\n");

  assert.deepEqual(offsetLines, ["000000", "000010"]);
  assert.equal(hexLines.length, offsetLines.length);
  assert.equal(asciiLines.length, offsetLines.length);
  assert.ok(hexLines[0].startsWith("00 01 02 03"));
  assert.equal(hexLines[1].trimEnd(), "10 11 12 13");
});

test("formatHexDump handles an empty buffer", () => {
  assert.deepEqual(formatHexDump(new Uint8Array()), {
    offsetText: "000000",
    hexText: "",
    asciiText: ""
  });
});

test("formatHexDump maps non-printable bytes to dots in the ASCII column", () => {
  const dump = formatHexDump(new Uint8Array([72, 105, 0, 200]));
  assert.equal(dump.asciiText.slice(0, 4), "Hi..");
});

test("parseHexString reads whitespace-separated pairs and rejects odd input", () => {
  assert.deepEqual([...parseHexString("48 69")], [72, 105]);
  assert.deepEqual([...parseHexString("4869")], [72, 105]);
  assert.equal(parseHexString("486"), null);
  assert.deepEqual([...parseHexString("")], []);
});

test("hex editor content disables textarea wrapping so rows stay aligned", () => {
  const content = getHexEditorContent();
  // Each of the three panes must disable soft-wrap; otherwise long hex rows
  // wrap and drift out of alignment with the offset gutter.
  const wrapCount = (content.match(/wrap="off"/g) || []).length;
  assert.equal(wrapCount, 3);
});

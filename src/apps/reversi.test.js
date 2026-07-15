import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { getReversiContent } from "./reversi.js";

const css = readFileSync(new URL("../oriel.css", import.meta.url), "utf8");

function backgroundOf(selector) {
  const block = new RegExp(
    selector.replace(/[.]/g, "\\.") + "\\s*\\{([^}]*)\\}"
  ).exec(css);
  assert.ok(block, `expected a CSS rule for ${selector}`);
  const bg = /background:\s*([^;]+);/.exec(block[1]);
  assert.ok(bg, `expected a background declaration for ${selector}`);
  return bg[1].trim().toLowerCase();
}

test("Reversi board draws visible grid lines distinct from the cells", () => {
  // The board background shows through the 1px grid gap; if it matches the
  // cell color the 8x8 grid is invisible (the original bug).
  assert.notEqual(backgroundOf(".reversi-board"), backgroundOf(".reversi-cell"));
});

test("Reversi content provides the board mount point", () => {
  const content = getReversiContent();
  assert.match(content, /id="reversi-board"/);
  assert.match(content, /reversi-status/);
});

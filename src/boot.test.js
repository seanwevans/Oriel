import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs/promises";

import { DEFAULT_SPLASH_IMAGE } from "./defaults.js";

test("boot renders the splash image", async () => {
  const imageUrl = new URL(DEFAULT_SPLASH_IMAGE);
  const imageBuffer = await fs.readFile(imageUrl);

  assert.ok(imageBuffer.byteLength > 0, "splash2.jpeg should be readable");

  const hasJpegSignature =
    imageBuffer[0] === 0xff &&
    imageBuffer[1] === 0xd8 &&
    imageBuffer[imageBuffer.length - 2] === 0xff &&
    imageBuffer[imageBuffer.length - 1] === 0xd9;

  assert.ok(hasJpegSignature, "splash2.jpeg should be a valid JPEG");
});

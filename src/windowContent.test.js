import assert from "node:assert/strict";
import { test } from "node:test";

import {
  getWindowBodyContainer,
  resolveWindowContentContainer
} from "./windowContent.js";

test("getWindowBodyContainer returns .window-body when available", () => {
  const body = { id: "body" };
  const root = {
    querySelector(selector) {
      return selector === ".window-body" ? body : null;
    }
  };

  assert.equal(getWindowBodyContainer(root), body);
  assert.equal(getWindowBodyContainer(null), null);
});

test("resolveWindowContentContainer prioritizes explicit container", () => {
  const targetContainer = { id: "explicit" };
  const targetElement = {};
  assert.equal(
    resolveWindowContentContainer(targetElement, targetContainer),
    targetContainer
  );
});

test("resolveWindowContentContainer resolves .window-body via closest window", () => {
  const body = { id: "window-body" };
  const targetElement = {
    closest(selector) {
      if (selector !== ".window") return null;
      return {
        querySelector(innerSelector) {
          return innerSelector === ".window-body" ? body : null;
        }
      };
    }
  };

  assert.equal(resolveWindowContentContainer(targetElement), body);
});

test("resolveWindowContentContainer falls back to HTMLElement target", () => {
  class FakeElement {}
  const originalHTMLElement = globalThis.HTMLElement;
  globalThis.HTMLElement = FakeElement;
  try {
    const targetElement = new FakeElement();
    assert.equal(resolveWindowContentContainer(targetElement), targetElement);
  } finally {
    globalThis.HTMLElement = originalHTMLElement;
  }
});

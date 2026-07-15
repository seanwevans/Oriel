import assert from "node:assert/strict";
import { test } from "node:test";

import {
  PROGRAM_CATEGORIES,
  OTHER_CATEGORY_ID,
  groupProgramsByCategory
} from "./programCategories.js";
import { APP_MANIFEST } from "./manifest.js";

test("every category type maps to a real, program-manager-visible app", () => {
  for (const category of PROGRAM_CATEGORIES) {
    for (const type of category.types) {
      const app = APP_MANIFEST[type];
      assert.ok(app, `category "${category.id}" references unknown app type "${type}"`);
      assert.notEqual(
        app.showInProgramManager,
        false,
        `hidden app "${type}" should not be categorized`
      );
    }
  }
});

test("every visible native app is assigned to a category", () => {
  const categorized = new Set(PROGRAM_CATEGORIES.flatMap((c) => c.types));
  for (const [type, app] of Object.entries(APP_MANIFEST)) {
    if (app.showInProgramManager === false) continue;
    assert.ok(
      categorized.has(type),
      `app "${type}" is not assigned to any Program Manager category`
    );
  }
});

test("a type belongs to at most one category", () => {
  const seen = new Set();
  for (const category of PROGRAM_CATEGORIES) {
    for (const type of category.types) {
      assert.ok(!seen.has(type), `type "${type}" appears in multiple categories`);
      seen.add(type);
    }
  }
});

test("groupProgramsByCategory alphabetizes within each section", () => {
  const programs = [
    { type: "write", label: "Write" },
    { type: "notepad", label: "Notepad" },
    { type: "calc", label: "Calculator" }
  ];
  const [section] = groupProgramsByCategory(programs);
  assert.equal(section.title, "Accessories");
  assert.deepEqual(
    section.programs.map((p) => p.label),
    ["Calculator", "Notepad", "Write"]
  );
});

test("groupProgramsByCategory orders sections and drops empty ones", () => {
  const programs = [
    { type: "chess", label: "Chess" },
    { type: "notepad", label: "Notepad" },
    { type: "browser", label: "Browser" }
  ];
  const titles = groupProgramsByCategory(programs).map((s) => s.title);
  // Accessories precedes Games precedes Internet; Graphics/Music are absent.
  assert.deepEqual(titles, ["Accessories", "Games", "Internet & Communication"]);
});

test("uncategorized (e.g. installed) programs fall into Other, last", () => {
  const programs = [
    { type: "notepad", label: "Notepad" },
    { type: "pen-starfield", label: "Starfield" }
  ];
  const sections = groupProgramsByCategory(programs);
  const other = sections[sections.length - 1];
  assert.equal(other.id, OTHER_CATEGORY_ID);
  assert.equal(other.title, "Other");
  assert.deepEqual(
    other.programs.map((p) => p.label),
    ["Starfield"]
  );
});

test("sort name accessor is respected", () => {
  const programs = [
    { type: "notepad", label: "Zeta", title: "A-title" },
    { type: "write", label: "Alpha", title: "Z-title" }
  ];
  const byTitle = groupProgramsByCategory(programs, (p) => p.title);
  assert.deepEqual(
    byTitle[0].programs.map((p) => p.label),
    ["Zeta", "Alpha"]
  );
});

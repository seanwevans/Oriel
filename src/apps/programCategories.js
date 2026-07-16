// Program Manager groups apps into use-case sections. Each category lists the
// app `type`s that belong to it; any program whose type is not listed (for
// example, user-installed pens) falls through to the "Other" section. Sections
// render in the order below, and programs are alphabetized within each section.

export const OTHER_CATEGORY_ID = "other";

export const PROGRAM_CATEGORIES = [
  {
    id: "accessories",
    title: "Accessories",
    types: [
      "calc",
      "cardfile",
      "charmap",
      "clipbrd",
      "clock",
      "database",
      "hexedit",
      "imageviewer",
      "markdown",
      "notepad",
      "pdfreader",
      "readme",
      "sheets",
      "taskman",
      "winfile",
      "write"
    ]
  },
  {
    id: "games",
    title: "Games",
    types: [
      "angrybirds",
      "cannonduel",
      "celeryman",
      "chess",
      "doom",
      "game2048",
      "gameoflife",
      "kakuro",
      "linerider",
      "mafia",
      "minecraft",
      "mines",
      "papers",
      "pinball",
      "reversi",
      "sandspiel",
      "sandspiel3d",
      "simcity",
      "skifree",
      "snake",
      "solitaire",
      "sudoku",
      "tetris"
    ]
  },
  {
    id: "graphics",
    title: "Graphics & Design",
    types: ["colorpicker", "paint", "photoshop", "pixelstudio", "shaderlab", "whiteboard"]
  },
  {
    id: "music",
    title: "Music & Audio",
    types: [
      "beatmaker",
      "midisequencer",
      "mplayer",
      "radio",
      "radiogarden",
      "soundrec",
      "spotify",
      "tracker"
    ]
  },
  {
    id: "internet",
    title: "Internet & Communication",
    types: [
      "apiclient",
      "bbs",
      "browser",
      "discord",
      "email",
      "irc",
      "messenger",
      "netnews",
      "packetlab",
      "rss"
    ]
  },
  {
    id: "development",
    title: "Development & System",
    types: [
      "codepen",
      "compiler",
      "console",
      "control",
      "json",
      "postgres",
      "procmon",
      "python",
      "regex",
      "reset",
      "retroai",
      "vm"
    ]
  },
  {
    id: "emulators",
    title: "Emulators",
    types: ["n64", "ti83"]
  }
];

const OTHER_CATEGORY = { id: OTHER_CATEGORY_ID, title: "Other" };

function buildCategoryLookup() {
  const lookup = new Map();
  for (const category of PROGRAM_CATEGORIES) {
    for (const type of category.types) lookup.set(type, category.id);
  }
  return lookup;
}

/**
 * Group programs into their use-case categories, alphabetized within each.
 *
 * @param {Array<object>} programs - available programs.
 * @param {(prog: object) => string} getName - resolves the name to sort by
 *   (defaults to the program label/title/type).
 * @returns {Array<{ id: string, title: string, programs: object[] }>} ordered,
 *   non-empty sections.
 */
export function groupProgramsByCategory(
  programs = [],
  getName = (prog) => prog?.label || prog?.title || prog?.type || ""
) {
  const lookup = buildCategoryLookup();
  const buckets = new Map();

  for (const prog of programs) {
    const categoryId = lookup.get(prog?.type) || OTHER_CATEGORY_ID;
    if (!buckets.has(categoryId)) buckets.set(categoryId, []);
    buckets.get(categoryId).push(prog);
  }

  const sections = [];
  for (const category of [...PROGRAM_CATEGORIES, OTHER_CATEGORY]) {
    const items = buckets.get(category.id);
    if (!items || !items.length) continue;
    items.sort((a, b) =>
      getName(a).localeCompare(getName(b), undefined, { sensitivity: "base", numeric: true })
    );
    sections.push({ id: category.id, title: category.title, programs: items });
  }
  return sections;
}

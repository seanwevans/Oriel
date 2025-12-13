import {
  DEFAULT_MD_SAMPLE,
  DEFAULT_PDF_DATA_URI,
  DEFAULT_SCREEN_IMAGE
} from "./defaults.js";
import { publish } from "./eventBus.js";

export const FS_STORAGE_KEY = "oriel-fs-v1";

export const DEFAULT_FS = {
  "C\\": {
    type: "dir",
    children: {
      ORIEL: {
        type: "dir",
        children: {
          SYSTEM: { type: "dir", children: {} },
          "CALC.EXE": { type: "file", app: "calc" },
          "NOTEPAD.EXE": { type: "file", app: "notepad" },
          "DOOM.EXE": { type: "file", app: "doom" },
          "WRITE.EXE": { type: "file", app: "write" },
          "CARDFILE.EXE": { type: "file", app: "cardfile" },
          "WINMINE.EXE": { type: "file", app: "mines" },
          "CHESS.EXE": { type: "file", app: "chess" },
          "SOL.EXE": { type: "file", app: "solitaire" },
          "REVERSI.EXE": { type: "file", app: "reversi" },
          "PBRUSH.EXE": { type: "file", app: "paint" },
          "ARTIST.EXE": { type: "file", app: "artist" },
          "PHOTOSHP.EXE": { type: "file", app: "photoshop" },
          "MPLAYER.EXE": { type: "file", app: "mplayer" },
          "SKIFREE.EXE": { type: "file", app: "skifree" },
          "LINERIDR.EXE": { type: "file", app: "linerider" },
          "SIMCITY.EXE": { type: "file", app: "simcity" },
          "WINFILE.EXE": { type: "file", app: "winfile" },
          "TASKMAN.EXE": { type: "file", app: "taskman" },
          "CLIPBRD.EXE": { type: "file", app: "clipbrd" },
          "DATAMGR.EXE": { type: "file", app: "database" },
          "CHARMAP.EXE": { type: "file", app: "charmap" },
          "SOUNDREC.EXE": { type: "file", app: "soundrec" },
          "BEATLAB.EXE": { type: "file", app: "beatmaker" },
          "RADIO.EXE": { type: "file", app: "radio" },
          "CLOCK.EXE": { type: "file", app: "clock" },
          "CONTROL.EXE": { type: "file", app: "control" },
          "RESET.EXE": { type: "file", app: "reset" },
          "RSS.EXE": { type: "file", app: "rss" },
          "WEB.EXE": { type: "file", app: "browser" },
          "DISCORD.EXE": { type: "file", app: "discord" },
          "IRC.EXE": { type: "file", app: "irc" },
          "TINYC.EXE": { type: "file", app: "compiler" },
          "PYTHON.EXE": { type: "file", app: "python" },
          "CONSOLE.EXE": { type: "file", app: "console" },
          "HEXEDIT.EXE": { type: "file", app: "hexedit" },
          "IMGVIEW.EXE": { type: "file", app: "imageviewer" }
        }
      },
      DOCUMENTS: {
        type: "dir",
        children: {
          "README.TXT": { type: "file", app: "notepad", content: "Welcome to Oriel 1.0!" },
          "TODO.TXT": { type: "file", app: "notepad", content: "- Buy Milk\n- Install DOOM" },
          "MANUAL.PDF": { type: "file", app: "pdfreader", content: { name: "Manual.pdf", src: DEFAULT_PDF_DATA_URI } },
          "README.MD": { type: "file", app: "markdown", content: DEFAULT_MD_SAMPLE },
          "SCREEN.PNG": {
            type: "file",
            app: "imageviewer",
            content: { name: "screen.png", src: DEFAULT_SCREEN_IMAGE }
          }
        }
      }
    }
  }
};

export function loadFileSystem() {
  const stored = localStorage.getItem(FS_STORAGE_KEY);
  if (!stored) return DEFAULT_FS;

  try {
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === "object" ? parsed : DEFAULT_FS;
  } catch (err) {
    console.warn("Failed to parse stored file system, resetting to defaults", err);
    localStorage.removeItem(FS_STORAGE_KEY);
    return DEFAULT_FS;
  }
}

export function saveFileSystem(fs = MOCK_FS) {
  localStorage.setItem(FS_STORAGE_KEY, JSON.stringify(fs));
  publish("fs:change", { fs });
}

export const MOCK_FS = loadFileSystem();

export function exportFileSystemAsJson(fs = MOCK_FS) {
  return JSON.stringify(fs, null, 2);
}

export function replaceFileSystem(newFs) {
  Object.keys(MOCK_FS).forEach((key) => delete MOCK_FS[key]);
  Object.assign(MOCK_FS, newFs);
  saveFileSystem(MOCK_FS);
}

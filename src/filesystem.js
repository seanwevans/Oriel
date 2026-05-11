import {
  DEFAULT_MD_SAMPLE,
  DEFAULT_PDF_DATA_URI,
  DEFAULT_SCREEN_IMAGE
} from "./defaults.js";
import { publish } from "./eventBus.js";
import { getExecutableEntries } from "./apps/manifest.js";

export const FS_STORAGE_KEY = "oriel-fs-v1";
export const NATIVE_DRIVE_LETTER = "D\\";

export const DEFAULT_FS = {
  "C\\": {
    type: "dir",
    children: {
      ORIEL: {
        type: "dir",
        children: {
          SYSTEM: { type: "dir", children: {} },
          ...getExecutableEntries()
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

const DB_NAME = "oriel-fs";
const DB_VERSION = 1;
const STORE_NAME = "filesystem";

const supportsIndexedDb = typeof indexedDB !== "undefined";
const supportsLocalStorage = typeof localStorage !== "undefined";

let dbPromise = null;

function isNativeNode(node) {
  return !!node?.nativeHandle;
}

function formatDriveLetter(letter = NATIVE_DRIVE_LETTER) {
  const upper = (letter || "").toUpperCase();
  return upper.endsWith("\\") ? upper : `${upper}\\`;
}

export function isNativeFsSupported() {
  return typeof window !== "undefined" && typeof window.showDirectoryPicker === "function";
}

function openDatabase() {
  if (!supportsIndexedDb) return Promise.reject(new Error("IndexedDB is unavailable"));
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }).catch((err) => {
      console.warn("Failed to open IndexedDB", err);
      dbPromise = null;
      throw err;
    });
  }

  return dbPromise;
}

async function readStoredFileSystem() {
  try {
    const db = await openDatabase();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(FS_STORAGE_KEY);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("Unable to read file system from IndexedDB", err);
    return null;
  }
}

export async function readFileStoreValue(key) {
  if (!key) return null;
  try {
    const db = await openDatabase();
    const stored = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
    if (stored) return stored;
  } catch (err) {
    console.warn(`Unable to read '${key}' from IndexedDB`, err);
  }

  if (!supportsLocalStorage) return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (err) {
    console.warn(`Failed to parse stored value for '${key}'`, err);
    return null;
  }
}

async function writeStoredFileSystem(fs) {
  try {
    const db = await openDatabase();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(fs, FS_STORAGE_KEY);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("Unable to write file system to IndexedDB", err);
    if (supportsLocalStorage) {
      localStorage.setItem(FS_STORAGE_KEY, JSON.stringify(fs));
    }
  }
}

export async function writeFileStoreValue(key, value) {
  if (!key) return;
  try {
    const db = await openDatabase();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(value, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    return;
  } catch (err) {
    console.warn(`Unable to write '${key}' to IndexedDB`, err);
    if (!supportsLocalStorage) return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to persist '${key}' to localStorage`, err);
  }
}

function readLegacyLocalStorage() {
  if (!supportsLocalStorage) return null;

  const stored = localStorage.getItem(FS_STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (err) {
    console.warn("Failed to parse legacy localStorage file system", err);
    localStorage.removeItem(FS_STORAGE_KEY);
    return null;
  }
}

export async function loadFileSystem() {
  const stored = await readStoredFileSystem();
  if (stored && typeof stored === "object") return stored;

  const legacy = readLegacyLocalStorage();
  if (legacy) {
    await writeStoredFileSystem(legacy);
    if (supportsLocalStorage) localStorage.removeItem(FS_STORAGE_KEY);
    return legacy;
  }

  return structuredClone(DEFAULT_FS);
}

export async function saveFileSystem(fs = MOCK_FS) {
  const serializable = getSerializableFileSystem(fs);
  return writeStoredFileSystem(serializable);
}

export const MOCK_FS = structuredClone(DEFAULT_FS);

function defineDataProperty(target, key, value) {
  Object.defineProperty(target, key, {
    value,
    enumerable: true,
    configurable: true,
    writable: true
  });
}

function copyPlainData(value, { childrenObject = false } = {}) {
  if (!value || typeof value !== "object") return value;
  if (value instanceof Blob) return value;
  if (Array.isArray(value)) return value.map((item) => copyPlainData(item));

  const target = childrenObject ? Object.create(null) : {};
  Object.entries(value).forEach(([key, childValue]) => {
    const copiedValue =
      key === "children"
        ? copyPlainData(childValue, { childrenObject: true })
        : copyPlainData(childValue);
    defineDataProperty(target, key, copiedValue);
  });
  return target;
}

function stripNativeNodes(node) {
  if (!node || typeof node !== "object") return node;
  if (isNativeNode(node)) return null;
  if (Array.isArray(node)) return node.map((child) => stripNativeNodes(child));
  if (node.type === "dir") {
    const cleanedChildren = Object.fromEntries(
      Object.entries(node.children || {})
        .map(([key, child]) => [key, stripNativeNodes(child)])
        .filter(([, child]) => child)
    );
    return { ...node, children: cleanedChildren };
  }
  return { ...node };
}

export function getSerializableFileSystem(fs = MOCK_FS) {
  const cleaned = {};
  Object.entries(fs || {}).forEach(([key, value]) => {
    const stripped = stripNativeNodes(value);
    if (stripped) cleaned[key] = stripped;
  });
  return cleaned;
}

async function serializeNode(value) {
  if (value instanceof Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(value);
    });
  }

  if (Array.isArray(value)) {
    return Promise.all(value.map((item) => serializeNode(item)));
  }

  if (value && typeof value === "object") {
    const entries = await Promise.all(
      Object.entries(value).map(async ([key, val]) => [key, await serializeNode(val)])
    );
    return Object.fromEntries(entries);
  }

  return value;
}

export async function exportFileSystemAsJson(fs = MOCK_FS) {
  const serializable = await serializeNode(getSerializableFileSystem(fs));
  return JSON.stringify(serializable, null, 2);
}

export async function replaceFileSystem(newFs, { persist = true } = {}) {
  const preservedNative = Object.entries(MOCK_FS).filter(([, node]) => isNativeNode(node));
  Object.keys(MOCK_FS).forEach((key) => delete MOCK_FS[key]);
  Object.entries(newFs || {}).forEach(([key, node]) => {
    defineDataProperty(MOCK_FS, key, copyPlainData(node));
  });
  preservedNative.forEach(([key, node]) => {
    defineDataProperty(MOCK_FS, key, node);
  });
  if (persist) await saveFileSystem(MOCK_FS);
}

export async function mountNativeFolder(driveLetter = NATIVE_DRIVE_LETTER) {
  if (!isNativeFsSupported()) throw new Error("File System Access API is unavailable in this browser.");
  const handle = await window.showDirectoryPicker({ mode: "readwrite" });
  const driveKey = formatDriveLetter(driveLetter);
  const node = {
    type: "dir",
    children: {},
    nativeHandle: handle,
    nativeName: handle.name,
    isNative: true
  };
  MOCK_FS[driveKey] = node;
  publish("fs:change", { type: "mount", drive: driveKey });
  return node;
}

export async function hydrateNativeDirectory(node) {
  if (!node?.nativeHandle) return node;
  try {
    const children = Object.create(null);
    for await (const entry of node.nativeHandle.values()) {
      const key = entry.name.toUpperCase();
      const priorChild = node.children?.[key];
      const childNode = {
        type: entry.kind === "directory" ? "dir" : "file",
        nativeHandle: entry,
        nativeName: entry.name,
        isNative: true
      };
      if (entry.kind === "directory") {
        childNode.children = priorChild?.children || null;
      }
      children[key] = childNode;
    }
    node.children = children;
  } catch (err) {
    console.warn("Unable to read native directory", err);
  }
  return node;
}

async function initializeFileSystem() {
  const hydratedFs = await loadFileSystem();
  await replaceFileSystem(hydratedFs, { persist: false });
}

export const fileSystemReady = initializeFileSystem().catch((err) => {
  console.warn("Failed to initialize file system", err);
});

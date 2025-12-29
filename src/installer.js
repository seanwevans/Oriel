import { publish } from "./eventBus.js";
import {
  MOCK_FS,
  fileSystemReady,
  readFileStoreValue,
  writeFileStoreValue
} from "./filesystem.js";

export const APP_REGISTRY_KEY = "oriel-app-registry";
export const MANIFEST_SCHEMA = {
  id: "string",
  name: "string",
  version: "string",
  entry: "string",
  permissions: "string[]",
  icon: "string?",
  hash: "string?",
  signature: "string?",
  label: "string?",
  window: "object?",
  export: "string?"
};

const runtimeRegistry = new Map();

function normalizeFsPath(rawPath, basePath = "C\\") {
  if (!rawPath) return null;
  const trimmed = rawPath.trim();
  const driveMatch = trimmed.match(/^([A-Za-z]):/);
  const cleaned = trimmed.replace(/\//g, "\\");

  if (driveMatch) {
    const drive = driveMatch[1].toUpperCase();
    const remainder = cleaned.slice(driveMatch[0].length).replace(/^\\*/, "");
    return `${drive}:\\${remainder}`.replace(/\\+/g, "\\");
  }

  const base = basePath?.replace(/\//g, "\\") || "C\\";
  const baseDir = base.endsWith("\\") ? base : base + "\\";
  const relative = cleaned.replace(/^\\*/, "");
  return `${baseDir}${relative}`.replace(/\\+/g, "\\");
}

function parentPath(path) {
  const normalized = path?.replace(/\\+/g, "\\") || "C\\";
  if (!normalized.includes("\\")) return "C\\";
  const parts = normalized.split("\\").filter(Boolean);
  if (parts.length <= 1) return `${parts[0]}\\`;
  return `${parts.shift()}\\${parts.slice(0, -1).join("\\")}`;
}

function resolveNode(path) {
  if (!path) return { node: null, path: null };
  const normalized = normalizeFsPath(path);
  const match = normalized.match(/^([A-Z]):\\/i);
  if (!match) return { node: null, path: null };

  const driveKey = `${match[1].toUpperCase()}\\`;
  let node = MOCK_FS[driveKey];
  const remainder = normalized.slice(match[0].length);
  if (!remainder) return { node, path: driveKey };
  const segments = [];
  remainder
    .split("\\")
    .filter(Boolean)
    .forEach((seg) => {
      if (seg === ".") return;
      if (seg === "..") segments.pop();
      else segments.push(seg);
    });
  let currentPath = driveKey.replace(/\\+$/, "\\");

  for (const seg of segments) {
    if (!node?.children) return { node: null, path: null };
    const key = Object.keys(node.children).find((k) => k.toUpperCase() === seg.toUpperCase());
    if (!key) return { node: null, path: null };
    node = node.children[key];
    currentPath = `${currentPath}${currentPath.endsWith("\\") ? "" : "\\"}${key}`;
  }

  return { node, path: currentPath };
}

async function readNodeAsText(node) {
  if (!node) return null;
  if (typeof node.content === "string") return node.content;
  if (node.content instanceof Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(node.content);
    });
  }
  if (node.nativeHandle?.getFile) {
    const file = await node.nativeHandle.getFile();
    return file.text();
  }
  return node.content?.toString?.() || null;
}

export function validateManifest(manifest) {
  const errors = [];
  if (!manifest || typeof manifest !== "object") {
    return { valid: false, errors: ["Manifest must be an object."] };
  }
  const requiredStrings = ["id", "name", "version", "entry"];
  requiredStrings.forEach((key) => {
    if (!manifest[key] || typeof manifest[key] !== "string") {
      errors.push(`${key} is required and must be a string.`);
    }
  });
  if (manifest.id && !/^[a-zA-Z0-9-_]+$/.test(manifest.id)) {
    errors.push("id must contain only letters, numbers, dashes, or underscores.");
  }
  if (manifest.permissions && !Array.isArray(manifest.permissions)) {
    errors.push("permissions must be an array of strings.");
  }
  if (manifest.permissions) {
    const bad = manifest.permissions.filter((p) => typeof p !== "string");
    if (bad.length) errors.push("permissions entries must be strings.");
  }
  if (manifest.window && typeof manifest.window !== "object") {
    errors.push("window must be an object when provided.");
  } else if (manifest.window) {
    if (manifest.window.width && typeof manifest.window.width !== "number") {
      errors.push("window.width must be a number when provided.");
    }
    if (manifest.window.height && typeof manifest.window.height !== "number") {
      errors.push("window.height must be a number when provided.");
    }
  }
  return { valid: errors.length === 0, errors };
}

async function computeSha256(text) {
  if (!text && text !== "") return null;
  if (!globalThis.crypto?.subtle) throw new Error("WebCrypto is unavailable.");
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function loadManifestFromPath(manifestPath, basePath) {
  await fileSystemReady;
  const resolvedPath = normalizeFsPath(manifestPath, basePath);
  const { node, path } = resolveNode(resolvedPath);
  if (!node) throw new Error("Manifest file not found in the virtual filesystem.");
  if (node.type !== "file") throw new Error("Manifest path must point to a file.");

  const raw = await readNodeAsText(node);
  if (!raw) throw new Error("Manifest is empty or unreadable.");

  let manifest = null;
  try {
    manifest = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Unable to parse manifest JSON: ${err.message}`);
  }

  const validation = validateManifest(manifest);
  if (!validation.valid) throw new Error(validation.errors.join("; "));

  const entryPath = normalizeFsPath(manifest.entry, parentPath(path));
  return { manifest, manifestPath: path, entryPath };
}

async function loadInitializerFromEntry(manifest, entryPath) {
  const { node, path } = resolveNode(entryPath);
  if (!node) throw new Error(`Entry file not found: ${entryPath}`);
  if (node.type !== "file") throw new Error("Entry path must point to a file.");

  const source = await readNodeAsText(node);
  if (source === null || source === undefined) throw new Error("Entry file is empty.");

  const hash = await computeSha256(source);
  const expectedHash = (manifest.hash || manifest.signature || "").toLowerCase().trim();
  if (expectedHash && expectedHash !== hash) {
    throw new Error("Entry hash does not match manifest signature/hash.");
  }

  const blob = new Blob([source], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  try {
    const module = await import(url);
    const exportName = manifest.export || "default";
    const initializer = exportName === "default" ? module.default : module[exportName];
    if (typeof initializer !== "function") {
      throw new Error(`Export '${exportName}' is not a function.`);
    }
    return { initializer, hash, path };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function manifestToProgram(manifest) {
  return {
    type: manifest.id,
    title: manifest.name,
    width: manifest.window?.width || 500,
    height: manifest.window?.height || 400,
    icon: manifest.icon || "help",
    label: manifest.label || manifest.name,
    permissions: manifest.permissions || []
  };
}

async function persistRegistry() {
  const payload = {
    installations: Array.from(runtimeRegistry.values()).map((entry) => ({
      manifest: entry.manifest,
      manifestPath: entry.manifestPath,
      entryPath: entry.entryPath,
      hash: entry.hash
    }))
  };
  await writeFileStoreValue(APP_REGISTRY_KEY, payload);
}

function registerRuntime(manifest, initializer, manifestPath, entryPath, hash) {
  runtimeRegistry.set(manifest.id, {
    manifest,
    initializer,
    manifestPath,
    entryPath,
    hash
  });
  publish("apps:change", { apps: getInstalledPrograms() });
}

export async function installFromManifestPath(manifestPath, { basePath } = {}) {
  const { manifest, manifestPath: resolvedManifestPath, entryPath } = await loadManifestFromPath(
    manifestPath,
    basePath
  );
  const { initializer, hash } = await loadInitializerFromEntry(manifest, entryPath);
  registerRuntime(manifest, initializer, resolvedManifestPath, entryPath, hash);
  await persistRegistry();
  return { manifest, entryPath, manifestPath: resolvedManifestPath };
}

export async function uninstallApp(appId) {
  const normalized = (appId || "").trim();
  if (!normalized) throw new Error("App id is required.");
  if (!runtimeRegistry.has(normalized)) {
    throw new Error(`No installed app found with id '${normalized}'.`);
  }
  runtimeRegistry.delete(normalized);
  await persistRegistry();
  publish("apps:change", { apps: getInstalledPrograms() });
  return { id: normalized };
}

export function getRuntimeInitializer(type) {
  return runtimeRegistry.get(type)?.initializer || null;
}

export function getInstalledPrograms() {
  return Array.from(runtimeRegistry.values())
    .map((entry) => manifestToProgram(entry.manifest))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getManifestForApp(type) {
  return runtimeRegistry.get(type)?.manifest || null;
}

async function tryRegisterFromRecord(record) {
  if (!record?.manifest || !record.entryPath) return;
  const validation = validateManifest(record.manifest);
  if (!validation.valid) throw new Error(validation.errors.join("; "));
  const { initializer, hash } = await loadInitializerFromEntry(record.manifest, record.entryPath);
  registerRuntime(record.manifest, initializer, record.manifestPath, record.entryPath, hash);
}

export async function bootstrapInstallations() {
  await fileSystemReady.catch(() => {});
  const stored = await readFileStoreValue(APP_REGISTRY_KEY);
  const installs = stored?.installations || [];
  for (const record of installs) {
    try {
      await tryRegisterFromRecord(record);
    } catch (err) {
      console.warn(`Failed to bootstrap app '${record?.manifest?.id || "unknown"}':`, err);
    }
  }
  publish("apps:change", { apps: getInstalledPrograms() });
}

export async function readManifest(manifestPath, basePath) {
  return loadManifestFromPath(manifestPath, basePath);
}

export function getRegistrySnapshot() {
  return Array.from(runtimeRegistry.values()).map((entry) => ({
    id: entry.manifest.id,
    manifest: entry.manifest,
    manifestPath: entry.manifestPath,
    entryPath: entry.entryPath,
    hash: entry.hash
  }));
}

import { installSelectionFromWindow, rFL, rFT, uninstallSelectionFromWindow } from "../apps/fileManager.js";

const INVALID_FOLDER_CHARS = /[\\/:*?"<>|]/;
const RESERVED_FOLDER_NAMES = new Set([
  "CON",
  "PRN",
  "AUX",
  "NUL",
  "COM1",
  "COM2",
  "COM3",
  "COM4",
  "COM5",
  "COM6",
  "COM7",
  "COM8",
  "COM9",
  "LPT1",
  "LPT2",
  "LPT3",
  "LPT4",
  "LPT5",
  "LPT6",
  "LPT7",
  "LPT8",
  "LPT9"
]);

const UNSAFE_CHILD_NAMES = new Set(["__proto__", "prototype", "constructor"]);

function isRestrictedFileSystemName(name) {
  if (typeof name !== "string" || !name.trim()) return true;
  if (UNSAFE_CHILD_NAMES.has(name)) return true;
  if (/[. ]$/.test(name)) return true;
  if (INVALID_FOLDER_CHARS.test(name)) return true;
  return RESERVED_FOLDER_NAMES.has(name.trim().toUpperCase());
}

export class FileSystemActions {
  constructor({
    filesystem,
    getWindowManager,
    alertUser = globalThis.alert,
    installSelection = installSelectionFromWindow,
    uninstallSelection = uninstallSelectionFromWindow
  } = {}) {
    this.fs = filesystem;
    this.getWindowManager = getWindowManager;
    this.alertUser = alertUser;
    this.installSelection = installSelection;
    this.uninstallSelection = uninstallSelection;
  }

  normalizeFolderName(name) {
    return name?.toUpperCase() ?? "";
  }

  getUniqueFolderName(targetDir, baseName = "New Folder") {
    if (!targetDir?.children) return baseName;
    const existingNames = new Set(
      Object.keys(targetDir.children).map((childName) => this.normalizeFolderName(childName))
    );
    let candidate = baseName;
    let counter = 1;
    while (existingNames.has(this.normalizeFolderName(candidate))) {
      candidate = `${baseName} (${counter})`;
      counter++;
    }
    return candidate;
  }

  async createNamedFolder(targetDir, name) {
    if (!targetDir) {
      return { success: false, message: "Invalid folder target." };
    }

    const rawName = typeof name === "string" ? name : "";
    const trimmedName = rawName.trim();
    if (trimmedName && isRestrictedFileSystemName(trimmedName)) {
      return {
        success: false,
        message: "That folder name is not allowed. Choose a different name and try again."
      };
    }
    if (rawName && /[. ]$/.test(rawName)) {
      return {
        success: false,
        message: "Folder names cannot end with a period or space."
      };
    }

    let finalName = trimmedName || this.getUniqueFolderName(targetDir);
    if (targetDir.children) {
      const normalized = this.normalizeFolderName(finalName);
      const existingNames = Object.keys(targetDir.children).map((childName) =>
        this.normalizeFolderName(childName)
      );
      if (existingNames.includes(normalized)) {
        finalName = this.getUniqueFolderName(targetDir, finalName);
      }
    }

    if (targetDir.children?.[finalName]) {
      return { success: false, message: "Folder already exists!" };
    }
    if (targetDir.nativeHandle) {
      try {
        await targetDir.nativeHandle.getDirectoryHandle(finalName, { create: true });
        await this.fs.hydrateNativeDirectory(targetDir);
      } catch (err) {
        return {
          success: false,
          message: `Failed to create directory: ${err.message}`
        };
      }
    } else {
      targetDir.children[finalName] = {
        type: "dir",
        children: {}
      };
      this.fs.saveFileSystem();
    }
    return { success: true };
  }

  async createFolder(btn) {
    const win = btn.closest(".window");
    const input = win.querySelector("#new-folder-name");
    const name = input.value.trim();
    if (name && win.currentDirObj) {
      const result = await this.createNamedFolder(win.currentDirObj, name);
      if (!result.success) {
        this.alertUser(result.message);
        return;
      }
      input.value = "";
      await rFT(win);
      await rFL(win);
    }
  }

  async mountLocalFolder(btn) {
    if (!this.fs.isNativeFsSupported()) {
      this.alertUser("Mounting a local folder requires a compatible browser.");
      return;
    }

    try {
      const driveNode = await this.fs.mountNativeFolder();
      await this.fs.hydrateNativeDirectory(driveNode);
      const win = btn.closest(".window");
      if (win) {
        win.cP = Object.keys(this.fs.MOCK_FS).includes("D\\") ? "D\\" : win.cP;
        win.cD = this.fs.MOCK_FS[win.cP] || driveNode;
        win.currentDirObj = win.cD;
        await rFT(win);
        await rFL(win);
      }
    } catch (err) {
      if (err?.name === "AbortError") return;
      this.alertUser(`Failed to mount folder: ${err.message}`);
    }
  }

  async installSelectedManifest(btn) {
    const win = btn.closest(".window");
    if (!win) return;
    try {
      const manifest = await this.installSelection(win);
      this.alertUser(`Installed ${manifest.name} (${manifest.id})`);
    } catch (err) {
      this.alertUser(err.message || "Unable to install manifest.");
    }
  }

  async uninstallManifest(btn) {
    const win = btn.closest(".window");
    if (!win) return;
    try {
      const removedId = await this.uninstallSelection(win);
      this.alertUser(`Uninstalled ${removedId}`);
    } catch (err) {
      this.alertUser(err.message || "Unable to uninstall app.");
    }
  }

  downloadJson(content, filename) {
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  isValidFileSystemNode(node) {
    if (!node || typeof node !== "object") return false;
    if (node.type === "dir") {
      if (!node.children || typeof node.children !== "object" || Array.isArray(node.children)) {
        return false;
      }
      return Object.entries(node.children).every(
        ([childName, child]) =>
          !isRestrictedFileSystemName(childName) && this.isValidFileSystemNode(child)
      );
    }
    return node.type === "file";
  }

  normalizeImportedDriveKey(key) {
    if (typeof key !== "string") return null;
    const driveMatch = key.match(/^([A-Za-z])(?::)?(?:\\+)?$/);
    return driveMatch ? `${driveMatch[1].toUpperCase()}\\` : null;
  }

  normalizeImportedFileSystem(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new Error("Invalid JSON structure");
    }

    const normalized = {};
    for (const [key, node] of Object.entries(data)) {
      const driveKey = this.normalizeImportedDriveKey(key);
      if (!driveKey) continue;
      if (node?.type !== "dir" || !this.isValidFileSystemNode(node)) {
        throw new Error("Import file system structure is invalid");
      }
      normalized[driveKey] = node;
    }

    if (!normalized["C\\"]) throw new Error("Import is missing a C drive directory");
    return normalized;
  }

  resolveFileManagerPath(path = "C\\") {
    const normalized = (path || "C\\").replace(/\\+/g, "\\");
    const driveMatch = normalized.match(/^([A-Za-z]:?)(?:\\|$)/);
    const driveKey = driveMatch ? `${driveMatch[1].toUpperCase().replace(/:$/, "")}\\` : "C\\";
    const remainder = normalized.slice(driveKey.length).replace(/^\\/, "");
    const segments = remainder.split("\\").filter(Boolean);
    let current = this.fs.MOCK_FS[driveKey];
    let resolvedPath = driveKey;

    for (let i = 0; i < segments.length; i++) {
      if (!current?.children) return null;
      const next = current.children[segments[i]];
      if (!next || next.type !== "dir") return null;
      resolvedPath = resolvedPath.endsWith("\\")
        ? `${resolvedPath}${segments[i]}`
        : `${resolvedPath}\\${segments[i]}`;
      current = next;
    }

    return { path: resolvedPath, node: current };
  }

  refreshOpenFileManagers() {
    const windowManager = this.getWindowManager?.();
    if (!windowManager?.windows) return;
    windowManager.windows.forEach((win) => {
      if (win.type === "winfile" && win.el) {
        const resolved =
          this.resolveFileManagerPath(win.el.cP || "C\\") || this.resolveFileManagerPath("C\\");
        const resolvedPath = resolved?.path || "C\\";
        const resolvedDir = resolved?.node || this.fs.MOCK_FS["C\\"];

        win.el.cP = resolvedPath;
        win.el.cD = resolvedDir;
        win.el.currentDirObj = resolvedDir;
        rFT(win.el);
        rFL(win.el);
      }
    });
  }

  async exportFileSystem() {
    const json = await this.fs.exportFileSystemAsJson();
    const stamp = new Date().toISOString().slice(0, 10);
    this.downloadJson(json, `oriel-fs-${stamp}.json`);
  }

  importFileSystem(event) {
    const input = event?.target;
    const file = input?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        const normalized = this.normalizeImportedFileSystem(parsed);
        await this.fs.replaceFileSystem(normalized);
        this.refreshOpenFileManagers();
        this.alertUser("File system imported successfully.");
      } catch (err) {
        this.alertUser(`Failed to import file system: ${err.message}`);
      } finally {
        if (input) input.value = "";
      }
    };
    reader.readAsText(file);
  }
}

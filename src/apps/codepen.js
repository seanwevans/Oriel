import { BaseApp } from "./base/BaseApp.js";
import { MOCK_FS, fileSystemReady, saveFileSystem } from "../filesystem.js";
import { installFromManifestPath } from "../installer.js";
import { getWindowBodyContainer } from "../windowContent.js";
import { escapeHtml } from "../utils/html.js";

const CODEPEN_APP_ROOT = "C\\ORIEL\\CODEPEN";
const DEFAULT_PEN_URL = "https://codepen.io/team/codepen/pen/PNaGbb";


function safeAppName(value, fallback = "CodePen App") {
  const cleaned = String(value || "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
  return cleaned || fallback;
}

function safeFileName(value = "codepen") {
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return cleaned || "codepen";
}

function titleFromPen(parsed) {
  if (!parsed) return "CodePen Pen";
  return `${parsed.userPath || parsed.user}/${parsed.hash}`;
}

export function parseCodePenUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  let url;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return null;
  }

  if (!/(^|\.)codepen\.io$/i.test(url.hostname)) return null;

  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length < 3) return null;

  let user = parts[0];
  let userPath = user;
  let mode = parts[1];
  let hash = parts[2];

  if (parts[0] === "team" && parts.length >= 4) {
    user = parts[1];
    userPath = `team/${user}`;
    mode = parts[2];
    hash = parts[3];
  }

  if (!user || !hash || !["pen", "embed", "full", "details", "debug"].includes(mode)) {
    return null;
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(user) || !/^[a-zA-Z0-9_-]+$/.test(hash)) return null;

  return {
    user,
    userPath,
    hash,
    mode,
    originalUrl: url.toString(),
    title: titleFromPen({ userPath, hash })
  };
}

export function getCodePenEmbedUrl(rawUrl, options = {}) {
  const parsed = parseCodePenUrl(rawUrl);
  if (!parsed) return null;
  const params = new URLSearchParams({
    "default-tab": options.defaultTab || "result",
    "theme-id": options.themeId || "dark"
  });
  if (options.editable) params.set("editable", "true");
  return `https://codepen.io/${parsed.userPath}/embed/${parsed.hash}?${params.toString()}`;
}

function ensureDir(path) {
  const parts = path.replace(/\/+/, "\\").split("\\").filter(Boolean);
  const drive = parts.shift();
  const driveKey = `${drive.toUpperCase()}\\`;
  if (!MOCK_FS[driveKey]) MOCK_FS[driveKey] = { type: "dir", children: {} };

  let node = MOCK_FS[driveKey];
  for (const part of parts) {
    const key = part.toUpperCase();
    if (!node.children[key]) node.children[key] = { type: "dir", children: {} };
    node = node.children[key];
  }
  return node;
}

function getGeneratedEntrySource({ appName, embedUrl, originalUrl }) {
  return `const EMBED_URL = ${JSON.stringify(embedUrl)};
const ORIGINAL_URL = ${JSON.stringify(originalUrl)};
const APP_NAME = ${JSON.stringify(appName)};

export default function initInstalledCodePen(win) {
  const body = win.querySelector(".window-body") || win;
  body.innerHTML = "";
  const root = document.createElement("div");
  root.className = "codepen-installed-app";
  root.innerHTML = ` + JSON.stringify(`
    <div class="codepen-installed-toolbar">
      <strong></strong>
      <a target="_blank" rel="noreferrer noopener">Open on CodePen</a>
    </div>
    <iframe title="Installed CodePen app" loading="lazy" allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; clipboard-read; clipboard-write" sandbox="allow-downloads allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts"></iframe>
  `) + `;
  root.querySelector("strong").textContent = APP_NAME;
  const link = root.querySelector("a");
  link.href = ORIGINAL_URL;
  const iframe = root.querySelector("iframe");
  iframe.src = EMBED_URL;
  body.appendChild(root);
}
`;
}

function triggerDownload({ manifest, entrySource }) {
  const payload = {
    kind: "oriel-codepen-app",
    manifest,
    files: {
      [manifest.entry]: entrySource
    }
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${manifest.id}.oriel.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function getCodePenAppId(rawUrl) {
  const parsed = parseCodePenUrl(rawUrl);
  return parsed ? `codepen-${safeFileName(parsed.hash)}` : null;
}

export async function installCodePenApp({ rawUrl, name, width, height, download }) {
  const parsed = parseCodePenUrl(rawUrl);
  const embedUrl = getCodePenEmbedUrl(rawUrl, { defaultTab: "result" });
  if (!parsed || !embedUrl) throw new Error("Enter a valid codepen.io pen URL first.");

  await fileSystemReady;
  const id = getCodePenAppId(rawUrl);
  const appName = safeAppName(name, `CodePen ${parsed.hash}`);
  const folderName = safeFileName(`${parsed.user}-${parsed.hash}`).toUpperCase();
  const appDirPath = `${CODEPEN_APP_ROOT}\\${folderName}`;
  const appDir = ensureDir(appDirPath);

  const manifest = {
    id,
    name: appName,
    version: "1.0.0",
    entry: "APP.JS",
    icon: "codepen",
    label: appName.slice(0, 14),
    permissions: ["iframe", "network"],
    window: {
      width: Number(width) || 900,
      height: Number(height) || 640
    }
  };
  const entrySource = getGeneratedEntrySource({ appName, embedUrl, originalUrl: parsed.originalUrl });

  appDir.children["APP.JS"] = { type: "file", content: entrySource };
  appDir.children["MANIFEST.JSON"] = { type: "file", content: JSON.stringify(manifest, null, 2) };
  await saveFileSystem(MOCK_FS);

  const manifestPath = `${appDirPath}\\MANIFEST.JSON`;
  await installFromManifestPath(manifestPath);
  if (download) triggerDownload({ manifest, entrySource });
  return { manifest, manifestPath };
}

function renderViewer({ win, rawUrl, title }) {
  const body = getWindowBodyContainer(win) || win;
  const embedUrl = getCodePenEmbedUrl(rawUrl, { defaultTab: "result" });
  body.innerHTML = "";
  const root = document.createElement("div");
  root.className = "codepen-viewer";

  if (!embedUrl) {
    root.innerHTML = `<div class="codepen-message error">Unable to load this CodePen URL.</div>`;
    body.appendChild(root);
    return;
  }

  root.innerHTML = `
    <div class="codepen-installed-toolbar">
      <strong>${escapeHtml(title || "CodePen Pen")}</strong>
      <a href="${escapeHtml(rawUrl)}" target="_blank" rel="noreferrer noopener">Open on CodePen</a>
    </div>
    <iframe title="${escapeHtml(title || "CodePen Pen")}" loading="lazy" allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; clipboard-read; clipboard-write" sandbox="allow-downloads allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts"></iframe>
  `;
  root.querySelector("iframe").src = embedUrl;
  body.appendChild(root);
}

export function getCodePenContent() {
  return `
    <div class="codepen-runner">
      <div class="codepen-form">
        <label class="codepen-field">
          <span>CodePen URL</span>
          <input class="codepen-url" type="url" value="${DEFAULT_PEN_URL}" placeholder="https://codepen.io/user/pen/hash">
        </label>
        <label class="codepen-field codepen-name-field">
          <span>Installed app name</span>
          <input class="codepen-name" type="text" value="CodePen App" maxlength="60">
        </label>
        <div class="codepen-actions">
          <button type="button" data-action="run">Run Pen</button>
          <button type="button" data-action="open">Open in App Window</button>
          <button type="button" data-action="install">Install as Oriel App</button>
          <button type="button" data-action="download-install">Download + Install</button>
        </div>
        <div class="codepen-status" role="status">Paste a CodePen pen URL, then run it in an isolated iframe.</div>
      </div>
      <div class="codepen-preview-shell">
        <iframe class="codepen-preview" title="CodePen preview" loading="lazy" allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; clipboard-read; clipboard-write" sandbox="allow-downloads allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts"></iframe>
      </div>
    </div>
  `;
}

export function initCodePen(win, initData, wm) {
  if (initData?.mode === "viewer" && initData.url) {
    renderViewer({ win, rawUrl: initData.url, title: initData.title });
    return;
  }

  const body = getWindowBodyContainer(win) || win;
  const urlInput = body.querySelector(".codepen-url");
  const nameInput = body.querySelector(".codepen-name");
  const status = body.querySelector(".codepen-status");
  const preview = body.querySelector(".codepen-preview");

  const setStatus = (message, isError = false) => {
    status.textContent = message;
    status.classList.toggle("error", isError);
  };

  const run = () => {
    const parsed = parseCodePenUrl(urlInput.value);
    const embedUrl = getCodePenEmbedUrl(urlInput.value, { defaultTab: "result" });
    if (!parsed || !embedUrl) {
      setStatus("Enter a valid codepen.io pen URL, such as https://codepen.io/user/pen/hash.", true);
      return null;
    }
    preview.src = embedUrl;
    nameInput.value = nameInput.value || `CodePen ${parsed.hash}`;
    setStatus(`Running ${parsed.userPath}/${parsed.hash} in an isolated iframe.`);
    return parsed;
  };

  body.querySelector('[data-action="run"]')?.addEventListener("click", run);
  body.querySelector('[data-action="open"]')?.addEventListener("click", () => {
    const parsed = run();
    if (!parsed) return;
    const title = safeAppName(nameInput.value, parsed.title);
    wm.openWindow("codepen", title, 900, 640, {
      mode: "viewer",
      url: urlInput.value,
      title
    });
  });

  const install = async (download = false) => {
    const parsed = run();
    if (!parsed) return;
    try {
      setStatus(download ? "Downloading and installing Oriel app..." : "Installing Oriel app...");
      const { manifest, manifestPath } = await installCodePenApp({
        rawUrl: urlInput.value,
        name: safeAppName(nameInput.value, parsed.title),
        width: 900,
        height: 640,
        download
      });
      setStatus(`Installed ${manifest.name}. Manifest saved to ${manifestPath}.`);
      wm.openWindow(manifest.id, manifest.name, manifest.window.width, manifest.window.height);
    } catch (err) {
      setStatus(err.message || "Unable to install CodePen app.", true);
    }
  };

  body.querySelector('[data-action="install"]')?.addEventListener("click", () => install(false));
  body
    .querySelector('[data-action="download-install"]')
    ?.addEventListener("click", () => install(true));

  run();
}

export class CodePenApp extends BaseApp {
  getWindowContent() {
    return this.initData?.mode === "viewer" ? "" : getCodePenContent(this.initData);
  }

  mount() {
    return initCodePen(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}

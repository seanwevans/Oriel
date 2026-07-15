import { BaseApp } from "./base/BaseApp.js";
import { MOCK_FS, fileSystemReady, saveFileSystem } from "../filesystem.js";
import { installFromManifestPath } from "../installer.js";
import { getWindowBodyContainer } from "../windowContent.js";
import { escapeHtml } from "../utils/html.js";

// Self-contained pen runner. Instead of embedding codepen.io (which renders
// CodePen's own toolbar/chrome inside the iframe), Oriel takes the raw HTML,
// CSS, and JS and compiles them into a single document rendered through an
// isolated iframe `srcdoc`. Nothing is fetched from CodePen at runtime.

const PEN_APP_ROOT = "C\\ORIEL\\PENS";

// Isolated: scripts run, but the pen gets an opaque origin (no allow-same-origin),
// so it cannot reach Oriel's storage, DOM, or origin.
const PEN_SANDBOX =
  "allow-scripts allow-modals allow-popups allow-forms allow-pointer-lock allow-downloads";

const STARTER = {
  html: `<h1>Hello from Oriel</h1>\n<p>Paste your pen's HTML here.</p>`,
  css: `body {\n  margin: 0;\n  height: 100vh;\n  display: grid;\n  place-items: center;\n  font-family: system-ui, sans-serif;\n  background: #0f172a;\n  color: #e2e8f0;\n}`,
  js: `console.log("Pen running inside Oriel");`
};

function safeAppName(value, fallback = "Web App") {
  const cleaned = String(value || "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
  return cleaned || fallback;
}

function safeFileName(value = "pen") {
  const cleaned = String(value)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return cleaned || "pen";
}

export function makeAppId(seed) {
  return `pen-${safeFileName(seed)}`;
}

// Compile the three sources into one standalone HTML document. The closing
// script tag is neutralized so JS containing the literal `</script>` cannot
// terminate the injected block early.
export function buildPenDocument({ html = "", css = "", js = "" } = {}) {
  const safeJs = String(js).replace(/<\/script/gi, "<\\/script");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
${css}
</style>
</head>
<body>
${html}
<script>
${safeJs}
</script>
</body>
</html>`;
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

// Produce a self-contained ES module that renders the compiled pen through a
// sandboxed iframe. The sources are embedded so the installed app never touches
// the network and never shows any CodePen chrome.
export function getGeneratedEntrySource({ appName, html = "", css = "", js = "" }) {
  return `const APP_NAME = ${JSON.stringify(appName)};
const PEN_HTML = ${JSON.stringify(html)};
const PEN_CSS = ${JSON.stringify(css)};
const PEN_JS = ${JSON.stringify(js)};
const PEN_SANDBOX = ${JSON.stringify(PEN_SANDBOX)};

function buildPenDocument(html, css, js) {
  const safeJs = String(js).replace(/<\\/script/gi, "<\\\\/script");
  return "<!DOCTYPE html>\\n<html lang=\\"en\\">\\n<head>\\n<meta charset=\\"utf-8\\">\\n" +
    "<meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\">\\n" +
    "<style>\\n" + css + "\\n</style>\\n</head>\\n<body>\\n" + html + "\\n" +
    "<script>\\n" + safeJs + "\\n</script>\\n</body>\\n</html>";
}

export default function initInstalledPen(win) {
  const body = win.querySelector(".window-body") || win;
  body.innerHTML = "";
  const root = document.createElement("div");
  root.className = "codepen-installed-app";
  const iframe = document.createElement("iframe");
  iframe.title = APP_NAME;
  iframe.loading = "lazy";
  iframe.setAttribute("sandbox", PEN_SANDBOX);
  iframe.srcdoc = buildPenDocument(PEN_HTML, PEN_CSS, PEN_JS);
  root.appendChild(iframe);
  body.appendChild(root);
}
`;
}

function triggerDownload({ manifest, entrySource }) {
  const payload = {
    kind: "oriel-pen-app",
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

export async function installPenApp({
  id,
  name,
  html = "",
  css = "",
  js = "",
  width,
  height,
  download
}) {
  const appName = safeAppName(name);
  const appId = safeFileName(id) ? makeAppId(id) : makeAppId(appName);

  await fileSystemReady;
  const folderName = safeFileName(appId).toUpperCase();
  const appDirPath = `${PEN_APP_ROOT}\\${folderName}`;
  const appDir = ensureDir(appDirPath);

  const manifest = {
    id: appId,
    name: appName,
    version: "1.0.0",
    entry: "APP.JS",
    icon: "codepen",
    label: appName.slice(0, 14),
    permissions: ["iframe"],
    window: {
      width: Number(width) || 900,
      height: Number(height) || 640
    }
  };
  const entrySource = getGeneratedEntrySource({ appName, html, css, js });

  appDir.children["APP.JS"] = { type: "file", content: entrySource };
  appDir.children["MANIFEST.JSON"] = { type: "file", content: JSON.stringify(manifest, null, 2) };
  await saveFileSystem(MOCK_FS);

  const manifestPath = `${appDirPath}\\MANIFEST.JSON`;
  await installFromManifestPath(manifestPath);
  if (download) triggerDownload({ manifest, entrySource });
  return { manifest, manifestPath };
}

// Kept for backwards compatibility with older callers that installed pens by
// name; delegates to the source-based installer.
export const installCodePenApp = installPenApp;

function renderViewer({ win, html, css, js, title }) {
  const body = getWindowBodyContainer(win) || win;
  body.innerHTML = "";
  const root = document.createElement("div");
  root.className = "codepen-viewer";
  const iframe = document.createElement("iframe");
  iframe.title = title || "Pen preview";
  iframe.loading = "lazy";
  iframe.setAttribute("sandbox", PEN_SANDBOX);
  iframe.srcdoc = buildPenDocument({ html, css, js });
  root.appendChild(iframe);
  body.appendChild(root);
}

export function getPenRunnerContent() {
  return `
    <div class="pen-runner">
      <div class="pen-controls">
        <label class="pen-name-field">
          <span>App name</span>
          <input class="pen-name" type="text" value="Web App" maxlength="60">
        </label>
        <div class="pen-actions">
          <button type="button" data-action="run">Run &#9654;</button>
          <button type="button" data-action="open">Open in Window</button>
          <button type="button" data-action="install">Install as App</button>
          <button type="button" data-action="download">Download</button>
        </div>
        <div class="pen-status" role="status">Paste HTML, CSS, and JS. Oriel compiles them into a live preview.</div>
      </div>
      <div class="pen-editors">
        <label class="pen-pane">
          <span>HTML</span>
          <textarea class="pen-html" spellcheck="false" autocomplete="off" autocapitalize="off">${escapeHtml(STARTER.html)}</textarea>
        </label>
        <label class="pen-pane">
          <span>CSS</span>
          <textarea class="pen-css" spellcheck="false" autocomplete="off" autocapitalize="off">${escapeHtml(STARTER.css)}</textarea>
        </label>
        <label class="pen-pane">
          <span>JS</span>
          <textarea class="pen-js" spellcheck="false" autocomplete="off" autocapitalize="off">${escapeHtml(STARTER.js)}</textarea>
        </label>
      </div>
      <div class="pen-preview-shell">
        <iframe class="pen-preview" title="Pen preview" sandbox="${PEN_SANDBOX}"></iframe>
      </div>
    </div>
  `;
}

export function initPenRunner(win, initData, wm, services, app) {
  if (initData?.mode === "viewer") {
    renderViewer({
      win,
      html: initData.html,
      css: initData.css,
      js: initData.js,
      title: initData.title
    });
    return;
  }

  const body = getWindowBodyContainer(win) || win;
  const nameInput = body.querySelector(".pen-name");
  const htmlInput = body.querySelector(".pen-html");
  const cssInput = body.querySelector(".pen-css");
  const jsInput = body.querySelector(".pen-js");
  const status = body.querySelector(".pen-status");
  const preview = body.querySelector(".pen-preview");

  const on = (target, type, listener) =>
    app?.listen ? app.listen(target, type, listener) : target?.addEventListener(type, listener);

  const setStatus = (message, isError = false) => {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("error", isError);
  };

  const getSources = () => ({
    html: htmlInput?.value || "",
    css: cssInput?.value || "",
    js: jsInput?.value || ""
  });

  const run = () => {
    if (preview) preview.srcdoc = buildPenDocument(getSources());
    setStatus("Running your compiled pen in an isolated iframe.");
  };

  // Live preview: recompile shortly after typing stops.
  let debounce = null;
  app?.registerDisposable?.(() => clearTimeout(debounce));
  const scheduleRun = () => {
    clearTimeout(debounce);
    debounce = setTimeout(run, 400);
  };

  [htmlInput, cssInput, jsInput].forEach((el) => on(el, "input", scheduleRun));

  on(body.querySelector('[data-action="run"]'), "click", run);

  on(body.querySelector('[data-action="open"]'), "click", () => {
    const title = safeAppName(nameInput?.value);
    wm.openWindow("codepen", title, 900, 640, { mode: "viewer", title, ...getSources() });
  });

  const install = async (download = false) => {
    const name = safeAppName(nameInput?.value);
    try {
      setStatus(download ? "Downloading and installing app..." : "Installing app...");
      const { manifest, manifestPath } = await installPenApp({
        id: name,
        name,
        ...getSources(),
        width: 900,
        height: 640,
        download
      });
      setStatus(`Installed ${manifest.name}. Manifest saved to ${manifestPath}.`);
      wm.openWindow(manifest.id, manifest.name, manifest.window.width, manifest.window.height);
    } catch (err) {
      setStatus(err.message || "Unable to install app.", true);
    }
  };

  on(body.querySelector('[data-action="install"]'), "click", () => install(false));
  on(body.querySelector('[data-action="download"]'), "click", () => install(true));

  run();
}

export class CodePenApp extends BaseApp {
  getWindowContent() {
    return this.initData?.mode === "viewer" ? "" : getPenRunnerContent();
  }

  mount() {
    return initPenRunner(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}

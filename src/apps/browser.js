import {
  BROWSER_FRAME_SANDBOX,
  BROWSER_HOME,
  BROWSER_PROXY_PREFIX,
  stripScriptTags
} from "../network/config.js";
import { trackedFetch } from "../network/trackedFetch.js";

function ensureBrowserFrameSandbox(frame) {
  if (!frame) return;
  if (frame.getAttribute?.("sandbox") !== BROWSER_FRAME_SANDBOX) {
    frame.setAttribute("sandbox", BROWSER_FRAME_SANDBOX);
  }
}

function setBrowserFrameSrcdoc(frame, html) {
  ensureBrowserFrameSandbox(frame);
  frame.srcdoc = html;
}

export const browserSessions = {};

export function initBrowser(win, sessions = browserSessions) {
  const sessionStore =
    sessions && typeof sessions === "object" ? sessions : browserSessions;
  const urlInput = win.querySelector(".browser-url");
  const frame = win.querySelector(".browser-frame");
  const status = win.querySelector(".browser-status");
  const backBtn = win.querySelector('[data-action="back"]');
  const fwdBtn = win.querySelector('[data-action="forward"]');
  const refreshBtn = win.querySelector('[data-action="refresh"]');
  const homeBtn = win.querySelector('[data-action="home"]');
  const goBtn = win.querySelector('[data-action="go"]');
  const sessionId = win.dataset.id;

  if (!urlInput || !frame || !status) return;

  const resetSession = () => {
    sessionStore[sessionId] = {
      history: [],
      index: -1
    };
  };
  resetSession();

  const setStatus = (text) => {
    status.textContent = text;
  };

  const normalizeUrl = (raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    if (!/^https?:\/\//i.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return trimmed;
  };

  const buildProxiedUrl = (url) => {
    try {
      const parsed = new URL(url);
      const portPart = parsed.port ? `:${parsed.port}` : "";
      return `${BROWSER_PROXY_PREFIX}${parsed.protocol}//${parsed.hostname}${portPart}${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch (err) {
      return `${BROWSER_PROXY_PREFIX}https://${url.replace(/^\/+/, "")}`;
    }
  };

  const updateNavState = () => {
    const session = sessionStore[sessionId];
    if (!session) return;
    const hasBack = session.index > 0;
    const hasForward = session.index < session.history.length - 1;
    if (backBtn) backBtn.disabled = !hasBack;
    if (fwdBtn) fwdBtn.disabled = !hasForward;
  };

  let lastLoadToken = 0;

  const renderProxiedContent = async (url) => {
    const token = ++lastLoadToken;
    const proxied = buildProxiedUrl(url);
    setStatus(`Loading ${url} (via text proxy)...`);
    ensureBrowserFrameSandbox(frame);
    frame.removeAttribute("src");
    setBrowserFrameSrcdoc(frame, "");
    try {
      const res = await trackedFetch(proxied);
      if (token !== lastLoadToken) return;
      if (!res.ok) {
        const statusMessage = `Proxy error (HTTP ${res.status})`;
        setStatus(statusMessage);
        setBrowserFrameSrcdoc(frame, `<p>${statusMessage}</p>`);
        return;
      }
      const text = stripScriptTags(await res.text());
      setBrowserFrameSrcdoc(frame, text || `<p>Proxy returned an empty response for ${url}.</p>`);
      setStatus(`Loaded ${url}`);
    } catch (err) {
      console.error(err);
      if (token !== lastLoadToken) return;
      ensureBrowserFrameSandbox(frame);
      frame.removeAttribute("srcdoc");
      frame.src = proxied;
      setStatus(`Opening ${url} directly...`);
    }
  };

  const loadUrl = (rawUrl, pushHistory = true) => {
    const url = normalizeUrl(rawUrl);
    const session = sessionStore[sessionId];
    if (!url || !session) return;
    if (pushHistory) {
      session.history = session.history.slice(0, session.index + 1);
      session.history.push(url);
      session.index = session.history.length - 1;
    }
    urlInput.value = url;
    renderProxiedContent(url);
    updateNavState();
  };

  if (backBtn)
    backBtn.onclick = () => {
      const session = sessionStore[sessionId];
      if (!session || session.index <= 0) return;
      session.index -= 1;
      const target = session.history[session.index];
      urlInput.value = target;
      renderProxiedContent(target);
      updateNavState();
    };

  if (fwdBtn)
    fwdBtn.onclick = () => {
      const session = sessionStore[sessionId];
      if (!session || session.index >= session.history.length - 1) return;
      session.index += 1;
      const target = session.history[session.index];
      urlInput.value = target;
      renderProxiedContent(target);
      updateNavState();
    };

  if (refreshBtn)
    refreshBtn.onclick = () => {
      const session = sessionStore[sessionId];
      if (!session || session.index < 0) return;
      const target = session.history[session.index];
      renderProxiedContent(target);
    };

  if (homeBtn) homeBtn.onclick = () => loadUrl(BROWSER_HOME);
  if (goBtn) goBtn.onclick = () => loadUrl(urlInput.value);

  urlInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") loadUrl(urlInput.value);
  });

  frame.addEventListener("load", () => {
    const session = sessionStore[sessionId];
    if (!session) return;
    const currentUrl = session.history[session.index] || "";
    setStatus(currentUrl ? `Loaded ${currentUrl}` : "Ready");
  });

  const reloadWithDefaults = () => {
    resetSession();
    loadUrl(BROWSER_HOME);
  };

  reloadWithDefaults();
  win.browserReload = reloadWithDefaults;
}


export function getBrowserContent() {
    return `<div class="browser-layout">
              <div class="browser-toolbar">
                <button class="browser-btn" data-action="back" title="Back">◀</button>
                <button class="browser-btn" data-action="forward" title="Forward">▶</button>
                <button class="browser-btn" data-action="refresh" title="Refresh">⟳</button>
                <button class="browser-btn" data-action="home" title="Home">⌂</button>
                <input class="browser-url" type="text" placeholder="${getBrowserPlaceholder()}" spellcheck="false">
                <button class="browser-btn go-btn" data-action="go">Go</button>
              </div>
              <div class="browser-view">
                <iframe class="browser-frame" src="about:blank" sandbox="allow-forms allow-popups"></iframe>
                <div class="browser-status">Enter a URL to begin browsing.</div>
              </div>
            </div>`;

}

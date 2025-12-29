import { getNetworkDefaults } from "../networking.js";
import { DEFAULT_SPLASH_IMAGE, DEFAULT_WALLPAPER } from "../defaults.js";

const DEMO_MESSAGES = [
  {
    id: "demo-1",
    folder: "INBOX",
    subject: "Welcome to RetroMail",
    from: "sysop@oriel.local",
    to: "you@example.com",
    date: "1997-10-12T14:05:00Z",
    unread: false,
    tags: ["system"],
    body:
      "You've unlocked the personal side of Oriel. Use the account panel to point at any IMAP/SMTP bridge and sync real mail, or just explore the demo inbox.",
    attachments: []
  },
  {
    id: "demo-2",
    folder: "INBOX",
    subject: "Postcard from the web",
    from: "neon@art-net.example",
    to: "you@example.com",
    date: "1998-01-20T09:30:00Z",
    unread: true,
    tags: ["inline"],
    body:
      "This inline JPEG rides along with the message—no downloads needed. Filters on the left help you zero in on rich messages.",
    attachments: [
      {
        name: "postcard.jpg",
        type: "image/jpeg",
        url: new URL(DEFAULT_SPLASH_IMAGE, import.meta.url).href,
        inline: true
      }
    ]
  },
  {
    id: "demo-3",
    folder: "Newsletters",
    subject: "Retro hardware digest",
    from: "list@retro-news.example",
    to: "you@example.com",
    date: "1998-02-02T22:15:00Z",
    unread: true,
    tags: ["unread", "attachments"],
    body:
      "- Feature: running DOS games in high resolution.\n- Classifieds: vintage modems available.\n- Tip: pair RetroMail with filters to keep newsletters tidy.",
    attachments: [
      {
        name: "catalogue.png",
        type: "image/png",
        url: new URL(DEFAULT_WALLPAPER, import.meta.url).href,
        inline: false
      }
    ]
  }
];

const STORAGE_KEY = "retromail-settings";

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed;
  } catch (err) {
    console.warn("Failed to parse stored mail settings", err);
  }
  return {};
}

function persistSettings(settings) {
  const copy = { ...settings };
  delete copy.password;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
}

function escapeHtml(text = "") {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(iso) {
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return "Unknown date";
  return dt.toLocaleString();
}

function renderBody(body = "") {
  const escaped = escapeHtml(body);
  return escaped.replace(/\n/g, "<br>");
}

function filterMessages(messages, filter, search, fromFilter) {
  const query = search.trim().toLowerCase();
  const fromQuery = fromFilter.trim().toLowerCase();
  return messages.filter((msg) => {
    if (filter === "unread" && !msg.unread) return false;
    if (filter === "attachments" && !(msg.attachments?.length)) return false;
    if (filter === "inline" && !(msg.attachments || []).some((a) => a.inline && a.type.startsWith("image/"))) return false;
    if (fromQuery && !msg.from.toLowerCase().includes(fromQuery)) return false;
    if (!query) return true;
    const haystack = `${msg.subject} ${msg.body} ${msg.from}`.toLowerCase();
    return haystack.includes(query);
  });
}

async function callMailBridge(endpoint, payload) {
  const target = endpoint?.replace(/\/$/, "");
  if (!target) throw new Error("No mail bridge configured");

  const res = await fetch(target, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bridge responded with ${res.status}: ${text || res.statusText}`);
  }

  return res.json();
}

export function getEmailContent() {
  const { mailProxyRoot } = getNetworkDefaults();
  return `
    <div class="retromail" aria-label="RetroMail client">
      <div class="mail-toolbar">
        <div class="mail-toolbar-left">
          <label>Filter:
            <select class="mail-filter">
              <option value="all">All mail</option>
              <option value="unread">Unread</option>
              <option value="attachments">With attachments</option>
              <option value="inline">Inline images</option>
            </select>
          </label>
          <label>From:
            <input type="text" class="mail-from-filter" placeholder="sender@example.com">
          </label>
          <label>Search:
            <input type="text" class="mail-search" placeholder="Subject, body, or sender">
          </label>
        </div>
        <div class="mail-toolbar-right">
          <button class="task-btn mail-sync">Sync IMAP</button>
          <button class="task-btn mail-mark-unread">Mark unread</button>
        </div>
      </div>
      <div class="mail-body">
        <div class="mail-sidebar">
          <div class="mail-panel-title">Account</div>
          <label class="mail-field">IMAP host<input type="text" class="mail-imap-host" placeholder="imap.example.com"></label>
          <label class="mail-field">IMAP port<input type="number" class="mail-imap-port" value="993"></label>
          <label class="mail-field">SMTP host<input type="text" class="mail-smtp-host" placeholder="smtp.example.com"></label>
          <label class="mail-field">SMTP port<input type="number" class="mail-smtp-port" value="587"></label>
          <label class="mail-field">Username<input type="text" class="mail-username" placeholder="mailbox user"></label>
          <label class="mail-field">Password<input type="password" class="mail-password" placeholder="Stored for session only"></label>
          <label class="mail-field">Bridge URL<input type="text" class="mail-bridge" placeholder="${mailProxyRoot || "Add a JSON IMAP/SMTP bridge"}"></label>
          <div class="mail-status" aria-live="polite">${mailProxyRoot ? "Ready to sync." : "Using demo inbox. Add a bridge to reach IMAP/SMTP."}</div>
          <button class="task-btn mail-save">Save settings</button>
        </div>
        <div class="mail-list" role="listbox" aria-label="Messages"></div>
        <div class="mail-preview">
          <div class="mail-preview-header">
            <div class="mail-preview-meta"></div>
            <div class="mail-preview-subject"></div>
          </div>
          <div class="mail-preview-body"></div>
          <div class="mail-attachments" aria-label="Attachments"></div>
          <div class="mail-inline-gallery" aria-label="Inline images"></div>
          <div class="mail-compose">
            <div class="mail-panel-title">Send mail (SMTP)</div>
            <label class="mail-field">To<input type="text" class="mail-compose-to" placeholder="friend@example.com"></label>
            <label class="mail-field">Subject<input type="text" class="mail-compose-subject" placeholder="Retro greetings"></label>
            <label class="mail-field">Message<textarea class="mail-compose-body" rows="4" placeholder="Plain text body"></textarea></label>
            <button class="task-btn mail-send">Send via SMTP</button>
            <div class="mail-compose-status" aria-live="polite"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initEmail(win) {
  const settings = { ...loadSettings() };
  const filterSelect = win.querySelector(".mail-filter");
  const fromFilterInput = win.querySelector(".mail-from-filter");
  const searchInput = win.querySelector(".mail-search");
  const listEl = win.querySelector(".mail-list");
  const metaEl = win.querySelector(".mail-preview-meta");
  const subjectEl = win.querySelector(".mail-preview-subject");
  const bodyEl = win.querySelector(".mail-preview-body");
  const attachmentsEl = win.querySelector(".mail-attachments");
  const inlineEl = win.querySelector(".mail-inline-gallery");
  const syncBtn = win.querySelector(".mail-sync");
  const statusEl = win.querySelector(".mail-status");
  const saveBtn = win.querySelector(".mail-save");
  const markUnreadBtn = win.querySelector(".mail-mark-unread");
  const sendBtn = win.querySelector(".mail-send");
  const composeStatus = win.querySelector(".mail-compose-status");
  const composeTo = win.querySelector(".mail-compose-to");
  const composeSubject = win.querySelector(".mail-compose-subject");
  const composeBody = win.querySelector(".mail-compose-body");

  const imapHost = win.querySelector(".mail-imap-host");
  const imapPort = win.querySelector(".mail-imap-port");
  const smtpHost = win.querySelector(".mail-smtp-host");
  const smtpPort = win.querySelector(".mail-smtp-port");
  const username = win.querySelector(".mail-username");
  const password = win.querySelector(".mail-password");
  const bridge = win.querySelector(".mail-bridge");

  if (!listEl || !filterSelect || !searchInput || !statusEl) return;

  // populate saved settings
  if (settings.imapHost) imapHost.value = settings.imapHost;
  if (settings.imapPort) imapPort.value = settings.imapPort;
  if (settings.smtpHost) smtpHost.value = settings.smtpHost;
  if (settings.smtpPort) smtpPort.value = settings.smtpPort;
  if (settings.username) username.value = settings.username;
  if (settings.bridge) bridge.value = settings.bridge;

  let messages = DEMO_MESSAGES.map((m) => ({ ...m }));
  let activeId = messages[0]?.id || null;

  const setStatus = (text, isError = false) => {
    statusEl.textContent = text;
    statusEl.classList.toggle("mail-status-error", isError);
  };

  const setComposeStatus = (text, isError = false) => {
    composeStatus.textContent = text;
    composeStatus.classList.toggle("mail-status-error", isError);
  };

  const renderAttachments = (msg) => {
    attachmentsEl.innerHTML = "";
    if (!msg?.attachments?.length) {
      attachmentsEl.innerHTML = '<div class="mail-attachment-row empty">No attachments</div>';
      return;
    }
    msg.attachments.forEach((att) => {
      const row = document.createElement("div");
      row.className = "mail-attachment-row";
      row.textContent = `${att.name} (${att.type})`;
      attachmentsEl.appendChild(row);
    });
  };

  const renderInlineImages = (msg) => {
    inlineEl.innerHTML = "";
    const inlineImages = (msg?.attachments || []).filter((a) => a.inline && a.type.startsWith("image/"));
    if (!inlineImages.length) {
      inlineEl.innerHTML = '<div class="mail-inline-empty">No inline images</div>';
      return;
    }
    inlineImages.forEach((att) => {
      const wrapper = document.createElement("div");
      wrapper.className = "mail-inline";
      const img = document.createElement("img");
      img.src = att.url;
      img.alt = att.name;
      wrapper.appendChild(img);
      inlineEl.appendChild(wrapper);
    });
  };

  const renderPreview = (msg) => {
    if (!msg) {
      metaEl.textContent = "No message selected";
      subjectEl.textContent = "";
      bodyEl.innerHTML = "";
      attachmentsEl.innerHTML = "";
      inlineEl.innerHTML = "";
      return;
    }
    metaEl.textContent = `${msg.from} → ${msg.to} · ${formatDate(msg.date)} · ${msg.folder || "Inbox"}`;
    subjectEl.textContent = msg.subject || "(No subject)";
    bodyEl.innerHTML = renderBody(msg.body);
    renderAttachments(msg);
    renderInlineImages(msg);
  };

  const renderList = () => {
    const filtered = filterMessages(messages, filterSelect.value, searchInput.value, fromFilterInput.value);
    listEl.innerHTML = "";
    if (!filtered.length) {
      listEl.innerHTML = '<div class="mail-empty">No messages match these filters.</div>';
      return;
    }
    filtered.forEach((msg) => {
      const row = document.createElement("div");
      row.className = "mail-row" + (msg.id === activeId ? " active" : "");
      if (msg.unread) row.classList.add("unread");
      row.dataset.id = msg.id;
      row.innerHTML = `
        <div class="mail-row-top">
          <span class="mail-row-from">${escapeHtml(msg.from)}</span>
          <span class="mail-row-date">${formatDate(msg.date)}</span>
        </div>
        <div class="mail-row-subject">${escapeHtml(msg.subject)}</div>
        <div class="mail-row-flags">${msg.attachments?.length ? "📎" : ""}${
        (msg.attachments || []).some((a) => a.inline && a.type.startsWith("image/")) ? "🖼️" : ""
      }</div>
      `;
      row.addEventListener("click", () => {
        activeId = msg.id;
        msg.unread = false;
        renderList();
        renderPreview(msg);
      });
      listEl.appendChild(row);
    });

    const activeMsg = messages.find((m) => m.id === activeId);
    renderPreview(activeMsg || filtered[0]);
  };

  const gatherSettings = () => ({
    imapHost: imapHost.value.trim(),
    imapPort: imapPort.value.trim() || "",
    smtpHost: smtpHost.value.trim(),
    smtpPort: smtpPort.value.trim() || "",
    username: username.value.trim(),
    password: password.value,
    bridge: bridge.value.trim() || getNetworkDefaults().mailProxyRoot || ""
  });

  const syncFromBridge = async () => {
    const cfg = gatherSettings();
    if (!cfg.bridge) {
      setStatus("No bridge set. Showing demo inbox.", true);
      messages = DEMO_MESSAGES.map((m) => ({ ...m }));
      activeId = messages[0]?.id || null;
      renderList();
      return;
    }

    setStatus("Syncing IMAP…");
    try {
      const payload = {
        action: "imap:list",
        host: cfg.imapHost,
        port: Number(cfg.imapPort) || 993,
        username: cfg.username,
        password: cfg.password,
        limit: 50
      };
      const response = await callMailBridge(cfg.bridge, payload);
      const fetched = Array.isArray(response?.messages) ? response.messages : [];
      messages = (fetched.length ? fetched : DEMO_MESSAGES).map((m, idx) => ({
        ...m,
        id: m.id || `remote-${idx}`,
        attachments: m.attachments || []
      }));
      activeId = messages[0]?.id || null;
      setStatus(fetched.length ? "Synced from IMAP." : "Bridge returned no mail; showing demo inbox.");
      renderList();
    } catch (err) {
      console.error(err);
      setStatus(`Sync failed: ${err.message}. Using demo inbox.`, true);
      messages = DEMO_MESSAGES.map((m) => ({ ...m }));
      renderList();
    }
  };

  const sendMessage = async () => {
    const cfg = gatherSettings();
    setComposeStatus("Sending…");
    const message = {
      to: composeTo.value.trim(),
      subject: composeSubject.value.trim() || "(No subject)",
      body: composeBody.value
    };

    if (!cfg.bridge) {
      setComposeStatus("No bridge configured; message saved to Sent locally.");
      messages.unshift({
        id: `local-${Date.now()}`,
        folder: "Sent",
        subject: message.subject,
        from: cfg.username || "you@localhost",
        to: message.to || "unknown",
        date: new Date().toISOString(),
        unread: false,
        body: message.body,
        attachments: []
      });
      renderList();
      return;
    }

    try {
      const payload = {
        action: "smtp:send",
        host: cfg.smtpHost,
        port: Number(cfg.smtpPort) || 587,
        username: cfg.username,
        password: cfg.password,
        message
      };
      await callMailBridge(cfg.bridge, payload);
      setComposeStatus("Sent via SMTP bridge.");
    } catch (err) {
      console.error(err);
      setComposeStatus(`Send failed: ${err.message}` || "Send failed", true);
    }
  };

  const markUnread = () => {
    const active = messages.find((m) => m.id === activeId);
    if (active) {
      active.unread = true;
      renderList();
    }
  };

  filterSelect.addEventListener("change", renderList);
  fromFilterInput.addEventListener("input", renderList);
  searchInput.addEventListener("input", renderList);
  markUnreadBtn?.addEventListener("click", markUnread);
  syncBtn?.addEventListener("click", syncFromBridge);
  sendBtn?.addEventListener("click", sendMessage);
  saveBtn?.addEventListener("click", () => {
    const next = gatherSettings();
    persistSettings(next);
    setStatus("Saved. Password stays in this session only.");
  });

  renderList();
}

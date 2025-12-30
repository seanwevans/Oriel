import { publish, subscribe } from "../eventBus.js";

const CHANNEL_NAME = "oriel-messenger";
const STORAGE_KEY = "oriel-messenger-history";
const NAME_KEY = "oriel-messenger-name";
const MAX_MESSAGES = 200;

function uid() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return "msg-" + Math.random().toString(16).slice(2, 10);
}

function loadMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(-MAX_MESSAGES);
  } catch (err) {
    console.warn("Failed to parse messenger history", err);
    return [];
  }
}

function saveMessages(messages) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES)));
}

function loadName() {
  try {
    const saved = localStorage.getItem(NAME_KEY);
    if (saved) return saved;
  } catch (err) {
    console.warn("Failed to load messenger name", err);
  }
  return `Guest-${Math.random().toString(16).slice(2, 6)}`;
}

function saveName(name) {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch (err) {
    console.warn("Failed to persist messenger name", err);
  }
}

function formatTimestamp(ms) {
  const dt = new Date(ms);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function getMessengerContent() {
  return `
    <div class="messenger">
      <div class="messenger-toolbar">
        <label class="messenger-label">Name</label>
        <input class="messenger-name" aria-label="Chat nickname" />
        <button class="task-btn messenger-clear" title="Clear local history">Clear</button>
        <div class="messenger-status" aria-live="polite"></div>
      </div>
      <div class="messenger-log" aria-live="polite"></div>
      <form class="messenger-input" autocomplete="off">
        <input class="messenger-message" placeholder="Type a message and press Enter" aria-label="Chat message" />
        <button class="task-btn messenger-send" type="submit">Send</button>
      </form>
    </div>
  `;
}

export function initMessenger(win) {
  const logEl = win.querySelector(".messenger-log");
  const input = win.querySelector(".messenger-message");
  const sendBtn = win.querySelector(".messenger-send");
  const nameInput = win.querySelector(".messenger-name");
  const status = win.querySelector(".messenger-status");
  const clearBtn = win.querySelector(".messenger-clear");

  if (!logEl || !input || !sendBtn || !nameInput) return;

  const clientId = uid();
  let messages = loadMessages();
  let currentName = loadName();
  const seenIds = new Set(messages.map((m) => m.id));
  nameInput.value = currentName;

  const channel = "BroadcastChannel" in window ? new BroadcastChannel(CHANNEL_NAME) : null;

  function setStatus(text) {
    if (!status) return;
    status.textContent = text;
  }

  function persistMessages() {
    saveMessages(messages);
  }

  function renderMessages() {
    logEl.innerHTML = "";
    messages.forEach((msg) => {
      const row = document.createElement("div");
      row.className = "messenger-message-row";
      row.innerHTML = `
        <span class="messenger-meta">${formatTimestamp(msg.timestamp)}</span>
        <span class="messenger-sender">${escapeHtml(msg.sender || "Guest")}</span>
        <span class="messenger-text">${escapeHtml(msg.text || "")}</span>
      `;
      logEl.appendChild(row);
    });
    logEl.scrollTop = logEl.scrollHeight;
  }

  function addMessage(msg, { persist = true } = {}) {
    if (!msg || seenIds.has(msg.id)) return;
    seenIds.add(msg.id);
    messages.push(msg);
    if (messages.length > MAX_MESSAGES) messages = messages.slice(-MAX_MESSAGES);
    if (persist) persistMessages();
    renderMessages();
  }

  function broadcast(payload) {
    channel?.postMessage(payload);
    publish("messenger:event", payload);
  }

  function handleIncoming(payload) {
    if (!payload) return;
    if (payload.type === "chat" && payload.message) {
      addMessage(payload.message, { persist: true });
    }
    if (payload.type === "history:request") {
      broadcast({ type: "history:response", messages, from: clientId });
    }
    if (payload.type === "history:response" && Array.isArray(payload.messages)) {
      payload.messages.forEach((m) => addMessage(m, { persist: true }));
    }
  }

  const unsubscribe = subscribe("messenger:event", handleIncoming);
  if (channel) {
    channel.addEventListener("message", (event) => handleIncoming(event.data));
    setStatus("Live sync ready");
  } else {
    setStatus("BroadcastChannel unavailable; using local history only");
  }

  renderMessages();

  nameInput.addEventListener("input", () => {
    currentName = nameInput.value.trim() || "Guest";
    saveName(currentName);
  });

  clearBtn?.addEventListener("click", () => {
    messages = [];
    seenIds.clear();
    persistMessages();
    renderMessages();
  });

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    const message = {
      id: uid(),
      sender: currentName || "Guest",
      text,
      timestamp: Date.now(),
      from: clientId
    };
    addMessage(message, { persist: true });
    broadcast({ type: "chat", message });
    input.value = "";
  }

  sendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    sendMessage();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  // Ask peers for their history so new windows can hydrate quickly.
  broadcast({ type: "history:request", from: clientId });

  // Clean up when window is destroyed
  win.addEventListener("app:destroy", () => {
    unsubscribe();
    channel?.close?.();
  });
}

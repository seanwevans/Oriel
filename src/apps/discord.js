import { BaseApp } from "./base/BaseApp.js";
import { trackedFetch } from "../network/trackedFetch.js";
export function getDiscordContent() {
  return `
        <div class="discord">
          <div class="discord-toolbar">
            <input type="text" class="discord-token" placeholder="Token (Bot or User)" />
            <input type="text" class="discord-channel" placeholder="Channel ID" />
            <button class="task-btn discord-fetch">Fetch Messages</button>
            <button class="task-btn discord-clear">Clear</button>
          </div>
          <div class="discord-log"></div>
          <div class="discord-compose">
            <input type="text" class="discord-message" placeholder="Type a message to send... (Ctrl/Cmd + Enter to send)" />
            <button class="task-btn discord-send">Send</button>
          </div>
          <div class="discord-status" data-tone="info">Enter a token and channel ID, then fetch messages.</div>
        </div>
      `;
}

export function initDiscord(win, _initData = null, _manager = null, _services = {}, app = null) {
  const tokenInput = win.querySelector(".discord-token");
  const channelInput = win.querySelector(".discord-channel");
  const fetchBtn = win.querySelector(".discord-fetch");
  const clearBtn = win.querySelector(".discord-clear");
  const sendBtn = win.querySelector(".discord-send");
  const messageInput = win.querySelector(".discord-message");
  const logEl = win.querySelector(".discord-log");
  const statusEl = win.querySelector(".discord-status");

  const setStatus = (text, tone = "info") => {
    statusEl.textContent = text;
    statusEl.dataset.tone = tone;
  };

  const formatAuth = (raw) => {
    if (!raw) return "";
    if (raw.startsWith("Bot ") || raw.startsWith("Bearer ")) return raw;
    return `Bot ${raw}`;
  };

  const renderMessages = (messages = []) => {
    logEl.innerHTML = "";
    if (!messages.length) {
      const empty = document.createElement("div");
      empty.className = "discord-empty";
      empty.textContent = "No messages returned for this channel.";
      logEl.appendChild(empty);
      return;
    }

    messages
      .slice()
      .reverse()
      .forEach((msg) => {
        const row = document.createElement("div");
        row.className = "discord-msg";
        const ts = new Date(msg.timestamp || msg.edited_timestamp || Date.now());
        const meta = `${msg.author?.username || "Unknown"} · ${ts.toLocaleString()}`;

        row.innerHTML = `<div class="discord-msg-meta">${meta}</div><div class="discord-msg-body">${
          msg.content ? msg.content.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "(no content)"
        }</div>`;
        logEl.appendChild(row);
      });
  };

  const requireFields = () => {
    const token = tokenInput.value.trim();
    const channelId = channelInput.value.trim();
    if (!token || !channelId) {
      setStatus("Enter both a token and channel ID before proceeding.", "error");
      return null;
    }
    return { token, channelId };
  };

  const fetchMessages = async () => {
    const fields = requireFields();
    if (!fields) return;

    setStatus("Fetching messages via Discord API...", "info");
    try {
      const controller = app?.createAbortController?.();
      const res = await trackedFetch(
        `https://discord.com/api/v10/channels/${encodeURIComponent(fields.channelId)}/messages?limit=20`,
        {
          headers: {
            Authorization: formatAuth(fields.token),
          },
          ...(controller ? { signal: controller.signal } : {})
        },
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Request failed with status ${res.status}`);
      }

      const data = await res.json();
      renderMessages(data);
      setStatus("Loaded the 20 most recent messages.", "success");
    } catch (err) {
      console.error(err);
      setStatus(
        `Could not reach Discord API: ${err.message}. Make sure CORS allows this origin and the token has access.`,
        "error",
      );
    }
  };

  const sendMessage = async () => {
    const fields = requireFields();
    if (!fields) return;
    const content = messageInput.value.trim();
    if (!content) {
      setStatus("Type a message before sending.", "error");
      return;
    }

    setStatus("Sending message...", "info");
    try {
      const controller = app?.createAbortController?.();
      const res = await trackedFetch(`https://discord.com/api/v10/channels/${encodeURIComponent(fields.channelId)}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: formatAuth(fields.token),
        },
        body: JSON.stringify({ content }),
        ...(controller ? { signal: controller.signal } : {})
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Request failed with status ${res.status}`);
      }

      messageInput.value = "";
      setStatus("Message sent. Fetching latest messages...", "success");
      fetchMessages();
    } catch (err) {
      console.error(err);
      setStatus(
        `Failed to send message: ${err.message}. Verify permissions (Send Messages) and CORS.`,
        "error",
      );
    }
  };

  app?.listen?.(fetchBtn, "click", fetchMessages);
  app?.listen?.(sendBtn, "click", sendMessage);
  app?.listen?.(clearBtn, "click", () => {
    logEl.innerHTML = "";
    setStatus("Cleared log. Ready to fetch again.", "info");
  });
  app?.listen?.(messageInput, "keydown", (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      sendMessage();
    }
  });
}

export class DiscordApp extends BaseApp {
  getWindowContent() {
    return getDiscordContent(this.initData, this.services);
  }

  mount() {
    return initDiscord(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}

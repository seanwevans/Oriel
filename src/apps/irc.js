let ircLibPromise = null;

function loadIrcLibrary() {
  if (window.IrcFramework) return Promise.resolve(window.IrcFramework);
  if (ircLibPromise) return ircLibPromise;

  ircLibPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/irc-framework@4.13.1/browser.js";

    script.onload = () => {
      if (window.IrcFramework) resolve(window.IrcFramework);
      else reject(new Error("IRC library loaded but window.IrcFramework is missing"));
    };

    script.onerror = () => {
      reject(new Error(`Network error loading script: ${script.src}`));
    };

    document.head.appendChild(script);
  });

  return ircLibPromise;
}

export function initIRC(win) {
  const serverInput = win.querySelector(".irc-server");
  const nickInput = win.querySelector(".irc-nick");
  const channelInput = win.querySelector(".irc-channel");
  const connectBtn = win.querySelector(".irc-connect");
  const joinBtn = win.querySelector(".irc-join");
  const sendBtn = win.querySelector(".irc-send");
  const input = win.querySelector(".irc-input");
  const logEl = win.querySelector(".irc-log");
  const usersEl = win.querySelector(".irc-users");

  if (!serverInput || !nickInput || !channelInput || !connectBtn) return;

  // Variables to hold our client instance
  let client = null;
  let isConnected = false;
  let activeChannel = null;

  // Helper: Sanitize HTML
  const escapeHtml = (str) =>
    String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Helper: Add Log Entry
  const addLog = (prefix, message, type = "general") => {
    const row = document.createElement("div");
    row.className = "irc-log-row";

    let prefixClass = "irc-log-prefix";
    if (type === "system") prefixClass += " system";
    if (type === "self") prefixClass += " irc-self";
    if (type === "error") row.style.color = "#a00";

    const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    row.innerHTML = `<span class="irc-log-time">[${ts}]</span> <span class="${prefixClass}">${escapeHtml(prefix)}</span> <span class="irc-log-msg">${escapeHtml(message)}</span>`;
    logEl.appendChild(row);
    logEl.scrollTop = logEl.scrollHeight;
  };

  // Helper: Refresh User List
  const refreshUsers = () => {
    usersEl.innerHTML = "";
    if (!client || !activeChannel) return;

    const channel = client.channel(activeChannel);
    if (!channel || !channel.users) {
      usersEl.innerHTML = '<div class="irc-user" style="color:#666">(empty)</div>';
      return;
    }

    channel.users.sort((a, b) => a.nick.localeCompare(b.nick)).forEach((u) => {
      const div = document.createElement("div");
      div.className = "irc-user";
      // Determine prefix (@ for op, + for voice)
      let pfx = "";
      if (u.modes.includes("o")) pfx = "@";
      else if (u.modes.includes("v")) pfx = "+";

      div.textContent = pfx + u.nick;
      if (pfx) div.style.fontWeight = "bold";
      usersEl.appendChild(div);
    });
  };

  const toggleUI = (connected) => {
    isConnected = connected;
    connectBtn.textContent = connected ? "Disconnect" : "Connect";
    joinBtn.disabled = !connected;
    serverInput.disabled = connected;
    nickInput.disabled = connected;

    // We only enable chat input if we are in a channel
    const inChan = connected && activeChannel;
    input.disabled = !inChan;
    sendBtn.disabled = !inChan;
    channelInput.disabled = !connected; // Can type channel name while connected
  };

  // --- Logic ---

  const handleConnect = async () => {
    if (isConnected && client) {
      client.quit("Oriel Web Client Disconnecting...");
      // Client events will handle the UI toggle on close
      return;
    }

    const serverUrl = serverInput.value.trim();
    const nickname = nickInput.value.trim() || "OrielUser";
    const channelToJoin = channelInput.value.trim();

    addLog("System", "Loading IRC Library...", "system");

    try {
      // 1. Load the library (Chess Engine style)
      const IrcFramework = await loadIrcLibrary();

      // 2. Initialize Client
      client = new IrcFramework.Client();

      // 3. Setup Events
      client.on("registered", () => {
        addLog("System", "Connected! Registered as " + client.user.nick, "system");
        toggleUI(true);
        // Auto join if specified
        if (channelToJoin) {
          const chanName = channelToJoin.startsWith("#") ? channelToJoin : "#" + channelToJoin;
          client.join(chanName);
        }
      });

      client.on("close", () => {
        addLog("System", "Connection closed.", "error");
        toggleUI(false);
        client = null;
        activeChannel = null;
        refreshUsers();
      });

      client.on("message", (event) => {
        // Filter messages to current channel or private messages
        if (event.target === activeChannel) {
          addLog(`<${event.nick}>`, event.message);
        } else if (event.target === client.user.nick) {
          addLog(`*${event.nick}*`, event.message); // Private msg
        }
      });

      client.on("join", (event) => {
        if (event.nick === client.user.nick) {
          activeChannel = event.channel;
          addLog("System", `Joined ${event.channel}`, "system");
          channelInput.value = event.channel; // Update input to match real name
          toggleUI(true); // Update input states
        } else if (event.channel === activeChannel) {
          addLog("→", `${event.nick} joined`, "system");
        }
        refreshUsers();
      });

      client.on("part", (event) => {
        if (event.nick === client.user.nick) {
          addLog("System", `Left ${event.channel}`, "system");
          activeChannel = null;
          toggleUI(true);
        } else if (event.channel === activeChannel) {
          addLog("←", `${event.nick} left`, "system");
        }
        refreshUsers();
      });

      client.on("quit", (event) => {
        if (activeChannel) {
          // The library doesn't strictly track which channel a quitter was in easily for all users,
          // but we can check the user list
          const chan = client.channel(activeChannel);
          // We refresh users regardless
          refreshUsers();
          addLog("←", `${event.nick} quit (${event.message})`, "system");
        }
      });

      client.on("userlist", (event) => {
        if (event.channel === activeChannel) refreshUsers();
      });

      // 4. Connect
      // Determine port and protocol. IrcFramework needs "transport: 'websocket'"
      let port = 443;
      let host = serverUrl;
      let ssl = true;

      // Basic parsing to strip ws:// if user typed it, though the lib handles host
      if (host.startsWith("ws://")) {
        ssl = false;
        host = host.replace("ws://", "");
      }
      if (host.startsWith("wss://")) {
        ssl = true;
        host = host.replace("wss://", "");
      }

      if (host.includes(":")) {
        const parts = host.split(":");
        host = parts[0];
        port = parseInt(parts[1]);
      }

      addLog("System", `Connecting to wss://${host}:${port}...`, "system");

      client.connect({
        host: host,
        port: port,
        nick: nickname,
        transport: "websocket", // Crucial for browser
        ssl: ssl,
        encoding: "utf8",
      });
    } catch (err) {
      addLog("Error", "Could not load IRC library or connect: " + err.message, "error");
      console.error(err);
      ircLibPromise = null;
    }
  };

  const handleSend = () => {
    if (!client || !isConnected || !activeChannel) return;
    const text = input.value;
    if (!text) return;

    // The library handles raw commands if we want, but for now let's just send messages
    if (text.startsWith("/")) {
      const parts = text.slice(1).split(" ");
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);

      if (cmd === "me") {
        client.action(activeChannel, args.join(" "));
        addLog(`* ${client.user.nick}`, args.join(" "), "self");
      } else if (cmd === "nick") {
        client.changeNick(args[0]);
      } else if (cmd === "join") {
        client.join(args[0]);
      } else if (cmd === "part") {
        client.part(activeChannel);
      } else {
        // Raw
        client.raw(text.slice(1));
      }
    } else {
      client.say(activeChannel, text);
      addLog(`<${client.user.nick}>`, text, "self");
    }
    input.value = "";
  };

  // Event Listeners
  connectBtn.addEventListener("click", handleConnect);

  joinBtn.addEventListener("click", () => {
    if (client && isConnected) {
      const chan = channelInput.value.trim();
      if (chan) client.join(chan.startsWith("#") ? chan : "#" + chan);
    }
  });

  sendBtn.addEventListener("click", handleSend);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  });

  // Cleanup
  win.ircCleanup = () => {
    if (client) {
      client.quit();
      client = null;
    }
  };
}

import { getSystemVolume } from "../audio.js";

const ANSI_COLOR_CLASSES = {
  30: "ansi-black",
  31: "ansi-red",
  32: "ansi-green",
  33: "ansi-yellow",
  34: "ansi-blue",
  35: "ansi-magenta",
  36: "ansi-cyan",
  37: "ansi-white",
  90: "ansi-bright-black",
  91: "ansi-bright-red",
  92: "ansi-bright-green",
  93: "ansi-bright-yellow",
  94: "ansi-bright-blue",
  95: "ansi-bright-magenta",
  96: "ansi-bright-cyan",
  97: "ansi-bright-white"
};

const DOOR_SCREENS = {
  tradewars: `\x1b[1;36mTradeWars 2002 (Shareware)
\x1b[0m--------------------------
Sector : \x1b[1;33m001\x1b[0m  Fighters: \x1b[1;32m150\x1b[0m
Fuel   : \x1b[1;32mOK\x1b[0m   Holds: \x1b[1;37m25/25\x1b[0m
\x1b[1;37mCommands:\x1b[0m  [P]ort  [M]ove  [S]can  [D]rop  [C]omputer\n`,
  lord: `\x1b[1;35mLegend of the Red Dragon\x1b[0m
\x1b[33mDay 3 in the forest...\x1b[0m
You encounter \x1b[1;31mThe Ferryman\x1b[0m guarding the river.
\x1b[1;37mChoices:\x1b[0m [F]ight  [T]alk  [R]un  [I]nventory\n`,
  trivia: `\x1b[1;34mThe Questionable Door\x1b[0m
Category: \x1b[36mANSI Art History\x1b[0m
Q: Which escape code resets formatting?\nA) \x1b[32mESC[0m\x1b[0m  B) \x1b[33mESC[7m\x1b[0m  C) \x1b[35mESC[32m\x1b[0m\n`
};

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function ansiToHtml(input) {
  let html = "";
  let lastIndex = 0;
  let openClass = null;
  const regex = /\x1b\[(\d{1,3})m/g;

  for (let match = regex.exec(input); match; match = regex.exec(input)) {
    html += escapeHtml(input.slice(lastIndex, match.index));
    const code = parseInt(match[1], 10);

    if (code === 0 && openClass) {
      html += "</span>";
      openClass = null;
    } else if (ANSI_COLOR_CLASSES[code]) {
      if (openClass) html += "</span>";
      openClass = ANSI_COLOR_CLASSES[code];
      html += `<span class="${openClass}">`;
    }
    lastIndex = regex.lastIndex;
  }

  html += escapeHtml(input.slice(lastIndex));
  if (openClass) html += "</span>";
  return html.replace(/\n/g, "<br>");
}

function appendLine(terminal, line) {
  if (!terminal) return;
  const row = document.createElement("div");
  row.className = "bbs-line";
  row.innerHTML = ansiToHtml(line);
  terminal.appendChild(row);
  terminal.scrollTop = terminal.scrollHeight;
}

function setStatus(el, text, isConnected) {
  if (!el) return;
  el.textContent = text;
  el.classList.toggle("connected", Boolean(isConnected));
}

function playModemSound() {
  const ctx =
    window.__orielModemCtx || new (window.AudioContext || window.webkitAudioContext)();
  window.__orielModemCtx = ctx;
  if (ctx.state === "suspended") ctx.resume();

  const gain = ctx.createGain();
  gain.gain.value = Math.max(0.05, getSystemVolume() * 0.5);
  gain.connect(ctx.destination);

  let start = ctx.currentTime;
  const tones = [
    { freq: 1200, duration: 0.25 },
    { freq: 1800, duration: 0.25 },
    { freq: 2100, duration: 0.22 },
    { freq: 1200, duration: 0.18 },
    { freq: 800, duration: 0.25 },
    { freq: 1500, duration: 0.35 }
  ];

  tones.forEach((tone, idx) => {
    const osc = ctx.createOscillator();
    osc.type = idx % 2 === 0 ? "sawtooth" : "square";
    osc.frequency.value = tone.freq;
    osc.connect(gain);
    osc.start(start);
    osc.stop(start + tone.duration);
    start += tone.duration + 0.02;
  });
}

function simulateTransfer(progressEl, terminal, direction = "download") {
  if (!progressEl) return;
  progressEl.style.width = "0%";
  progressEl.classList.add("active");

  const stamp = direction === "download" ? "XMODEM" : "ZMODEM";
  appendLine(terminal, `\x1b[36m${stamp}:\x1b[0m Negotiating blocks...`);

  let pct = 0;
  const timer = setInterval(() => {
    pct = Math.min(100, pct + Math.random() * 15 + 5);
    progressEl.style.width = `${pct.toFixed(0)}%`;
    if (pct >= 100) {
      clearInterval(timer);
      progressEl.classList.remove("active");
      appendLine(terminal, `\x1b[32m${stamp} complete:\x1b[0m checksum OK.`);
    }
  }, 450);
}

function runDoorScript(terminal, doorKey) {
  const script = DOOR_SCREENS[doorKey];
  if (!script) return;
  appendLine(terminal, script);
  appendLine(terminal, "\x1b[37m[ENTER] to return to the BBS prompt.\x1b[0m");
}

export function getBbsContent() {
  return `<div class="bbs-shell">
            <div class="bbs-toolbar">
              <div class="bbs-dial">
                <label>Number / Host:</label>
                <input type="text" class="bbs-target" value="555-TA-EL" />
                <label>Baud:</label>
                <select class="bbs-baud">
                  <option>2400</option>
                  <option selected>9600</option>
                  <option>14400</option>
                  <option>28800</option>
                  <option>33600</option>
                </select>
                <button class="task-btn bbs-dial-btn">Dial</button>
                <button class="task-btn bbs-hangup-btn">Hang Up</button>
              </div>
              <div class="bbs-status">Ready to dial.</div>
            </div>
            <div class="bbs-body">
              <div class="bbs-sidebar">
                <div class="bbs-section">
                  <div class="bbs-section-title">Door Games</div>
                  <select class="bbs-door">
                    <option value="tradewars">TradeWars 2002</option>
                    <option value="lord">LORD</option>
                    <option value="trivia">Trivia Door</option>
                  </select>
                  <button class="task-btn bbs-door-launch">Launch door</button>
                </div>
                <div class="bbs-section">
                  <div class="bbs-section-title">File Transfer</div>
                  <button class="task-btn bbs-download">Download (XMODEM)</button>
                  <button class="task-btn bbs-upload">Upload (ZMODEM)</button>
                  <div class="bbs-progress"><div class="bbs-progress-fill"></div></div>
                </div>
              </div>
              <div class="bbs-terminal" aria-live="polite"></div>
            </div>
            <div class="bbs-input-row">
              <span class="bbs-prompt">></span>
              <input class="bbs-input" type="text" spellcheck="false" placeholder="Type AT commands or chat..." />
              <button class="task-btn bbs-send">Send</button>
            </div>
          </div>`;
}

export function initBbs(win) {
  const terminal = win.querySelector(".bbs-terminal");
  const statusEl = win.querySelector(".bbs-status");
  const dialBtn = win.querySelector(".bbs-dial-btn");
  const hangupBtn = win.querySelector(".bbs-hangup-btn");
  const targetInput = win.querySelector(".bbs-target");
  const baudSelect = win.querySelector(".bbs-baud");
  const doorSelect = win.querySelector(".bbs-door");
  const doorBtn = win.querySelector(".bbs-door-launch");
  const downloadBtn = win.querySelector(".bbs-download");
  const uploadBtn = win.querySelector(".bbs-upload");
  const progressFill = win.querySelector(".bbs-progress-fill");
  const input = win.querySelector(".bbs-input");
  const sendBtn = win.querySelector(".bbs-send");

  if (!terminal || !statusEl || !dialBtn || !input) return;

  let connected = false;

  const loginSplash = () => {
    appendLine(terminal, "\x1b[32mCONNECT 9600/ARQ/V42BIS\x1b[0m");
    appendLine(
      terminal,
      "\x1b[1;36m\n   ▄▄▄▄▀▀▀▀▀▀▀▀▄▄▄   \x1b[0m  Welcome to the \x1b[33mBlue Night BBS\x1b[0m"
    );
    appendLine(terminal, "\x1b[36m SysOp:\x1b[0m S. Matrix   \x1b[36mLocation:\x1b[0m The Grid");
    appendLine(terminal, "\x1b[37mDoors:\x1b[0m TradeWars, LORD, Dial-Up Chess Arena");
    appendLine(terminal, "Type HELP for local commands or /WHO to see callers.\n");
  };

  const handleDial = () => {
    const target = targetInput.value.trim() || "555-BBS";
    const baud = baudSelect.value;
    connected = false;
    setStatus(statusEl, `Dialing ${target} @ ${baud} baud...`, false);
    dialBtn.disabled = true;
    hangupBtn.disabled = false;
    playModemSound();
    appendLine(terminal, `\x1b[37mATDT ${target}\x1b[0m`);

    setTimeout(() => appendLine(terminal, "\x1b[33mRING...\x1b[0m"), 350);
    setTimeout(() => appendLine(terminal, "\x1b[32mCONNECT HANDSHAKE...\x1b[0m"), 850);
    setTimeout(() => {
      connected = true;
      setStatus(statusEl, `Connected to ${target} (${baud}bps)`, true);
      dialBtn.disabled = false;
      loginSplash();
    }, 1450);
  };

  const handleHangup = () => {
    connected = false;
    setStatus(statusEl, "Ready to dial.", false);
    appendLine(terminal, "\x1b[31m+++ ATH\x1b[0m");
  };

  const handleSend = () => {
    const text = input.value.trim();
    if (!text) return;
    appendLine(terminal, `\x1b[37m>${text}\x1b[0m`);
    input.value = "";

    const lc = text.toLowerCase();
    if (lc.startsWith("at")) {
      appendLine(terminal, "\x1b[32mOK\x1b[0m");
      if (lc.includes("dt")) handleDial();
      return;
    }
    if (!connected) {
      appendLine(terminal, "\x1b[31mNo carrier. Dial first.\x1b[0m");
      return;
    }
    if (lc === "help") {
      appendLine(
        terminal,
        "\x1b[36mLocal:\x1b[0m DOOR, ANSI, TRANSFER, WHO  |  \x1b[36mRemote:\x1b[0m CHAT, MSG, SCORE"
      );
      return;
    }
    if (lc === "ansi") {
      appendLine(
        terminal,
        "\x1b[34mANSI test:\x1b[0m \x1b[31m■\x1b[0m\x1b[32m■\x1b[0m\x1b[33m■\x1b[0m\x1b[34m■\x1b[0m\x1b[35m■\x1b[0m\x1b[36m■\x1b[0m"
      );
      return;
    }
    if (lc === "transfer") {
      simulateTransfer(progressFill, terminal, "download");
      return;
    }
    if (lc === "door") {
      runDoorScript(terminal, doorSelect.value);
      return;
    }

    const canned = [
      "\x1b[33m[SysOp]\x1b[0m Checking node status...",
      "\x1b[32m[OK]\x1b[0m Buffered message stored in mail slot.",
      "\x1b[36m[Tip]\x1b[0m Try DOOR to launch a game or TRANSFER for XMODEM." 
    ];
    appendLine(terminal, canned[Math.floor(Math.random() * canned.length)]);
  };

  const handleDoor = () => {
    if (!connected) {
      appendLine(terminal, "\x1b[31mYou must be online to launch a door.\x1b[0m");
      return;
    }
    runDoorScript(terminal, doorSelect.value);
  };

  dialBtn.addEventListener("click", handleDial);
  hangupBtn.addEventListener("click", handleHangup);
  sendBtn?.addEventListener("click", handleSend);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSend();
  });
  doorBtn?.addEventListener("click", handleDoor);
  downloadBtn?.addEventListener("click", () => simulateTransfer(progressFill, terminal, "download"));
  uploadBtn?.addEventListener("click", () => simulateTransfer(progressFill, terminal, "upload"));

  hangupBtn.disabled = true;
  setStatus(statusEl, "Ready to dial.", false);
  appendLine(terminal, "\x1b[37mHayes-compatible modem detected.\x1b[0m");
  appendLine(terminal, "Type ATDT <number> to dial or HELP for local shortcuts.\n");
}

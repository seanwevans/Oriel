const DEFAULT_NAMES = [
  "Alex", "Bailey", "Casey", "Dakota", "Emery", "Frankie", "Harper", "Indigo",
  "Jordan", "Kai", "Lennon", "Marley", "Nico", "Oakley", "Parker", "Quinn", "Riley",
  "Sawyer", "Taylor", "Vida", "Winter"
];

const ROLE_ORDER = [
  { role: "Mafia", key: "mafia", quota: 2 },
  { role: "Detective", key: "detective", quota: 1 },
  { role: "Doctor", key: "doctor", quota: 1 },
  { role: "Villager", key: "villager", quota: Infinity }
];

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function choosePlayers(count) {
  const names = shuffle(DEFAULT_NAMES).slice(0, count);
  const players = [];
  let remaining = count;

  ROLE_ORDER.forEach((role) => {
    const quota = Math.min(role.quota, remaining);
    for (let i = 0; i < quota; i++) {
      const name = names.shift() || `Guest ${players.length + 1}`;
      players.push({ name, role: role.key, alive: true, revealed: role.key === "detective" });
      remaining -= 1;
      if (remaining <= 0) break;
    }
  });

  return players;
}

function summarizeState(players) {
  const alive = players.filter((p) => p.alive);
  const mafia = alive.filter((p) => p.role === "mafia");
  const town = alive.filter((p) => p.role !== "mafia");
  return { alive, mafia, town, mafiaWin: mafia.length >= town.length, townWin: mafia.length === 0 };
}

function renderRoster(container, players) {
  if (!container) return;
  container.innerHTML = "";
  players.forEach((p) => {
    const row = document.createElement("div");
    row.className = "mafia-roster-row";
    const badge = document.createElement("span");
    badge.className = `mafia-role mafia-role-${p.role}${p.revealed ? "" : " mafia-role-hidden"}`;
    badge.textContent = p.revealed ? p.role : "Unknown";
    const name = document.createElement("span");
    name.textContent = p.name;
    name.className = "mafia-player-name";
    if (!p.alive) name.classList.add("mafia-faded");
    row.appendChild(badge);
    row.appendChild(name);
    container.appendChild(row);
  });
}

function updateSuspectOptions(selectEl, players) {
  if (!selectEl) return;
  selectEl.innerHTML = "";
  players
    .filter((p) => p.alive && p.role !== "detective")
    .forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.name;
      opt.textContent = p.name;
      selectEl.appendChild(opt);
    });
  if (!selectEl.value && selectEl.options.length) selectEl.value = selectEl.options[0].value;
}

function addLog(logEl, text) {
  if (!logEl) return;
  const entry = document.createElement("div");
  entry.className = "mafia-log-entry";
  entry.textContent = text;
  logEl.appendChild(entry);
  logEl.scrollTop = logEl.scrollHeight;
}

function buildPrompt(state, narration, accusedName) {
  const livingNames = state.players.filter((p) => p.alive).map((p) => p.name);
  const keyFacts = [
    `Round: ${state.round}`,
    `Alive: ${livingNames.join(", ")}`,
    `Detected suspect: ${accusedName || "(none)"}`,
    narration
  ].join("\n");

  return `You are narrating a cozy murder-mystery Mafia game. Keep answers under 6 sentences.\n${keyFacts}\nDescribe what the bots whisper about and end with a hunch.`;
}

function localNarration(state, accusedName) {
  const templates = [
    "The town wakes to hushed voices. ${suspect} draws wary glances while the doctor clutches a stethoscope like a talisman.",
    "Arguments spark near the fountain. ${suspect} insists on innocence, but the detective notes muddy shoes.",
    "Lanterns sway as the village debates. ${suspect} laughs too loudly, and someone swears they saw a shadow near the bakery.",
    "Whispers ripple through the square. ${suspect} keeps checking the clock while the crowd grows restless."
  ];
  const suspect = accusedName || "no one in particular";
  const template = templates[Math.floor(Math.random() * templates.length)];
  const hint = Math.random() > 0.5 ? "A clue about red fibers resurfaces." : "Someone mentions a secret meeting at midnight.";
  return template.replace("${suspect}", suspect) + ` ${hint}`;
}

async function callRemoteModel(provider, apiKey, prompt, modelInput) {
  if (!apiKey) throw new Error("API key required for the selected provider.");
  if (provider === "openai") {
    const model = modelInput || "gpt-4o-mini";
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a playful narrator for a Mafia deduction game." },
          { role: "user", content: prompt }
        ],
        max_tokens: 220,
        temperature: 0.8
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim();
  }
  if (provider === "google") {
    const model = modelInput || "gemini-1.5-flash";
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    );
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  }
  if (provider === "anthropic") {
    const model = modelInput || "claude-3-5-sonnet-latest";
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], max_tokens: 220 })
    });
    const data = await res.json();
    return data?.content?.[0]?.text?.trim();
  }
  throw new Error("Unsupported provider");
}

function resolveNight(state, accusedName) {
  const alive = state.players.filter((p) => p.alive);
  const mafia = alive.filter((p) => p.role === "mafia");
  const doctor = alive.find((p) => p.role === "doctor");
  if (!mafia.length) return { summary: "All mafia are gone.", killed: null, saved: null };

  const candidates = alive.filter((p) => p.role !== "mafia");
  const target = candidates[Math.floor(Math.random() * candidates.length)];
  const saved = doctor ? alive[Math.floor(Math.random() * alive.length)] : null;
  let killed = null;
  if (!saved || saved.name !== target.name) {
    target.alive = false;
    killed = target;
  }

  if (accusedName) {
    const accused = alive.find((p) => p.name === accusedName && p.alive);
    if (accused) {
      accused.alive = false;
      accused.revealed = true;
    }
  }

  const summaryParts = [];
  summaryParts.push(killed ? `${target.name} was attacked overnight.` : `${target.name} survived an attack.`);
  if (accusedName) summaryParts.push(`${accusedName} was voted on and removed from town.`);
  return { summary: summaryParts.join(" "), killed, saved };
}

export function initMafia(win) {
  const logEl = win.querySelector(".mafia-log");
  const rosterEl = win.querySelector(".mafia-roster");
  const suspectSelect = win.querySelector(".mafia-suspect");
  const roundBtn = win.querySelector(".mafia-next");
  const startBtn = win.querySelector(".mafia-start");
  const playerInput = win.querySelector(".mafia-count");
  const providerSelect = win.querySelector(".mafia-provider");
  const apiKeyInput = win.querySelector(".mafia-api-key");
  const modelInput = win.querySelector(".mafia-model");
  const statusEl = win.querySelector(".mafia-status");

  const state = { players: [], round: 1 };

  function updateUi() {
    renderRoster(rosterEl, state.players);
    updateSuspectOptions(suspectSelect, state.players);
    const summary = summarizeState(state.players);
    if (summary.mafiaWin) {
      statusEl.textContent = "Mafia dominate the town. Restart to try again.";
      roundBtn.disabled = true;
    } else if (summary.townWin) {
      statusEl.textContent = "The town wins! All mafia have been caught.";
      roundBtn.disabled = true;
    } else {
      statusEl.textContent = `Round ${state.round}: ${summary.alive.length} players remain.`;
      roundBtn.disabled = false;
    }
  }

  function startGame() {
    const count = Math.min(Math.max(parseInt(playerInput?.value || "8", 10), 6), 12);
    state.players = choosePlayers(count);
    state.round = 1;
    logEl.innerHTML = "";
    addLog(logEl, `New case opened with ${count} suspects.`);
    updateUi();
  }

  async function handleRound() {
    const summary = summarizeState(state.players);
    if (summary.mafiaWin || summary.townWin) return;
    const accusedName = suspectSelect?.value || "";
    const nightResult = resolveNight(state, accusedName);
    const prompt = buildPrompt(state, nightResult.summary, accusedName);
    const provider = providerSelect?.value || "local";
    const apiKey = apiKeyInput?.value?.trim();
    const model = modelInput?.value?.trim();
    let narration = "";

    try {
      if (provider === "local") narration = localNarration(state, accusedName);
      else narration = (await callRemoteModel(provider, apiKey, prompt, model)) || "Remote model returned no text.";
    } catch (err) {
      narration = `AI narrator unavailable: ${err.message}. Using local improv.`;
      narration += ` ${localNarration(state, accusedName)}`;
    }

    addLog(logEl, `[Round ${state.round}] ${nightResult.summary}`);
    addLog(logEl, narration);
    state.round += 1;
    updateUi();
  }

  startBtn?.addEventListener("click", startGame);
  roundBtn?.addEventListener("click", handleRound);
  if (providerSelect) {
    providerSelect.addEventListener("change", () => {
      const requiresKey = providerSelect.value !== "local";
      apiKeyInput.disabled = !requiresKey;
      modelInput.disabled = providerSelect.value === "local";
    });
    const requiresKey = providerSelect.value !== "local";
    apiKeyInput.disabled = !requiresKey;
    modelInput.disabled = providerSelect.value === "local";
  }

  startGame();
}

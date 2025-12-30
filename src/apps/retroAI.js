import { RETRO_AI_CORPUS } from "../assets/data/retro_ai_corpus.js";

const order = 2;
const chainCache = new Map();

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash >>> 0;
}

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildChain(persona) {
  if (chainCache.has(persona)) return chainCache.get(persona);
  const personaData = RETRO_AI_CORPUS.personas[persona];
  const combined = personaData.corpus.join(" ");
  const words = combined.split(/\s+/).filter(Boolean);
  const chain = new Map();

  for (let i = 0; i < words.length - order; i++) {
    const key = words.slice(i, i + order).join(" ");
    const next = words[i + order];
    if (!chain.has(key)) chain.set(key, []);
    chain.get(key).push(next);
  }

  const entry = { chain, words };
  chainCache.set(persona, entry);
  return entry;
}

function seededChoice(list, rng) {
  if (!list.length) return "";
  const idx = Math.floor(rng() * list.length) % list.length;
  return list[idx];
}

function generateMarkovText(words, chain, rng, targetLength = 60) {
  if (!words.length) return "";
  const startIndex = hashString(words.join("")) % Math.max(words.length - order, 1);
  let window = words.slice(startIndex, startIndex + order);
  const output = [...window];

  while (output.length < targetLength) {
    const key = window.join(" ");
    const nextOptions = chain.get(key);
    const nextWord = nextOptions?.length
      ? seededChoice(nextOptions, rng)
      : seededChoice(words, rng);
    output.push(nextWord);
    window = output.slice(output.length - order, output.length);
  }

  return output.join(" ");
}

function buildTemplateResponse(prompt, persona) {
  const { chain, words } = buildChain(persona);
  const rng = mulberry32(hashString(`${persona}:${prompt}`));
  const starters = [
    "Accessing archives",
    "Consulting matrix",
    "Spinning disks",
    "Routing request"
  ];
  const bridges = [
    "so here's the path",
    "and this is the pattern",
    "and the logs agree",
    "so the console blinks"
  ];
  const closers = [
    "End of transmission",
    "Signal locked",
    "Buffer complete",
    "Logging off"
  ];

  const intro = seededChoice(starters, rng);
  const bridge = seededChoice(bridges, rng);
  const closing = seededChoice(closers, rng);
  const markov = generateMarkovText(words, chain, rng, 55);

  const promptEcho = prompt?.trim()
    ? `Prompt heard: "${prompt.trim()}".`
    : "Prompt heard: awaiting further input.";

  return `${intro}, ${bridge}. ${promptEcho} ${markov}. ${closing}.`;
}

export function initRetroAI(win) {
  const personaSelect = win.querySelector(".retroai-persona");
  const promptArea = win.querySelector(".retroai-prompt");
  const output = win.querySelector(".retroai-output");
  const generateBtn = win.querySelector(".retroai-generate");
  const personaDesc = win.querySelector(".retroai-description");
  if (!personaSelect || !promptArea || !output || !generateBtn) return;

  const personaNames = Object.keys(RETRO_AI_CORPUS.personas);
  personaNames.forEach((name) => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    personaSelect.appendChild(opt);
  });

  const updateDescription = () => {
    const persona = personaSelect.value;
    personaDesc.textContent =
      RETRO_AI_CORPUS.personas[persona]?.description || "";
  };

  updateDescription();

  const runGeneration = () => {
    const persona = personaSelect.value;
    const prompt = promptArea.value;
    const response = buildTemplateResponse(prompt, persona);
    output.textContent = response;
  };

  generateBtn.addEventListener("click", runGeneration);
  personaSelect.addEventListener("change", () => {
    updateDescription();
    runGeneration();
  });

  promptArea.addEventListener("keydown", (ev) => {
    if ((ev.ctrlKey || ev.metaKey) && ev.key === "Enter") {
      ev.preventDefault();
      runGeneration();
    }
  });

  runGeneration();
}

export function getRetroAIContent() {
  return `
    <div class="retroai-layout">
      <div class="retroai-toolbar">
        <label class="retroai-label">Persona
          <select class="retroai-persona"></select>
        </label>
        <button class="task-btn retroai-generate">Generate</button>
      </div>
      <div class="retroai-description"></div>
      <div class="retroai-body">
        <label class="retroai-label">Prompt</label>
        <textarea class="retroai-prompt" rows="4" placeholder="Ask for guidance, retro-style..."></textarea>
        <label class="retroai-label">Response</label>
        <div class="retroai-output" aria-live="polite"></div>
      </div>
    </div>
  `;
}

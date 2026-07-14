import { BaseApp } from "./base/BaseApp.js";
import { ICONS } from "../icons.js";

const CARDS_STORAGE_KEY = "w31-cards";

function loadCards() {
  try {
    const raw = localStorage.getItem(CARDS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((card) => card && typeof card === "object")
          .map((card, idx) => ({
            id: card.id ?? Date.now() + idx,
            header: String(card.header ?? ""),
            content: String(card.content ?? "")
          }));
      }
      console.warn("Ignoring saved cards with unexpected shape");
    }
  } catch (err) {
    console.warn("Failed to parse saved cards", err);
  }
  return [
    {
      id: 1,
      header: "Welcome",
      content: "This is Cardfile."
    }
  ];
}

export function initCardfile(w) {
  const key = CARDS_STORAGE_KEY;
  w.cards = loadCards();
  if (w.cards.length === 0)
    w.cards.push({
      id: Date.now(),
      header: "New Card",
      content: ""
    });
  w.activeCardId = w.cards[0].id;

  const listEl = w.querySelector("#card-index-list");
  const headerEl = w.querySelector("#card-header-display");
  const contentEl = w.querySelector("#card-content-edit");

  const render = () => {
    w.cards.sort((a, b) => a.header.localeCompare(b.header));
    listEl.innerHTML = "";
    w.cards.forEach((card) => {
      const d = document.createElement("div");
      d.className = "cardfile-item " + (card.id === w.activeCardId ? "sel" : "");
      d.innerHTML =
        ICONS.cardfile + `<span>${card.header || "(blank)"}</span>`;
      d.onclick = () => {
        w.activeCardId = card.id;
        render();
      };
      listEl.appendChild(d);
    });
    const active = w.cards.find((c) => c.id === w.activeCardId);
    if (active) {
      headerEl.value = active.header;
      contentEl.value = active.content;
    }
    localStorage.setItem(key, JSON.stringify(w.cards));
  };

  headerEl.oninput = () => {
    const active = w.cards.find((c) => c.id === w.activeCardId);
    if (active) {
      active.header = headerEl.value;
      render();
    }
  };
  contentEl.oninput = () => {
    const active = w.cards.find((c) => c.id === w.activeCardId);
    if (active) {
      active.content = contentEl.value;
      localStorage.setItem(key, JSON.stringify(w.cards));
    }
  };

  w.querySelector("#card-add").onclick = () => {
    const nc = { id: Date.now(), header: "New Card", content: "" };
    w.cards.push(nc);
    w.activeCardId = nc.id;
    render();
  };
  w.querySelector("#card-del").onclick = () => {
    if (w.cards.length > 1) {
      w.cards = w.cards.filter((c) => c.id !== w.activeCardId);
      w.activeCardId = w.cards[0].id;
      render();
    }
  };

  render();
}

export function getCardfileContent() {
    return `<div class="cardfile-layout"><div class="cardfile-menu"><button class="task-btn" id="card-add">Add</button><button class="task-btn" id="card-del">Delete</button></div><div class="card-container"><div class="card-index-list" id="card-index-list"></div><div class="card-body-view"><div class="card-header-bar" id="card-header-display"></div><textarea class="card-content-area" id="card-content-edit"></textarea></div></div></div>`;

}

export class CardfileApp extends BaseApp {
  getWindowContent() {
    return getCardfileContent(this.initData, this.services);
  }

  mount() {
    return initCardfile(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}

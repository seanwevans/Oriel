import { ICONS } from "../icons.js";

export function initCardfile(w) {
  const key = "w31-cards";
  const stored = localStorage.getItem(key);
  w.cards = stored
    ? JSON.parse(stored)
    : [
        {
          id: 1,
          header: "Welcome",
          content: "This is Cardfile."
        }
      ];
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

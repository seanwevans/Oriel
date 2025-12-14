export function initSolitaire(w) {
  const SUITS = ["h", "d", "c", "s"];
  const RANKS = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K"
  ];
  let stock = [];
  let waste = [];
  let f = { h: [], d: [], c: [], s: [] };
  let t = [[], [], [], [], [], [], []];
  let sel = null;

  const createDeck = () => {
    const deck = [];
    SUITS.forEach((suit) =>
      RANKS.forEach((rank, i) =>
        deck.push({
          s: suit,
          r: rank,
          v: i + 1,
          u: false,
          c: suit === "h" || suit === "d" ? "red" : "black"
        })
      )
    );
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  };

  const render = () => {
    const renderCard = (card, cb) => {
      const d = document.createElement("div");
      d.className = "card " + (card.u ? card.c : "back");
      if (sel && sel.card === card) d.classList.add("selected");
      if (card.u) {
        d.innerHTML = `<div style="text-align:left">${card.r}</div><div class="card-center">${{
          h: "♥",
          d: "♦",
          c: "♣",
          s: "♠"
        }[card.s]}</div>`;
      }
      d.onclick = cb;
      return d;
    };

    const renderFoundation = (suit) => {
      const pile = f[suit];
      const pileDiv = w.querySelector("#sol-f-" + suit);
      if (pileDiv) {
        pileDiv.innerHTML = "";
        pile.forEach((card) => pileDiv.appendChild(renderCard(card, () => tryFoundation(suit))));
      }
    };

    const renderTableau = () => {
      const tDiv = w.querySelector("#sol-tableau");
      if (tDiv) {
        tDiv.innerHTML = "";
        t.forEach((col, ci) => {
          const colDiv = document.createElement("div");
          colDiv.className = "sol-col";
          colDiv.dataset.col = ci;
          col.forEach((card, idx) => {
            const c = renderCard(card, () => selectCard(card, "tableau", ci, idx));
            colDiv.appendChild(c);
          });
          tDiv.appendChild(colDiv);
        });
      }
    };

    const renderStockWaste = () => {
      const sDiv = w.querySelector("#sol-stock");
      const wDiv = w.querySelector("#sol-waste");
      if (sDiv) {
        sDiv.innerHTML = "";
        if (stock.length) {
          const back = document.createElement("div");
          back.className = "card back";
          back.onclick = () => draw();
          sDiv.appendChild(back);
        }
      }
      if (wDiv) {
        wDiv.innerHTML = "";
        waste.forEach((card, idx) =>
          wDiv.appendChild(renderCard(card, () => selectCard(card, "waste", idx)))
        );
      }
    };

    renderFoundation("h");
    renderFoundation("d");
    renderFoundation("c");
    renderFoundation("s");
    renderTableau();
    renderStockWaste();
    updateFocusHighlight();
  };

  const draw = () => {
    if (stock.length === 0) {
      stock = waste.map((card) => ({ ...card, u: false })).reverse();
      waste = [];
    }
    if (stock.length > 0) {
      const card = stock.pop();
      card.u = true;
      waste.push(card);
    }
    render();
  };

  const tryFoundation = (suit) => {
    if (!sel) return;
    const movingCard = sel.card;
    const pile = f[suit];
    if (movingCard.s === suit && movingCard.v === pile.length + 1) {
      let canMove = false;
      if (sel.loc === "waste") canMove = true;
      if (sel.loc === "tableau" && sel.idx === t[sel.col].length - 1) canMove = true;
      if (canMove) {
        if (sel.loc === "waste") waste.pop();
        else {
          t[sel.col].pop();
          const origin = t[sel.col];
          if (origin.length > 0) {
            const topCard = origin[origin.length - 1];
            if (!topCard.u) topCard.u = true;
          }
        }
        pile.push(movingCard);
        sel = null;
        render();
      }
    }
  };

  const tryTableau = (colIdx) => {
    const target = t[colIdx];
    if (sel) {
      const movingCards = sel.loc === "tableau" ? t[sel.col].slice(sel.idx) : [sel.card];
      const topCard = target[target.length - 1];
      const movingTop = movingCards[0];
      const isValidMove =
        target.length === 0 ? movingTop.v === 13 : topCard.u && topCard.c !== movingTop.c && topCard.v === movingTop.v + 1;
      if (isValidMove) {
        if (sel.loc === "tableau") t[sel.col] = t[sel.col].slice(0, sel.idx);
        else waste.pop();
        const origin = sel.loc === "tableau" ? t[sel.col] : null;
        target.push(...movingCards);
        if (origin && origin.length > 0) {
          const topCard = origin[origin.length - 1];
          if (!topCard.u) topCard.u = true;
        }
        sel = null;
        render();
      }
    } else {
      if (target.length > 0) {
        const topCard = target[target.length - 1];
        if (!topCard.u) {
          topCard.u = true;
          render();
        } else {
          selectCard(topCard, "tableau", colIdx, target.length - 1);
        }
      }
    }
  };

  const selectCard = (card, loc, col, idx) => {
    sel = { card, loc, col, idx };
    render();
  };

  w.querySelector("#sol-stock")?.addEventListener("click", (e) => {
    e.preventDefault();
    draw();
    setFocusIndex(0);
  });

  w.querySelector("#sol-waste")?.addEventListener("click", (e) => {
    e.preventDefault();
    const topCard = waste[waste.length - 1];
    if (topCard) selectCard(topCard, "waste", waste.length - 1);
    setFocusIndex(1);
  });

  w.querySelector("#sol-tableau")?.addEventListener("click", (e) => {
    const col = e.target.closest(".sol-col");
    if (col) {
      const ci = parseInt(col.dataset.col, 10);
      tryTableau(ci);
      setFocusIndex(6 + ci);
    }
  });

  [
    ["h", "#sol-f-h"],
    ["d", "#sol-f-d"],
    ["c", "#sol-f-c"],
    ["s", "#sol-f-s"]
  ].forEach(([suit, selector]) => {
    w.querySelector(selector)?.addEventListener("click", (e) => {
      e.preventDefault();
      tryFoundation(suit);
      setFocusIndex({ h: 2, d: 3, c: 4, s: 5 }[suit]);
    });
  });

  const deal = () => {
    stock = createDeck();
    waste = [];
    f = { h: [], d: [], c: [], s: [] };
    sel = null;
    t = [[], [], [], [], [], [], []];
    for (let i = 0; i < 7; i++) {
      for (let j = i; j < 7; j++) {
        const card = stock.pop();
        if (i === j) card.u = true;
        t[j].push(card);
      }
    }
    render();
  };

  const elS = w.querySelector("#sol-stock");
  const elW = w.querySelector("#sol-waste");
  const elT = w.querySelector("#sol-tableau");
  const elF = {
    h: w.querySelector("#sol-f-h"),
    d: w.querySelector("#sol-f-d"),
    c: w.querySelector("#sol-f-c"),
    s: w.querySelector("#sol-f-s")
  };
  const layout = w.querySelector(".sol-layout");
  if (layout) {
    layout.tabIndex = 0;
    layout.setAttribute("role", "application");
    layout.setAttribute("aria-label", "Solitaire game");
  }
  [
    [elS, "Stock pile"],
    [elW, "Waste pile"],
    [elF.h, "Hearts foundation"],
    [elF.d, "Diamonds foundation"],
    [elF.c, "Clubs foundation"],
    [elF.s, "Spades foundation"]
  ].forEach(([el, label]) => {
    if (!el) return;
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", label);
  });

  let focusIndex = 0;

  const getFocusTargets = () => {
    const tableauCols = Array.from(elT.querySelectorAll(".sol-col"));
    return [
      { type: "stock", el: elS },
      { type: "waste", el: elW },
      { type: "foundation", el: elF.h, suit: "h" },
      { type: "foundation", el: elF.d, suit: "d" },
      { type: "foundation", el: elF.c, suit: "c" },
      { type: "foundation", el: elF.s, suit: "s" },
      ...tableauCols.map((el, i) => ({ type: "tableau", el, col: i }))
    ].filter((t) => t.el);
  };

  const updateFocusHighlight = () => {
    const targets = getFocusTargets();
    if (!targets.length) return;
    if (focusIndex >= targets.length) focusIndex = 0;
    const shouldFocus =
      (layout && layout.contains(document.activeElement)) ||
      document.activeElement === document.body;
    targets.forEach((t, i) => {
      t.el.classList.toggle("sol-focus", i === focusIndex);
      t.el.tabIndex = i === focusIndex ? 0 : -1;
    });
    if (shouldFocus) targets[focusIndex].el.focus();
  };

  const setFocusIndex = (idx) => {
    const targets = getFocusTargets();
    if (!targets.length) return;
    focusIndex = ((idx % targets.length) + targets.length) % targets.length;
    updateFocusHighlight();
  };

  const moveFocus = (delta) => {
    const targets = getFocusTargets();
    if (!targets.length) return;
    setFocusIndex(focusIndex + delta);
  };

  const handleTableauKeyboard = (colIdx) => {
    const col = t[colIdx] || [];
    if (!col.length) {
      tryTableau(colIdx);
      return;
    }
    if (sel) {
      tryTableau(colIdx);
      return;
    }
    const topCard = col[col.length - 1];
    if (topCard.u) selectCard(topCard, "tableau", colIdx, col.length - 1);
    else {
      topCard.u = true;
      render();
    }
  };

  const activateFocusedTarget = () => {
    const targets = getFocusTargets();
    const target = targets[focusIndex];
    if (!target) return;

    if (target.type === "stock") {
      elS?.onclick?.({ preventDefault: () => {} });
    } else if (target.type === "waste") {
      const topWaste = elW.querySelector(".card:last-child");
      if (topWaste) topWaste.click();
    } else if (target.type === "foundation") {
      tryFoundation(target.suit);
    } else if (target.type === "tableau") {
      handleTableauKeyboard(target.col);
    }
  };

  const keyHandlers = (e) => {
    if (e.key === "ArrowRight") {
      moveFocus(1);
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      moveFocus(-1);
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      setFocusIndex(6);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setFocusIndex(0);
      e.preventDefault();
    } else if (e.key === "Enter" || e.key === " ") {
      activateFocusedTarget();
      e.preventDefault();
    }
  };

  layout?.addEventListener("keydown", keyHandlers);
  layout?.addEventListener("focus", updateFocusHighlight);

  deal();
}

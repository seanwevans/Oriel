const KAKURO_PUZZLE = [
  [
    { type: "block" },
    { type: "clue", down: 6 },
    { type: "clue", down: 6 },
    { type: "block" },
    { type: "block" }
  ],
  [
    { type: "clue", across: 4 },
    { type: "play", answer: 1 },
    { type: "play", answer: 3 },
    { type: "clue", down: 5 },
    { type: "block" }
  ],
  [
    { type: "clue", across: 7 },
    { type: "play", answer: 2 },
    { type: "play", answer: 1 },
    { type: "play", answer: 4 },
    { type: "block" }
  ],
  [
    { type: "clue", across: 6 },
    { type: "play", answer: 3 },
    { type: "play", answer: 2 },
    { type: "play", answer: 1 },
    { type: "block" }
  ],
  [
    { type: "block" },
    { type: "block" },
    { type: "block" },
    { type: "block" },
    { type: "block" }
  ]
];

export function initKakuro(win) {
  const board = win.querySelector(".kakuro-board");
  const status = win.querySelector(".kakuro-status");
  const keypadButtons = win.querySelectorAll(".kakuro-key");
  const checkBtn = win.querySelector(".kakuro-check");
  const resetBtn = win.querySelector(".kakuro-reset");
  const clearBtn = win.querySelector(".kakuro-clear");

  if (!board) return;

  board.style.gridTemplateColumns = `repeat(${KAKURO_PUZZLE[0].length}, 1fr)`;
  board.innerHTML = "";

  let activeCell = null;

  KAKURO_PUZZLE.forEach((row, r) => {
    row.forEach((cell, c) => {
      const cellEl = document.createElement("div");
      cellEl.dataset.row = r;
      cellEl.dataset.col = c;

      if (cell.type === "block") {
        cellEl.className = "kakuro-cell kakuro-block";
      } else if (cell.type === "clue") {
        cellEl.className = "kakuro-cell kakuro-clue";
        cellEl.innerHTML = `
          <div class="kakuro-clue-across">${cell.across ?? ""}</div>
          <div class="kakuro-clue-down">${cell.down ?? ""}</div>
        `;
        cellEl.setAttribute("aria-label", `Clue ${cell.across ? `across ${cell.across}` : ""}${
          cell.across && cell.down ? ", " : ""
        }${cell.down ? `down ${cell.down}` : ""}`);
      } else {
        cellEl.className = "kakuro-cell kakuro-play";
        const input = document.createElement("input");
        input.type = "text";
        input.inputMode = "numeric";
        input.maxLength = 1;
        input.autocomplete = "off";
        input.setAttribute("aria-label", `Row ${r + 1} column ${c + 1}`);
        input.addEventListener("input", (e) => {
          const clean = e.target.value.replace(/[^1-9]/g, "").slice(0, 1);
          e.target.value = clean;
          cellEl.classList.remove("kakuro-error", "kakuro-correct");
          status.textContent = "Fill every run without repeating numbers.";
        });
        input.addEventListener("focus", () => setActive(cellEl));
        cellEl.appendChild(input);
        cellEl.dataset.answer = cell.answer;
        cellEl.addEventListener("click", () => {
          setActive(cellEl);
          input.focus();
        });
      }

      board.appendChild(cellEl);
    });
  });

  keypadButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!activeCell) return;
      const targetInput = activeCell.querySelector("input");
      if (!targetInput) return;
      targetInput.value = btn.dataset.num;
      targetInput.dispatchEvent(new Event("input", { bubbles: true }));
      targetInput.focus();
    });
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (!activeCell) return;
      const targetInput = activeCell.querySelector("input");
      if (!targetInput) return;
      targetInput.value = "";
      targetInput.dispatchEvent(new Event("input", { bubbles: true }));
      targetInput.focus();
    });
  }

  if (checkBtn) {
    checkBtn.addEventListener("click", () => {
      let solved = true;
      let complete = true;

      board.querySelectorAll(".kakuro-play").forEach((cell) => {
        const input = cell.querySelector("input");
        const expected = cell.dataset.answer;
        const value = input.value.trim();
        cell.classList.remove("kakuro-error", "kakuro-correct");

        if (!value) {
          complete = false;
          solved = false;
          return;
        }

        if (value === expected) {
          cell.classList.add("kakuro-correct");
        } else {
          cell.classList.add("kakuro-error");
          solved = false;
        }
      });

      if (solved && complete) {
        status.textContent = "Puzzle solved! Great job.";
      } else if (!complete) {
        status.textContent = "Keep going—some cells are still empty.";
      } else {
        status.textContent = "Some entries don't match the sums yet.";
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      board.querySelectorAll(".kakuro-play").forEach((cell) => {
        const input = cell.querySelector("input");
        cell.classList.remove("kakuro-error", "kakuro-correct", "active");
        input.value = "";
      });
      status.textContent = "Fill every run without repeating numbers.";
      activeCell = null;
    });
  }

  function setActive(cell) {
    if (activeCell) activeCell.classList.remove("active");
    activeCell = cell;
    activeCell.classList.add("active");
  }
}

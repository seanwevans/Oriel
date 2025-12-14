export function initSudoku(w) {
  const puzzles = {
    easy: [
      {
        name: "Classic Starter",
        puzzle: "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
        solution: "534678912672195348198342567859761423426853791713924856961537284287419635345286179"
      }
    ],
    medium: [
      {
        name: "Midday Mix",
        puzzle: "000260701680070090190004500820100040004602900050003028009300074040050036703018000",
        solution: "435269781682571493197834562826195347374682915951743628519326874248957136763418259"
      }
    ],
    hard: [
      {
        name: "Tough Cookie",
        puzzle: "000000907000420180000705026100904000050000040000507009920108000034059000507000000",
        solution: "483612957795423186216785326172934865659871243348567219924178635834259671567346892"
      }
    ]
  };

  const grid = w.querySelector(".sudoku-grid");
  const status = w.querySelector(".sudoku-status");
  const diffSelect = w.querySelector(".sudoku-difficulty");
  const newBtn = w.querySelector(".sudoku-new");
  const checkBtn = w.querySelector(".sudoku-check");
  const resetBtn = w.querySelector(".sudoku-reset");

  let baseValues = [];
  let solutionValues = [];
  let cells = [];

  const parseGrid = (str = "") =>
    str
      .replace(/[^0-9.]/g, "")
      .padEnd(81, "0")
      .slice(0, 81)
      .split("")
      .map((n) => parseInt(n, 10) || 0);

  const buildGrid = () => {
    grid.innerHTML = "";
    cells = [];
    for (let r = 0; r < 9; r++) {
      const row = [];
      for (let c = 0; c < 9; c++) {
        const cell = document.createElement("input");
        cell.type = "text";
        cell.inputMode = "numeric";
        cell.maxLength = 1;
        cell.className = "sudoku-cell";
        if (c % 3 === 0) cell.classList.add("sudoku-bold-left");
        if (c === 8) cell.classList.add("sudoku-bold-right");
        if (r % 3 === 0) cell.classList.add("sudoku-bold-top");
        if (r === 8) cell.classList.add("sudoku-bold-bottom");
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.setAttribute("role", "gridcell");
        cell.addEventListener("input", () => {
          const cleaned = cell.value.replace(/[^1-9]/g, "").slice(0, 1);
          cell.value = cleaned;
          cell.classList.remove("sudoku-error");
        });
        cell.addEventListener("focus", () => cell.select());
        grid.appendChild(cell);
        row.push(cell);
      }
      cells.push(row);
    }
  };

  const applyBaseState = () => {
    cells.flat().forEach((cell) => {
      cell.readOnly = false;
      cell.value = "";
      cell.classList.remove("sudoku-given", "sudoku-error");
    });

    baseValues.forEach((val, idx) => {
      const r = Math.floor(idx / 9);
      const c = idx % 9;
      if (val !== 0) {
        const cell = cells[r][c];
        cell.value = val;
        cell.readOnly = true;
        cell.classList.add("sudoku-given");
      }
    });
  };

  const loadPuzzle = (difficulty) => {
    const pool = puzzles[difficulty] || puzzles.easy;
    const puzzle = pool[Math.floor(Math.random() * pool.length)];
    baseValues = parseGrid(puzzle.puzzle);
    solutionValues = parseGrid(puzzle.solution);
    status.textContent = `${puzzle.name} — Difficulty: ${difficulty}`;
    applyBaseState();
  };

  const resetGrid = () => {
    cells.flat().forEach((cell) => {
      if (!cell.readOnly) cell.value = "";
      cell.classList.remove("sudoku-error");
    });
    status.textContent = "Fill in the grid so each row, column, and block has 1-9.";
  };

  const checkSolution = () => {
    let allCorrect = true;
    cells.flat().forEach((cell) => {
      const r = parseInt(cell.dataset.row, 10);
      const c = parseInt(cell.dataset.col, 10);
      const expected = solutionValues[r * 9 + c];
      const val = parseInt(cell.value, 10) || 0;
      if (val !== expected) {
        allCorrect = false;
        if (!cell.readOnly) cell.classList.add("sudoku-error");
      } else {
        cell.classList.remove("sudoku-error");
      }
    });
    status.textContent = allCorrect
      ? "Great job! Puzzle solved."
      : "Some numbers are incorrect. Fix highlighted cells.";
  };

  const handleKeyDown = (e) => {
    if (!/^[1-9]$/.test(e.key)) return;
    const active = document.activeElement;
    if (!active || !grid.contains(active)) return;
    if (active.readOnly) return;
    active.value = e.key;
    active.dispatchEvent(new Event("input", { bubbles: true }));
  };

  if (diffSelect) {
    diffSelect.addEventListener("change", () => loadPuzzle(diffSelect.value));
  }
  if (newBtn) newBtn.addEventListener("click", () => loadPuzzle(diffSelect.value));
  if (checkBtn) checkBtn.addEventListener("click", checkSolution);
  if (resetBtn) resetBtn.addEventListener("click", resetGrid);
  w.addEventListener("keydown", handleKeyDown);

  buildGrid();
  loadPuzzle(diffSelect.value || "easy");
}

export function initReversi(w) {
  const board = w.querySelector("#reversi-board");
  const status = w.querySelector(".reversi-status");
  let grid = Array(8)
    .fill()
    .map(() => Array(8).fill(0));
  let turn = 1;
  grid[3][3] = 2;
  grid[3][4] = 1;
  grid[4][3] = 1;
  grid[4][4] = 2;

  const render = () => {
    board.innerHTML = "";
    grid.forEach((row, ri) => {
      row.forEach((cell, ci) => {
        const cellDiv = document.createElement("div");
        cellDiv.className = "reversi-cell";
        if (cell !== 0) {
          const piece = document.createElement("div");
          piece.className = "reversi-piece " + (cell === 1 ? "red" : "blue");
          cellDiv.appendChild(piece);
        }
        cellDiv.onclick = () => {
          if (turn === 1) makeMove(ri, ci, 1);
        };
        board.appendChild(cellDiv);
      });
    });
    status.innerText =
      turn === 1 ? "Your Turn (Red)" : "Computer Thinking...";
  };

  const isValid = (r, c, color) => {
    if (grid[r][c] !== 0) return false;
    const opp = color === 1 ? 2 : 1;
    const dirs = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1]
    ];
    return dirs.some(([dr, dc]) => {
      let nr = r + dr;
      let nc = c + dc;
      let hasOpp = false;
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && grid[nr][nc] === opp) {
        nr += dr;
        nc += dc;
        hasOpp = true;
      }
      return hasOpp && nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && grid[nr][nc] === color;
    });
  };

  const makeMove = (r, c, color) => {
    if (!isValid(r, c, color)) return;
    const opp = color === 1 ? 2 : 1;
    const dirs = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1]
    ];
    grid[r][c] = color;
    dirs.forEach(([dr, dc]) => {
      let nr = r + dr;
      let nc = c + dc;
      const path = [];
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && grid[nr][nc] === opp) {
        path.push([nr, nc]);
        nr += dr;
        nc += dc;
      }
      if (
        path.length > 0 &&
        nr >= 0 &&
        nr < 8 &&
        nc >= 0 &&
        nc < 8 &&
        grid[nr][nc] === color
      ) {
        path.forEach(([pr, pc]) => (grid[pr][pc] = color));
      }
    });
    turn = color === 1 ? 2 : 1;
    render();
    if (turn === 2) setTimeout(cpuMove, 500);
  };

  const cpuMove = () => {
    let best = null;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (isValid(r, c, 2)) {
          best = { r, c };
        }
      }
    }
    if (best) makeMove(best.r, best.c, 2);
    else {
      turn = 1;
      render();
    }
  };

  render();
}

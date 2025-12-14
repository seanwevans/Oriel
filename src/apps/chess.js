let chessLibPromise = null;

function loadChessLibrary() {
  if (!window.Chess) {
    window.Chess = Chess;
  }
  if (!chessLibPromise) {
    chessLibPromise = new Promise((resolve, reject) => {
      if (window.Chess) {
        resolve(window.Chess);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js";
      script.onload = () => {
        if (window.Chess) resolve(window.Chess);
        else reject(new Error("Chess.js loaded but window.Chess is missing"));
      };
      script.onerror = (e) => reject(e);
      document.head.appendChild(script);
    });
  }
  return chessLibPromise;
}

function initStockfishEngine(w) {
  if (w.chessWorkerReady) return Promise.resolve(w.chessWorker);
  if (w.chessWorkerInit) return w.chessWorkerInit;

  w.chessWorkerInit = new Promise((resolve, reject) => {
    fetch("https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.0/stockfish.js")
      .then((res) => res.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const worker = new Worker(blobUrl);
        w.chessWorker = worker;

        const onMsg = (event) => {
          const msg = String(event.data || "");
          if (msg.includes("uciok")) worker.postMessage("isready");
          if (msg.includes("readyok")) {
            worker.removeEventListener("message", onMsg);
            w.chessWorkerReady = true;
            resolve(worker);
          }
        };

        worker.addEventListener("message", onMsg);
        worker.onerror = (e) => reject(e);

        worker.postMessage("uci");
        worker.postMessage("setoption name Skill Level value 5");
        worker.postMessage("ucinewgame");
      })
      .catch((err) => {
        console.error("Stockfish failed to load:", err);
        reject(err);
      });
  });
  return w.chessWorkerInit;
}

function initChess(w) {
  const boardEl = w.querySelector(".chess-board"),
    statusEl = w.querySelector(".chess-status"),
    movesEl = w.querySelector(".chess-moves"),
    fenInput = w.querySelector("#chess-fen"),
    newBtn = w.querySelector(".chess-new"),
    copyBtn = w.querySelector(".chess-copy"),
    pasteBtn = w.querySelector(".chess-paste"),
    loadBtn = w.querySelector(".chess-load");
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const symbols = {
    p: "♟",
    r: "♜",
    n: "♞",
    b: "♝",
    q: "♛",
    k: "♚"
  };
  let game = null;
  let selected = null;
  let legalTargets = [];
  let userTurn = true;

  const setStatus = (msg) => (statusEl.innerText = msg);

  const renderMoves = () => {
    movesEl.innerHTML = "";
    const hist = game ? game.history({ verbose: true }) : [];
    for (let i = 0; i < hist.length; i += 2) {
      const white = hist[i];
      const black = hist[i + 1];
      const row = document.createElement("div");
      row.className = "chess-move-row";
      row.innerHTML = `<span class="mv-num">${i / 2 + 1}.</span><span class="mv-white">${
        white ? white.san : ""
      }</span><span class="mv-black">${black ? black.san : ""}</span>`;
      movesEl.appendChild(row);
    }
    movesEl.scrollTop = movesEl.scrollHeight;
  };

  const renderBoard = () => {
    if (!game) return;
    boardEl.innerHTML = "";
    const boardState = game.board();
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = files[col] + (8 - row);
        const cell = document.createElement("div");
        cell.className =
          "chess-square " + ((row + col) % 2 === 0 ? "light" : "dark");
        if (square === selected) cell.classList.add("selected");
        if (legalTargets.includes(square)) cell.classList.add("hint");
        cell.dataset.square = square;
        const piece = boardState[row][col];
        if (piece) {
          const span = document.createElement("span");
          span.className = "chess-piece";
          span.innerText = symbols[piece.type];
          if (piece.color === "w") span.classList.add("white");
          cell.appendChild(span);
        }
        boardEl.appendChild(cell);
      }
    }
    fenInput.value = game.fen();
    renderMoves();
    const turn = game.turn() === "w" ? "White" : "Black";
    setStatus(`${turn}'s move${game.in_check() ? " (Check)" : ""}`);
    if (game.game_over()) {
      const result = game.in_checkmate()
        ? `${turn} is checkmated!`
        : game.in_stalemate()
        ? "Stalemate"
        : game.in_draw()
        ? "Draw"
        : "Game over";
      setStatus(result);
    }
  };

  const resetSelection = () => {
    selected = null;
    legalTargets = [];
  };

  const syncState = (engineMove) => {
    renderBoard();
    if (engineMove) {
      userTurn = false;
      setStatus("Engine thinking...");
      requestEngineMove();
    } else {
      userTurn = true;
      setStatus("Your move (White)");
    }
  };

  const applyEngineMove = (bestmove) => {
    try {
      const move = game.move({ from: bestmove.slice(0, 2), to: bestmove.slice(2, 4), promotion: "q" });
      if (move) {
        resetSelection();
        syncState(false);
      } else {
        setStatus("Engine move invalid");
        userTurn = true;
      }
    } catch (e) {
      setStatus("Engine move failed");
      userTurn = true;
    }
  };

  const requestEngineMove = () => {
    initStockfishEngine(w)
      .then((worker) => {
        const listener = (event) => {
          const msg = String(event.data || "");
          if (msg.startsWith("bestmove")) {
            const parts = msg.split(" ");
            const best = parts[1];
            worker.removeEventListener("message", listener);
            applyEngineMove(best);
          }
        };
        worker.addEventListener("message", listener);
        worker.postMessage("position fen " + game.fen());
        worker.postMessage("go movetime 800");
      })
      .catch(() => {
        setStatus("Engine unavailable");
        userTurn = true;
      });
  };

  const selectSquare = (square) => {
    if (!game || !userTurn) return;
    const piece = game.get(square);
    if (selected === square) {
      resetSelection();
      renderBoard();
      return;
    }
    if (selected) {
      const move = game.move({ from: selected, to: square, promotion: "q" });
      if (move) {
        resetSelection();
        syncState(true);
        return;
      }
    }
    if (piece && piece.color === "w") {
      selected = square;
      legalTargets = game
        .moves({ square, verbose: true })
        .map((m) => m.to);
    } else {
      resetSelection();
    }
    renderBoard();
  };

  boardEl.addEventListener("click", (e) => {
    const target = e.target.closest(".chess-square");
    if (target?.dataset.square) selectSquare(target.dataset.square);
  });

  newBtn.onclick = () => {
    if (!game) return;
    game.reset();
    resetSelection();
    initStockfishEngine(w).catch(() => {});
    syncState(false);
  };

  copyBtn.onclick = () => {
    fenInput.select();
    document.execCommand("copy");
  };

  pasteBtn.onclick = async () => {
    if (navigator.clipboard?.readText) {
      try {
        fenInput.value = await navigator.clipboard.readText();
      } catch (e) {
        /* ignore */
      }
    }
  };

  loadBtn.onclick = () => {
    if (!game) return;
    const fen = fenInput.value.trim();
    try {
      const ok = game.load(fen);
      if (ok) {
        resetSelection();
        syncState(false);
        return;
      }
    } catch (e) {}
    alert("Invalid FEN string");
  };

  w.chessCleanup = () => {
    if (w.chessWorker) w.chessWorker.terminate();
  };

  loadChessLibrary()
    .then((ChessClass) => {
      game = new ChessClass();
      resetSelection();
      renderBoard();
      renderMoves();
      setStatus("Your move (White)");
      initStockfishEngine(w).catch(() => setStatus("Engine unavailable"));
    })
    .catch(() => setStatus("Failed to load chess.js"));
}

export { initChess };

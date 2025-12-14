export function getSimCityContent() {
  return `
                <div class="simcity-layout">
                    <div class="simcity-toolbar">
                        <div class="simcity-stats">
                            <span>Funds: $<span class="simcity-funds">5000</span></span>
                            <span>Population: <span class="simcity-pop">0</span></span>
                            <span>Happiness: <span class="simcity-happiness">50</span>%</span>
                        </div>
                        <div class="simcity-tools">
                            <button data-tool="road">Road ($20)</button>
                            <button data-tool="house">House ($100)</button>
                            <button data-tool="power">Power ($200)</button>
                            <button data-tool="park">Park ($50)</button>
                            <button data-tool="bulldoze">Bulldoze</button>
                        </div>
                    </div>
                    <div class="simcity-map"></div>
                    <div class="simcity-log">Welcome to Micropolis! Place roads, homes, and power to grow your town.</div>
                </div>
            `;
}

export function initSimCity(w) {
  const map = w.querySelector(".simcity-map");
  const fundsEl = w.querySelector(".simcity-funds");
  const popEl = w.querySelector(".simcity-pop");
  const happinessEl = w.querySelector(".simcity-happiness");
  const logEl = w.querySelector(".simcity-log");
  const buttons = Array.from(w.querySelectorAll(".simcity-tools button"));
  const size = 12;
  const costs = { road: 20, house: 100, power: 200, park: 50 };
  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "grass")
  );
  let funds = 5000;
  let tool = "road";

  map.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  function setTool(t) {
    tool = t;
    buttons.forEach((b) => b.classList.toggle("active", b.dataset.tool === t));
  }

  function neighbors(x, y) {
    const res = [];
    [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ].forEach(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < size && ny >= 0 && ny < size) res.push(grid[ny][nx]);
    });
    return res;
  }

  function updateStats() {
    let population = 0;
    let parks = 0;
    let powerPlants = 0;

    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === "park") parks++;
        if (cell === "power") powerPlants++;
        if (cell === "house") {
          const adj = neighbors(x, y);
          const hasRoad = adj.includes("road");
          const hasPower = adj.includes("power");
          const hasPark = adj.includes("park");
          let growth = 10;
          if (hasRoad) growth += 20;
          if (hasPower) growth += 30;
          if (hasPark) growth += 5;
          population += growth;
        }
      });
    });

    const happiness = Math.max(
      0,
      Math.min(100, 45 + parks * 3 + Math.floor(population / 30) - powerPlants * 2)
    );

    fundsEl.textContent = funds;
    popEl.textContent = population;
    happinessEl.textContent = happiness;
  }

  function setTile(cell, type) {
    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);

    if (type === "bulldoze") {
      if (grid[y][x] !== "grass") {
        grid[y][x] = "grass";
        log(`Cleared (${x + 1}, ${y + 1}).`);
      }
      return updateCell(cell, y, x);
    }

    const cost = costs[type] || 0;
    if (funds < cost) return log("Not enough funds for that project.");
    funds -= cost;
    grid[y][x] = type;
    log(`Placed ${type} at (${x + 1}, ${y + 1}).`);
    updateCell(cell, y, x);
  }

  function updateCell(cell, y, x) {
    const type = grid[y][x];
    cell.dataset.type = type;
    cell.className = `simcity-cell tile-${type}`;
    updateStats();
  }

  function log(msg) {
    const lines = logEl.innerText.split("\n").filter(Boolean);
    lines.unshift(msg);
    logEl.innerText = lines.slice(0, 6).join("\n");
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = document.createElement("div");
      cell.className = "simcity-cell tile-grass";
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.dataset.type = "grass";
      cell.onclick = () => setTile(cell, tool);
      map.appendChild(cell);
    }
  }

  buttons.forEach((btn) => btn.addEventListener("click", () => setTool(btn.dataset.tool)));
  setTool("road");
  updateStats();
}

const STORAGE_KEY = "oriel-postgres-config";

const SAMPLE_TABLES = {
  databases: [
    { name: "app_core", owner: "admin", size_mb: 128, readonly: false },
    { name: "analytics", owner: "data", size_mb: 342, readonly: true },
    { name: "support", owner: "support", size_mb: 64, readonly: false }
  ],
  extensions: [
    { name: "postgis", version: "3.4", schema: "public" },
    { name: "pgvector", version: "0.7", schema: "public" },
    { name: "pg_stat_statements", version: "1.10", schema: "monitoring" }
  ],
  connections: [
    { pid: 1234, user: "admin", db: "app_core", state: "active" },
    { pid: 2231, user: "api", db: "app_core", state: "idle" },
    { pid: 4110, user: "reporter", db: "analytics", state: "active" }
  ]
};

const SAMPLE_QUERIES = [
  {
    label: "List databases",
    sql: "SELECT name, owner, size_mb FROM databases;",
    description: "Shows the demo catalog with sizes."
  },
  {
    label: "Active sessions",
    sql: "SELECT pid, user, db, state FROM connections WHERE state = 'active';",
    description: "Filters the mock pg_stat_activity table."
  },
  {
    label: "Installed extensions",
    sql: "SELECT name, version FROM extensions;",
    description: "Preview the extension catalog."
  }
];

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed;
  } catch (err) {
    console.warn("Failed to read postgres settings", err);
  }
  return {};
}

function persistConfig(cfg) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

function parseSimpleSelect(sql) {
  const normalized = sql.trim().replace(/;\s*$/, "");
  const match = normalized.match(
    /^select\s+(.+?)\s+from\s+(\w+)(?:\s+where\s+(\w+)\s*=\s*(['"]?[^'";]+['"]?))?$/i
  );
  if (!match) {
    throw new Error(
      "Only simple SELECT ... FROM ... queries with optional WHERE column = value are supported in this demo."
    );
  }

  const [, columnsPart, tableRaw, whereColumnRaw, whereValueRaw] = match;
  const table = tableRaw.toLowerCase();
  const tableRows = SAMPLE_TABLES[table];
  if (!tableRows) throw new Error(`Unknown table '${table}'.`);

  const requestedColumns = columnsPart.trim();
  const columns = requestedColumns === "*"
    ? null
    : requestedColumns.split(",").map((col) => col.trim()).filter(Boolean);

  const whereColumn = whereColumnRaw ? whereColumnRaw.trim() : null;
  const whereValue = whereValueRaw?.replace(/^['"]|['"]$/g, "");

  let result = [...tableRows];
  if (whereColumn) {
    result = result.filter((row) => String(row[whereColumn]) === (whereValue ?? ""));
  }

  if (columns && columns.length) {
    result = result.map((row) =>
      columns.reduce((acc, col) => {
        acc[col] = row[col] ?? null;
        return acc;
      }, {})
    );
  }

  return result;
}

function renderResults(container, rows) {
  container.innerHTML = "";
  container.classList.toggle("pg-results-empty", !rows?.length);
  if (!rows?.length) {
    container.innerHTML = '<div class="pg-empty">No rows returned.</div>';
    return;
  }
  const table = document.createElement("table");
  table.className = "pg-table";
  const header = document.createElement("thead");
  const headers = Object.keys(rows[0]);
  header.innerHTML = `<tr>${headers
    .map((key) => `<th scope="col">${key}</th>`)
    .join("")}</tr>`;
  table.appendChild(header);
  const body = document.createElement("tbody");
  rows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = headers.map((key) => `<td>${row[key] ?? ""}</td>`).join("");
    body.appendChild(tr);
  });
  table.appendChild(body);
  container.appendChild(table);
}

function renderSchemaList(listEl) {
  if (!listEl) return;
  listEl.innerHTML = "";
  Object.entries(SAMPLE_TABLES).forEach(([table, rows]) => {
    const item = document.createElement("div");
    item.className = "pg-schema-item";
    const keys = rows.length ? Object.keys(rows[0]).join(", ") : "No columns";
    item.innerHTML = `<div class="pg-schema-name">${table}</div><div class="pg-schema-columns">${keys}</div>`;
    listEl.appendChild(item);
  });
}

function setStatus(el, text, isError = false) {
  if (!el) return;
  el.textContent = text;
  el.classList.toggle("pg-status-error", isError);
}

function fillSavedConfig(win, cfg) {
  win.querySelector(".pg-host").value = cfg.host || "localhost";
  win.querySelector(".pg-port").value = cfg.port || "5432";
  win.querySelector(".pg-db").value = cfg.database || "oriel";
  win.querySelector(".pg-user").value = cfg.user || "admin";
  win.querySelector(".pg-password").value = cfg.password || "";
  win.querySelector(".pg-ssl").checked = !!cfg.ssl;
}

export function getPostgresContent() {
  const defaultSql = SAMPLE_QUERIES[0].sql;
  const options = SAMPLE_QUERIES.map(
    (q, idx) => `<option value="${idx}">${q.label}</option>`
  ).join("");
  return `
    <div class="pg-app">
      <div class="pg-header">
        <div class="pg-connection-grid">
          <label>Host<input type="text" class="pg-input pg-host" placeholder="db.example.com"></label>
          <label>Port<input type="number" class="pg-input pg-port" min="1" max="65535"></label>
          <label>Database<input type="text" class="pg-input pg-db"></label>
          <label>User<input type="text" class="pg-input pg-user"></label>
          <label>Password<input type="password" class="pg-input pg-password" autocomplete="current-password"></label>
          <label class="pg-checkbox"><input type="checkbox" class="pg-ssl"> Require SSL</label>
        </div>
        <div class="pg-actions">
          <button class="task-btn pg-save">Save profile</button>
          <button class="task-btn pg-reset">Reset</button>
          <button class="task-btn pg-test">Test connection</button>
        </div>
        <div class="pg-status" aria-live="polite">Ready to connect.</div>
      </div>
      <div class="pg-body">
        <div class="pg-schema">
          <div class="pg-panel-title">Demo schema</div>
          <div class="pg-schema-list"></div>
        </div>
        <div class="pg-query">
          <div class="pg-query-toolbar">
            <label class="pg-sample-label">Sample query
              <select class="pg-sample-query">${options}</select>
            </label>
            <div class="pg-query-hint"></div>
            <button class="task-btn pg-run">Run</button>
          </div>
          <textarea class="pg-sql" rows="6">${defaultSql}</textarea>
          <div class="pg-results" aria-live="polite"></div>
        </div>
      </div>
    </div>
  `;
}

export function initPostgres(win) {
  const statusEl = win.querySelector(".pg-status");
  const resultsEl = win.querySelector(".pg-results");
  const sampleSelect = win.querySelector(".pg-sample-query");
  const queryHint = win.querySelector(".pg-query-hint");
  const sqlInput = win.querySelector(".pg-sql");
  const schemaList = win.querySelector(".pg-schema-list");

  renderSchemaList(schemaList);

  const saved = loadConfig();
  fillSavedConfig(win, saved);
  queryHint.textContent = SAMPLE_QUERIES[0].description;

  win.querySelector(".pg-save")?.addEventListener("click", () => {
    const nextCfg = {
      host: win.querySelector(".pg-host")?.value || "",
      port: win.querySelector(".pg-port")?.value || "",
      database: win.querySelector(".pg-db")?.value || "",
      user: win.querySelector(".pg-user")?.value || "",
      password: win.querySelector(".pg-password")?.value || "",
      ssl: win.querySelector(".pg-ssl")?.checked || false
    };
    persistConfig(nextCfg);
    setStatus(statusEl, "Profile saved to local storage.");
  });

  win.querySelector(".pg-reset")?.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    fillSavedConfig(win, {});
    setStatus(statusEl, "Reset to defaults.");
  });

  win.querySelector(".pg-test")?.addEventListener("click", () => {
    setStatus(statusEl, "Pinging server…");
    setTimeout(() => {
      const host = win.querySelector(".pg-host")?.value?.trim();
      if (!host) {
        setStatus(statusEl, "Enter a host to test the connection.", true);
        return;
      }
      setStatus(statusEl, `Connected to ${host} (demo only).`);
    }, 300);
  });

  sampleSelect?.addEventListener("change", (e) => {
    const idx = Number(e.target.value);
    const sample = SAMPLE_QUERIES[idx];
    if (!sample) return;
    sqlInput.value = sample.sql;
    queryHint.textContent = sample.description || "";
  });

  win.querySelector(".pg-run")?.addEventListener("click", () => {
    if (!sqlInput) return;
    try {
      const rows = parseSimpleSelect(sqlInput.value);
      renderResults(resultsEl, rows);
      setStatus(statusEl, `Query returned ${rows.length} row${rows.length === 1 ? "" : "s"}.`);
    } catch (err) {
      renderResults(resultsEl, []);
      setStatus(statusEl, err.message || "Query failed", true);
    }
  });

  renderResults(resultsEl, parseSimpleSelect(sqlInput?.value || SAMPLE_QUERIES[0].sql));
}

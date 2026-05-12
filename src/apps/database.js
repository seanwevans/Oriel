import { BaseApp } from "./base/BaseApp.js";
function renderDbTable(w, app = null) {
  const t = w.querySelector("#db-tbody");
  t.innerHTML = "";
  w.dbData.forEach((r, i) => {
    const tr = document.createElement("tr");

    [r.name, r.phone, r.email].forEach((value) => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    });

    const actionTd = document.createElement("td");
    const button = document.createElement("button");
    button.textContent = "X";
    const listen = app?.listen?.bind(app) || ((target, type, listener) => target?.addEventListener?.(type, listener));
    listen(button, "click", () => deleteDbRecord(button, i));
    actionTd.appendChild(button);
    tr.appendChild(actionTd);

    t.appendChild(tr);
  });
}

export function initDatabase(w, _initData = null, _windowManager = null, _services = {}, app = null) {
  const d = localStorage.getItem("w31-db");
  w.dbData = d
    ? JSON.parse(d)
    : [
        {
          id: 1,
          name: "Bill",
          phone: "555-0199",
          email: "b@ms.com"
        }
      ];
  w.dbApp = app;
  renderDbTable(w, app);
  const listen = app?.listen?.bind(app) || ((target, type, listener) => target?.addEventListener?.(type, listener));
  listen(w.querySelector("#db-add-record"), "click", (e) => addDbRecord(e.currentTarget));
  listen(w.querySelector("#db-export-csv"), "click", (e) => exportDbToCsv(e.currentTarget));
}

export function addDbRecord(b) {
  const w = b.closest(".window"),
    n = w.querySelector("#db-name"),
    p = w.querySelector("#db-phone"),
    e = w.querySelector("#db-email");
  if (!n.value) return;
  w.dbData.push({
    name: n.value,
    phone: p.value,
    email: e.value
  });
  localStorage.setItem("w31-db", JSON.stringify(w.dbData));
  n.value = "";
  p.value = "";
  e.value = "";
  renderDbTable(w, w.dbApp);
}

export function deleteDbRecord(b, i) {
  const w = b.closest(".window");
  w.dbData.splice(i, 1);
  localStorage.setItem("w31-db", JSON.stringify(w.dbData));
  renderDbTable(w, w.dbApp);
}

export function exportDbToCsv(b) {
  const w = b.closest(".window");
  const headers = ["Name", "Phone", "Email"];
  const rows = w.dbData || [];
  const csvLines = [
    headers,
    ...rows.map((r) => [r.name || "", r.phone || "", r.email || ""])
  ].map((line) =>
    line
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(",")
  );

  const blob = new Blob([csvLines.join("\r\n")], {
    type: "text/csv;charset=utf-8;"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data_manager_export.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getDatabaseContent() {
    return `<div class="db-layout"><div class="db-form"><div class="db-input-group"><label>Name</label><input type="text" class="db-input" id="db-name"></div><div class="db-input-group"><label>Phone</label><input type="text" class="db-input" id="db-phone"></div><div class="db-input-group"><label>Email</label><input type="text" class="db-input" id="db-email"></div><button class="task-btn" id="db-add-record" type="button">Add Record</button><button class="task-btn" id="db-export-csv" type="button">Save CSV</button></div><div class="db-grid-container"><table class="db-table"><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th style="width:50px">Action</th></tr></thead><tbody id="db-tbody"></tbody></table></div></div>`;

}

export class DatabaseApp extends BaseApp {
  getWindowContent() {
    return getDatabaseContent(this.initData, this.services);
  }

  mount() {
    return initDatabase(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}

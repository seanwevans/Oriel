function renderDbTable(w) {
  const t = w.querySelector("#db-tbody");
  t.innerHTML = "";
  w.dbData.forEach((r, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${r.name}</td><td>${r.phone}</td><td>${r.email}</td><td><button onclick="deleteDbRecord(this,${i})">X</button></td>`;
    t.appendChild(tr);
  });
}

export function initDatabase(w) {
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
  renderDbTable(w);
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
  renderDbTable(w);
}

export function deleteDbRecord(b, i) {
  const w = b.closest(".window");
  w.dbData.splice(i, 1);
  localStorage.setItem("w31-db", JSON.stringify(w.dbData));
  renderDbTable(w);
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

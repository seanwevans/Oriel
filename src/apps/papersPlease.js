import { BaseApp } from "./base/BaseApp.js";
function initPapersPlease(win) {
  const nameEl = win.querySelector(".papers-name");
  const nationEl = win.querySelector(".papers-nation");
  const idEl = win.querySelector(".papers-id");
  const expiryEl = win.querySelector(".papers-expiry");
  const purposeEl = win.querySelector(".papers-purpose");
  const reasonEl = win.querySelector(".papers-reason");
  const logEl = win.querySelector(".papers-log");
  const photoEl = win.querySelector(".papers-photo");
  const dayEl = win.querySelector(".papers-day");
  const creditsEl = win.querySelector(".papers-credits");

  const nations = ["Arstotzka", "Kolechia", "Impor", "Obristan", "United Fed", "Antegria", "Republia"];
  const firstNames = ["Jorji", "Mikhail", "Svetlana", "Anna", "Ivan", "Nikolai", "Katerina", "Dimitri", "Olga", "Irina"];
  const lastNames = ["Costava", "Ivanov", "Petrova", "Smirnov", "Karpov", "Volkova", "Popov", "Sidorova", "Morozov", "Viktorov"];
  const purposes = ["Work", "Visit", "Transit", "Immigrate", "Diplomatic", "Asylum"];
  const issues = [
    { note: "Invalid ID number", apply: (e) => (e.valid = false) },
    { note: "Expired passport", apply: (e) => (e.expiry = "1982-11-25") },
    { note: "Wrong purpose", apply: (e) => (e.purpose = "Tourism") },
    { note: "Fake nation", apply: (e) => (e.nation = "Narnia") },
    { note: "Photo mismatch", apply: (e) => (e.photoMismatch = true) }
  ];

  const colors = ["#6ab04c", "#22a6b3", "#be2edd", "#f0932b", "#e74c3c", "#95a5a6"];

  let current = null;
  const stats = { day: 1, credits: 20, mistakes: 0, processed: 0 };

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randomId = () => Math.random().toString(36).slice(2, 10).toUpperCase();
  const randomDate = (future = false) => {
    const base = new Date();
    base.setDate(base.getDate() + (future ? Math.floor(Math.random() * 60) : -Math.floor(Math.random() * 60)));
    return base.toISOString().slice(0, 10);
  };

  const log = (msg) => {
    const div = document.createElement("div");
    div.textContent = msg;
    logEl?.appendChild(div);
    if (logEl) logEl.scrollTop = logEl.scrollHeight;
  };

  const updateStats = () => {
    if (dayEl) dayEl.textContent = `Day ${stats.day}`;
    if (creditsEl) creditsEl.textContent = `${stats.credits} cr`;
  };

  const renderEntrant = () => {
    if (!current) {
      if (reasonEl) {
        reasonEl.textContent = "Click 'Next' to inspect the next traveler.";
        reasonEl.classList.remove("invalid");
      }
      return;
    }
    if (nameEl) nameEl.textContent = current.name;
    if (nationEl) nationEl.textContent = current.nation;
    if (idEl) idEl.textContent = current.id;
    if (expiryEl) expiryEl.textContent = current.expiry;
    if (purposeEl) purposeEl.textContent = current.purpose;
    if (reasonEl) {
      reasonEl.textContent = "Review documents and choose to approve or deny.";
      reasonEl.classList.remove("invalid");
    }

    if (photoEl) {
      const initials = current.name
        .split(" ")
        .map((p) => p[0])
        .join(" ");
      photoEl.textContent = initials;
      photoEl.style.background = current.photoMismatch
        ? "repeating-linear-gradient(45deg, #600, #600 6px, #c0392b 6px, #c0392b 12px)"
        : `linear-gradient(135deg, ${pick(colors)}, ${pick(colors)})`;
    }
  };

  function generateEntrant() {
    const entrant = {
      name: `${pick(firstNames)} ${pick(lastNames)}`,
      nation: pick(nations),
      id: randomId(),
      expiry: randomDate(true),
      purpose: pick(purposes),
      valid: true,
      note: "All documents appear valid.",
      photoMismatch: false,
    };

    if (Math.random() < 0.45) {
      entrant.valid = false;
      const issue = pick(issues);
      issue.apply(entrant);
      entrant.note = issue.note;
    }

    return entrant;
  }

  function finishTraveler(approved) {
    if (!current) return;
    const correct = approved === current.valid;
    stats.processed += 1;
    if (stats.processed % 6 === 0) {
      stats.day += 1;
      log(`Night falls. Day ${stats.day} begins.`);
    }

    if (correct) {
      stats.credits += 5;
      log(`${approved ? "Approved" : "Denied"} correctly. +5 credits.`);
    } else {
      stats.credits = Math.max(0, stats.credits - 5);
      stats.mistakes += 1;
      log(`Citation issued for wrong decision on ${current.name}. -5 credits.`);
      log(`Citation reason: ${current.note}`);
    }

    updateStats();
    current = null;
    renderEntrant();
  }

  win.querySelector(".papers-approve")?.addEventListener("click", () => finishTraveler(true));
  win.querySelector(".papers-deny")?.addEventListener("click", () => finishTraveler(false));
  win.querySelector(".papers-next")?.addEventListener("click", () => {
    log("Traveler sent away without judgment.");
    current = null;
    renderEntrant();
  });

  updateStats();
  renderEntrant();
}

export { initPapersPlease };

export function getPapersContent() {
    return `
                <div class="papers-layout">
                    <div class="papers-header">
                        <div class="papers-title">Checkpoint Alpha</div>
                        <div class="papers-subtitle">"Glory to Orielstotzka"</div>
                    </div>
                    <div class="papers-stats">Day <span class="papers-day">1</span> · Credits: <span class="papers-credits">20</span> · Citations: <span class="papers-mistakes">0</span></div>
                    <div class="papers-body">
                        <div class="papers-docs">
                            <div class="papers-photo"></div>
                            <div class="papers-fields">
                                <div class="papers-field"><span class="papers-label">Name:</span> <span class="papers-name">---</span></div>
                                <div class="papers-field"><span class="papers-label">Nation:</span> <span class="papers-nation">---</span></div>
                                <div class="papers-field"><span class="papers-label">ID:</span> <span class="papers-id">---</span></div>
                                <div class="papers-field"><span class="papers-label">Expires:</span> <span class="papers-expiry">---</span></div>
                                <div class="papers-field"><span class="papers-label">Purpose:</span> <span class="papers-purpose">---</span></div>
                            </div>
                        </div>
                        <div class="papers-reason">Review documents and choose to approve or deny.</div>
                        <div class="papers-actions">
                            <button class="task-btn papers-approve">Approve</button>
                            <button class="task-btn papers-deny">Deny</button>
                            <button class="task-btn papers-next">Next Traveler</button>
                        </div>
                        <div class="papers-log" tabindex="0">Checkpoint initialized.</div>
                    </div>
                </div>
            `;

}

export class PapersPleaseApp extends BaseApp {
  getWindowContent() {
    return getPapersContent(this.initData, this.services);
  }

  mount() {
    return initPapersPlease(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}

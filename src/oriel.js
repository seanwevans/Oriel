const ICONS = {
  progman: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="2" y="4" width="28" height="24" fill="#c0c0c0" stroke="black"/><rect x="4" y="8" width="24" height="16" fill="white" stroke="black"/><rect x="6" y="10" width="4" height="4" fill="#000080"/><rect x="14" y="10" width="4" height="4" fill="#000080"/><rect x="22" y="10" width="4" height="4" fill="#000080"/><rect x="6" y="18" width="4" height="4" fill="#000080"/><rect x="14" y="18" width="4" height="4" fill="#000080"/><rect x="22" y="18" width="4" height="4" fill="#000080"/></svg>`,
  notepad: `<svg viewBox="0 0 32 32" class="svg-icon"><path d="M6 4h14l6 6v18H6z" fill="white" stroke="black"/><path d="M20 4v6h6" fill="#c0c0c0" stroke="black"/><line x1="10" y1="12" x2="22" y2="12" stroke="blue"/><line x1="10" y1="16" x2="22" y2="16" stroke="black"/><line x1="10" y1="20" x2="22" y2="20" stroke="black"/><line x1="10" y1="24" x2="22" y2="24" stroke="black"/></svg>`,
  calc: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="6" y="4" width="20" height="24" fill="#c0c0c0" stroke="black"/><rect x="8" y="6" width="16" height="6" fill="white" stroke="black"/><rect x="8" y="14" width="4" height="4" fill="blue" stroke="black"/><rect x="14" y="14" width="4" height="4" fill="blue" stroke="black"/><rect x="20" y="14" width="4" height="4" fill="red" stroke="black"/><rect x="8" y="20" width="4" height="4" fill="blue" stroke="black"/><rect x="14" y="20" width="4" height="4" fill="blue" stroke="black"/><rect x="20" y="20" width="4" height="4" fill="red" stroke="black"/></svg>`,
  mines: `<svg viewBox="0 0 32 32" class="svg-icon"><circle cx="16" cy="16" r="10" fill="black"/><rect x="14" y="4" width="4" height="6" fill="black"/><rect x="4" y="14" width="6" height="4" fill="black"/><rect x="22" y="14" width="6" height="4" fill="black"/><rect x="14" y="22" width="4" height="6" fill="black"/><circle cx="12" cy="12" r="2" fill="white"/></svg>`,
  ccompiler: `<svg viewBox="0 0 32 32" class="svg-icon"><path d="M6 4h14l6 6v18H6z" fill="white" stroke="black"/><path d="M20 4v6h6" fill="#c0c0c0" stroke="black"/><text x="14" y="22" font-family="serif" font-weight="bold" font-size="20" text-anchor="middle" fill="blue">C</text></svg>`,
  python: `<svg viewBox="0 0 32 32" class="svg-icon"><path d="M16 4c-4 0-4 2-4 2v2h4v1h-5c-4 0-4 4-4 4v2h2v-2c0-2 0-2 2-2h5c2 0 2-2 2-2V7c0-2-2-2-2-2h-1z" fill="#306998"/><path d="M16 28c4 0 4-2 4-2v-2h-4v-1h5c4 0 4-4 4-4v-2h-2v2c0 2 0 2-2 2h-5c-2 0-2 2-2 2v2c0 2 2 2 2 2h1z" fill="#FFD43B"/><circle cx="14" cy="7" r="1" fill="white"/><circle cx="18" cy="25" r="1" fill="white"/></svg>`,
  console: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="6" width="24" height="20" fill="black" stroke="#c0c0c0"/><text x="8" y="20" font-family="monospace" font-weight="bold" font-size="14" fill="#c0c0c0">C:\></text></svg>`,
  hexedit: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="6" width="24" height="20" rx="2" fill="#101010" stroke="#c0c0c0"/><rect x="6" y="8" width="20" height="16" fill="#1e1e1e" stroke="#404040"/><text x="16" y="18" font-family="monospace" font-size="10" fill="#00ff90" text-anchor="middle">0xED</text></svg>`,
  taskman: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="4" width="24" height="24" fill="#c0c0c0" stroke="black"/><rect x="6" y="6" width="20" height="4" fill="#000080"/><rect x="6" y="12" width="20" height="14" fill="white" stroke="black"/><line x1="8" y1="16" x2="24" y2="16" stroke="black"/><line x1="8" y1="20" x2="24" y2="20" stroke="black"/></svg>`,
  paint: `<svg viewBox="0 0 32 32" class="svg-icon"><path d="M10 24c0 2 2 4 4 4s4-2 4-4v-8h-8v8z" fill="#c0c0c0" stroke="black"/><rect x="10" y="10" width="8" height="6" fill="black"/><path d="M14 4l-4 6h8l-4-6z" fill="#c0c0c0" stroke="black"/><circle cx="24" cy="24" r="6" fill="#ff0000" opacity="0.5"/><circle cx="8" cy="24" r="6" fill="#0000ff" opacity="0.5"/></svg>`,
  artist: `<svg viewBox="0 0 32 32" class="svg-icon"><circle cx="16" cy="16" r="12" fill="#f9e0ae" stroke="#8a5a00"/><path d="M8 18c0-4 6-8 10-8s6 3 6 6-3 6-6 6c-2 0-2-2-1.5-3.5s-1.5-2.5-3-1.5S8 22 8 18z" fill="#fff4d0" stroke="#8a5a00"/><circle cx="12" cy="12" r="2" fill="#ff6f61"/><circle cx="18" cy="12" r="2" fill="#6ccff6"/><circle cx="14" cy="17" r="2" fill="#8bd450"/><rect x="6" y="20" width="6" height="2" rx="1" fill="#8a5a00"/><rect x="5" y="21" width="3" height="5" rx="1" fill="#c29f5d"/></svg>`,
  photoshop: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="4" width="24" height="24" rx="2" fill="#0b1d35" stroke="#00c8ff"/><rect x="6" y="6" width="20" height="20" fill="#112d4e" stroke="#00c8ff"/><text x="13" y="20" font-family="monospace" font-size="12" font-weight="bold" fill="#00c8ff">PS</text><rect x="18" y="10" width="6" height="2" fill="#00c8ff"/><rect x="18" y="14" width="6" height="2" fill="#00c8ff" opacity="0.7"/></svg>`,
  database: `<svg viewBox="0 0 32 32" class="svg-icon"><path d="M16 6c-8 0-12 2-12 4v12c0 2 4 4 12 4s12-2 12-4V10c0-2-4-4-12-4z" fill="#c0c0c0" stroke="black"/><ellipse cx="16" cy="10" rx="12" ry="4" fill="white" stroke="black"/><path d="M4 14c0 2 4 4 12 4s12-2 12-4" fill="none" stroke="black"/><path d="M4 18c0 2 4 4 12 4s12-2 12-4" fill="none" stroke="black"/></svg>`,
  soundrec: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="12" y="6" width="8" height="14" rx="4" fill="#404040" stroke="black"/><rect x="14" y="20" width="4" height="6" fill="#808080" stroke="black"/><rect x="10" y="26" width="12" height="2" fill="black"/><line x1="8" y1="12" x2="24" y2="12" stroke="#808080" stroke-width="2"/></svg>`,
  charmap: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="4" width="24" height="24" fill="#fff" stroke="black"/><text x="16" y="24" font-family="serif" font-size="24" text-anchor="middle" font-weight="bold">Ã</text></svg>`,
  winfile: `<svg viewBox="0 0 32 32" class="svg-icon"><path d="M2 6h8l2 2h18v20H2z" fill="#FFFF00" stroke="black"/><path d="M4 10h24v14H4z" fill="white" opacity="0.3"/></svg>`,
  clock: `<svg viewBox="0 0 32 32" class="svg-icon"><circle cx="16" cy="16" r="12" fill="white" stroke="black"/><line x1="16" y1="16" x2="16" y2="8" stroke="black" stroke-width="2"/><line x1="16" y1="16" x2="22" y2="16" stroke="black" stroke-width="2"/></svg>`,
  control: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="8" width="24" height="16" fill="#c0c0c0" stroke="black"/><rect x="6" y="10" width="20" height="12" fill="white"/><circle cx="10" cy="16" r="3" fill="red"/><circle cx="16" cy="16" r="3" fill="green"/><circle cx="22" cy="16" r="3" fill="blue"/></svg>`,
  cp_color: `<svg viewBox="0 0 32 32" class="svg-icon"><path d="M16 2 L2 28 H30 Z" fill="#FFFF00" stroke="black"/><circle cx="16" cy="18" r="5" fill="red"/><circle cx="12" cy="24" r="5" fill="blue"/><circle cx="20" cy="24" r="5" fill="green"/></svg>`,
  screensaver: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="6" width="24" height="18" rx="2" ry="2" fill="#000" stroke="#0ff"/><circle cx="22" cy="10" r="2" fill="#0ff"/><path d="M8 22c2-4 6-6 10-6s6 1 8 3" stroke="#0ff" stroke-width="2" fill="none"/></svg>`,
  write: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="6" y="4" width="20" height="24" fill="white" stroke="black"/><text x="16" y="22" font-family="serif" font-size="24" text-anchor="middle" font-weight="bold" fill="blue">A</text><path d="M20 6 l6 6 -2 2 -6 -6 z" fill="#ffff00" stroke="black"/></svg>`,
  cardfile: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="8" width="24" height="18" fill="white" stroke="black"/><line x1="4" y1="12" x2="28" y2="12" stroke="black"/><rect x="6" y="4" width="8" height="4" fill="white" stroke="black" style="border-bottom:none;"/></svg>`,
  solitaire: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="4" width="16" height="20" fill="white" stroke="black" rx="2"/><text x="8" y="16" font-size="14" fill="red">♥</text><rect x="12" y="8" width="16" height="20" fill="#000080" stroke="white" rx="2"/></svg>`,
  clipboard: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="6" y="6" width="20" height="22" fill="white" stroke="black"/><rect x="10" y="4" width="12" height="4" fill="#c0c0c0" stroke="black"/><line x1="10" y1="12" x2="22" y2="12" stroke="gray"/><line x1="10" y1="16" x2="22" y2="16" stroke="gray"/></svg>`,
  reversi: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="4" width="24" height="24" fill="#008000" stroke="black"/><circle cx="16" cy="16" r="8" fill="red"/><circle cx="16" cy="16" r="4" fill="blue"/></svg>`,
  mplayer: `<svg viewBox="0 0 32 32" class="svg-icon"><path d="M4 6h24v20H4z" fill="#fff" stroke="black"/><rect x="6" y="8" width="20" height="12" fill="black"/><path d="M12 24l8 0l-4 4z" fill="#000"/></svg>`,
  simcity: `<svg viewBox='0 0 32 32' class='svg-icon'><rect x='4' y='12' width='24' height='14' fill='#87ceeb' stroke='black'/><rect x='6' y='18' width='6' height='6' fill='#d3d3d3' stroke='black'/><rect x='14' y='14' width='6' height='10' fill='#a0d468' stroke='black'/><rect x='22' y='16' width='4' height='8' fill='#fdd835' stroke='black'/><rect x='4' y='10' width='24' height='2' fill='#8d6e63'/><rect x='2' y='24' width='28' height='4' fill='#6d4c41'/></svg>`,
  skifree: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="2" y="2" width="28" height="28" rx="2" fill="#e0f7ff" stroke="black"/><path d="M6 26l20-20" stroke="#000080" stroke-width="2"/><path d="M6 22l12-12" stroke="#000080" stroke-width="2"/><circle cx="16" cy="10" r="3" fill="#ff4040" stroke="black"/><rect x="14" y="13" width="4" height="7" fill="#ffffff" stroke="black"/><path d="M14 16l-4 3" stroke="#000" stroke-width="2"/><path d="M18 16l4 3" stroke="#000" stroke-width="2"/><path d="M14 20l-4 6" stroke="#000" stroke-width="2"/><path d="M18 20l4 6" stroke="#000" stroke-width="2"/></svg>`,
  chess: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="4" width="24" height="24" rx="2" ry="2" fill="#fff" stroke="black"/><path d="M12 24h8v2h-8z" fill="#808080" stroke="black"/><path d="M13 20h6v4h-6z" fill="#c0c0c0" stroke="black"/><path d="M14 10c0-2 4-2 4 0v2h2v3H12v-3h2z" fill="#000"/><circle cx="16" cy="8" r="2" fill="#000"/></svg>`,
  browser: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="6" width="24" height="20" fill="#c0c0c0" stroke="black"/><circle cx="10" cy="12" r="1" fill="red"/><circle cx="14" cy="12" r="1" fill="gold"/><circle cx="18" cy="12" r="1" fill="lime"/><rect x="6" y="14" width="20" height="10" fill="white" stroke="black"/><path d="M8 20h16" stroke="#000080" stroke-width="2"/><path d="M12 18l-2 2l2 2" stroke="#000080" stroke-width="2" fill="none"/><path d="M20 18l2 2l-2 2" stroke="#000080" stroke-width="2" fill="none"/></svg>`,
  radiogarden: `<svg viewBox="0 0 32 32" class="svg-icon"><circle cx="16" cy="16" r="14" fill="#0b5f66" stroke="#022f33"/><circle cx="16" cy="16" r="10" fill="#0fa4af" stroke="#0b5f66"/><circle cx="16" cy="16" r="6" fill="#c0f5ff" stroke="#0fa4af"/><rect x="15" y="6" width="2" height="20" fill="#022f33"/><rect x="6" y="15" width="20" height="2" fill="#022f33"/><circle cx="16" cy="16" r="2" fill="#ffe066" stroke="#bfa033"/></svg>`,
  irc: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="6" width="24" height="18" rx="2" ry="2" fill="#c0e0ff" stroke="#003366"/><rect x="8" y="10" width="12" height="4" rx="2" fill="white" stroke="#003366"/><circle cx="22" cy="20" r="4" fill="#004080"/><path d="M22 17c1.5 0 2.5.7 3 1.8" stroke="white" stroke-width="1" fill="none"/></svg>`,
  beatmaker: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="6" width="24" height="20" rx="2" ry="2" fill="#f0f0f0" stroke="black"/><rect x="6" y="8" width="20" height="16" fill="#202020" stroke="#808080"/><rect x="8" y="18" width="4" height="4" fill="#ff7043"/><rect x="14" y="18" width="4" height="4" fill="#fff176"/><rect x="20" y="18" width="4" height="4" fill="#66bb6a"/><rect x="10" y="12" width="12" height="2" fill="#00e5ff"/><rect x="12" y="10" width="8" height="2" fill="#00bcd4"/><rect x="10" y="14" width="12" height="2" fill="#00e676"/></svg>`,
  radio: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="10" width="24" height="14" rx="2" fill="#f0f0f0" stroke="black"/><rect x="6" y="8" width="14" height="4" fill="#c0c0c0" stroke="black"/><circle cx="22" cy="17" r="4" fill="#ffcc00" stroke="#c08000"/><circle cx="22" cy="17" r="2" fill="#0066cc"/><rect x="8" y="14" width="8" height="2" fill="#000"/><rect x="8" y="18" width="6" height="2" fill="#000"/><path d="M10 8 L18 4" stroke="#404040" stroke-width="2"/></svg>`,
  rss: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="4" width="24" height="24" rx="4" fill="#ff7f00" stroke="#b85c00"/><circle cx="11" cy="21" r="2" fill="#fff"/><path d="M10 14c5 0 9 4 9 9" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M10 10c7 0 13 6 13 13" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
  discord: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="6" width="24" height="20" rx="3" fill="#5865f2" stroke="#2c2f33"/><path d="M12 12c1 0 1.5.5 2 1 1-.5 3-.5 4 0 .5-.5 1-1 2-1l1 4s-1.5 2.5-5 2.5-5-2.5-5-2.5l1-4Z" fill="white"/><circle cx="14" cy="15" r="1" fill="#2c2f33"/><circle cx="18" cy="15" r="1" fill="#2c2f33"/></svg>`,
  folder: `<svg viewBox="0 0 16 16" class="tiny-icon"><path d="M1 2h6l2 2h6v10H1z" fill="#FFFF00" stroke="black" stroke-width="0.5"/></svg>`,
  file_exe: `<svg viewBox="0 0 16 16" class="tiny-icon"><rect x="2" y="1" width="12" height="14" fill="white" stroke="black" stroke-width="0.5"/><rect x="3" y="2" width="10" height="2" fill="#000080"/></svg>`,
  file_txt: `<svg viewBox="0 0 16 16" class="tiny-icon"><rect x="2" y="1" width="12" height="14" fill="white" stroke="black" stroke-width="0.5"/><line x1="4" y1="4" x2="12" y2="4" stroke="black" stroke-width="0.5"/><line x1="4" y1="7" x2="12" y2="7" stroke="black" stroke-width="0.5"/></svg>`,
  readme: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="6" y="4" width="20" height="24" fill="white" stroke="black"/><path d="M10 8h12M10 12h12M10 16h12M10 20h8" stroke="black" stroke-width="2"/></svg>`,
  help: `<svg viewBox="0 0 32 32" class="svg-icon"><circle cx="16" cy="16" r="12" fill="#FFFF00" stroke="black"/><text x="16" y="22" font-size="20" text-anchor="middle" font-weight="bold" font-family="serif">?</text></svg>`,
  desktop_cp: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="2" y="4" width="28" height="20" fill="white" stroke="black"/><rect x="4" y="6" width="24" height="16" fill="cyan"/><rect x="10" y="24" width="12" height="4" fill="gray" stroke="black"/></svg>`,
  pdfreader: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="6" y="4" width="20" height="24" fill="white" stroke="black"/><path d="M20 4v6h6" fill="#ffdddd" stroke="black"/><rect x="10" y="10" width="12" height="2" fill="#c00"/><path d="M12 14c4 6 8 0 10 8" fill="none" stroke="#c00" stroke-width="2"/><circle cx="12" cy="14" r="2" fill="#fff" stroke="#c00"/></svg>`,
  imageviewer: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="6" width="24" height="20" fill="#f5f5f5" stroke="black"/><rect x="6" y="8" width="20" height="16" fill="#c0e8ff" stroke="#808080"/><circle cx="12" cy="13" r="2" fill="#ffcc00" stroke="#c08000"/><path d="M8 22l6-6l4 4l4-6l4 8H8z" fill="#008040" stroke="#004020"/></svg>`,
  doom: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="2" y="2" width="28" height="28" fill="#333" stroke="black"/><path d="M6 16l4-4l4 4l4-8l4 8l4-4" stroke="red" stroke-width="2" fill="none"/><rect x="8" y="22" width="16" height="4" fill="#555"/></svg>`,
  papers: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="6" width="24" height="20" rx="2" fill="#fff" stroke="black"/><rect x="6" y="8" width="20" height="6" fill="#d8d8d8" stroke="#808080"/><path d="M8 12h10" stroke="#000080" stroke-width="2"/><rect x="6" y="16" width="10" height="8" fill="#f5f5f5" stroke="#808080"/><rect x="18" y="16" width="8" height="6" fill="#ffe0b2" stroke="#c07020"/><path d="M6 6l4-4h12l4 4" fill="#fff8e1" stroke="#c07020"/></svg>`,
  markdown: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="6" width="24" height="20" fill="#fff" stroke="black"/><rect x="4" y="10" width="24" height="2" fill="#c0c0c0"/><text x="10" y="22" font-family="monospace" font-size="12" font-weight="bold" fill="#000">#</text><text x="18" y="22" font-family="monospace" font-size="12" font-weight="bold" fill="#000">MD</text></svg>`,
  linerider: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="2" y="6" width="28" height="20" rx="2" fill="#e0f7ff" stroke="black"/><path d="M6 18l14-6l6 4l-14 6z" fill="#0080c0" stroke="black"/><circle cx="10" cy="12" r="3" fill="#ffcc00" stroke="black"/><path d="M8 22l10 4" stroke="#202020" stroke-width="2"/></svg>`,
  volume: `<svg viewBox="0 0 32 32" class="svg-icon"><path d="M4 12h6l8-6v20l-8-6H4z" fill="#c0c0c0" stroke="black"/><path d="M21 10c2 2 2 10 0 12M24 7c4 4 4 14 0 18" stroke="black" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
};

const PROGRAMS = [
  {
    type: "notepad",
    title: "Notepad",
    width: 300,
    height: 200,
    icon: "notepad",
    label: "Notepad"
  },
  {
    type: "write",
    title: "Write",
    width: 500,
    height: 400,
    icon: "write",
    label: "Write"
  },
  {
    type: "winfile",
    title: "File Manager",
    width: 500,
    height: 350,
    icon: "winfile",
    label: "File Mgr"
  },
  {
    type: "cardfile",
    title: "Cardfile",
    width: 350,
    height: 400,
    icon: "cardfile",
    label: "Cardfile"
  },
  {
    type: "calc",
    title: "Calculator",
    width: 220,
    height: 250,
    icon: "calc",
    label: "Calculator"
  },
  {
    type: "mines",
    title: "Minesweeper",
    width: 240,
    height: 320,
    icon: "mines",
    label: "Minesweeper"
  },
  {
    type: "solitaire",
    title: "Solitaire",
    width: 600,
    height: 450,
    icon: "solitaire",
    label: "Solitaire"
  },
  {
    type: "chess",
    title: "Chess",
    width: 640,
    height: 520,
    icon: "chess",
    label: "Chess"
  },
  {
    type: "reversi",
    title: "Reversi",
    width: 300,
    height: 340,
    icon: "reversi",
    label: "Reversi"
  },
  {
    type: "paint",
    title: "Paintbrush",
    width: 500,
    height: 400,
    icon: "paint",
    label: "Paintbrush"
  },
  {
    type: "photoshop",
    title: "Photoshop 1.0",
    width: 760,
    height: 560,
    icon: "photoshop",
    label: "Photoshop"
  },
  {
    type: "mplayer",
    title: "Media Player",
    width: 350,
    height: 250,
    icon: "mplayer",
    label: "Media Player"
  },
  {
    type: "simcity",
    title: "Micropolis",
    width: 560,
    height: 520,
    icon: "simcity",
    label: "Micropolis"
  },
  {
    type: "skifree",
    title: "SkiFree",
    width: 520,
    height: 520,
    icon: "skifree",
    label: "SkiFree"
  },
  {
    type: "linerider",
    title: "Line Rider",
    width: 620,
    height: 520,
    icon: "linerider",
    label: "Line Rider"
  },
  {
    type: "soundrec",
    title: "Sound Recorder",
    width: 300,
    height: 160,
    icon: "soundrec",
    label: "Sound Rec"
  },
  {
    type: "radio",
    title: "Radio",
    width: 620,
    height: 460,
    icon: "radio",
    label: "Radio"
  },
  {
    type: "beatmaker",
    title: "Beat Lab",
    width: 720,
    height: 420,
    icon: "beatmaker",
    label: "Beat Lab"
  },
  {
    type: "clock",
    title: "Clock",
    width: 250,
    height: 250,
    icon: "clock",
    label: "Clock"
  },
  {
    type: "charmap",
    title: "Character Map",
    width: 460,
    height: 380,
    icon: "charmap",
    label: "Char Map"
  },
  {
    type: "control",
    title: "Control Panel",
    width: 400,
    height: 300,
    icon: "control",
    label: "Control"
  },
  {
    type: "imageviewer",
    title: "Image Viewer",
    width: 720,
    height: 540,
    icon: "imageviewer",
    label: "Image View"
  },
  {
    type: "pdfreader",
    title: "PDF Reader",
    width: 720,
    height: 540,
    icon: "pdfreader",
    label: "PDF Reader"
  },
  {
    type: "markdown",
    title: "Markdown Viewer",
    width: 700,
    height: 500,
    icon: "markdown",
    label: "Markdown"
  },
  {
    type: "clipbrd",
    title: "Clipboard",
    width: 300,
    height: 250,
    icon: "clipboard",
    label: "Clipboard"
  },
  {
    type: "taskman",
    title: "Task List",
    width: 320,
    height: 350,
    icon: "taskman",
    label: "Task List"
  },
  {
    type: "database",
    title: "Data Manager",
    width: 500,
    height: 400,
    icon: "database",
    label: "Data Mgr"
  },
  {
    type: "compiler",
    title: "Tiny C",
    width: 450,
    height: 350,
    icon: "ccompiler",
    label: "Tiny C"
  },
  {
    type: "python",
    title: "Tiny Python",
    width: 450,
    height: 350,
    icon: "python",
    label: "Python"
  },
  {
    type: "console",
    title: "Console",
    width: 500,
    height: 350,
    icon: "console",
    label: "Console"
  },
  {
    type: "hexedit",
    title: "Hex Editor",
    width: 720,
    height: 520,
    icon: "hexedit",
    label: "Hex Editor"
  },
  {
    type: "rss",
    title: "RSS Reader",
    width: 720,
    height: 520,
    icon: "rss",
    label: "RSS Reader"
  },
  {
    type: "browser",
    title: "Web Browser",
    width: 640,
    height: 480,
    icon: "browser",
    label: "Browser"
  },
  {
    type: "radiogarden",
    title: "Radio Garden",
    width: 720,
    height: 520,
    icon: "radiogarden",
    label: "Radio Garden"
  },
  {
    type: "discord",
    title: "Discord (API)",
    width: 720,
    height: 520,
    icon: "discord",
    label: "Discord"
  },
  {
    type: "irc",
    title: "IRC Client",
    width: 680,
    height: 500,
    icon: "irc",
    label: "IRC"
  },
  {
    type: "readme",
    title: "Read Me",
    width: 350,
    height: 400,
    icon: "readme",
    label: "Read Me"
  },
  {
    type: "doom",
    title: "DOOM",
    width: 640,
    height: 400,
    icon: "doom",
    label: "DOOM"
  },
  {
    type: "papers",
    title: "Checkpoint",
    width: 640,
    height: 520,
    icon: "papers",
    label: "Checkpoint"
  }
];

const DESKTOP_STATE_KEY = "oriel-desktop-state";

let wallpaperSettings = { url: "", mode: "tile" };

function loadDesktopState() {
  try {
    const stored = localStorage.getItem(DESKTOP_STATE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (err) {
    console.error("Failed to parse desktop state", err);
  }
  return { windows: [], wallpaper: null };
}

function persistDesktopState(state) {
  localStorage.setItem(DESKTOP_STATE_KEY, JSON.stringify(state));
}

function applyWallpaperSettings(url = "", mode = "tile", persist = false) {
  wallpaperSettings = { url, mode };
  const body = document.body;
  if (url) {
    body.style.backgroundImage = `url('${url}')`;
    if (mode === "tile") {
      body.style.backgroundSize = "auto";
      body.style.backgroundRepeat = "repeat";
      body.style.backgroundPosition = "center";
    } else if (mode === "center") {
      body.style.backgroundSize = "auto";
      body.style.backgroundRepeat = "no-repeat";
      body.style.backgroundPosition = "center";
    } else if (mode === "cover") {
      body.style.backgroundSize = "cover";
      body.style.backgroundRepeat = "no-repeat";
      body.style.backgroundPosition = "center";
    }
  } else {
    body.style.backgroundImage = "none";
  }

  if (persist && window.wm) {
    window.wm.saveDesktopState();
  }
}

const DEFAULT_PDF_DATA_URI =
  "data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMCA0IDAgUiA+PiA+PiAvTWVkaWFCb3ggWzAgMCA1OTUuMjggODQxLjg5XSA+PgplbmRvYmoKNCAwIG9iago8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL05hbWUgL0YwIC9CYXNlRm9udCAvSGVsdmV0aWNhID4+CmVuZG9iagogNSAwIG9iago8PCAvTGVuZ3RoIDY2ID4+CnN0cmVhbQpCVAovRjAgMjQgVGYKMTIwIDcwMCBUZAooSGVsbG8gV29ybGQhKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDY3IDAwMDAwIG4gCjAwMDAwMDAxNjMgMDAwMDAgbiAKMDAwMDAwMDI2MiAwMDAwMCBuIAowMDAwMDAwMzQ3IDAwMDAwIG4gCnRyYWlsZXIKPDwgL1NpemUgNiAvUm9vdCAxIDAgUiAvSW5mbyA1IDAgUiA+PgpzdGFydHhyZWYKNDY5CiUlRU9G";

const DEFAULT_MD_SAMPLE = 
  `# Welcome to Markdown Viewer\n\n
  This is a simple markdown previewer. 
  Try editing the text on the left and watch the preview update.\n\n
  ## Features\n
  - Headings, lists, and links\n
  - **Bold** and *italic* text\n`;

const FS_STORAGE_KEY = "oriel-fs-v1";

const DEFAULT_FS = {
  "C:\\": {
    type: "dir",
    children: {
      ORIEL: {
        type: "dir",
        children: {
          SYSTEM: { type: "dir", children: {} },
          "CALC.EXE": { type: "file", app: "calc" },
          "NOTEPAD.EXE": { type: "file", app: "notepad" },
          "DOOM.EXE": { type: "file", app: "doom" },
          "WRITE.EXE": { type: "file", app: "write" },
          "CARDFILE.EXE": { type: "file", app: "cardfile" },
          "WINMINE.EXE": { type: "file", app: "mines" },
          "CHESS.EXE": { type: "file", app: "chess" },
          "SOL.EXE": { type: "file", app: "solitaire" },
          "REVERSI.EXE": { type: "file", app: "reversi" },
          "PBRUSH.EXE": { type: "file", app: "paint" },
          "ARTIST.EXE": { type: "file", app: "artist" },
          "PHOTOSHP.EXE": { type: "file", app: "photoshop" },
          "MPLAYER.EXE": { type: "file", app: "mplayer" },
          "SKIFREE.EXE": { type: "file", app: "skifree" },
          "LINERIDR.EXE": { type: "file", app: "linerider" },
          "SIMCITY.EXE": { type: "file", app: "simcity" },
          "WINFILE.EXE": { type: "file", app: "winfile" },
          "TASKMAN.EXE": { type: "file", app: "taskman" },
          "CLIPBRD.EXE": { type: "file", app: "clipbrd" },
          "DATAMGR.EXE": { type: "file", app: "database" },
          "CHARMAP.EXE": { type: "file", app: "charmap" },
          "SOUNDREC.EXE": { type: "file", app: "soundrec" },
          "BEATLAB.EXE": { type: "file", app: "beatmaker" },
          "RADIO.EXE": { type: "file", app: "radio" },
          "CLOCK.EXE": { type: "file", app: "clock" },
          "CONTROL.EXE": { type: "file", app: "control" },
          "RSS.EXE": { type: "file", app: "rss" },
          "WEB.EXE": { type: "file", app: "browser" },
          "DISCORD.EXE": { type: "file", app: "discord" },
          "IRC.EXE": { type: "file", app: "irc" },
          "TINYC.EXE": { type: "file", app: "compiler" },
          "PYTHON.EXE": { type: "file", app: "python" },
          "CONSOLE.EXE": { type: "file", app: "console" },
          "HEXEDIT.EXE": { type: "file", app: "hexedit" },
          "IMGVIEW.EXE": { type: "file", app: "imageviewer" }
        }
      },
      DOCUMENTS: {
        type: "dir",
        children: {
          "README.TXT": { type: "file", app: "notepad", content: "Welcome to Oriel 1.0!" },
          "TODO.TXT": { type: "file", app: "notepad", content: "- Buy Milk\n- Install DOOM" },
          "MANUAL.PDF": { type: "file", app: "pdfreader", content: { name: "Manual.pdf", src: DEFAULT_PDF_DATA_URI } },
          "README.MD": { type: "file", app: "markdown", content: DEFAULT_MD_SAMPLE },
          "SCREEN.PNG": {
            type: "file",
            app: "imageviewer",
            content: { name: "screen.png", src: "screen.png" }
          }
        }
      }
    }
  }
};

function loadFileSystem() {
  const stored = localStorage.getItem(FS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_FS;
}

function saveFileSystem() {
  localStorage.setItem(FS_STORAGE_KEY, JSON.stringify(MOCK_FS));
}

const MOCK_FS = loadFileSystem();

function createFolder(btn) {
  const win = btn.closest(".window");
  const input = win.querySelector("#new-folder-name");
  const name = input.value.trim();
  if (name && win.currentDirObj) {
    if (win.currentDirObj.children[name]) {
      alert("Folder already exists!");
      return;
    }
    win.currentDirObj.children[name] = {
      type: "dir",
      children: {}
    };
    saveFileSystem(); // Save changes
    input.value = "";
    rFT(win);
    rFL(win);
  }
}

const BROWSER_HOME = "https://example.com/";
const browserSessions = {};
const BROWSER_PROXY_PREFIX = "https://r.jina.ai/";
const RADIO_BROWSER_BASE = "https://de1.api.radio-browser.info/json";
const RADIO_GARDEN_PROXY = `${BROWSER_PROXY_PREFIX}http://radio.garden`;

const RSS_PRESETS = [
  { label: "Hacker News", url: "https://hnrss.org/frontpage" },
  { label: "Lobsters", url: "https://lobste.rs/rss" },
  { label: "BBC World", url: "http://feeds.bbci.co.uk/news/world/rss.xml" },
  { label: "Ars Technica", url: "http://feeds.arstechnica.com/arstechnica/index" }
];

const DEFAULT_RSS_SAMPLE = [
  {
    title: "Welcome to Oriel RSS",
    link: "https://example.com/",
    date: new Date().toISOString(),
    summary:
      "Load a feed from the toolbar presets or paste any RSS/Atom URL. Items appear on the left and show details here."
  }
];

const RSS_PROXY_ROOT = "https://api.allorigins.win/raw?url=";

const IRC_BOT_MESSAGES = [
  "Anyone else miss dial-up modems?",
  "Set your away message with /away <msg>!",
  "New high score in SkiFree: 12,430 points.",
  "Reminder: backups save lives.",
  "Try the checkpoint game—papers, please!",
  "TinyC compile succeeded. No warnings.",
  "Have you tweaked your wallpaper today?",
  "Oriel 1.0 loves retro vibes.",
  "Remember to hydrate and stretch."
];

const VOLUME_STORAGE_KEY = "oriel-volume";

function clampVolume(v) {
  return Math.min(1, Math.max(0, v));
}

function loadStoredVolume() {
  const stored = parseFloat(localStorage.getItem(VOLUME_STORAGE_KEY));
  if (isNaN(stored)) return 0.7;
  return clampVolume(stored);
}

let systemVolume = loadStoredVolume();
let lastNonZeroVolume = systemVolume || 0.7;
const activeMediaElements = new Set();

function generateToneUrl(freq, duration = 1.2, sampleRate = 22050) {
  const sampleCount = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + sampleCount * 2);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) bytes[offset + i] = str.charCodeAt(i);
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + sampleCount * 2, true);
  writeString(8, "WAVEfmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, sampleCount * 2, true);

  for (let i = 0; i < sampleCount; i++) {
    const sample = Math.sin((2 * Math.PI * freq * i) / sampleRate) * 0.35;
    view.setInt16(44 + i * 2, sample * 32767, true);
  }

  return URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
}

let mediaPlayerTracks = null;

function getMediaPlayerTracks() {
  if (!mediaPlayerTracks) {
    mediaPlayerTracks = [
      {
        name: "Synth Bell (C5)",
        url: generateToneUrl(523.25, 1.2),
        type: "audio/wav"
      },
      {
        name: "Retro Chime (E4)",
        url: generateToneUrl(329.63, 1.5),
        type: "audio/wav"
      },
      {
        name: "Soft Drone (A3)",
        url: generateToneUrl(220, 2),
        type: "audio/wav"
      }
    ];
  }
  return mediaPlayerTracks;
}

function getSystemVolume() {
  return systemVolume;
}

function updateVolumeUIElements(volume) {
  const percent = `${Math.round(volume * 100)}%`;
  document
    .querySelectorAll(".volume-slider")
    .forEach((slider) => (slider.value = Math.round(volume * 100)));
  document
    .querySelectorAll(".volume-percent")
    .forEach((label) => (label.textContent = percent));
  document
    .querySelectorAll(".volume-mute-toggle")
    .forEach((chk) => (chk.checked = volume === 0));
}

function setSystemVolume(value) {
  systemVolume = clampVolume(value);
  if (systemVolume > 0) lastNonZeroVolume = systemVolume;
  localStorage.setItem(VOLUME_STORAGE_KEY, systemVolume.toString());
  activeMediaElements.forEach((el) => {
    el.volume = systemVolume;
  });
  updateVolumeUIElements(systemVolume);
}

function registerMediaElement(el) {
  if (!el) return;
  el.volume = systemVolume;
  activeMediaElements.add(el);
  const cleanup = () => activeMediaElements.delete(el);
  el.addEventListener("ended", cleanup, { once: true });
  el.addEventListener("pause", () => {
    if (el.currentTime === 0 || el.currentTime >= (el.duration || 0)) {
      cleanup();
    }
  });
}

let testToneContext = null;

function playVolumeTest() {
  testToneContext =
    testToneContext || new (window.AudioContext || window.webkitAudioContext)();
  const ctx = testToneContext;
  if (ctx.state === "suspended") ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 880;
  gain.gain.value = systemVolume;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.4);
}

class SimulatedKernel {
  constructor() {
    this.processes = [];
    this.schedulerInterval = null;
    this.currentProcessIndex = 0;
  }
  registerProcess(pid, name) {
    this.processes.push({
      pid: pid,
      name: name,
      state: "READY",
      priority: Math.floor(Math.random() * 10) + 1,
      cpuTime: 0
    });
    this.startScheduler();
  }
  unregisterProcess(pid) {
    const idx = this.processes.findIndex((p) => p.pid === pid);
    if (idx > -1) this.processes.splice(idx, 1);
  }
  startScheduler() {
    if (this.schedulerInterval) return;
    this.schedulerInterval = setInterval(() => this.tick(), 200); // 5Hz simulated tick
  }
  tick() {
    if (this.processes.length === 0) return;
    // Bounds check in case a process was killed asynchronously
    if (this.currentProcessIndex >= this.processes.length) {
      this.currentProcessIndex = 0;
    }
    const p = this.processes[this.currentProcessIndex];
    // Double check existence because async removals might happen
    if (p) {
      if (p.state !== "WAITING") {
        p.state = "RUNNING";
        p.cpuTime += 200; // ms
      }
    } else {
      // If undefined, try to reset index and wait for next tick
      this.currentProcessIndex = 0;
      return;
    }
    // Simple Round Robin Simulation update for next tick
    this.processes.forEach((proc, idx) => {
      if (idx !== this.currentProcessIndex) {
        if (proc.state === "RUNNING") proc.state = "READY";
        // Randomly toggle WAITING state to simulate I/O
        if (Math.random() < 0.1) proc.state = "WAITING";
        else if (proc.state === "WAITING" && Math.random() < 0.3)
          proc.state = "READY";
      }
    });
    this.currentProcessIndex =
      (this.currentProcessIndex + 1) % this.processes.length;
    // Notify Task Managers
    refreshAllProcessViews();
  }
}

const kernel = new SimulatedKernel();

class WindowManager {
  constructor(initialState = null) {
    this.desktop = document.getElementById("desktop");
    this.minimizedContainer = document.getElementById("minimized-container");
    this.windows = [];
    this.highestZ = 100;
    this.isRestoring = false;
    this.dragState = {
      isDragging: false,
      initialX: 0,
      initialY: 0,
      offX: 0,
      offY: 0,
      currentWin: null
    };
    this.resizeState = {
      isResizing: false,
      currentWin: null,
      handleType: null,
      initialX: 0,
      initialY: 0,
      initialW: 0,
      initialH: 0,
      initialL: 0,
      initialT: 0
    };
    // Global Listeners
    window.addEventListener("mousemove", (e) => {
      this.onDrag(e);
      this.onResize(e);
    });
    window.addEventListener("mouseup", () => {
      this.endDrag();
      this.endResize();
    });
    // Restore prior desktop state
    if (initialState && initialState.windows?.length) {
      this.isRestoring = true;
      this.restoreWindows(initialState.windows);
      const top = this.getTopWindowByZ();
      if (top) this.focusWindow(top.id);
      this.isRestoring = false;
      this.highestZ = Math.max(
        this.highestZ,
        ...initialState.windows.map((w) => w.zIndex || 100)
      );
      this.saveDesktopState();
    }
    if (this.windows.length === 0)
      this.openWindow("progman", "Program Manager", 500, 480);
  }
  createWindowDOM(id, title, width, height, content, stateOverrides = {}) {
    const win = document.createElement("div");
    win.classList.add("window");
    win.style.width =
      typeof width === "number" ? width + "px" : width || width === 0 ? width : "";
    win.style.height =
      typeof height === "number"
        ? height + "px"
        : height || height === 0
          ? height
          : "";
    win.style.left = stateOverrides.left || 40 + this.windows.length * 20 + "px";
    win.style.top = stateOverrides.top || 40 + this.windows.length * 20 + "px";
    win.dataset.id = id;
    win.dataset.type = title; // For task manager filter
    // HTML Structure with Resize Handles
    win.innerHTML = `
                <div class="resizer n" data-resize="n"></div>
                <div class="resizer s" data-resize="s"></div>
                <div class="resizer e" data-resize="e"></div>
                <div class="resizer w" data-resize="w"></div>
                <div class="resizer ne" data-resize="ne"></div>
                <div class="resizer nw" data-resize="nw"></div>
                <div class="resizer se" data-resize="se"></div>
                <div class="resizer sw" data-resize="sw"></div>
                <div class="title-bar">
                    <div class="sys-box" onclick="wm.closeWindow('${id}')">-</div>
                    <div class="title-bar-text">${title}</div>
                    <div class="win-controls-right">
                        <div class="win-btn" onclick="wm.minimizeWindow('${id}')">▼</div>
                        <div class="win-btn" onclick="wm.maximizeWindow('${id}')">▲</div>
                    </div>
                </div>
                <div class="menu-bar">
                    <div class="menu-item">File</div>
                    <div class="menu-item">Edit</div>
                    <div class="menu-item">Help</div>
                </div>
                <div class="window-body">
                    ${content}
                </div>
            `;
    // Drag Start
    const titleBar = win.querySelector(".title-bar");
    titleBar.addEventListener("mousedown", (e) => {
      if (
        e.target.classList.contains("sys-box") ||
        e.target.classList.contains("win-btn")
      )
        return;
      this.startDrag(e, win);
    });
    // Resize Start
    win.querySelectorAll(".resizer").forEach((r) => {
      r.addEventListener("mousedown", (e) =>
        this.startResize(e, win, r.dataset.resize)
      );
    });
    // Focus on click
    win.addEventListener("mousedown", () => this.focusWindow(id));
    return win;
  }
  openWindow(type, title, w, h, initData = null, stateOverrides = {}) {
    const id = stateOverrides.id || "win-" + Date.now();
    let content = "";
    // Generate App Content
    if (type === "progman") content = this.getProgramManagerContent();
    if (type === "notepad") content = this.getNotepadContent(initData);
    if (type === "write") content = this.getWriteContent(initData);
    if (type === "cardfile") content = this.getCardfileContent();
    if (type === "calc") content = this.getCalcContent();
    if (type === "mines") content = this.getMinesContent();
    if (type === "solitaire") content = this.getSolitaireContent();
    if (type === "reversi") content = this.getReversiContent();
    if (type === "photoshop") content = this.getPhotoshopContent();
    if (type === "artist") content = this.getArtistContent();
    if (type === "compiler") content = this.getCompilerContent();
    if (type === "python") content = this.getPythonContent();
    if (type === "console") content = this.getConsoleContent();
    if (type === "taskman") content = this.getTaskManContent();
    if (type === "chess") content = this.getChessContent();
    if (type === "paint") content = this.getPaintContent();
    if (type === "mplayer") content = this.getMediaPlayerContent();
    if (type === "simcity") content = this.getSimCityContent();
    if (type === "skifree") content = this.getSkiFreeContent();
    if (type === "linerider") content = this.getLineRiderContent();
    if (type === "database") content = this.getDatabaseContent();
    if (type === "soundrec") content = this.getSoundRecContent();
    if (type === "radio") content = this.getRadioContent();
    if (type === "beatmaker") content = this.getBeatMakerContent();
    if (type === "charmap") content = this.getCharMapContent();
    if (type === "winfile") content = this.getWinFileContent();
    if (type === "clock") content = this.getClockContent();
    if (type === "control") content = this.getControlPanelContent();
    if (type === "clipbrd") content = this.getClipboardContent();
    if (type === "readme") content = this.getReadmeContent();
    if (type === "pdfreader") content = this.getPdfReaderContent(initData);
    if (type === "imageviewer") content = this.getImageViewerContent(initData);
    if (type === "markdown") content = this.getMarkdownContent(initData);
    if (type === "rss") content = this.getRssReaderContent();
    if (type === "browser") content = this.getBrowserContent();
    if (type === "radiogarden") content = this.getRadioGardenContent();
    if (type === "discord") content = this.getDiscordContent();
    if (type === "irc") content = this.getIRCContent();
    if (type === "doom") content = this.getDoomContent();
    if (type === "papers") content = this.getPapersContent();
    if (type === "hexedit") content = this.getHexEditorContent();
    const winEl = this.createWindowDOM(id, title, w, h, content, stateOverrides);
    this.desktop.appendChild(winEl);
    const winObj = {
      id,
      el: winEl,
      type,
      title,
      minimized: false,
      maximized: false,
      prevRect: stateOverrides.prevRect || null
    };
    if (stateOverrides.zIndex) {
      winEl.style.zIndex = stateOverrides.zIndex;
      this.highestZ = Math.max(this.highestZ, stateOverrides.zIndex);
    }
    this.windows.push(winObj);
    // Register Process
    kernel.registerProcess(id, title);
    if (!this.isRestoring) this.focusWindow(id);
    // Initialize app logic if needed
    if (type === "mines") initMinesweeper(winEl);
    if (type === "solitaire") initSolitaire(winEl);
    if (type === "reversi") initReversi(winEl);
    if (type === "paint") initPaint(winEl);
    if (type === "photoshop") initPhotoshop(winEl);
    if (type === "artist") initArtist(winEl);
    if (type === "mplayer") initMediaPlayer(winEl);
    if (type === "simcity") initSimCity(winEl);
    if (type === "skifree") initSkiFree(winEl);
    if (type === "linerider") initLineRider(winEl);
    if (type === "database") initDatabase(winEl);
    if (type === "soundrec") initSoundRecorder(winEl);
    if (type === "radio") initRadio(winEl);
    if (type === "beatmaker") initBeatMaker(winEl);
    if (type === "charmap") initCharMap(winEl);
    if (type === "winfile") initFileManager(winEl);
    if (type === "clock") initClock(winEl);
    if (type === "control") initControlPanel(winEl);
    if (type === "chess") initChess(winEl);
    if (type === "console") initConsole(winEl);
    if (type === "write") initWrite(winEl);
    if (type === "cardfile") initCardfile(winEl);
    if (type === "taskman") initTaskMan(winEl, this);
    if (type === "pdfreader") initPdfReader(winEl, initData);
    if (type === "imageviewer") initImageViewer(winEl, initData);
    if (type === "markdown") initMarkdownViewer(winEl, initData);
    if (type === "rss") initRssReader(winEl);
    if (type === "browser") initBrowser(winEl);
    if (type === "radiogarden") initRadioGarden(winEl);
    if (type === "discord") initDiscord(winEl);
    if (type === "irc") initIRC(winEl);
    if (type === "doom") initDoom(winEl);
    if (type === "papers") initPapersPlease(winEl);
    if (type === "hexedit") initHexEditor(winEl);
    // Refresh logic
    refreshAllTaskManagers(this);
    if (stateOverrides.maximized) this.maximizeWindow(id);
    if (stateOverrides.minimized) this.minimizeWindow(id);
    this.saveDesktopState();
    return winObj;
  }
  closeWindow(id) {
    const index = this.windows.findIndex((w) => w.id === id);
    if (index > -1) {
      const closingWin = this.windows[index];
      if (typeof closingWin.el.chessCleanup === "function")
        closingWin.el.chessCleanup();
      if (typeof closingWin.el.skifreeCleanup === "function")
        closingWin.el.skifreeCleanup();
      if (typeof closingWin.el.lineRiderCleanup === "function")
        closingWin.el.lineRiderCleanup();
      if (typeof closingWin.el.ircCleanup === "function") closingWin.el.ircCleanup();
      if (closingWin.el.doomCI) {
        closingWin.el.doomCI.exit();
        closingWin.el.doomCI = null;
      }
      closingWin.el.remove();
      // Remove minimized icon if exists
      const minIcon = document.getElementById("min-" + id);
      if (minIcon) minIcon.remove();
      this.windows.splice(index, 1);
      delete browserSessions[id];
      // Kill Process
      kernel.unregisterProcess(id);
      refreshAllTaskManagers(this);
      this.saveDesktopState();
    }
  }
  minimizeWindow(id) {
    const win = this.windows.find((w) => w.id === id);
    if (!win) return;
    if (win.minimized) return;
    win.el.style.display = "none";
    win.minimized = true;
    // Create Icon at bottom
    const existing = document.getElementById("min-" + id);
    if (existing) existing.remove();
    const icon = document.createElement("div");
    icon.id = "min-" + id;
    icon.className = "desktop-icon minimized";
    icon.innerHTML = `
                <div class="icon-img">${this.getIconForType(win.type)}</div>
                <div class="icon-label">${
                  win.el.querySelector(".title-bar-text").innerText
                }</div>
            `;
    icon.onclick = () => this.restoreWindow(id);
    this.minimizedContainer.appendChild(icon);
    this.saveDesktopState();
  }
  restoreWindow(id) {
    const win = this.windows.find((w) => w.id === id);
    if (!win) return;
    win.el.style.display = "flex";
    win.minimized = false;
    const minIcon = document.getElementById("min-" + id);
    if (minIcon) minIcon.remove();
    this.focusWindow(id);
    this.saveDesktopState();
  }
  maximizeWindow(id) {
    const win = this.windows.find((w) => w.id === id);
    if (!win) return;
    if (!win.maximized) {
      win.prevRect =
        win.prevRect || {
          top: win.el.style.top,
          left: win.el.style.left,
          width: win.el.style.width,
          height: win.el.style.height
        };
      win.el.style.top = "0";
      win.el.style.left = "0";
      win.el.style.width = "100%";
      win.el.style.height = "100%";
      win.maximized = true;
    } else {
      win.el.style.top = win.prevRect.top;
      win.el.style.left = win.prevRect.left;
      win.el.style.width = win.prevRect.width;
      win.el.style.height = win.prevRect.height;
      win.maximized = false;
    }
    this.focusWindow(id);
    this.saveDesktopState();
  }
  focusWindow(id) {
    if (this.isRestoring) {
      this.windows.forEach((w) =>
        w.el.classList.toggle("active", w.id === id)
      );
      return;
    }
    this.highestZ++;
    this.windows.forEach((w) => {
      if (w.id === id) {
        w.el.style.zIndex = this.highestZ;
        w.el.classList.add("active");
      } else {
        w.el.classList.remove("active");
      }
    });
    this.saveDesktopState();
  }
  // Drag Logic
  startDrag(e, winEl) {
    if (e.target.closest(".win-btn") || e.target.closest(".sys-box")) return;
    this.dragState.isDragging = true;
    this.dragState.currentWin = winEl;
    this.dragState.initialX = e.clientX;
    this.dragState.initialY = e.clientY;
    const rect = winEl.getBoundingClientRect();
    this.dragState.offX = winEl.offsetLeft;
    this.dragState.offY = winEl.offsetTop;
    this.focusWindow(winEl.dataset.id);
  }
  onDrag(e) {
    if (!this.dragState.isDragging) return;
    const dx = e.clientX - this.dragState.initialX;
    const dy = e.clientY - this.dragState.initialY;
    this.dragState.currentWin.style.left = this.dragState.offX + dx + "px";
    this.dragState.currentWin.style.top = this.dragState.offY + dy + "px";
  }
  endDrag() {
    this.dragState.isDragging = false;
    this.dragState.currentWin = null;
    this.saveDesktopState();
  }
  // Resize Logic
  startResize(e, winEl, type) {
    e.stopPropagation();
    e.preventDefault();
    this.resizeState.isResizing = true;
    this.resizeState.currentWin = winEl;
    this.resizeState.handleType = type;
    this.resizeState.initialX = e.clientX;
    this.resizeState.initialY = e.clientY;
    const rect = winEl.getBoundingClientRect();
    this.resizeState.initialW = rect.width;
    this.resizeState.initialH = rect.height;
    this.resizeState.initialL = rect.left;
    this.resizeState.initialT = rect.top;
    this.focusWindow(winEl.dataset.id);
  }
  onResize(e) {
    if (!this.resizeState.isResizing) return;
    const dx = e.clientX - this.resizeState.initialX;
    const dy = e.clientY - this.resizeState.initialY;
    const type = this.resizeState.handleType;
    const win = this.resizeState.currentWin;
    let newW = this.resizeState.initialW;
    let newH = this.resizeState.initialH;
    let newL = this.resizeState.initialL;
    let newT = this.resizeState.initialT;
    if (type.includes("e")) newW += dx;
    if (type.includes("s")) newH += dy;
    if (type.includes("w")) {
      newW -= dx;
      newL += dx;
    }
    if (type.includes("n")) {
      newH -= dy;
      newT += dy;
    }
    if (newW > 100) {
      win.style.width = newW + "px";
      win.style.left = newL + "px";
    }
    if (newH > 100) {
      win.style.height = newH + "px";
      win.style.top = newT + "px";
    }
  }
  endResize() {
    this.resizeState.isResizing = false;
    this.resizeState.currentWin = null;
    this.saveDesktopState();
  }
  restoreWindows(windowsState = []) {
    windowsState.forEach((winState) => {
      const defaults = PROGRAMS.find((p) => p.type === winState.type);
      const width = winState.width || defaults?.width || 500;
      const height = winState.height || defaults?.height || 400;
      this.openWindow(
        winState.type || "progman",
        winState.title || defaults?.title || "Window",
        width,
        height,
        null,
        {
          id: winState.id,
          left: winState.left,
          top: winState.top,
          width,
          height,
          maximized: winState.maximized,
          minimized: winState.minimized,
          prevRect: winState.prevRect,
          zIndex: winState.zIndex
        }
      );
    });
  }
  getWindowStateSnapshot() {
    return this.windows.map((w) => ({
      id: w.id,
      type: w.type,
      title: w.title,
      left: w.el.style.left,
      top: w.el.style.top,
      width: w.el.style.width,
      height: w.el.style.height,
      minimized: w.minimized,
      maximized: w.maximized,
      prevRect: w.prevRect,
      zIndex: parseInt(w.el.style.zIndex || `${this.highestZ}`, 10)
    }));
  }
  getTopWindowByZ() {
    if (this.windows.length === 0) return null;
    return this.windows.reduce((top, current) => {
      const currentZ = parseInt(current.el.style.zIndex || "0", 10);
      const topZ = parseInt(top.el.style.zIndex || "0", 10);
      return currentZ >= topZ ? current : top;
    });
  }
  saveDesktopState() {
    if (this.isRestoring) return;
    const state = {
      windows: this.getWindowStateSnapshot(),
      wallpaper: wallpaperSettings
    };
    persistDesktopState(state);
  }
  // Helper: Icons
  getIconForType(type) {
    return ICONS[type] || ICONS["help"];
  }
  // Content Generators
  getProgramManagerContent() {
    const programIcons = PROGRAMS.map(
      (prog) => `
                    <div class="prog-icon" onclick="wm.openWindow('${prog.type}', '${prog.title}', ${prog.width}, ${prog.height})">
                        ${ICONS[prog.icon] || ICONS.help}
                        <div class="prog-label">${prog.label}</div>
                    </div>`
    ).join("");
    return `
                <div class="prog-man-grid">
                    ${programIcons}
                </div>
            `;
  }
  getPapersContent() {
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
  getSimCityContent() {
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
  getSkiFreeContent() {
    return `
                <div class="skifree-layout" tabindex="0">
                    <div class="skifree-hud">
                        <div class="skifree-stat">Score: <span class="skifree-score">0</span></div>
                        <div class="skifree-stat">Speed: <span class="skifree-speed">0</span></div>
                        <div class="skifree-status">Ready to ski</div>
                        <button class="task-btn skifree-reset">Restart</button>
                    </div>
                    <canvas class="skifree-canvas" width="320" height="360"></canvas>
                    <div class="skifree-help">Use ← → to steer, ↑ to jump, ↓ to slow down. Avoid trees and rocks!</div>
                </div>
            `;
  }
  getLineRiderContent() {
    return `
                <div class="linerider-layout">
                    <div class="linerider-toolbar">
                        <div class="linerider-group">
                            <button class="task-btn linerider-mode active" data-mode="draw" title="Draw segments">Draw</button>
                            <button class="task-btn linerider-mode" data-mode="erase" title="Erase segments">Erase</button>
                        </div>
                        <div class="linerider-group">
                            <button class="task-btn linerider-play">Ride</button>
                            <button class="task-btn linerider-reset">Reset Sled</button>
                            <button class="task-btn linerider-clear">Clear Lines</button>
                        </div>
                    </div>
                    <canvas class="linerider-canvas" width="560" height="360"></canvas>
                    <div class="linerider-status">Draw ramps with your mouse, then hit Ride!</div>
                </div>
            `;
  }
  getRssReaderContent() {
    const presetOptions = RSS_PRESETS.map(
      (p) => `<option value="${p.url}">${p.label}</option>`
    ).join("");
    return `
              <div class="rss-layout">
                <div class="rss-toolbar">
                  <label class="rss-label">Feed:</label>
                  <input class="rss-url" type="text" value="${RSS_PRESETS[0].url}" spellcheck="false" placeholder="https://example.com/feed.xml">
                  <select class="rss-preset" title="Popular feeds">${presetOptions}</select>
                  <button class="task-btn rss-load">Load</button>
                  <span class="rss-status">Ready</span>
                </div>
                <div class="rss-body">
                  <div class="rss-list" aria-label="Feed items"></div>
                  <div class="rss-preview">
                    <div class="rss-preview-title">Choose an item to preview</div>
                    <div class="rss-preview-meta"></div>
                    <div class="rss-preview-text"></div>
                    <a class="rss-preview-link" href="#" target="_blank" rel="noreferrer noopener">Open original</a>
                  </div>
                </div>
              </div>
            `;
  }
  getBrowserContent() {
    return `<div class="browser-layout">
              <div class="browser-toolbar">
                <button class="browser-btn" data-action="back" title="Back">◀</button>
                <button class="browser-btn" data-action="forward" title="Forward">▶</button>
                <button class="browser-btn" data-action="refresh" title="Refresh">⟳</button>
                <button class="browser-btn" data-action="home" title="Home">⌂</button>
                <input class="browser-url" type="text" placeholder="https://example.com" spellcheck="false">
                <button class="browser-btn go-btn" data-action="go">Go</button>
              </div>
              <div class="browser-view">
                <iframe class="browser-frame" src="about:blank" sandbox="allow-scripts allow-forms allow-pointer-lock allow-popups"></iframe>
                <div class="browser-status">Enter a URL to begin browsing.</div>
              </div>
            </div>`;
  }
  getRadioGardenContent() {
    return `<div class="radio-garden">
              <div class="radio-header">
                <div>
                  <div class="radio-title">Radio Garden</div>
                  <div class="radio-subtitle">Search the globe and jump to a live station.</div>
                </div>
                <button class="task-btn radio-open-site">Open radio.garden</button>
              </div>
              <div class="radio-search-row">
                <input class="radio-search-input" type="text" placeholder="Search by city, country, or station name" spellcheck="false">
                <button class="task-btn radio-search-btn">Search</button>
              </div>
              <div class="radio-quick-row">
                <span class="radio-quick-label">Quick picks:</span>
                <div class="radio-quick-list">
                  <button class="radio-chip" data-query="Tokyo">Tokyo</button>
                  <button class="radio-chip" data-query="London">London</button>
                  <button class="radio-chip" data-query="São Paulo">São Paulo</button>
                  <button class="radio-chip" data-query="Sydney">Sydney</button>
                  <button class="radio-chip" data-query="Lagos">Lagos</button>
                </div>
              </div>
              <div class="radio-status">Type a query to load stations via the Radio Garden directory.</div>
              <div class="radio-results" role="list"></div>
            </div>`;
  }
  getIRCContent() {
    return `<div class="irc-layout">
              <div class="irc-header">
                <div class="irc-field">
                  <label>Server</label>
                  <input type="text" class="irc-server" value="irc.oriel.local" spellcheck="false">
                </div>
                <div class="irc-field">
                  <label>Nick</label>
                  <input type="text" class="irc-nick" value="guest" spellcheck="false">
                </div>
                <div class="irc-field">
                  <label>Channel</label>
                  <input type="text" class="irc-channel" value="#oriel" spellcheck="false">
                </div>
                <div class="irc-actions">
                  <button class="task-btn irc-connect">Connect</button>
                  <button class="task-btn irc-join" disabled>Join</button>
                </div>
              </div>
              <div class="irc-body">
                <div class="irc-log" aria-live="polite"></div>
                <div class="irc-sidebar">
                  <div class="irc-sidebar-header">Users</div>
                  <div class="irc-users"></div>
                </div>
              </div>
              <div class="irc-input-row">
                <input type="text" class="irc-input" placeholder="Type a message and hit Enter" spellcheck="false" disabled>
                <button class="task-btn irc-send" disabled>Send</button>
              </div>
            </div>`;
  }
  getDiscordContent() {
    return `<div class="discord-layout">
              <div class="discord-header">
                <div class="discord-field">
                  <label>Bot/User Token</label>
                  <input type="password" class="discord-token" placeholder="Bot or user token" spellcheck="false">
                </div>
                <div class="discord-field">
                  <label>Channel ID</label>
                  <input type="text" class="discord-channel" placeholder="000000000000000000" spellcheck="false">
                </div>
                <div class="discord-actions">
                  <button class="task-btn discord-fetch">Fetch Messages</button>
                  <button class="task-btn discord-clear">Clear</button>
                </div>
              </div>
              <div class="discord-status" aria-live="polite">Provide a token with access to the channel and fetch messages.</div>
              <div class="discord-body">
                <div class="discord-log" aria-label="Message log"></div>
                <div class="discord-compose">
                  <textarea class="discord-message" placeholder="Write a message" spellcheck="false"></textarea>
                  <div class="discord-compose-actions">
                    <button class="task-btn discord-send">Send</button>
                    <span class="discord-help">Uses Discord's REST API. Tokens are only stored in-memory.</span>
                  </div>
                </div>
              </div>
            </div>`;
  }
  getRadioContent() {
    return `<div class="radio-layout">
              <div class="radio-toolbar">
                <div class="radio-search">
                  <input type="text" class="radio-query" placeholder="Search stations or genres..." spellcheck="false" />
                  <button class="task-btn radio-search-btn">Search</button>
                  <button class="task-btn radio-top-btn" title="Load popular stations">Top</button>
                </div>
                <div class="radio-status">Find and play live internet radio via the free Radio Browser API.</div>
              </div>
              <div class="radio-body">
                <div class="radio-list" role="listbox" aria-label="Radio stations"></div>
                <div class="radio-player">
                  <div class="radio-now">No station selected.</div>
                  <audio class="radio-audio" controls></audio>
                  <div class="radio-actions">
                    <button class="task-btn radio-play">Play</button>
                    <button class="task-btn radio-stop">Stop</button>
                  </div>
                  <div class="radio-meta">Use search or Top to load stations.</div>
                </div>
              </div>
            </div>`;
  }
  getDoomContent() {
    return `
      <div style="width:100%;height:100%;background:black;display:flex;justify-content:center;align-items:center;">
        <canvas id="doom-container" style="width:640px;height:400px;background:#111;"></canvas>
      </div>
    `;
  }
  getTaskManContent() {
    return `
                <div class="task-mgr-layout">
                    <div class="task-list" id="task-list">
                        <!-- Populated by JS -->
                    </div>
                    <div class="task-btns">
                        <button class="task-btn" onclick="switchTask(event)">Switch To</button>
                        <button class="task-btn" onclick="endTask(event)">End Task</button>
                        <button class="task-btn" onclick="wm.closeWindow(this.closest('.window').dataset.id)">Cancel</button>
                    </div>
                    <div style="font-weight:bold; border-bottom:1px solid gray; margin-bottom:2px;">System Monitor:</div>
                    <div class="task-queue-view" id="task-queue-view">
                        <!-- Queue Data -->
                    </div>
                </div>
            `;
  }
  // ... [Previous Content Methods] ...
  getReversiContent() {
    return `<div class="reversi-layout"><div class="reversi-status">Your Turn (Red)</div><div class="reversi-board" id="reversi-board"></div></div>`;
  }
  getChessContent() {
    return `<div class="chess-layout"><div class="chess-board" aria-label="Chessboard"></div><div class="chess-sidebar"><div class="chess-status">Loading chess engine...</div><div class="chess-controls"><button class="task-btn chess-new">New Game</button><button class="task-btn chess-copy">Copy FEN</button><button class="task-btn chess-paste">Paste FEN</button><button class="task-btn chess-load">Load FEN</button><input type="text" id="chess-fen" class="chess-fen" spellcheck="false" title="Current FEN"></div><div class="chess-moves" aria-label="Move list"></div></div></div>`;
  }
  getMediaPlayerContent() {
    return `<div class="mplayer-layout"><div class="mplayer-screen"><video class="mplayer-video" playsinline></video><canvas id="mplayer-canvas" width="300" height="150"></canvas><div class="mplayer-overlay"><div class="mplayer-track-label">Track: <span class="mplayer-track-name">Loading…</span></div><div class="mplayer-seek-row"><span class="mplayer-time mplayer-current">0:00</span><input type="range" class="mplayer-seek" min="0" max="100" value="0" aria-label="Seek"><span class="mplayer-time mplayer-duration">0:00</span></div></div></div><div class="mplayer-controls"><select class="mplayer-track-select" aria-label="Choose track"></select><div class="mplayer-btn" onclick="toggleMedia(this, 'play')">▶</div><div class="mplayer-btn" onclick="toggleMedia(this, 'pause')">||</div><div class="mplayer-btn" onclick="toggleMedia(this, 'stop')">■</div><label class="mplayer-load-btn">Open<input class="mplayer-file-input" type="file" accept="audio/*,video/*" multiple></label></div><div class="mplayer-status"><span class="mplayer-file-name">Load mp3 or video files from your computer to play them here.</span></div></div>`;
  }
  getSolitaireContent() {
    return `<div class="sol-layout"><div class="sol-top"><div class="sol-deck-area"><div class="card-ph" id="sol-stock"></div><div class="card-ph" id="sol-waste"></div></div><div class="sol-foundations"><div class="card-ph" data-suit="h" id="sol-f-h"></div><div class="card-ph" data-suit="d" id="sol-f-d"></div><div class="card-ph" data-suit="c" id="sol-f-c"></div><div class="card-ph" data-suit="s" id="sol-f-s"></div></div></div><div class="sol-tableau" id="sol-tableau"></div></div>`;
  }
  getClipboardContent() {
    return `<textarea class="clip-area" readonly placeholder="(Clipboard is empty)"></textarea>`;
  }
  getWriteContent(txt) {
    return `<div class="write-layout"><div class="write-toolbar"><select class="write-select write-font" title="Font Family"><option value="Times New Roman">Times New Roman</option><option value="Arial">Arial</option><option value="Courier New">Courier New</option><option value="Georgia">Georgia</option><option value="Verdana">Verdana</option></select><select class="write-select write-size" title="Font Size"><option value="2">10</option><option value="3">12</option><option value="4" selected>14</option><option value="5">18</option><option value="6">24</option><option value="7">32</option></select><button class="fmt-btn" data-cmd="bold" title="Bold">B</button><button class="fmt-btn" data-cmd="italic" title="Italic">I</button><button class="fmt-btn" data-cmd="underline" title="Underline">U</button></div><div class="write-editor" contenteditable="true" spellcheck="false">${
      txt || "Welcome to Oriel Write."
    }</div></div>`;
  }
  getCardfileContent() {
    return `<div class="cardfile-layout"><div class="cardfile-menu"><button class="task-btn" id="card-add-btn">Add</button><button class="task-btn" id="card-del-btn">Delete</button></div><div class="card-container"><div class="card-index-list" id="card-index-list"></div><div class="card-body-view"><div class="card-header-bar" id="card-header-display"></div><textarea class="card-content-area" id="card-content-edit"></textarea></div></div></div>`;
  }
  getWinFileContent() {
    return `<div class="winfile-layout"><div class="drive-bar"><div class="drive-icon active">a:</div><div class="drive-icon active">c:</div><div class="drive-icon active">d:</div><div style="flex-grow:1; text-align:right; font-size:12px;display:flex;align-items:center;justify-content:flex-end;gap:5px;"><input type="text" id="new-folder-name" style="width:80px;height:18px;font-size:11px;" placeholder="Folder Name"><button class="task-btn" onclick="createFolder(this)" style="height:20px;font-size:11px;padding:0 4px;">New Dir</button><span>C:\\</span></div></div><div class="winfile-main"><div class="winfile-pane winfile-tree"><div class="winfile-pane-header">C:\\</div><div id="file-tree-root"></div></div><div class="winfile-pane winfile-list"><div class="winfile-pane-header" id="file-list-header">C:\\*.*</div><div class="file-list-view" id="file-list-view"></div></div></div><div class="status-bar" style="border-top:1px solid gray; padding:2px; font-size:12px;">Selected 1 file(s) (0 bytes)</div></div>`;
  }
  getSoundRecContent() {
    return `<div class="sound-rec-layout"><div class="sound-vis"><canvas class="sound-wave-canvas" width="246" height="56"></canvas></div><div class="sound-controls"><div class="media-btn" id="btn-rec" title="Record"><div class="symbol-rec"></div></div><div class="media-btn" id="btn-stop" title="Stop"><div class="symbol-stop"></div></div><div class="media-btn" id="btn-play" title="Play"><div class="symbol-play"></div></div></div><div style="margin-top:5px; font-size:12px;" id="sound-status">Ready</div></div>`;
  }
  getBeatMakerContent() {
    const steps = Array.from({ length: 16 }, (_, i) =>
      `<div class="daw-step" data-step="${i}" title="Step ${i + 1}"></div>`
    ).join("");
    const row = (id, label) =>
      `<div class="daw-row" data-track="${id}"><div class="daw-row-label">${label}</div><div class="daw-step-row">${steps}</div></div>`;

    return `<div class="daw-layout">
              <div class="daw-toolbar">
                <div class="daw-transport">
                  <button class="task-btn" id="daw-play">Play</button>
                  <button class="task-btn" id="daw-stop">Stop</button>
                </div>
                <div class="daw-tempo">
                  <label for="daw-tempo">Tempo</label>
                  <input type="range" id="daw-tempo" min="60" max="180" value="110">
                  <span id="daw-tempo-val">110</span> BPM
                </div>
                <div class="daw-tools">
                  <button class="task-btn" id="daw-random">Humanize</button>
                  <button class="task-btn" id="daw-clear">Clear</button>
                </div>
              </div>
              <div class="daw-grid">
                ${row("kick", "Kick")}
                ${row("snare", "Snare")}
                ${row("hihat", "Hi-Hat")}
                ${row("clap", "Clap")}
              </div>
              <div class="daw-status" id="daw-status">Ready to lay down a beat.</div>
            </div>`;
  }
  getCharMapContent() {
    return `<div class="char-map-layout">
              <div class="char-map-toolbar">
                <div class="char-preview" aria-live="polite">A</div>
                <div class="char-meta">
                  <div class="char-code" id="char-code-label">U+0041 · Dec 65</div>
                  <div class="char-font-row">
                    <label for="char-font-select">Font:</label>
                    <select class="char-font" id="char-font-select">
                      <option value="'Times New Roman', serif">Times New Roman</option>
                      <option value="'Arial', sans-serif">Arial</option>
                      <option value="'Courier New', monospace">Courier New</option>
                      <option value="'Segoe UI Symbol', 'Noto Sans Symbols', sans-serif">Symbols</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="char-grid" id="char-grid"></div>
              <div class="char-controls">
                <label>Characters to copy:</label>
                <div class="copy-row">
                  <input type="text" class="char-input" id="char-copy-input" readonly>
                  <button class="task-btn" onclick="copyCharMap(this)" style="width:60px">Copy</button>
                </div>
                <button class="task-btn" onclick="document.getElementById('char-copy-input').value = ''">Clear</button>
              </div>
            </div>`;
  }
  getClockContent() {
    return `<div class="clock-layout" title="Double click to toggle mode"><canvas class="clock-canvas" width="200" height="200"></canvas><div class="clock-digital" style="display:none">12:00</div></div>`;
  }
  getControlPanelContent() {
    return `<div class="control-layout" id="cp-main"><div class="control-icon" onclick="openCPColor(this)">${ICONS.cp_color}<div class="control-label">Color</div></div><div class="control-icon" onclick="openCPDesktop(this)">${ICONS.desktop_cp}<div class="control-label">Desktop</div></div><div class="control-icon" onclick="openCPScreensaver(this)">${ICONS.screensaver}<div class="control-label">Screensaver</div></div><div class="control-icon" onclick="openCPSound(this)">${ICONS.volume}<div class="control-label">Sound</div></div><div class="control-icon" onclick="openCPFonts(this)"><svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="8" width="24" height="16" fill="none" stroke="black"/><text x="16" y="20" font-family="serif" font-size="10" text-anchor="middle">ABC</text></svg><div class="control-label">Fonts</div></div><div class="control-icon"><svg viewBox="0 0 32 32" class="svg-icon"><rect x="10" y="6" width="12" height="20" fill="none" stroke="black"/><circle cx="16" cy="12" r="2" fill="black"/></svg><div class="control-label">Mouse</div></div><div class="control-icon"><svg viewBox="0 0 32 32" class="svg-icon"><rect x="2" y="10" width="28" height="12" fill="none" stroke="black"/></svg><div class="control-label">Keyboard</div></div></div>`;
  }
  getNotepadContent(txt) {
    return `<textarea class="notepad-area" spellcheck="false">${
      txt || "Welcome to Oriel 1.0!"
    }</textarea>`;
  }
  getCompilerContent() {
    return `<div class="compiler-layout"><div class="compiler-toolbar"><button class="compiler-btn" onclick="runCompiler(event)">RUN</button></div><textarea class="compiler-editor" spellcheck="false">#include <stdio.h>\n\nint main() {\n    printf("Hello from C!");\n    return 0;\n}</textarea><div class="compiler-output" id="compiler-out"></div></div>`;
  }
  getPythonContent() {
    return `<div class="compiler-layout"><div class="compiler-toolbar"><button class="compiler-btn" onclick="runPython(event)">RUN</button></div><textarea class="compiler-editor" spellcheck="false">print("Hello Python!")\nfor i in range(3):\n    print(i)</textarea><div class="compiler-output" id="python-out"></div></div>`;
  }
  getConsoleContent() {
    return `<div class="console" onclick="document.querySelector('.window.active .console-input')?.focus()"><div>Egg Oriel 1.0</div><br><div class="console-output"></div><div class="console-line"><span>C:\\></span><input type="text" class="console-input" onkeydown="handleConsoleKey(event)" autocomplete="off"></div></div>`;
  }
  getMinesContent() {
    return `<div style="background:#c0c0c0; height:100%; display:flex; flex-direction:column; align-items:center;"><div class="mines-bar" style="width:200px"><div class="mines-lcd" id="mines-count">010</div><div class="mines-face" id="mines-face" onclick="resetMines()">:)</div><div class="mines-lcd" id="mines-timer">000</div></div><div class="mines-grid" id="mines-grid"></div></div>`;
  }
  getReadmeContent() {
    return `<div style="padding:15px; font-family:'Times New Roman', serif;"><h2>Welcome to Web 3.1</h2><p>Features: Solitaire, Reversi, Media Player, Clock, etc.</p></div>`;
  }
  getPdfReaderContent(initData) {
    const src = initData?.src || DEFAULT_PDF_DATA_URI;
    const name = initData?.name || "Sample.pdf";
    return `<div class="pdf-reader">
                <div class="pdf-toolbar">
                    <label class="task-btn file-btn">Open File<input type="file" accept="application/pdf" class="pdf-file-input"></label>
                    <input type="text" class="pdf-url-input" placeholder="Paste PDF URL and click Load" value="">
                    <button class="task-btn pdf-load-btn">Load</button>
                    <div class="pdf-status">Loaded ${name}</div>
                </div>
                <div class="pdf-viewer">
                    <iframe class="pdf-frame" src="${src}" title="PDF Viewer"></iframe>
                </div>
            </div>`;
  }
  getImageViewerContent(initData) {
    const name = initData?.name || "";
    const src = initData?.src || "";
    return `<div class="img-viewer">
                <div class="img-toolbar">
                    <label class="task-btn file-btn">Open Image<input type="file" accept="image/*" class="img-file-input"></label>
                    <input type="text" class="img-url-input" placeholder="Paste image URL and click Load" value="${src ? src : ""}">
                    <button class="task-btn img-load-btn">Load</button>
                    <div class="img-status">${src ? `Loaded ${name || "image"}` : "No image loaded"}</div>
                </div>
                <div class="img-display">
                    <div class="img-placeholder" ${src ? "style=\"display:none\"" : ""}>Drop an image or click Open</div>
                    <img class="img-preview" ${src ? `src="${src}"` : "style=\"display:none\""} alt="${name || "Image preview"}">
                </div>
            </div>`;
  }
  getMarkdownContent(initData) {
    const initialText = typeof initData === "string" ? initData : initData || DEFAULT_MD_SAMPLE;
    return `<div class="md-viewer">
                <div class="md-toolbar">
                    <label class="task-btn file-btn">Open .md<input type="file" accept=".md,text/markdown" class="md-file-input"></label>
                    <button class="task-btn md-sample-btn">Sample</button>
                    <div class="md-status">Ready</div>
                </div>
                <div class="md-body">
                    <textarea class="md-input" spellcheck="false" placeholder="Paste Markdown here">${initialText}</textarea>
                    <div class="md-preview" aria-live="polite"></div>
                </div>
            </div>`;
  }
  getHexEditorContent() {
    return `<div class="hex-layout">
                <div class="hex-toolbar">
                    <button class="task-btn hex-new">New</button>
                    <label class="task-btn file-btn">Open File<input type="file" class="hex-file" accept="*/*"></label>
                    <button class="task-btn hex-parse">Parse Hex</button>
                    <button class="task-btn hex-from-ascii">From ASCII</button>
                    <div class="hex-status">Ready</div>
                </div>
                <div class="hex-body">
                    <textarea class="hex-offsets" readonly aria-label="Offsets"></textarea>
                    <textarea class="hex-area" spellcheck="false" aria-label="Hex bytes"></textarea>
                    <textarea class="hex-ascii" spellcheck="false" aria-label="ASCII view"></textarea>
                </div>
                <div class="hex-footer">
                    <div class="hex-summary">0 bytes</div>
                    <div class="hex-hint">Edit hex pairs, then click Parse Hex to refresh the ASCII view.</div>
                </div>
            </div>`;
  }
  getCalcContent() {
    return `<div class="calc-grid"><div class="calc-display" id="calc-disp" data-val="0">0</div><div class="calc-btn" onclick="calcInput(event, 'C')">C</div><div class="calc-btn" onclick="calcInput(event, '/')">/</div><div class="calc-btn" onclick="calcInput(event, '*')">*</div><div class="calc-btn" onclick="calcInput(event, '-')">-</div><div class="calc-btn" onclick="calcInput(event, '7')">7</div><div class="calc-btn" onclick="calcInput(event, '8')">8</div><div class="calc-btn" onclick="calcInput(event, '9')">9</div><div class="calc-btn op" onclick="calcInput(event, '+')">+</div><div class="calc-btn" onclick="calcInput(event, '4')">4</div><div class="calc-btn" onclick="calcInput(event, '5')">5</div><div class="calc-btn" onclick="calcInput(event, '6')">6</div><div class="calc-btn op" style="grid-row:span 2" onclick="calcInput(event, '=')">=</div><div class="calc-btn" onclick="calcInput(event, '1')">1</div><div class="calc-btn" onclick="calcInput(event, '2')">2</div><div class="calc-btn" onclick="calcInput(event, '3')">3</div><div class="calc-btn" style="grid-column: span 2" onclick="calcInput(event, '0')">0</div><div class="calc-btn" onclick="calcInput(event, '.')">.</div></div>`;
  }
  getTaskManContent() {
    return `<div class="task-mgr-layout"><div class="task-list" id="task-list"></div><div class="task-btns"><button class="task-btn" onclick="switchTask(event)">Switch To</button><button class="task-btn" onclick="endTask(event)">End Task</button><button class="task-btn" onclick="wm.closeWindow(this.closest('.window').dataset.id)">Cancel</button></div><div style="font-weight:bold; border-bottom:1px solid gray; margin-bottom:2px;">System Monitor:</div><div class="task-queue-view" id="task-queue-view"></div></div>`;
  }
  getPaintContent() {
    return `<div class="paint-layout"><div class="paint-main"><div class="paint-tools"><div class="tool-btn active" data-tool="brush" onclick="selectPaintTool(this, 'brush')">✎</div><div class="tool-btn" data-tool="eraser" onclick="selectPaintTool(this, 'eraser')">E</div><div class="tool-btn" style="color:red; font-size:12px;" onclick="clearPaint(this)">CLR</div></div><div class="paint-canvas-container"><canvas class="paint-canvas" width="600" height="400"></canvas></div></div><div class="paint-palette" id="paint-palette"></div></div>`;
  }
  getArtistContent() {
    const defaultPrompt = "retro desktop art of a cozy computer lab";
    return `
                <div class="artist-app">
                    <div class="artist-toolbar">
                        <input class="artist-prompt" type="text" value="${defaultPrompt}" placeholder="Describe the image you want" spellcheck="false" />
                        <button class="task-btn artist-generate">Generate</button>
                        <span class="artist-status">Enter a prompt and click Generate.</span>
                    </div>
                    <div class="artist-body">
                        <div class="artist-preview-wrap">
                            <div class="artist-placeholder">Image will appear here</div>
                            <img class="artist-preview" alt="AI generated art" />
                        </div>
                        <div class="artist-hint">Uses the free Pollinations image API. Right-click the result to save it.</div>
                        <a class="artist-link" href="#" target="_blank" rel="noreferrer noopener">Open image directly</a>
                    </div>
                </div>`;
  }
  getPhotoshopContent() {
    return `
                <div class="ps-layout">
                    <div class="ps-topbar">
                        <button class="task-btn" onclick="psTriggerOpen(this)">Open...</button>
                        <button class="task-btn" onclick="psNewDocument(this)">New Canvas</button>
                        <button class="task-btn" onclick="psExport(this)">Export PNG</button>
                        <div class="ps-status">Tool: <span class="ps-tool-label">Brush</span> · Size: <span class="ps-size-label">6px</span></div>
                        <input type="file" class="ps-file-input" accept="image/*" hidden />
                    </div>
                    <div class="ps-body">
                        <div class="ps-toolbar">
                            <button class="ps-tool active" data-tool="brush" onclick="setPsTool(this, 'brush')">Brush</button>
                            <button class="ps-tool" data-tool="eraser" onclick="setPsTool(this, 'eraser')">Eraser</button>
                            <button class="ps-tool" data-tool="fill" onclick="setPsTool(this, 'fill')">Fill</button>
                            <button class="ps-tool" data-tool="rect" onclick="setPsTool(this, 'rect')">Rectangle</button>
                            <button class="ps-tool" data-tool="picker" onclick="setPsTool(this, 'picker')">Eyedropper</button>
                        </div>
                        <div class="ps-canvas-wrap">
                            <canvas class="ps-canvas" width="640" height="420"></canvas>
                        </div>
                        <div class="ps-panel">
                            <div class="ps-panel-group">
                                <label>Primary Color <input type="color" class="ps-color-primary" value="#1d7be3"></label>
                                <label>Secondary <input type="color" class="ps-color-secondary" value="#ffffff"></label>
                                <div class="ps-swatches"></div>
                            </div>
                            <div class="ps-panel-group">
                                <label>Brush Size <input type="range" min="1" max="32" value="6" class="ps-size-slider" /></label>
                                <div class="ps-filter-buttons">
                                    <button class="task-btn" onclick="psApplyFilter(this, 'grayscale')">Grayscale</button>
                                    <button class="task-btn" onclick="psApplyFilter(this, 'invert')">Invert</button>
                                    <button class="task-btn" onclick="psApplyFilter(this, 'contrast')">+ Contrast</button>
                                    <button class="task-btn" onclick="psApplyFilter(this, 'bright')">Brighten</button>
                                </div>
                                <div class="ps-filter-buttons">
                                    <button class="task-btn" onclick="psApplyFilter(this, 'sharpen')">Sharpen</button>
                                    <button class="task-btn" onclick="psApplyFilter(this, 'fade')">Vintage Fade</button>
                                </div>
                            </div>
                            <div class="ps-panel-group">
                                <button class="task-btn" onclick="psFillCanvas(this)">Flood Fill Canvas</button>
                                <div class="ps-hint">Tip: Click the canvas with the Eyedropper to sample colors like Photoshop 1.0.</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
  }
  getDatabaseContent() {
    return `<div class="db-layout"><div class="db-form"><div class="db-input-group"><label>Name</label><input type="text" class="db-input" id="db-name"></div><div class="db-input-group"><label>Phone</label><input type="text" class="db-input" id="db-phone"></div><div class="db-input-group"><label>Email</label><input type="text" class="db-input" id="db-email"></div><button class="task-btn" onclick="addDbRecord(this)">Add Record</button><button class="task-btn" onclick="exportDbToCsv(this)">Save CSV</button></div><div class="db-grid-container"><table class="db-table"><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th style="width:50px">Action</th></tr></thead><tbody id="db-tbody"></tbody></table></div></div>`;
  }
}

const initialDesktopState = loadDesktopState();
applyWallpaperSettings(
  initialDesktopState.wallpaper?.url || "",
  initialDesktopState.wallpaper?.mode || "tile"
);
let wm = null;
function bootDesktop() {
  if (wm) return wm;
  wm = new WindowManager(initialDesktopState);
  window.wm = wm;
  return wm;
}
let saverActive = false;
let idleTime = 0;
const saverCanvas = document.getElementById("saver-canvas");
const sCtx = saverCanvas.getContext("2d");
const screensaverDiv = document.getElementById("screensaver");
const bsodOverlay = document.getElementById("bsod-overlay");
const bsodCodeText = bsodOverlay?.querySelector(".bsod-code");
let screensaverType = "starfield";
let screensaverTimeout = 60;
let lockPassphrase = "";
let requirePassphrase = false;
let unlockPromptVisible = false;
const saverLock = document.getElementById("saver-lock");
const saverPassInput = document.getElementById("saver-pass-input");
const saverLockError = document.getElementById("saver-lock-error");

let stars = [];
const numStars = 500;
let sInterval = null;

let pipes = [];

const pipeDirections = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 }
];

const PIPE_COLORS = ["#4bc0ff", "#ff6b6b", "#50fa7b", "#f1fa8c"];

let matrixDrops = [];
const MATRIX_CHARS = "X01Z=+*".split("");
let matrixFontSize = 16;

let dvdLogo = null;
const DVD_COLORS = ["#ff3864", "#3ae374", "#00b3ff", "#ffc600", "#bd93f9", "#ffffff"];

function isLockEnabled() {
  return requirePassphrase && lockPassphrase.trim().length > 0;
}

function showUnlockPrompt() {
  if (!isLockEnabled()) {
    stopScreensaver();
    return;
  }

  if (unlockPromptVisible) return;
  unlockPromptVisible = true;

  if (saverLock) saverLock.style.display = "flex";
  if (screensaverDiv) screensaverDiv.classList.add("locked");
  if (saverLockError) saverLockError.textContent = "";
  if (saverPassInput) {
    saverPassInput.value = "";
    saverPassInput.focus();
  }
}

function hideUnlockPrompt() {
  unlockPromptVisible = false;
  if (saverLock) saverLock.style.display = "none";
  if (screensaverDiv) screensaverDiv.classList.remove("locked");
  if (saverPassInput) saverPassInput.value = "";
  if (saverLockError) saverLockError.textContent = "";
}

function submitLockPassphrase() {
  if (!isLockEnabled()) {
    stopScreensaver();
    return;
  }

  const attempted = saverPassInput?.value || "";
  if (attempted === lockPassphrase) {
    hideUnlockPrompt();
    stopScreensaver();
  } else if (saverLockError) {
    saverLockError.textContent = "Incorrect passphrase.";
    saverPassInput?.focus();
  }
}

function initScreensaver() {
  saverCanvas.width = window.innerWidth;
  saverCanvas.height = window.innerHeight;
  setupStarfield();
  // Global Listeners
  document.body.addEventListener("mousemove", resetTimer);
  document.body.addEventListener("keydown", resetTimer);
  document.body.addEventListener("mousedown", resetTimer);
  saverPassInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitLockPassphrase();
  });
  // Timer Check
  setInterval(() => {
    idleTime++;
    if (idleTime > screensaverTimeout && !saverActive) startScreensaver();
  }, 1000);
}

function resetTimer() {
  idleTime = 0;
  if (!saverActive) return;
  if (unlockPromptVisible) return;
  if (isLockEnabled()) {
    showUnlockPrompt();
  } else {
    stopScreensaver();
  }
}

function startScreensaver(forceType) {
  const saver = forceType || screensaverType;
  saverActive = true;
  screensaverDiv.style.display = "block";
  saverCanvas.width = window.innerWidth;
  saverCanvas.height = window.innerHeight;
  clearInterval(sInterval);
  hideUnlockPrompt();

  const shouldPrank = !forceType && Math.random() < 0.001;
  if (shouldPrank) {
    showFakeBsod();
    return;
  }

  hideFakeBsod();
  if (saver === "pipes") {
    setupPipes();
    sInterval = setInterval(drawPipes, 50);
  } else if (saver === "matrix") {
    setupMatrix();
    sInterval = setInterval(drawMatrix, 50);
  } else if (saver === "dvd") {
    setupDvd();
    sInterval = setInterval(drawDvd, 30);
  } else {
    setupStarfield();
    sInterval = setInterval(drawStars, 30);
  }
}

function stopScreensaver() {
  saverActive = false;
  screensaverDiv.style.display = "none";
  clearInterval(sInterval);
  hideFakeBsod();
  hideUnlockPrompt();
}

function showFakeBsod() {
  if (!bsodOverlay) return;
  const randomCode = Math.random().toString(16).slice(2, 8).toUpperCase();
  if (bsodCodeText) bsodCodeText.textContent = `STOP CODE: ${randomCode}`;
  bsodOverlay.classList.add("visible");
  saverCanvas.style.display = "none";
}

function hideFakeBsod() {
  if (!bsodOverlay) return;
  bsodOverlay.classList.remove("visible");
  saverCanvas.style.display = "block";
}

function setupStarfield() {
  stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * saverCanvas.width,
      y: Math.random() * saverCanvas.height,
      z: Math.random() * saverCanvas.width
    });
  }
}

function drawStars() {
  sCtx.fillStyle = "black";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
  sCtx.fillStyle = "white";
  for (let i = 0; i < numStars; i++) {
    let s = stars[i];
    s.z -= 10;
    if (s.z <= 0) {
      s.x = Math.random() * saverCanvas.width;
      s.y = Math.random() * saverCanvas.height;
      s.z = saverCanvas.width;
    }
    let k = 128.0 / s.z;
    let px = (s.x - saverCanvas.width / 2) * k + saverCanvas.width / 2;
    let py = (s.y - saverCanvas.height / 2) * k + saverCanvas.height / 2;
    if (
      px >= 0 &&
      px <= saverCanvas.width &&
      py >= 0 &&
      py <= saverCanvas.height
    ) {
      let size = (1 - s.z / saverCanvas.width) * 3;
      sCtx.fillRect(px, py, size, size);
    }
  }
}

function setupMatrix() {
  matrixFontSize = Math.max(14, Math.floor(saverCanvas.width / 80));
  const columns = Math.floor(saverCanvas.width / matrixFontSize);
  matrixDrops = new Array(columns)
    .fill(0)
    .map(() => Math.floor(Math.random() * -30));
  sCtx.fillStyle = "black";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
  sCtx.font = `${matrixFontSize}px monospace`;
}

function drawMatrix() {
  sCtx.fillStyle = "rgba(0, 0, 0, 0.25)";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
  sCtx.fillStyle = "#00ff7f";
  for (let i = 0; i < matrixDrops.length; i++) {
    const text =
      MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)] || "0";
    sCtx.fillText(text, i * matrixFontSize, matrixDrops[i] * matrixFontSize);
    if (matrixDrops[i] * matrixFontSize > saverCanvas.height && Math.random() > 0.975) {
      matrixDrops[i] = 0;
    }
    matrixDrops[i]++;
  }
}

function setupDvd() {
  const size = Math.max(80, Math.floor(Math.min(saverCanvas.width, saverCanvas.height) / 6));
  const startX = Math.random() * (saverCanvas.width - size);
  const startY = Math.random() * (saverCanvas.height - size / 2);
  dvdLogo = {
    x: startX,
    y: startY,
    dx: 4,
    dy: 3,
    w: size,
    h: size / 2,
    color: DVD_COLORS[Math.floor(Math.random() * DVD_COLORS.length)]
  };
  sCtx.fillStyle = "black";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
  sCtx.font = `${Math.floor(size / 3)}px 'Segoe UI', 'MS Sans Serif', sans-serif`;
}

function drawDvd() {
  if (!dvdLogo) return;
  sCtx.fillStyle = "rgba(0, 0, 0, 0.4)";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);

  dvdLogo.x += dvdLogo.dx;
  dvdLogo.y += dvdLogo.dy;

  const hitX = dvdLogo.x <= 0 || dvdLogo.x + dvdLogo.w >= saverCanvas.width;
  const hitY = dvdLogo.y <= 0 || dvdLogo.y + dvdLogo.h >= saverCanvas.height;

  if (hitX) {
    dvdLogo.dx *= -1;
    dvdLogo.color = DVD_COLORS[Math.floor(Math.random() * DVD_COLORS.length)];
  }
  if (hitY) {
    dvdLogo.dy *= -1;
    dvdLogo.color = DVD_COLORS[Math.floor(Math.random() * DVD_COLORS.length)];
  }

  sCtx.fillStyle = dvdLogo.color;
  sCtx.strokeStyle = "#000";
  sCtx.lineWidth = 4;
  sCtx.beginPath();
  if (sCtx.roundRect) {
    sCtx.roundRect(dvdLogo.x, dvdLogo.y, dvdLogo.w, dvdLogo.h, dvdLogo.h / 4);
  } else {
    sCtx.rect(dvdLogo.x, dvdLogo.y, dvdLogo.w, dvdLogo.h);
  }
  sCtx.fill();
  sCtx.stroke();

  sCtx.fillStyle = "#000";
  sCtx.textAlign = "center";
  sCtx.textBaseline = "middle";
  sCtx.fillText("DVD", dvdLogo.x + dvdLogo.w / 2, dvdLogo.y + dvdLogo.h / 2 + 2);
}

function setupPipes() {
  pipes = [];
  sCtx.fillStyle = "black";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
  for (let i = 0; i < 4; i++) {
    pipes.push({
      x: Math.random() * saverCanvas.width,
      y: Math.random() * saverCanvas.height,
      dir: pipeDirections[Math.floor(Math.random() * pipeDirections.length)],
      color: PIPE_COLORS[i % PIPE_COLORS.length],
      stepSize: 14,
      turnCounter: 0
    });
  }
}

function chooseNewPipeDirection(pipe) {
  const options = pipeDirections.filter(
    (d) => !(d.x === -pipe.dir.x && d.y === -pipe.dir.y)
  );
  pipe.dir = options[Math.floor(Math.random() * options.length)];
  pipe.turnCounter = 0;
}

function adjustColor(col, amt) {
  const hex = col.replace("#", "");
  const num = parseInt(hex, 16);
  let r = (num >> 16) + amt;
  let g = ((num >> 8) & 0xff) + amt;
  let b = (num & 0xff) + amt;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `rgb(${r}, ${g}, ${b})`;
}

function drawPipes() {
  sCtx.fillStyle = "rgba(0,0,0,0.08)";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);

  pipes.forEach((pipe) => {
    pipe.turnCounter++;
    const dangerMargin = 30;
    let nextX = pipe.x + pipe.dir.x * pipe.stepSize;
    let nextY = pipe.y + pipe.dir.y * pipe.stepSize;

    if (
      nextX < dangerMargin ||
      nextX > saverCanvas.width - dangerMargin ||
      nextY < dangerMargin ||
      nextY > saverCanvas.height - dangerMargin ||
      Math.random() < 0.1 * (pipe.turnCounter / 6)
    ) {
      chooseNewPipeDirection(pipe);
      nextX = pipe.x + pipe.dir.x * pipe.stepSize;
      nextY = pipe.y + pipe.dir.y * pipe.stepSize;
    }

    const highlight = adjustColor(pipe.color, 80);
    const shadow = adjustColor(pipe.color, -80);
    const grad = sCtx.createLinearGradient(pipe.x, pipe.y, nextX, nextY);
    grad.addColorStop(0, highlight);
    grad.addColorStop(0.5, pipe.color);
    grad.addColorStop(1, shadow);

    sCtx.lineWidth = 12;
    sCtx.lineCap = "round";
    sCtx.strokeStyle = grad;
    sCtx.beginPath();
    sCtx.moveTo(pipe.x, pipe.y);
    sCtx.lineTo(nextX, nextY);
    sCtx.stroke();

    sCtx.fillStyle = highlight;
    sCtx.beginPath();
    sCtx.arc(nextX, nextY, 4, 0, Math.PI * 2);
    sCtx.fill();

    pipe.x = nextX;
    pipe.y = nextY;
  });
}

function openCPDesktop(el, containerOverride) {
  let targetContainer = containerOverride;
  if (!targetContainer && el?.classList?.contains("cp-view-area")) {
    targetContainer = el;
  }
  if (!targetContainer && el?.closest) {
    const area = el.closest(".cp-view-area");
    if (area) targetContainer = area;
  }
  const w = el?.closest ? el.closest(".window") : null;
  const body =
    targetContainer ||
    (w ? w.querySelector(".window-body") : null) ||
    (el instanceof HTMLElement ? el : null);
  if (!body) return;
  if (w) {
    w
      .querySelectorAll(".cp-tab-btn, .cp-menu-item")
      .forEach((btn) =>
        btn.classList.toggle("active", btn.dataset.view === "desktop")
      );
  }
  body.innerHTML = `
            <div class="cp-settings-layout">
                <div class="cp-section">
                    <div style="font-weight:bold;margin-bottom:5px;">Desktop Wallpaper</div>
                    <label style="display:block;font-size:12px;">Image URL:</label>
                    <input type="text" id="bg-url" style="width:100%;margin-bottom:10px;">

                    <label style="display:block;font-size:12px;">Display:</label>
                    <select id="bg-mode" style="width:100%;margin-bottom:10px;">
                        <option value="tile">Tile</option>
                        <option value="center">Center</option>
                        <option value="cover">Stretch (Cover)</option>
                    </select>

                    <div style="text-align:right;">
                        <button class="task-btn" onclick="setWallpaper()">Apply</button>
                        <button class="task-btn" onclick="wm.closeWindow('${w ? w.dataset.id : ""}')">Close</button>
                    </div>
                </div>
            </div>
        `;
  const urlInput = body.querySelector("#bg-url");
  const modeSelect = body.querySelector("#bg-mode");
  if (urlInput) urlInput.value = wallpaperSettings.url || "";
  if (modeSelect) modeSelect.value = wallpaperSettings.mode || "tile";
}

function openCPScreensaver(target, containerOverride) {
  let targetContainer = containerOverride;
  if (!targetContainer && target?.classList?.contains("cp-view-area")) {
    targetContainer = target;
  }
  if (!targetContainer && target?.closest) {
    const area = target.closest(".cp-view-area");
    if (area) targetContainer = area;
  }
  const w = target?.closest ? target.closest(".window") : null;
  const body =
    targetContainer ||
    (w ? w.querySelector(".window-body") : null) ||
    (target instanceof HTMLElement ? target : null);
  if (!body) return;

  if (w) {
    w
      .querySelectorAll(".cp-tab-btn, .cp-menu-item")
      .forEach((btn) =>
        btn.classList.toggle("active", btn.dataset.view === "screensaver")
      );
  }

  const saverOptionsData = [
    { value: "starfield", label: "Starfield", desc: "Classic warp-speed stars." },
    { value: "pipes", label: "3D Pipes", desc: "Colorful shaded pipes crawl in 3D." },
    { value: "matrix", label: "Matrix", desc: "Green cascading code falls from the top of the screen." },
    { value: "dvd", label: "Bouncing Logo", desc: "A retro DVD logo that changes color when it hits a wall." }
  ];
  const saverOptions = saverOptionsData
    .map(
      (opt) =>
        `<option value="${opt.value}" ${
          opt.value === screensaverType ? "selected" : ""
        }>${opt.label}</option>`
    )
    .join("");

  const lockEnabled = isLockEnabled();

  body.innerHTML = `<div class="cp-settings-layout">
        <div class="cp-section">
            <label style="display:block;font-size:12px;margin-bottom:6px;">Screensaver</label>
            <select id="cp-saver-select" style="width:100%;margin-bottom:8px;">${saverOptions}</select>
            <div class="cp-font-preview" id="cp-saver-desc"></div>
            <div class="cp-saver-row">
                <label for="cp-saver-delay">Idle time (seconds):</label>
                <input type="number" id="cp-saver-delay" min="5" max="600" value="${screensaverTimeout}" style="width:80px;">
            </div>
            <div class="cp-saver-row">
                <label for="cp-saver-passphrase">Lock screen passphrase (optional):</label>
                <input type="password" id="cp-saver-passphrase" placeholder="Leave blank to disable" value="${lockPassphrase}" style="width:100%;">
            </div>
            <label class="volume-mute"><input type="checkbox" id="cp-saver-require" ${
              lockEnabled ? "checked" : ""
            }> Require passphrase to exit screensaver</label>
            <div class="cp-saver-actions">
                <button class="task-btn" onclick="previewScreensaver()">Preview</button>
                <button class="task-btn" onclick="applyScreensaver()">Apply</button>
            </div>
            <div class="cp-saver-note" id="cp-saver-status">Current saver: ${screensaverType}${
              lockEnabled ? " (locked)" : ""
            }</div>
        </div>
    </div>`;

  const descBox = body.querySelector("#cp-saver-desc");
  const select = body.querySelector("#cp-saver-select");
  const updateDesc = () => {
    const selected = saverOptionsData.find((s) => s.value === select?.value);
    if (descBox && selected) descBox.textContent = selected.desc;
  };
  updateDesc();
  select?.addEventListener("change", updateDesc);
}

function openCPSound(target, containerOverride) {
  let targetContainer = containerOverride;
  if (!targetContainer && target?.classList?.contains("cp-view-area")) {
    targetContainer = target;
  }
  if (!targetContainer && target?.closest) {
    const area = target.closest(".cp-view-area");
    if (area) targetContainer = area;
  }
  const w = target?.closest ? target.closest(".window") : null;
  const body =
    targetContainer ||
    (w ? w.querySelector(".window-body") : null) ||
    (target instanceof HTMLElement ? target : null);
  if (!body) return;

  if (w) {
    w
      .querySelectorAll(".cp-tab-btn, .cp-menu-item")
      .forEach((btn) =>
        btn.classList.toggle("active", btn.dataset.view === "sound")
      );
  }

  const currentVolume = Math.round(getSystemVolume() * 100);

  body.innerHTML = `<div class="cp-settings-layout">
        <div class="cp-section">
            <div style="font-weight:bold;margin-bottom:6px;">System Volume</div>
            <div class="volume-row">
                <input type="range" min="0" max="100" value="${currentVolume}" class="volume-slider" aria-label="System volume">
                <span class="volume-percent">${currentVolume}%</span>
            </div>
            <label class="volume-mute"><input type="checkbox" class="volume-mute-toggle" ${
              currentVolume === 0 ? "checked" : ""
            }>Mute</label>
            <div class="volume-actions">
                <button class="task-btn volume-test-btn">Test Beep</button>
                <button class="task-btn volume-reset-btn">Reset</button>
            </div>
            <div class="volume-note">Adjusts playback volume for all Oriel apps.</div>
        </div>
    </div>`;

  const slider = body.querySelector(".volume-slider");
  const muteToggle = body.querySelector(".volume-mute-toggle");
  const syncUI = (vol) => {
    if (slider) slider.value = Math.round(vol * 100);
    if (muteToggle) muteToggle.checked = vol === 0;
    const pct = body.querySelector(".volume-percent");
    if (pct) pct.textContent = `${Math.round(vol * 100)}%`;
  };

  slider?.addEventListener("input", (e) => {
    const vol = Number(e.target.value) / 100;
    setSystemVolume(vol);
    syncUI(getSystemVolume());
  });

  muteToggle?.addEventListener("change", (e) => {
    if (e.target.checked) {
      setSystemVolume(0);
    } else {
      setSystemVolume(lastNonZeroVolume || 0.5);
    }
    syncUI(getSystemVolume());
  });

  body.querySelector(".volume-reset-btn")?.addEventListener("click", () => {
    setSystemVolume(0.7);
    syncUI(getSystemVolume());
  });

  body.querySelector(".volume-test-btn")?.addEventListener("click", () => {
    playVolumeTest();
  });
}

function setWallpaper() {
  const url = document.getElementById("bg-url")?.value || "";
  const mode = document.getElementById("bg-mode")?.value || "tile";
  applyWallpaperSettings(url, mode, true);
}

function captureScreensaverForm() {
  const select = document.getElementById("cp-saver-select");
  const delay = document.getElementById("cp-saver-delay");
  const status = document.getElementById("cp-saver-status");
  const passInput = document.getElementById("cp-saver-passphrase");
  const requireToggle = document.getElementById("cp-saver-require");
  if (select?.value) screensaverType = select.value;
  const parsedDelay = parseInt(delay?.value || "", 10);
  if (!isNaN(parsedDelay)) {
    screensaverTimeout = Math.min(600, Math.max(5, parsedDelay));
    if (delay) delay.value = screensaverTimeout;
  }
  lockPassphrase = passInput?.value || "";
  const hasPass = lockPassphrase.trim().length > 0;
  requirePassphrase = !!requireToggle?.checked && hasPass;
  if (requireToggle && !hasPass) requireToggle.checked = false;
  return { status, hasPass };
}

function applyScreensaver() {
  const { status, hasPass } = captureScreensaverForm();
  idleTime = 0;
  if (status)
    status.textContent = `Current saver: ${screensaverType} (starts after ${screensaverTimeout}s idle${
      requirePassphrase && hasPass ? ", locked" : ""
    })`;
}

function previewScreensaver() {
  const select = document.getElementById("cp-saver-select");
  captureScreensaverForm();
  const chosen = select?.value || screensaverType;
  screensaverType = chosen;
  idleTime = 0;
  startScreensaver(chosen);
}

function initRssReader(win) {
  const urlInput = win.querySelector(".rss-url");
  const presetSelect = win.querySelector(".rss-preset");
  const loadBtn = win.querySelector(".rss-load");
  const status = win.querySelector(".rss-status");
  const list = win.querySelector(".rss-list");
  const titleEl = win.querySelector(".rss-preview-title");
  const metaEl = win.querySelector(".rss-preview-meta");
  const textEl = win.querySelector(".rss-preview-text");
  const linkEl = win.querySelector(".rss-preview-link");

  if (!urlInput || !presetSelect || !loadBtn || !status || !list || !titleEl || !metaEl || !textEl || !linkEl) return;

  let items = [];
  let selected = -1;

  const setStatus = (text, isError = false) => {
    status.textContent = text;
    status.classList.toggle("rss-status-error", isError);
  };

  const normalizeUrl = (raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
    return trimmed;
  };

  const sanitizeText = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html || "";
    div.querySelectorAll("script,style").forEach((n) => n.remove());
    return (div.textContent || "").trim();
  };

  const formatDate = (value) => {
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) return "No date";
    return dt.toLocaleString();
  };

  const renderItems = () => {
    list.innerHTML = "";
    if (!items.length) {
      list.innerHTML = '<div class="rss-empty">No items in this feed.</div>';
      return;
    }
    items.forEach((item, idx) => {
      const row = document.createElement("div");
      row.className = "rss-item" + (idx === selected ? " active" : "");
      row.dataset.index = idx.toString();
      row.innerHTML = `<div class="rss-item-title">${item.title || "(Untitled)"}</div><div class="rss-item-date">${formatDate(
        item.date
      )}</div>`;
      list.appendChild(row);
    });
  };

  const showItem = (idx) => {
    const item = items[idx];
    selected = idx;
    renderItems();
    if (!item) return;
    titleEl.textContent = item.title || "(Untitled)";
    metaEl.textContent = `${formatDate(item.date)} · ${item.link || "No link"}`;
    textEl.textContent = sanitizeText(item.summary) || "(No description)";
    if (item.link) {
      linkEl.href = item.link;
      linkEl.style.display = "inline";
    } else {
      linkEl.style.display = "none";
    }
  };

  const parseFeed = (xmlText) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, "application/xml");
    if (doc.querySelector("parsererror")) throw new Error("Invalid feed");
    const nodes = doc.querySelectorAll("item, entry");
    return Array.from(nodes).map((node) => {
      const get = (sel) => node.querySelector(sel)?.textContent?.trim() || "";
      const resolveLink = () => {
        const linkEl = node.querySelector("link[href]");
        if (linkEl) return linkEl.getAttribute("href") || "";
        return get("link");
      };
      return {
        title: get("title"),
        link: resolveLink(),
        date: get("pubDate") || get("updated") || get("published"),
        summary: get("description") || get("summary") || get("content")
      };
    });
  };

  const applyItems = (listItems) => {
    items = listItems;
    selected = items.length ? 0 : -1;
    renderItems();
    if (selected >= 0) showItem(selected);
  };

  const loadFeed = async (rawUrl) => {
    const normalized = normalizeUrl(rawUrl);
    if (!normalized) return;
    setStatus("Loading...");
    try {
      const proxyUrl = `${RSS_PROXY_ROOT}${encodeURIComponent(normalized)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const parsed = parseFeed(text);
      if (!parsed.length) throw new Error("Empty feed");
      applyItems(parsed);
      setStatus(`Loaded ${parsed.length} items`);
    } catch (err) {
      console.error("RSS load error", err);
      setStatus("Failed to load feed. Showing sample items.", true);
      applyItems(DEFAULT_RSS_SAMPLE);
    }
  };

  list.addEventListener("click", (e) => {
    const target = e.target.closest(".rss-item");
    if (!target) return;
    const idx = parseInt(target.dataset.index || "-1", 10);
    if (!Number.isNaN(idx)) showItem(idx);
  });

  presetSelect.addEventListener("change", () => {
    const value = presetSelect.value;
    urlInput.value = value;
    loadFeed(value);
  });

  loadBtn.addEventListener("click", () => loadFeed(urlInput.value));
  urlInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") loadFeed(urlInput.value);
  });

  applyItems(DEFAULT_RSS_SAMPLE);
  loadFeed(urlInput.value);
}

function initBrowser(win) {
  const urlInput = win.querySelector(".browser-url");
  const frame = win.querySelector(".browser-frame");
  const status = win.querySelector(".browser-status");
  const backBtn = win.querySelector('[data-action="back"]');
  const fwdBtn = win.querySelector('[data-action="forward"]');
  const refreshBtn = win.querySelector('[data-action="refresh"]');
  const homeBtn = win.querySelector('[data-action="home"]');
  const goBtn = win.querySelector('[data-action="go"]');
  const sessionId = win.dataset.id;

  if (!urlInput || !frame || !status) return;

  browserSessions[sessionId] = {
    history: [],
    index: -1
  };

  const setStatus = (text) => {
    status.textContent = text;
  };

  const normalizeUrl = (raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    if (!/^https?:\/\//i.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return trimmed;
  };

  const buildProxiedUrl = (url) => {
    try {
      const parsed = new URL(url);
      const portPart = parsed.port ? `:${parsed.port}` : "";
      return `${BROWSER_PROXY_PREFIX}${parsed.protocol}//${parsed.hostname}${portPart}${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch (err) {
      // Fallback for malformed URLs; r.jina.ai will still try to fetch it.
      return `${BROWSER_PROXY_PREFIX}https://${url.replace(/^\/+/, "")}`;
    }
  };

  const updateNavState = () => {
    const session = browserSessions[sessionId];
    if (!session) return;
    const hasBack = session.index > 0;
    const hasForward = session.index < session.history.length - 1;
    if (backBtn) backBtn.disabled = !hasBack;
    if (fwdBtn) fwdBtn.disabled = !hasForward;
  };

  const loadUrl = (rawUrl, pushHistory = true) => {
    const url = normalizeUrl(rawUrl);
    const session = browserSessions[sessionId];
    if (!url || !session) return;
    if (pushHistory) {
      session.history = session.history.slice(0, session.index + 1);
      session.history.push(url);
      session.index = session.history.length - 1;
    }
    const proxied = buildProxiedUrl(url);
    urlInput.value = url;
    frame.src = proxied;
    setStatus(`Loading ${url} (via text proxy)...`);
    updateNavState();
  };

  if (backBtn)
    backBtn.onclick = () => {
      const session = browserSessions[sessionId];
      if (!session || session.index <= 0) return;
      session.index -= 1;
      const target = session.history[session.index];
      urlInput.value = target;
      frame.src = buildProxiedUrl(target);
      setStatus(`Loading ${target} (via text proxy)...`);
      updateNavState();
    };

  if (fwdBtn)
    fwdBtn.onclick = () => {
      const session = browserSessions[sessionId];
      if (!session || session.index >= session.history.length - 1) return;
      session.index += 1;
      const target = session.history[session.index];
      urlInput.value = target;
      frame.src = buildProxiedUrl(target);
      setStatus(`Loading ${target} (via text proxy)...`);
      updateNavState();
    };

  if (refreshBtn)
    refreshBtn.onclick = () => {
      const session = browserSessions[sessionId];
      if (!session || session.index < 0) return;
      const target = session.history[session.index];
      frame.src = buildProxiedUrl(target);
      setStatus(`Refreshing ${target} (via text proxy)...`);
    };

  if (homeBtn) homeBtn.onclick = () => loadUrl(BROWSER_HOME);
  if (goBtn) goBtn.onclick = () => loadUrl(urlInput.value);

  urlInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") loadUrl(urlInput.value);
  });

  frame.addEventListener("load", () => {
    const session = browserSessions[sessionId];
    if (!session) return;
    const currentUrl = session.history[session.index] || "";
    setStatus(currentUrl ? `Loaded ${currentUrl}` : "Ready");
  });

  loadUrl(BROWSER_HOME);
}

function initRadioGarden(win) {
  const input = win.querySelector(".radio-search-input");
  const searchBtn = win.querySelector(".radio-search-btn");
  const results = win.querySelector(".radio-results");
  const status = win.querySelector(".radio-status");
  const openSite = win.querySelector(".radio-open-site");

  const setStatus = (text, isError = false) => {
    if (!status) return;
    status.textContent = text;
    status.classList.toggle("radio-status-error", isError);
  };

  const buildLink = (path) => `https://radio.garden${path}`;

  const renderResults = (stations) => {
    if (!results) return;
    if (!stations.length) {
      results.innerHTML = `<div class="radio-empty">No stations found for that search.</div>`;
      return;
    }
    results.innerHTML = stations
      .map((station) => {
        const title = station.page?.title || "Unknown Station";
        const subtitle = station.page?.subtitle || "";
        const url = station.page?.url ? buildLink(station.page.url) : null;
        return `<div class="radio-card" role="listitem">
                  <div class="radio-card-main">
                    <div class="radio-card-title">${title}</div>
                    <div class="radio-card-sub">${subtitle}</div>
                  </div>
                  <div class="radio-card-actions">
                    <button class="radio-pill" data-radio-link="${url || ""}" ${url ? "" : "disabled"}>Open</button>
                    <button class="radio-pill ghost" data-copy-link="${url || ""}" ${url ? "" : "disabled"}>Copy Link</button>
                  </div>
                </div>`;
      })
      .join("");
  };

  const parseRadioJson = (text) => {
    const start = text.indexOf("{");
    if (start === -1) throw new Error("Unexpected response format");
    return JSON.parse(text.slice(start));
  };

  const extractStations = (data) => {
    const sections = Array.isArray(data?.data?.content) ? data.data.content : [];
    const lists = sections.filter((section) => Array.isArray(section.items));
    return lists.flatMap((list) => list.items || []).filter((item) => item.page?.type === "channel");
  };

  const runSearch = async (query) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setStatus("Enter a station, city, or country to search.", true);
      return;
    }
    setStatus(`Searching for "${trimmed}"…`);
    if (results) results.innerHTML = "";
    try {
      const res = await fetch(
        `${RADIO_GARDEN_PROXY}/api/ara/content/search?q=${encodeURIComponent(trimmed)}`
      );
      const text = await res.text();
      const data = parseRadioJson(text);
      const stations = extractStations(data);
      renderResults(stations);
      setStatus(`Showing ${stations.length} result${stations.length === 1 ? "" : "s"} for "${trimmed}".`);
    } catch (err) {
      console.error(err);
      setStatus("Could not reach radio.garden right now. Try again later.", true);
    }
  };

  const handleActionClick = (e) => {
    const openBtn = e.target.closest("[data-radio-link]");
    const copyBtn = e.target.closest("[data-copy-link]");
    if (openBtn) {
      const link = openBtn.getAttribute("data-radio-link");
      if (link) window.open(link, "_blank", "noopener,noreferrer");
    }
    if (copyBtn) {
      const link = copyBtn.getAttribute("data-copy-link");
      if (!link) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(link)
          .then(() => setStatus("Copied link to clipboard."));
      } else {
        const temp = document.createElement("textarea");
        temp.value = link;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        temp.remove();
        setStatus("Copied link to clipboard.");
      }
    }
  };

  if (results) results.addEventListener("click", handleActionClick);

  if (openSite) {
    openSite.addEventListener("click", () =>
      window.open("https://radio.garden", "_blank", "noopener,noreferrer")
    );
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", () => runSearch(input?.value || ""));
  }

  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") runSearch(input.value);
    });
  }

  win.querySelectorAll(".radio-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const q = chip.getAttribute("data-query") || "";
      if (input) input.value = q;
      runSearch(q);
    });
  });
}

function initIRC(win) {
  const serverInput = win.querySelector(".irc-server");
  const nickInput = win.querySelector(".irc-nick");
  const channelInput = win.querySelector(".irc-channel");
  const connectBtn = win.querySelector(".irc-connect");
  const joinBtn = win.querySelector(".irc-join");
  const sendBtn = win.querySelector(".irc-send");
  const input = win.querySelector(".irc-input");
  const logEl = win.querySelector(".irc-log");
  const usersEl = win.querySelector(".irc-users");

  if (!serverInput || !nickInput || !channelInput || !connectBtn) return;

  // Variables to hold our client instance
  let client = null;
  let isConnected = false;
  let activeChannel = null;

  // Helper: Sanitize HTML
  const escapeHtml = (str) =>
    String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Helper: Add Log Entry
  const addLog = (prefix, message, type = "general") => {
    const row = document.createElement("div");
    row.className = "irc-log-row";
    
    let prefixClass = "irc-log-prefix";
    if (type === "system") prefixClass += " system"; 
    if (type === "self") prefixClass += " irc-self";
    if (type === "error") row.style.color = "#a00";

    const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    
    row.innerHTML = `<span class="irc-log-time">[${ts}]</span> <span class="${prefixClass}">${escapeHtml(prefix)}</span> <span class="irc-log-msg">${escapeHtml(message)}</span>`;
    logEl.appendChild(row);
    logEl.scrollTop = logEl.scrollHeight;
  };

  // Helper: Refresh User List
  const refreshUsers = () => {
    usersEl.innerHTML = "";
    if (!client || !activeChannel) return;
    
    const channel = client.channel(activeChannel);
    if (!channel || !channel.users) {
       usersEl.innerHTML = '<div class="irc-user" style="color:#666">(empty)</div>';
       return;
    }

    channel.users.sort((a, b) => a.nick.localeCompare(b.nick)).forEach((u) => {
      const div = document.createElement("div");
      div.className = "irc-user";
      // Determine prefix (@ for op, + for voice)
      let pfx = "";
      if (u.modes.includes('o')) pfx = "@";
      else if (u.modes.includes('v')) pfx = "+";
      
      div.textContent = pfx + u.nick;
      if (pfx) div.style.fontWeight = "bold";
      usersEl.appendChild(div);
    });
  };

  const toggleUI = (connected) => {
    isConnected = connected;
    connectBtn.textContent = connected ? "Disconnect" : "Connect";
    joinBtn.disabled = !connected;
    serverInput.disabled = connected;
    nickInput.disabled = connected;
    
    // We only enable chat input if we are in a channel
    const inChan = connected && activeChannel;
    input.disabled = !inChan;
    sendBtn.disabled = !inChan;
    channelInput.disabled = !connected; // Can type channel name while connected
  };

  // --- Logic ---

  const handleConnect = async () => {
    if (isConnected && client) {
      client.quit("Oriel Web Client Disconnecting...");
      // Client events will handle the UI toggle on close
      return;
    }

    const serverUrl = serverInput.value.trim();
    const nickname = nickInput.value.trim() || "OrielUser";
    const channelToJoin = channelInput.value.trim();

    addLog("System", "Loading IRC Library...", "system");

    try {
      // 1. Load the library (Chess Engine style)
      const IrcFramework = await loadIrcLibrary();

      // 2. Initialize Client
      client = new IrcFramework.Client();
      
      // 3. Setup Events
      client.on('registered', () => {
        addLog("System", "Connected! Registered as " + client.user.nick, "system");
        toggleUI(true);
        // Auto join if specified
        if (channelToJoin) {
            const chanName = channelToJoin.startsWith("#") ? channelToJoin : "#" + channelToJoin;
            client.join(chanName);
        }
      });

      client.on('close', () => {
        addLog("System", "Connection closed.", "error");
        toggleUI(false);
        client = null;
        activeChannel = null;
        refreshUsers();
      });

      client.on('message', (event) => {
        // Filter messages to current channel or private messages
        if (event.target === activeChannel) {
           addLog(`<${event.nick}>`, event.message);
        } else if (event.target === client.user.nick) {
           addLog(`*${event.nick}*`, event.message); // Private msg
        }
      });

      client.on('join', (event) => {
        if (event.nick === client.user.nick) {
          activeChannel = event.channel;
          addLog("System", `Joined ${event.channel}`, "system");
          channelInput.value = event.channel; // Update input to match real name
          toggleUI(true); // Update input states
        } else if (event.channel === activeChannel) {
          addLog("→", `${event.nick} joined`, "system");
        }
        refreshUsers();
      });

      client.on('part', (event) => {
        if (event.nick === client.user.nick) {
            addLog("System", `Left ${event.channel}`, "system");
            activeChannel = null;
            toggleUI(true);
        } else if (event.channel === activeChannel) {
            addLog("←", `${event.nick} left`, "system");
        }
        refreshUsers();
      });

      client.on('quit', (event) => {
         if (activeChannel) {
             // The library doesn't strictly track which channel a quitter was in easily for all users,
             // but we can check the user list
             const chan = client.channel(activeChannel);
             // We refresh users regardless
             refreshUsers();
             addLog("←", `${event.nick} quit (${event.message})`, "system");
         }
      });

      client.on('userlist', (event) => {
        if (event.channel === activeChannel) refreshUsers();
      });

      // 4. Connect
      // Determine port and protocol. IrcFramework needs "transport: 'websocket'"
      let port = 443;
      let host = serverUrl;
      let ssl = true;

      // Basic parsing to strip ws:// if user typed it, though the lib handles host
      if(host.startsWith("ws://")) { ssl = false; host = host.replace("ws://", ""); }
      if(host.startsWith("wss://")) { ssl = true; host = host.replace("wss://", ""); }
      
      if(host.includes(":")) {
          const parts = host.split(":");
          host = parts[0];
          port = parseInt(parts[1]);
      }

      addLog("System", `Connecting to wss://${host}:${port}...`, "system");

      client.connect({
        host: host,
        port: port,
        nick: nickname,
        transport: 'websocket', // Crucial for browser
        ssl: ssl,
        encoding: 'utf8'
      });

    } catch (err) {
      addLog("Error", "Could not load IRC library or connect: " + err.message, "error");
      console.error(err);
      ircLibPromise = null;
    }
  };

  const handleSend = () => {
    if (!client || !isConnected || !activeChannel) return;
    const text = input.value;
    if (!text) return;

    // The library handles raw commands if we want, but for now let's just send messages
    if (text.startsWith("/")) {
        const parts = text.slice(1).split(" ");
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        if (cmd === "me") {
            client.action(activeChannel, args.join(" "));
            addLog(`* ${client.user.nick}`, args.join(" "), "self");
        } else if (cmd === "nick") {
            client.changeNick(args[0]);
        } else if (cmd === "join") {
            client.join(args[0]);
        } else if (cmd === "part") {
            client.part(activeChannel);
        } else {
            // Raw
            client.raw(text.slice(1));
        }
    } else {
        client.say(activeChannel, text);
        addLog(`<${client.user.nick}>`, text, "self");
    }
    input.value = "";
  };

  // Event Listeners
  connectBtn.addEventListener("click", handleConnect);
  
  joinBtn.addEventListener("click", () => {
      if(client && isConnected) {
          const chan = channelInput.value.trim();
          if(chan) client.join(chan.startsWith("#") ? chan : "#"+chan);
      }
  });

  sendBtn.addEventListener("click", handleSend);
  input.addEventListener("keydown", (e) => {
      if(e.key === "Enter") {
          e.preventDefault();
          handleSend();
      }
  });

  // Cleanup
  win.ircCleanup = () => {
      if(client) {
          client.quit();
          client = null;
      }
  };
}

function initDiscord(win) {
  const tokenInput = win.querySelector(".discord-token");
  const channelInput = win.querySelector(".discord-channel");
  const fetchBtn = win.querySelector(".discord-fetch");
  const clearBtn = win.querySelector(".discord-clear");
  const sendBtn = win.querySelector(".discord-send");
  const messageInput = win.querySelector(".discord-message");
  const logEl = win.querySelector(".discord-log");
  const statusEl = win.querySelector(".discord-status");

  const setStatus = (text, tone = "info") => {
    statusEl.textContent = text;
    statusEl.dataset.tone = tone;
  };

  const formatAuth = (raw) => {
    if (!raw) return "";
    if (raw.startsWith("Bot ") || raw.startsWith("Bearer ")) return raw;
    return `Bot ${raw}`;
  };

  const renderMessages = (messages = []) => {
    logEl.innerHTML = "";
    if (!messages.length) {
      const empty = document.createElement("div");
      empty.className = "discord-empty";
      empty.textContent = "No messages returned for this channel.";
      logEl.appendChild(empty);
      return;
    }

    messages
      .slice()
      .reverse()
      .forEach((msg) => {
        const row = document.createElement("div");
        row.className = "discord-msg";
        const ts = new Date(msg.timestamp || msg.edited_timestamp || Date.now());
        const meta = `${msg.author?.username || "Unknown"} · ${ts.toLocaleString()}`;

        row.innerHTML = `<div class="discord-msg-meta">${meta}</div><div class="discord-msg-body">${
          msg.content ? msg.content.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "(no content)"
        }</div>`;
        logEl.appendChild(row);
      });
  };

  const requireFields = () => {
    const token = tokenInput.value.trim();
    const channelId = channelInput.value.trim();
    if (!token || !channelId) {
      setStatus("Enter both a token and channel ID before proceeding.", "error");
      return null;
    }
    return { token, channelId };
  };

  const fetchMessages = async () => {
    const fields = requireFields();
    if (!fields) return;

    setStatus("Fetching messages via Discord API...", "info");
    try {
      const res = await fetch(
        `https://discord.com/api/v10/channels/${encodeURIComponent(fields.channelId)}/messages?limit=20`,
        {
          headers: {
            Authorization: formatAuth(fields.token)
          }
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Request failed with status ${res.status}`);
      }

      const data = await res.json();
      renderMessages(data);
      setStatus("Loaded the 20 most recent messages.", "success");
    } catch (err) {
      console.error(err);
      setStatus(
        `Could not reach Discord API: ${err.message}. Make sure CORS allows this origin and the token has access.`,
        "error"
      );
    }
  };

  const sendMessage = async () => {
    const fields = requireFields();
    if (!fields) return;
    const content = messageInput.value.trim();
    if (!content) {
      setStatus("Type a message before sending.", "error");
      return;
    }

    setStatus("Sending message...", "info");
    try {
      const res = await fetch(`https://discord.com/api/v10/channels/${encodeURIComponent(fields.channelId)}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: formatAuth(fields.token)
        },
        body: JSON.stringify({ content })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Request failed with status ${res.status}`);
      }

      messageInput.value = "";
      setStatus("Message sent. Fetching latest messages...", "success");
      fetchMessages();
    } catch (err) {
      console.error(err);
      setStatus(
        `Failed to send message: ${err.message}. Verify permissions (Send Messages) and CORS.`,
        "error"
      );
    }
  };

  fetchBtn?.addEventListener("click", fetchMessages);
  sendBtn?.addEventListener("click", sendMessage);
  clearBtn?.addEventListener("click", () => {
    logEl.innerHTML = "";
    setStatus("Cleared log. Ready to fetch again.", "info");
  });
  messageInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      sendMessage();
    }
  });
}

let selT = {};

function initTaskMan(win, manager) {
  refreshTaskList(win.querySelector("#task-list"), win.dataset.id, manager);
  refreshProcessView(win.querySelector("#task-queue-view"));
}

function refreshAllTaskManagers(manager) {
  const wmRef = manager || window.wm;
  if (!wmRef) return;
  document.querySelectorAll(".window").forEach((w) => {
    if (w.dataset.type === "Task List") {
      const list = w.querySelector("#task-list");
      if (list) refreshTaskList(list, w.dataset.id, wmRef);
    }
  });
}

function refreshAllProcessViews() {
  document.querySelectorAll(".window").forEach((w) => {
    if (w.dataset.type === "Task List") {
      const view = w.querySelector("#task-queue-view");
      if (view) refreshProcessView(view);
    }
  });
}

function refreshTaskList(listEl, winId, manager) {
  const wmRef = manager || window.wm;
  if (!wmRef) return;
  listEl.innerHTML = "";
  wmRef.windows.forEach((w) => {
    const item = document.createElement("div");
    item.className = "task-item " + (selT[winId] === w.id ? "selected" : "");
    item.innerText = w.title;
    item.onclick = () => {
      selT[winId] = w.id;
      refreshTaskList(listEl, winId, wmRef);
    };
    listEl.appendChild(item);
  });
}

function refreshProcessView(viewEl) {
  viewEl.innerHTML =
    '<div class="queue-header">PID  | PRI | STATE   | CPU TIME</div>';
  kernel.processes.forEach((p) => {
    const row = document.createElement("div");
    row.className = "queue-row";
    let cpuBar = "";
    const ticks = Math.min(20, Math.floor(p.cpuTime / 1000));
    for (let i = 0; i < ticks; i++) cpuBar += "|";
    // Format ID from "win-123..."
    const shortId = p.pid.split("-")[1].substring(9);
    row.innerText = `${shortId} | ${p.priority
      .toString()
      .padEnd(3)} | ${p.state.padEnd(7)} | ${cpuBar}`;
    if (p.state === "RUNNING") row.style.color = "lime";
    else if (p.state === "WAITING") row.style.color = "yellow";
    else row.style.color = "gray";
    viewEl.appendChild(row);
  });
}

function switchTask(e) {
  const winId = e.target.closest(".window").dataset.id;
  const targetId = selT[winId];
  if (targetId) {
    window.wm?.restoreWindow(targetId);
    window.wm?.focusWindow(targetId);
    window.wm?.closeWindow(winId);
  }
}

function endTask(e) {
  const winId = e.target.closest(".window").dataset.id;
  const targetId = selT[winId];
  if (targetId) window.wm?.closeWindow(targetId);
}

function initReversi(w) {
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

    for (let d of dirs) {
      let nr = r + d[0];
      let nc = c + d[1];
      let found = 0;
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && grid[nr][nc] === opp) {
        nr += d[0];
        nc += d[1];
        found++;
      }
      if (
        found > 0 &&
        nr >= 0 &&
        nr < 8 &&
        nc >= 0 &&
        nc < 8 &&
        grid[nr][nc] === color
      )
        return true;
    }
    return false;
  };

  const makeMove = (r, c, color) => {
    if (!isValid(r, c, color)) return;
    grid[r][c] = color;
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
    dirs.forEach((d) => {
      let nr = r + d[0];
      let nc = c + d[1];
      const path = [];
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && grid[nr][nc] === opp) {
        path.push([nr, nc]);
        nr += d[0];
        nc += d[1];
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

async function initRadio(win) {
  const listEl = win.querySelector(".radio-list");
  const queryEl = win.querySelector(".radio-query");
  const searchBtn = win.querySelector(".radio-search-btn");
  const topBtn = win.querySelector(".radio-top-btn");
  const statusEl = win.querySelector(".radio-status");
  const nowEl = win.querySelector(".radio-now");
  const metaEl = win.querySelector(".radio-meta");
  const playBtn = win.querySelector(".radio-play");
  const stopBtn = win.querySelector(".radio-stop");
  const audioEl = win.querySelector(".radio-audio");

  if (!listEl || !queryEl || !searchBtn || !topBtn || !audioEl) return;

  registerMediaElement(audioEl);

  let stations = [];
  let selectedIndex = -1;

  const setStatus = (msg, isError = false) => {
    statusEl.textContent = msg;
    statusEl.classList.toggle("radio-error", !!isError);
  };

  const renderStations = () => {
    listEl.innerHTML = "";
    if (!stations.length) {
      listEl.innerHTML = "<div class='radio-empty'>No stations loaded yet.</div>";
      return;
    }
    stations.forEach((st, idx) => {
      const btn = document.createElement("button");
      btn.className = "radio-item" + (idx === selectedIndex ? " active" : "");
      btn.dataset.index = idx.toString();
      btn.setAttribute("role", "option");
      const tags = (st.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 3)
        .join(", ");
      btn.innerHTML = `
        <div class="radio-station-title">${st.name || "Unnamed Station"}</div>
        <div class="radio-meta-line">${st.country || ""}${
        st.language ? " · " + st.language : ""
      }</div>
        <div class="radio-meta-line">${
          st.codec ? st.codec.toUpperCase() + " · " : ""
        }${st.bitrate ? st.bitrate + " kbps" : ""}${
        tags ? " · " + tags : ""
      }</div>`;
      btn.addEventListener("click", () => selectStation(idx));
      listEl.appendChild(btn);
    });
  };

  const selectStation = (idx) => {
    selectedIndex = idx;
    const st = stations[idx];
    listEl.querySelectorAll(".radio-item").forEach((el, i) => {
      el.classList.toggle("active", i === selectedIndex);
    });
    const prettyName = `${st.name || "Unknown"}${
      st.country ? " · " + st.country : ""
    }`;
    nowEl.textContent = `Now tuned to ${prettyName}`;
    metaEl.textContent = `Codec: ${st.codec || "n/a"} · Bitrate: ${
      st.bitrate || "--"
    } kbps${st.tags ? " · Tags: " + st.tags.split(",").slice(0, 5).join(", ") : ""}`;
    const streamUrl = st.url_resolved || st.url;
    if (streamUrl) {
      audioEl.src = streamUrl;
      setStatus("Station ready. Press Play to start.");
    } else {
      setStatus("This station does not have a playable stream.", true);
    }
  };

  const fetchStations = async (url, description) => {
    setStatus(`Loading ${description}...`);
    listEl.innerHTML = "<div class='radio-empty'>Fetching stations...</div>";
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      stations = Array.isArray(data) ? data.slice(0, 30) : [];
      selectedIndex = -1;
      nowEl.textContent = "No station selected.";
      metaEl.textContent = "Use search or Top to load stations.";
      renderStations();
      if (stations.length === 0) {
        setStatus("No stations found for that query.", true);
      } else {
        setStatus(`Loaded ${stations.length} stations (${description}).`);
      }
    } catch (err) {
      console.error(err);
      listEl.innerHTML =
        "<div class='radio-empty'>Could not load stations. Please try again.</div>";
      setStatus("Network error while contacting Radio Browser.", true);
    }
  };

  const startPlayback = () => {
    if (selectedIndex < 0 || !audioEl.src) {
      setStatus("Pick a station first.", true);
      return;
    }
    audioEl
      .play()
      .then(() => setStatus("Playing live radio."))
      .catch(() => setStatus("Playback blocked. Try pressing Play again.", true));
  };

  const stopPlayback = () => {
    audioEl.pause();
    audioEl.currentTime = 0;
    setStatus("Stopped.");
  };

  searchBtn.addEventListener("click", () => {
    const q = queryEl.value.trim();
    if (!q) {
      setStatus("Enter a search term like 'jazz', 'news', or a city.", true);
      return;
    }
    const url = `${RADIO_BROWSER_BASE}/stations/search?limit=30&name=${encodeURIComponent(q)}`;
    fetchStations(url, `search for "${q}"`);
  });

  topBtn.addEventListener("click", () => {
    const url = `${RADIO_BROWSER_BASE}/stations/topvote/30`;
    fetchStations(url, "popular stations");
  });

  queryEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchBtn.click();
    }
  });

  playBtn?.addEventListener("click", startPlayback);
  stopBtn?.addEventListener("click", stopPlayback);

  audioEl.addEventListener("playing", () => setStatus("Streaming..."));
  audioEl.addEventListener("stalled", () =>
    setStatus("Stream stalled. Trying to recover...", true)
  );
  audioEl.addEventListener("error", () =>
    setStatus("Stream error. Try another station.", true)
  );

  fetchStations(`${RADIO_BROWSER_BASE}/stations/topvote/20`, "popular stations");
}

function initMediaPlayer(w) {
  const canvas = w.querySelector("#mplayer-canvas");
  const ctx = canvas.getContext("2d");
  const video = w.querySelector(".mplayer-video");

  const selectEl = w.querySelector(".mplayer-track-select");
  const seekEl = w.querySelector(".mplayer-seek");
  const currentEl = w.querySelector(".mplayer-current");
  const durationEl = w.querySelector(".mplayer-duration");
  const trackNameEl = w.querySelector(".mplayer-track-name");
  const fileInput = w.querySelector(".mplayer-file-input");
  const fileNameEl = w.querySelector(".mplayer-file-name");

  registerMediaElement(video);

  const tracks = [...getMediaPlayerTracks()];
  const addOption = (track, index, prefix = "") => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = `${prefix}${track.name}`;
    selectEl.appendChild(opt);
  };
  tracks.forEach((t, i) => addOption(t, i));

  let interval = null;
  let x = 50;
  let y = 50;
  let dx = 2;
  let dy = 2;
  let currentTrack = 0;

  const formatTime = (seconds) => {
    if (!isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const animate = () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00ff6a";
    ctx.font = "20px 'Courier New', monospace";
    ctx.fillText("ORIEL DVD", x, y);
    x += dx;
    y += dy;
    if (x < 0 || x > canvas.width - 100) dx = -dx;
    if (y < 20 || y > canvas.height - 10) dy = -dy;
  };

  const stopVisual = () => {
    clearInterval(interval);
    interval = null;
  };

  const resetVisual = () => {
    stopVisual();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    x = 50;
    y = 50;
  };

  const isVideoTrack = (track) => {
    const type = (track.type || "").toLowerCase();
    if (type.startsWith("video/")) return true;
    const name = (track.name || "").toLowerCase();
    return /(\.mp4|\.webm|\.ogv|\.mov|\.mkv)$/.test(name);
  };

  const updateSeek = () => {
    const duration = video.duration;
    if (!isFinite(duration) || duration <= 0) {
      seekEl.value = 0;
      durationEl.textContent = formatTime(0);
      currentEl.textContent = formatTime(video.currentTime || 0);
      return;
    }
    seekEl.value = Math.floor((video.currentTime / duration) * 100);
    currentEl.textContent = formatTime(video.currentTime);
    durationEl.textContent = formatTime(duration);
  };

  const loadTrack = (index) => {
    currentTrack = index;
    const track = tracks[currentTrack];
    const videoMode = isVideoTrack(track);
    canvas.style.display = videoMode ? "none" : "block";
    video.src = track.url;
    video.currentTime = 0;
    trackNameEl.textContent = track.name;
    seekEl.value = 0;
    currentEl.textContent = "0:00";
    durationEl.textContent = "0:00";
    if (!videoMode) {
      resetVisual();
    } else {
      stopVisual();
    }
  };

  selectEl.addEventListener("change", (e) => {
    loadTrack(parseInt(e.target.value, 10));
    registerMediaElement(video);
    video.play();
    if (canvas.style.display !== "none" && !interval) interval = setInterval(animate, 30);
  });

  seekEl.addEventListener("input", () => {
    if (!video.duration || !isFinite(video.duration)) return;
    video.currentTime = (parseFloat(seekEl.value) / 100) * video.duration;
  });

  video.addEventListener("timeupdate", updateSeek);
  video.addEventListener("loadedmetadata", updateSeek);
  video.addEventListener("ended", () => {
    stopVisual();
    video.currentTime = 0;
    seekEl.value = 0;
    currentEl.textContent = formatTime(0);
  });

  fileInput.addEventListener("change", () => {
    if (!fileInput.files || !fileInput.files.length) {
      fileNameEl.textContent = "Load mp3 or video files from your computer to play them here.";
      return;
    }

    let startIndex = tracks.length;
    Array.from(fileInput.files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const entry = { name: file.name, url, type: file.type };
      tracks.push(entry);
      addOption(entry, tracks.length - 1, "Local: ");
    });

    selectEl.value = `${startIndex}`;
    loadTrack(startIndex);
    registerMediaElement(video);
    video.play();
    fileNameEl.textContent =
      fileInput.files.length === 1
        ? `Loaded ${fileInput.files[0].name}`
        : `Loaded ${fileInput.files.length} files`;
  });

  loadTrack(currentTrack);
  selectEl.value = "0";

  w.toggleMedia = (btn, action) => {
    const videoMode = canvas.style.display === "none";
    if (action === "play") {
      registerMediaElement(video);
      video.play();
      if (!videoMode && !interval) interval = setInterval(animate, 30);
    } else if (action === "pause") {
      video.pause();
      stopVisual();
    } else {
      video.pause();
      video.currentTime = 0;
      seekEl.value = 0;
      currentEl.textContent = formatTime(0);
      stopVisual();
      resetVisual();
    }
  };
  window.toggleMedia = w.toggleMedia;
}

function initSolitaire(w) {
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

  const deal = () => {
    stock = createDeck();
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
      }[card.s]}</div><div style="text-align:right">${card.r}</div>`;
    }
    d.onclick = (e) => {
      e.stopPropagation();
      cb();
    };
    return d;
  };

  const render = () => {
    elS.innerHTML = "";
    if (stock.length > 0)
      elS.appendChild(
        renderCard(
          { u: false },
          () => {
            if (stock.length > 0) {
              const card = stock.pop();
              card.u = true;
              waste.push(card);
              sel = null;
              render();
            }
          }
        )
      );
    else
      elS.onclick = () => {
        while (waste.length > 0) {
          const card = waste.pop();
          card.u = false;
          stock.push(card);
        }
        sel = null;
        render();
      };

    elW.innerHTML = "";
    if (waste.length > 0) {
      const top = waste[waste.length - 1];
      elW.appendChild(renderCard(top, () => selectCard(top, "waste")));
    }

    SUITS.forEach((suit) => {
      elF[suit].innerHTML = "";
      if (f[suit].length > 0) {
        const top = f[suit][f[suit].length - 1];
        const d = renderCard(top, () => tryFoundation(suit));
        d.style.position = "static";
        elF[suit].appendChild(d);
      } else {
        elF[suit].innerHTML = `<div style="text-align:center;color:#006000;margin-top:35px;font-size:24px;">${{
          h: "♥",
          d: "♦",
          c: "♣",
          s: "♠"
        }[suit]}</div>`;
        elF[suit].onclick = () => tryFoundation(suit);
      }
    });

    elT.innerHTML = "";
    t.forEach((col, ci) => {
      const cd = document.createElement("div");
      cd.className = "sol-col";
      cd.onclick = () => tryTableau(ci);
      col.forEach((card, i) => {
        const d = renderCard(card, () => {
          // If another card is selected, treat this click as a move
          // destination for the selection (so players can click on
          // stacks directly instead of empty column space).
          if (
            sel &&
            !(sel.card === card && sel.loc === "tableau" && sel.col === ci && sel.idx === i)
          ) {
            tryTableau(ci);
            return;
          }
          if (card.u) selectCard(card, "tableau", ci, i);
          else if (i === col.length - 1) {
            card.u = true;
            render();
          }
        });
        d.style.top = i * 25 + "px";
        cd.appendChild(d);
      });
      elT.appendChild(cd);
    });
  };

  const selectCard = (card, loc, col, idx) => {
    if (sel && sel.card === card) sel = null;
    else sel = { card, loc, col, idx };
    render();
  };

  const tryTableau = (toCol) => {
    if (!sel) return;
    const dest = t[toCol];
    const movingCard = sel.card;
    let valid = false;
    if (dest.length === 0) {
      if (movingCard.r === "K") valid = true;
    } else {
      const top = dest[dest.length - 1];
      if (top.c !== movingCard.c && top.v === movingCard.v + 1) valid = true;
    }
    if (valid) {
      let moving = [];
      const fromCol = sel.col;
      if (sel.loc === "waste") moving.push(waste.pop());
      else moving = t[sel.col].splice(sel.idx);
      t[toCol].push(...moving);
      if (sel.loc === "tableau") {
        const origin = t[fromCol];
        if (origin.length > 0) {
          const topCard = origin[origin.length - 1];
          if (!topCard.u) topCard.u = true;
        }
      }
      sel = null;
      render();
    }
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

  deal();
}

function initWrite(w) {
  const editor = w.querySelector(".write-editor");
  w.querySelectorAll(".fmt-btn").forEach((btn) => {
    btn.onclick = () => {
      document.execCommand(btn.dataset.cmd, false, null);
      editor.focus();
    };
  });

  const fontSelect = w.querySelector(".write-font");
  const sizeSelect = w.querySelector(".write-size");

  if (fontSelect) {
    fontSelect.onchange = () => {
      document.execCommand("fontName", false, fontSelect.value);
      editor.focus();
    };
  }

  if (sizeSelect) {
    sizeSelect.onchange = () => {
      document.execCommand("fontSize", false, sizeSelect.value);
      editor.focus();
    };
  }
}

function initCardfile(w) {
  const key = "w31-cards";
  const stored = localStorage.getItem(key);
  w.cards = stored
    ? JSON.parse(stored)
    : [
        {
          id: 1,
          header: "Welcome",
          content: "This is Cardfile."
        }
      ];
  if (w.cards.length === 0)
    w.cards.push({
      id: Date.now(),
      header: "New Card",
      content: ""
    });
  w.activeCardId = w.cards[0].id;

  const listEl = w.querySelector("#card-index-list");
  const headerEl = w.querySelector("#card-header-display");
  const contentEl = w.querySelector("#card-content-edit");

  const render = () => {
    w.cards.sort((a, b) => a.header.localeCompare(b.header));
    listEl.innerHTML = "";
    w.cards.forEach((card) => {
      const d = document.createElement("div");
      d.className = "cardfile-item " + (card.id === w.activeCardId ? "sel" : "");
      d.innerHTML =
        ICONS.cardfile + `<span>${card.header || "(blank)"}</span>`;
      d.onclick = () => {
        w.activeCardId = card.id;
        render();
      };
      listEl.appendChild(d);
    });
    const active = w.cards.find((c) => c.id === w.activeCardId);
    if (active) {
      headerEl.value = active.header;
      contentEl.value = active.content;
    }
    localStorage.setItem(key, JSON.stringify(w.cards));
  };

  headerEl.oninput = () => {
    const active = w.cards.find((c) => c.id === w.activeCardId);
    if (active) {
      active.header = headerEl.value;
      render();
    }
  };
  contentEl.oninput = () => {
    const active = w.cards.find((c) => c.id === w.activeCardId);
    if (active) {
      active.content = contentEl.value;
      localStorage.setItem(key, JSON.stringify(w.cards));
    }
  };

  w.querySelector("#card-add").onclick = () => {
    const nc = { id: Date.now(), header: "New Card", content: "" };
    w.cards.push(nc);
    w.activeCardId = nc.id;
    render();
  };
  w.querySelector("#card-del").onclick = () => {
    if (w.cards.length > 1) {
      w.cards = w.cards.filter((c) => c.id !== w.activeCardId);
      w.activeCardId = w.cards[0].id;
      render();
    }
  };

  render();
}

function initClock(w) {
  const canvas = w.querySelector(".clock-canvas");
  const ctx = canvas.getContext("2d");
  const digital = w.querySelector(".clock-digital");
  const layout = w.querySelector(".clock-layout");
  let analogMode = true;

  const formatTime = (date) => {
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  };

  const drawAnalog = (date) => {
    const wH = canvas.width;
    const center = wH / 2;
    ctx.clearRect(0, 0, wH, wH);
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, wH, wH);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(center, center, center - 10, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI / 6) * i;
      const inner = center - 15;
      const outer = center - 5;
      ctx.beginPath();
      ctx.moveTo(
        center + inner * Math.sin(angle),
        center - inner * Math.cos(angle)
      );
      ctx.lineTo(
        center + outer * Math.sin(angle),
        center - outer * Math.cos(angle)
      );
      ctx.stroke();
    }

    const sec = date.getSeconds();
    const min = date.getMinutes();
    const hr = date.getHours() % 12;

    const drawHand = (value, max, length, width, color) => {
      const angle = (Math.PI * 2 * (value / max)) - Math.PI / 2;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(
        center + length * Math.cos(angle),
        center + length * Math.sin(angle)
      );
      ctx.stroke();
    };

    drawHand(hr + min / 60, 12, center - 55, 4, "#000");
    drawHand(min + sec / 60, 60, center - 35, 3, "#000");
    drawHand(sec, 60, center - 25, 2, "red");
  };

  const render = () => {
    const now = new Date();
    if (analogMode) {
      canvas.style.display = "block";
      digital.style.display = "none";
      drawAnalog(now);
    } else {
      canvas.style.display = "none";
      digital.style.display = "block";
      digital.innerText = formatTime(now);
    }
  };

  layout?.addEventListener("dblclick", () => {
    analogMode = !analogMode;
    render();
  });

  render();
  setInterval(render, 1000);
}

function initControlPanel(w) {
  const menu = w.querySelector(".menu-bar");
  const body = w.querySelector(".window-body");
  if (!menu || !body) return;

  menu.innerHTML = `
    <div class="menu-item cp-menu-item active" data-view="desktop">Desktop</div>
    <div class="menu-item cp-menu-item" data-view="color">Colors</div>
    <div class="menu-item cp-menu-item" data-view="screensaver">Screensaver</div>
    <div class="menu-item cp-menu-item" data-view="sound">Sound</div>
    <div class="menu-item cp-menu-item" data-view="fonts">Fonts</div>
    <div class="menu-item cp-menu-item" data-view="home">Home</div>
  `;

  body.innerHTML = `
    <div class="cp-menu-bar">
      <button class="task-btn cp-tab-btn active" data-view="desktop">Desktop</button>
      <button class="task-btn cp-tab-btn" data-view="color">Colors</button>
      <button class="task-btn cp-tab-btn" data-view="screensaver">Screensaver</button>
      <button class="task-btn cp-tab-btn" data-view="sound">Sound</button>
      <button class="task-btn cp-tab-btn" data-view="fonts">Fonts</button>
      <button class="task-btn cp-tab-btn" data-view="home">Home</button>
    </div>
    <div class="cp-view-area"></div>
  `;

  const viewArea = body.querySelector(".cp-view-area");

  const renderHome = () => {
    viewArea.innerHTML = wm.getControlPanelContent();
  };

  const setActive = (view) => {
    body
      .querySelectorAll(".cp-tab-btn")
      .forEach((btn) => btn.classList.toggle("active", btn.dataset.view === view));
    menu
      .querySelectorAll(".cp-menu-item")
      .forEach((btn) => btn.classList.toggle("active", btn.dataset.view === view));
  };

  const switchView = (view) => {
    setActive(view);
    if (view === "desktop") openCPDesktop(viewArea);
    else if (view === "color") openCPColor(viewArea);
    else if (view === "screensaver") openCPScreensaver(viewArea);
    else if (view === "sound") openCPSound(viewArea);
    else if (view === "fonts") openCPFonts(viewArea);
    else renderHome();
  };

  body.querySelectorAll(".cp-tab-btn").forEach((btn) => {
    btn.onclick = () => switchView(btn.dataset.view);
  });

  menu.querySelectorAll(".cp-menu-item").forEach((btn) => {
    btn.onclick = () => switchView(btn.dataset.view);
  });

  switchView("desktop");
}

function openCPFonts(target, containerOverride) {
  let targetContainer = containerOverride;
  if (!targetContainer && target?.classList?.contains("cp-view-area")) {
    targetContainer = target;
  }
  if (!targetContainer && target?.closest) {
    const area = target.closest(".cp-view-area");
    if (area) targetContainer = area;
  }
  const w = target?.closest ? target.closest(".window") : null;
  const body =
    targetContainer ||
    (w ? w.querySelector(".window-body") : null) ||
    (target instanceof HTMLElement ? target : null);
  if (!body) return;

  if (w) {
    w
      .querySelectorAll(".cp-tab-btn, .cp-menu-item")
      .forEach((btn) =>
        btn.classList.toggle("active", btn.dataset.view === "fonts")
      );
  }

  const fontOptions = ["Inter", "Roboto", "Open Sans", "Press Start 2P", "VT323"]
    .map((f) => `<option value="${f}">${f}</option>`)
    .join("");

  body.innerHTML = `<div class="cp-settings-layout"><div class="cp-section"><label style="display:block;font-size:12px;margin-bottom:6px;">Choose a Google Font</label><select id="cp-font-select" style="width:100%;margin-bottom:8px;">${fontOptions}</select><label style="display:block;font-size:12px;margin-bottom:4px;">Or enter a Google Font name</label><input type="text" id="cp-font-custom" placeholder="e.g. Space Grotesk" style="width:100%;margin-bottom:8px;"><div class="cp-font-preview" id="cp-font-preview-text">The quick brown fox jumps over the lazy dog.</div><div style="text-align:right;margin-top:8px;"><button class="task-btn" onclick="applyFontSelection()">Apply</button></div></div></div>`;

  const select = body.querySelector("#cp-font-select");
  const custom = body.querySelector("#cp-font-custom");
  const preview = body.querySelector("#cp-font-preview-text");

  const updatePreview = () => {
    const font = (custom?.value.trim() || select?.value || "Segoe UI").trim();
    const family = `'${font}', sans-serif`;
    if (preview) {
      preview.style.fontFamily = family;
      preview.textContent = `The quick brown fox jumps over the lazy dog. (${font})`;
    }
  };

  select?.addEventListener("change", updatePreview);
  custom?.addEventListener("input", updatePreview);
  updatePreview();
}

function loadGoogleFont(fontName) {
  if (!fontName) return;
  const encodedName = fontName.trim().replace(/\s+/g, "+");
  const href = `https://fonts.googleapis.com/css2?family=${encodedName}:wght@400;700&display=swap`;
  let link = document.getElementById("cp-google-font-link");
  if (!link) {
    link = document.createElement("link");
    link.id = "cp-google-font-link";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  link.href = href;
}

function applyFontSelection() {
  const custom = document.getElementById("cp-font-custom");
  const select = document.getElementById("cp-font-select");
  const chosen = (custom?.value.trim() || select?.value || "").trim();
  if (!chosen) return;
  loadGoogleFont(chosen);
  const family = `'${chosen}', sans-serif`;
  document.documentElement.style.setProperty("--font-main", family);
  const preview = document.getElementById("cp-font-preview-text");
  if (preview) {
    preview.style.fontFamily = family;
    preview.textContent = `The quick brown fox jumps over the lazy dog. (${chosen})`;
  }
}

function openCPColor(target, containerOverride) {
  let targetContainer = containerOverride;
  if (!targetContainer && target?.classList?.contains("cp-view-area")) {
    targetContainer = target;
  }
  if (!targetContainer && target?.closest) {
    const area = target.closest(".cp-view-area");
    if (area) targetContainer = area;
  }
  const w = target?.closest ? target.closest(".window") : null;
  const body =
    targetContainer ||
    (w ? w.querySelector(".window-body") : null) ||
    (target instanceof HTMLElement ? target : null);
  if (!body) return;
  if (w) {
    w
      .querySelectorAll(".cp-tab-btn, .cp-menu-item")
      .forEach((btn) =>
        btn.classList.toggle("active", btn.dataset.view === "color")
      );
  }
  body.innerHTML = `<div class="cp-settings-layout"><div class="cp-section"><select id="cs-sel" style="width:100%"><option value="d">Default</option><option value="h">Hot Dog</option><option value="p">Plasma</option></select><button class="task-btn" onclick="applyTheme()">Apply</button></div></div>`;
}

function applyTheme() {
  const v = document.getElementById("cs-sel").value,
    r = document.documentElement.style;
  if (v === "h") {
    r.setProperty("--win-teal", "red");
    r.setProperty("--win-gray", "yellow");
  } else if (v === "p") {
    r.setProperty("--win-teal", "#400040");
    r.setProperty("--win-gray", "#C0C0C0");
  } else {
    r.setProperty("--win-teal", "#008080");
    r.setProperty("--win-gray", "#C0C0C0");
  }
}

let ircLibPromise = null;

function loadIrcLibrary() {
  if (window.IrcFramework) return Promise.resolve(window.IrcFramework);
  if (ircLibPromise) return ircLibPromise;

  ircLibPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");    
    script.src = "https://unpkg.com/irc-framework@4.13.1/browser.js";
    
    script.onload = () => {
      if (window.IrcFramework) resolve(window.IrcFramework);
      else reject(new Error("IRC library loaded but window.IrcFramework is missing"));
    };
        
    script.onerror = () => {
      reject(new Error(`Network error loading script: ${script.src}`));
    };
    
    document.head.appendChild(script);
  });
  
  return ircLibPromise;
}

let chessLibPromise = null;

function loadChessLibrary() {
  if (!chessLibPromise) {
    chessLibPromise = new Promise((resolve, reject) => {
      // 1. If loaded, return it
      if (window.Chess) return resolve(window.Chess);

      // 2. Create script tag (Like DOOM/JsDos)
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js";
      
      // 3. Resolve when loaded
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
    // 1. Fetch the worker code from CDN
    fetch("https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.0/stockfish.js")
      .then(res => res.blob())
      .then(blob => {
        // 2. Create a local blob URL
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
        
        // 3. Initialize Engine
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
  };

  const resetSelection = () => {
    selected = null;
    legalTargets = [];
  };

  const syncState = (fromPlayer) => {
    renderBoard();
    renderMoves();
    if (game.game_over()) {
      const res = game.in_checkmate()
        ? fromPlayer
          ? "Checkmate! You win."
          : "Checkmate! Computer wins."
        : "Game over.";
      setStatus(res);
      userTurn = false;
      return;
    }
    if (fromPlayer) {
      userTurn = false;
      setStatus("Computer thinking...");
      requestEngineMove();
    } else {
      userTurn = true;
      setStatus("Your move (White)");
    }
  };

  const applyEngineMove = (uci) => {
    try {
      const move = game.move({
        from: uci.slice(0, 2),
        to: uci.slice(2, 4),
        promotion: "q"
      });
      if (move) resetSelection();
      syncState(false);
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

function initFileManager(w) {
  w.cP = "C:\\";
  w.cD = MOCK_FS["C:\\"];
  w.currentDirObj = w.cD;
  rFT(w);
  rFL(w);
}

function renderMarkdown(text) {
  const escapeHtml = (str) =>
    str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const applyInline = (str) => {
    let html = escapeHtml(str);
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    return html;
  };

  const lines = text.split(/\r?\n/);
  const output = [];
  let inList = false;
  let inCode = false;

  lines.forEach((line) => {
    if (line.trim().startsWith("```")) {
      if (inCode) output.push("</code></pre>");
      else output.push("<pre><code>");
      inCode = !inCode;
      return;
    }

    if (inCode) {
      output.push(escapeHtml(line));
      return;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      if (inList) {
        output.push("</ul>");
        inList = false;
      }
      const level = headingMatch[1].length;
      const content = applyInline(headingMatch[2].trim());
      output.push(`<h${level}>${content}</h${level}>`);
      return;
    }

    const listMatch = line.match(/^\s*[-*+]\s+(.*)$/);
    if (listMatch) {
      if (!inList) {
        output.push("<ul>");
        inList = true;
      }
      output.push(`<li>${applyInline(listMatch[1].trim())}</li>`);
      return;
    }

    if (inList && line.trim() === "") {
      output.push("</ul>");
      inList = false;
      return;
    }

    if (inList) {
      output.push("</ul>");
      inList = false;
    }

    if (line.trim() !== "") {
      output.push(`<p>${applyInline(line.trim())}</p>`);
    }
  });

  if (inList) output.push("</ul>");
  if (inCode) output.push("</code></pre>");

  return output.join("\n");
}

function initImageViewer(win, initData) {
  const fileInput = win.querySelector(".img-file-input");
  const urlInput = win.querySelector(".img-url-input");
  const loadBtn = win.querySelector(".img-load-btn");
  const preview = win.querySelector(".img-preview");
  const placeholder = win.querySelector(".img-placeholder");
  const status = win.querySelector(".img-status");

  const setStatus = (text) => {
    if (status) status.textContent = text;
  };

  const showPlaceholder = (message) => {
    if (placeholder) {
      placeholder.style.display = "flex";
      placeholder.textContent = message || "Drop an image or click Open";
    }
    if (preview) preview.style.display = "none";
  };

  const setImage = (src, label) => {
    if (!preview || !placeholder) return;
    if (!src) {
      showPlaceholder("No image loaded");
      setStatus("No image loaded");
      return;
    }
    preview.onload = () => {
      placeholder.style.display = "none";
      preview.style.display = "block";
      setStatus(`Loaded ${label || "image"}`);
    };
    preview.onerror = () => {
      showPlaceholder("Failed to load image");
      setStatus("Failed to load image");
    };
    preview.src = src;
    preview.alt = label || "Image preview";
  };

  if (initData?.src) setImage(initData.src, initData.name);

  fileInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target.result, file.name);
    reader.readAsDataURL(file);
  });

  const loadUrl = () => {
    const url = urlInput?.value.trim();
    if (url) setImage(url, url);
  };

  loadBtn?.addEventListener("click", loadUrl);
  urlInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      loadUrl();
    }
  });
}

function initArtist(win) {
  const promptInput = win.querySelector(".artist-prompt");
  const generateBtn = win.querySelector(".artist-generate");
  const status = win.querySelector(".artist-status");
  const preview = win.querySelector(".artist-preview");
  const placeholder = win.querySelector(".artist-placeholder");
  const link = win.querySelector(".artist-link");

  if (!promptInput || !generateBtn || !status || !preview || !placeholder || !link)
    return;

  const setStatus = (msg, isError = false) => {
    status.textContent = msg;
    status.classList.toggle("artist-status-error", isError);
  };

  const setLoading = (loading) => {
    generateBtn.disabled = loading;
    generateBtn.textContent = loading ? "Generating..." : "Generate";
  };

  const showPlaceholder = (msg) => {
    placeholder.style.display = "flex";
    placeholder.textContent = msg;
    preview.style.display = "none";
  };

  const displayImage = (url) => {
    preview.onload = () => {
      placeholder.style.display = "none";
      preview.style.display = "block";
      setStatus("Image ready. Right-click to save.");
      setLoading(false);
    };
    preview.onerror = () => {
      showPlaceholder("Failed to load image. Try again.");
      setStatus("Image request failed.", true);
      setLoading(false);
    };
    preview.src = url;
    link.href = url;
  };

  const requestImage = () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      setStatus("Enter a description first.", true);
      return;
    }
    setLoading(true);
    setStatus("Requesting image from Pollinations...");
    showPlaceholder("Generating image...");

    const apiUrl =
      "https://image.pollinations.ai/prompt/" +
      encodeURIComponent(prompt) +
      `?width=1024&height=1024&seed=${Date.now()}`;

    displayImage(apiUrl);
  };

  generateBtn.addEventListener("click", requestImage);
  promptInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      requestImage();
    }
  });

  // Kick off an initial render using the default prompt
  requestImage();
}

function initPdfReader(win, initData) {
  const fileInput = win.querySelector(".pdf-file-input");
  const urlInput = win.querySelector(".pdf-url-input");
  const loadBtn = win.querySelector(".pdf-load-btn");
  const frame = win.querySelector(".pdf-frame");
  const status = win.querySelector(".pdf-status");

  const loadDocument = (src, label) => {
    if (!src) {
      frame.src = "";
      status.textContent = "No document loaded";
      return;
    }
    frame.src = src;
    status.textContent = `Loaded ${label}`;
  };

  const initialSrc = initData?.src || DEFAULT_PDF_DATA_URI;
  loadDocument(initialSrc, initData?.name || "Sample.pdf");

  fileInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => loadDocument(ev.target.result, file.name);
    reader.readAsDataURL(file);
  });

  loadBtn?.addEventListener("click", () => {
    const url = urlInput?.value.trim();
    if (url) loadDocument(url, url);
  });

  urlInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      loadBtn?.click();
    }
  });
}

function initMarkdownViewer(win, initData) {
  const textarea = win.querySelector(".md-input");
  const preview = win.querySelector(".md-preview");
  const status = win.querySelector(".md-status");
  const fileInput = win.querySelector(".md-file-input");
  const sampleBtn = win.querySelector(".md-sample-btn");

  const updatePreview = (label) => {
    if (!textarea || !preview) return;
    const html = renderMarkdown(textarea.value);
    preview.innerHTML = html || '<p class="md-empty">Nothing to preview.</p>';
    if (status) status.textContent = label ? `Loaded ${label}` : "Preview ready";
  };

  const initialLabel =
    typeof initData === "object" && initData?.name
      ? initData.name
      : initData
      ? "Markdown"
      : "Sample";
  updatePreview(initialLabel);

  textarea?.addEventListener("input", () => updatePreview());

  fileInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file || !textarea) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      textarea.value = ev.target.result;
      updatePreview(file.name);
    };
    reader.readAsText(file);
  });

  sampleBtn?.addEventListener("click", () => {
    if (!textarea) return;
    textarea.value = DEFAULT_MD_SAMPLE;
    updatePreview("Sample");
  });
}

function formatHexDump(bytes) {
  const offsets = [];
  const hexLines = [];
  const asciiLines = [];

  if (!bytes || !bytes.length)
    return { offsetText: "000000", hexText: "", asciiText: "" };

  for (let i = 0; i < bytes.length; i += 16) {
    offsets.push(i.toString(16).padStart(6, "0"));
    const hexPart = [];
    const asciiPart = [];
    for (let j = 0; j < 16; j++) {
      const idx = i + j;
      if (idx < bytes.length) {
        const b = bytes[idx];
        hexPart.push(b.toString(16).padStart(2, "0").toUpperCase());
        asciiPart.push(b >= 32 && b <= 126 ? String.fromCharCode(b) : ".");
      } else {
        hexPart.push("  ");
        asciiPart.push(" ");
      }
    }
    hexLines.push(hexPart.join(" "));
    asciiLines.push(asciiPart.join(""));
  }

  return {
    offsetText: offsets.join("\n"),
    hexText: hexLines.join("\n"),
    asciiText: asciiLines.join("\n")
  };
}

function parseHexString(str) {
  const cleaned = (str || "").replace(/[^0-9a-fA-F]/g, "");
  if (!cleaned) return new Uint8Array();
  if (cleaned.length % 2 !== 0) return null;
  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < cleaned.length; i += 2) {
    bytes[i / 2] = parseInt(cleaned.substr(i, 2), 16);
  }
  return bytes;
}

function initHexEditor(win) {
  const hexArea = win.querySelector(".hex-area");
  const asciiArea = win.querySelector(".hex-ascii");
  const offsetArea = win.querySelector(".hex-offsets");
  const status = win.querySelector(".hex-status");
  const summary = win.querySelector(".hex-summary");
  const fileInput = win.querySelector(".hex-file");
  const parseBtn = win.querySelector(".hex-parse");
  const asciiBtn = win.querySelector(".hex-from-ascii");
  const newBtn = win.querySelector(".hex-new");

  const setStatus = (msg, isError = false) => {
    if (!status) return;
    status.textContent = msg;
    status.classList.toggle("error", isError);
  };

  const renderBytes = (bytes, label) => {
    const data = bytes || new Uint8Array();
    const dump = formatHexDump(data);
    if (offsetArea) offsetArea.value = dump.offsetText;
    if (hexArea) hexArea.value = dump.hexText;
    if (asciiArea) asciiArea.value = dump.asciiText;
    if (summary)
      summary.textContent = `${data.length} byte${data.length === 1 ? "" : "s"}`;
    setStatus(label || "Ready");
  };

  const loadSample = () => {
    const sample = new TextEncoder().encode(
      "Hello, Hex Editor!\nUse Parse Hex after editing."
    );
    renderBytes(sample, "Sample buffer loaded.");
  };

  loadSample();

  fileInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const arr = new Uint8Array(ev.target.result);
      renderBytes(arr, `Loaded ${file.name}`);
    };
    reader.readAsArrayBuffer(file);
  });

  parseBtn?.addEventListener("click", () => {
    const bytes = parseHexString(hexArea?.value || "");
    if (bytes === null) {
      setStatus("Hex input contains an incomplete byte.", true);
      return;
    }
    renderBytes(bytes, "Parsed hex input.");
  });

  asciiBtn?.addEventListener("click", () => {
    const txt = asciiArea?.value || "";
    const bytes = new TextEncoder().encode(txt);
    renderBytes(bytes, "Encoded ASCII view.");
  });

  newBtn?.addEventListener("click", () =>
    renderBytes(new Uint8Array(), "New empty buffer.")
  );
}

function rFT(w) {
  const r = w.querySelector("#file-tree-root");
  r.innerHTML = "";
  const b = (c, p, o) => {
    const d = document.createElement("div");
    d.className = "tree-item " + (w.cP === p ? "selected" : "");
    d.innerHTML =
      ICONS.folder + `<span>${p.split("\\").pop() || "C:\\"}</span>`;
    d.onclick = (e) => {
      e.stopPropagation();
      w.cP = p;
      w.cD = o;
      w.currentDirObj = o;
      rFT(w);
      rFL(w);
    };
    c.appendChild(d);
    if (o.children) {
      const s = document.createElement("div");
      s.style.paddingLeft = "15px";
      Object.keys(o.children).forEach((k) => {
        if (o.children[k].type === "dir")
          b(s, p === "C:\\" ? p + k : p + "\\" + k, o.children[k]);
      });
      c.appendChild(s);
    }
  };
  b(r, "C:\\", MOCK_FS["C:\\"]);
}

function rFL(w) {
  const v = w.querySelector("#file-list-view");
  w.querySelector("#file-list-header").innerText = w.cP + "*.*";
  v.innerHTML = "";
  if (w.cD && w.cD.children)
    Object.keys(w.cD.children).forEach((k) => {
      const i = w.cD.children[k],
        r = document.createElement("div");
      r.className = "file-item";
      r.innerHTML =
        (i.type === "file"
          ? k.endsWith(".EXE")
            ? ICONS.file_exe
            : ICONS.file_txt
          : ICONS.folder) + `<span>${k}</span>`;
      r.ondblclick = () => {
        if (i.type === "dir") {
          const np = w.cP === "C\\" ? w.cP + k : w.cP + "\\" + k;
          w.cP = np;
          w.cD = i;
          w.currentDirObj = i;
          rFT(w);
          rFL(w);
        } else if (i.app) {
          const size =
            i.app === "skifree"
              ? { w: 520, h: 520 }
              : i.app === "imageviewer"
                ? { w: 720, h: 540 }
                : i.app === "beatmaker"
                  ? { w: 720, h: 420 }
                  : { w: 400, h: 300 };
          wm.openWindow(i.app, i.app.toUpperCase(), size.w, size.h, i.content);
        }
      };
      r.onclick = () => {
        w.querySelectorAll(".file-item").forEach((x) =>
          x.classList.remove("selected")
        );
        r.classList.add("selected");
      };
      v.appendChild(r);
    });
}

let jsDosLoadPromise = null;

function loadJsDos() {
  if (window.Dos) return Promise.resolve();       // already loaded

  if (jsDosLoadPromise) return jsDosLoadPromise;  // already loading

  jsDosLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js-dos.com/6.22/current/js-dos.js";
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });

  return jsDosLoadPromise;
}

function initDoom(win) {
  const container = win.querySelector("#doom-container");
  if (!container) return;

  const savedTitle = document.title;
  const restoreTitle = () => { document.title = savedTitle; };
  
  loadJsDos()
    .then(() => {
      return window.Dos(container, {
        style: "none",
        wdosboxUrl: "https://js-dos.com/6.22/current/wdosbox.js"
      }).ready((fs, main) => {
        restoreTitle();
        fs.extract("https://js-dos.com/cdn/upload/DOOM-@evilution.zip").then(() => {
          restoreTitle();
          main(["-c", "cd doom", "-c", "doom"]).then((ci) => {
            win.doomCI = ci;
            restoreTitle();
            setTimeout(restoreTitle, 100);
          });
        });
      });
    })
    .catch((err) => {
      console.error("Failed to load js-dos:", err);
      container.innerHTML =
        '<div style="color:#f44;font-family:var(--font-main);padding:8px;">Failed to load DOOM (js-dos load error).</div>';
    });
}

function initBeatMaker(win) {
  const tempo = win.querySelector("#daw-tempo");
  const tempoVal = win.querySelector("#daw-tempo-val");
  const status = win.querySelector("#daw-status");
  const playBtn = win.querySelector("#daw-play");
  const stopBtn = win.querySelector("#daw-stop");
  const randomBtn = win.querySelector("#daw-random");
  const clearBtn = win.querySelector("#daw-clear");

  const tracks = [
    { id: "kick", name: "Kick" },
    { id: "snare", name: "Snare" },
    { id: "hihat", name: "Hi-Hat" },
    { id: "clap", name: "Clap" }
  ];
  const stepsCount = 16;
  const pattern = Object.fromEntries(
    tracks.map((t) => [t.id, Array(stepsCount).fill(false)])
  );

  // Starter groove
  [0, 4, 8, 12].forEach((i) => (pattern.kick[i] = true));
  [4, 12].forEach((i) => (pattern.snare[i] = true));
  [2, 6, 10, 14].forEach((i) => (pattern.hihat[i] = true));
  pattern.clap[14] = true;

  let audioCtx = null;
  let timer = null;
  let currentStep = 0;

  const stepNodes = Array.from(win.querySelectorAll(".daw-step"));

  function ensureContext() {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  function renderPattern() {
    stepNodes.forEach((node) => {
      const track = node.closest(".daw-row").dataset.track;
      const stepIndex = parseInt(node.dataset.step);
      node.classList.toggle("active", pattern[track][stepIndex]);
    });
  }

  function highlightStep(stepIndex) {
    stepNodes.forEach((node) => {
      const isCurrent = parseInt(node.dataset.step) === stepIndex;
      node.classList.toggle("playhead", isCurrent);
    });
  }

  function connectWithVolume(node) {
    const gain = ensureContext().createGain();
    gain.gain.value = systemVolume;
    node.connect(gain);
    gain.connect(ensureContext().destination);
    return { node, gain };
  }

  function triggerKick(time) {
    const ctx = ensureContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(55, time + 0.25);
    gain.gain.setValueAtTime(systemVolume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.4);
  }

  function triggerNoise(duration, tone, cutoff) {
    const ctx = ensureContext();
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * tone;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = cutoff;
    const { gain } = connectWithVolume(noise);
    gain.gain.setValueAtTime(systemVolume * 0.8, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    noise.connect(filter);
    filter.connect(gain);
    noise.start();
    noise.stop(ctx.currentTime + duration);
  }

  function triggerSnare(time) {
    const ctx = ensureContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, time);
    gain.gain.setValueAtTime(systemVolume * 0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.25);
    triggerNoise(0.18, 0.7, 1000);
  }

  function triggerHat(time) {
    triggerNoise(0.1, 0.4, 6000);
  }

  function triggerClap(time) {
    const ctx = ensureContext();
    const bursts = [0, 0.03, 0.06];
    bursts.forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(400, time + offset);
      gain.gain.setValueAtTime(systemVolume * 0.2, time + offset);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + offset + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time + offset);
      osc.stop(time + offset + 0.16);
    });
  }

  const triggerMap = {
    kick: triggerKick,
    snare: triggerSnare,
    hihat: triggerHat,
    clap: triggerClap
  };

  stepNodes.forEach((node) => {
    node.addEventListener("click", () => {
      const track = node.closest(".daw-row").dataset.track;
      const stepIndex = parseInt(node.dataset.step);
      pattern[track][stepIndex] = !pattern[track][stepIndex];
      node.classList.toggle("active", pattern[track][stepIndex]);
      status.textContent = pattern[track][stepIndex]
        ? `${tracks.find((t) => t.id === track).name} enabled on step ${stepIndex + 1}.`
        : `${tracks.find((t) => t.id === track).name} muted on step ${stepIndex + 1}.`;
    });
  });

  function stepDurationMs() {
    return (60000 / parseInt(tempo.value, 10)) / 4;
  }

  function playCurrentStep() {
    const ctx = ensureContext();
    const time = ctx.currentTime;
    tracks.forEach((t) => {
      if (pattern[t.id][currentStep]) triggerMap[t.id](time);
    });
    highlightStep(currentStep);
    currentStep = (currentStep + 1) % stepsCount;
  }

  function startPlayback() {
    if (timer) return;
    ensureContext();
    currentStep = 0;
    playCurrentStep();
    timer = setInterval(playCurrentStep, stepDurationMs());
    status.textContent = "Playing pattern. Click steps to toggle sounds.";
  }

  function stopPlayback() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    highlightStep(-1);
    status.textContent = "Stopped. Adjust tempo or toggle steps.";
  }

  tempo.addEventListener("input", () => {
    tempoVal.textContent = tempo.value;
    if (timer) {
      clearInterval(timer);
      timer = setInterval(playCurrentStep, stepDurationMs());
    }
  });

  playBtn.onclick = startPlayback;
  stopBtn.onclick = stopPlayback;

  randomBtn.onclick = () => {
    tracks.forEach((t) => {
      pattern[t.id] = pattern[t.id].map(() => Math.random() < 0.25);
    });
    renderPattern();
    status.textContent = "Humanized the beat with some random hits.";
  };

  clearBtn.onclick = () => {
    tracks.forEach((t) => pattern[t.id].fill(false));
    renderPattern();
    status.textContent = "Cleared all steps.";
  };

  renderPattern();
}

function initSoundRecorder(w) {
  const canvas = w.querySelector(".sound-wave-canvas");
  const ctx = canvas.getContext("2d");
  const status = w.querySelector("#sound-status");
  
  let mediaRecorder;
  let audioChunks = [];
  let audioBlob = null;
  let audioUrl = null;
  let audioCtx;
  let analyser;
  let dataArray;
  let source;
  let streamRef;
  let animationId;

  // Visualization Loop
  function draw() {
    if (!analyser) return;
    animationId = requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#0f0"; // Green wave
    ctx.beginPath();
    const sliceWidth = canvas.width / dataArray.length;
    let x = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }

  // RECORD
  w.querySelector("#btn-rec").onclick = async () => {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef = stream;
      
      // Setup Visualizer
      analyser = audioCtx.createAnalyser();
      source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      dataArray = new Uint8Array(analyser.frequencyBinCount);
      draw();

      // Setup Recorder
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];
      mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
      mediaRecorder.onstop = () => {
        audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        audioUrl = URL.createObjectURL(audioBlob);
        status.innerText = "Stopped. Ready to play.";
        cancelAnimationFrame(animationId);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height); // clear canvas
      };

      mediaRecorder.start();
      status.innerText = "Recording...";
      status.style.color = "red";
    } catch (err) {
      status.innerText = "Error: Mic access denied.";
    }
  };

  // STOP
  w.querySelector("#btn-stop").onclick = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      if (streamRef) streamRef.getTracks().forEach(track => track.stop());
      status.style.color = "black";
    }
  };

  // PLAY
  w.querySelector("#btn-play").onclick = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      registerMediaElement(audio);
      audio.play();
      status.innerText = "Playing...";
      audio.onended = () => { status.innerText = "Ready"; };
    }
  };
}

function initCharMap(w) {
  const g = w.querySelector("#char-grid"),
    ip = w.querySelector("#char-copy-input"),
    preview = w.querySelector(".char-preview"),
    codeLabel = w.querySelector("#char-code-label"),
    fontSelect = w.querySelector("#char-font-select");

  let activeCell = null;

  const applyFont = (fontValue) => {
    g.style.fontFamily = fontValue;
    preview.style.fontFamily = fontValue;
  };

  const setSelection = (cell) => {
    if (!cell) return;
    if (activeCell) activeCell.classList.remove("active");
    activeCell = cell;
    cell.classList.add("active");
    const chr = cell.dataset.char;
    const code = parseInt(cell.dataset.code, 10);
    preview.innerText = chr;
    codeLabel.innerText = `U+${code.toString(16).toUpperCase().padStart(4, "0")} · Dec ${code}`;
  };

  for (let i = 32; i < 256; i++) {
    const c = String.fromCharCode(i);
    const d = document.createElement("div");
    d.className = "char-cell";
    d.innerText = c;
    d.dataset.char = c;
    d.dataset.code = i;
    d.onclick = () => {
      ip.value += c;
      setSelection(d);
    };
    g.appendChild(d);
  }

  fontSelect?.addEventListener("change", (e) => applyFont(e.target.value));
  setSelection(g.querySelector('[data-code="65"]') || g.querySelector(".char-cell"));
  applyFont(fontSelect?.value || "'Times New Roman', serif");
}

function copyCharMap(b) {
  b.closest(".window").querySelector("#char-copy-input").select();
  document.execCommand("copy");
}

function initDatabase(w) {
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

function renderDbTable(w) {
  const t = w.querySelector("#db-tbody");
  t.innerHTML = "";
  w.dbData.forEach((r, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${r.name}</td><td>${r.phone}</td><td>${r.email}</td><td><button onclick="deleteDbRecord(this,${i})">X</button></td>`;
    t.appendChild(tr);
  });
}

function addDbRecord(b) {
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

function deleteDbRecord(b, i) {
  const w = b.closest(".window");
  w.dbData.splice(i, 1);
  localStorage.setItem("w31-db", JSON.stringify(w.dbData));
  renderDbTable(w);
}

function exportDbToCsv(b) {
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

function initPhotoshop(w) {
  const canvas = w.querySelector(".ps-canvas");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fdfdfd";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const swatchContainer = w.querySelector(".ps-swatches");
  const palette = [
    "#000000",
    "#ffffff",
    "#1d7be3",
    "#f7c948",
    "#e55381",
    "#7dd87d",
    "#8b5cf6",
    "#ff7f11",
    "#6dd3e7",
    "#2c3e50"
  ];
  palette.forEach((c) => {
    const sw = document.createElement("div");
    sw.className = "ps-swatch";
    sw.style.background = c;
    sw.onclick = () => {
      w.querySelector(".ps-color-primary").value = c;
      w.ps.primary = c;
      updatePsStatus(w);
    };
    swatchContainer.appendChild(sw);
  });

  w.ps = {
    canvas,
    ctx,
    tool: "brush",
    primary: w.querySelector(".ps-color-primary").value,
    secondary: w.querySelector(".ps-color-secondary").value,
    size: parseInt(w.querySelector(".ps-size-slider").value, 10),
    drawing: false,
    startX: 0,
    startY: 0
  };

  const sizeSlider = w.querySelector(".ps-size-slider");
  sizeSlider.addEventListener("input", (e) => {
    w.ps.size = parseInt(e.target.value, 10) || 1;
    updatePsStatus(w);
  });

  w.querySelector(".ps-color-primary").addEventListener("input", (e) => {
    w.ps.primary = e.target.value;
  });
  w.querySelector(".ps-color-secondary").addEventListener("input", (e) => {
    w.ps.secondary = e.target.value;
  });

  const fileInput = w.querySelector(".ps-file-input");
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fdfdfd";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const wScaled = img.width * scale;
        const hScaled = img.height * scale;
        const x = (canvas.width - wScaled) / 2;
        const y = (canvas.height - hScaled) / 2;
        ctx.drawImage(img, x, y, wScaled, hScaled);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  const getPos = (evt) => {
    const rect = canvas.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
  };

  const stopDrawing = () => {
    if (w.ps) w.ps.drawing = false;
  };

  canvas.addEventListener("mousedown", (e) => {
    const { x, y } = getPos(e);
    if (w.ps.tool === "fill") {
      ctx.fillStyle = w.ps.primary;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }
    if (w.ps.tool === "picker") {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const picked = `#${[pixel[0], pixel[1], pixel[2]]
        .map((v) => v.toString(16).padStart(2, "0"))
        .join("")}`;
      w.ps.primary = picked;
      w.querySelector(".ps-color-primary").value = picked;
      updatePsStatus(w);
      return;
    }
    w.ps.drawing = true;
    w.ps.startX = x;
    w.ps.startY = y;
    if (w.ps.tool === "brush" || w.ps.tool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!w.ps.drawing) return;
    const { x, y } = getPos(e);
    if (w.ps.tool === "brush" || w.ps.tool === "eraser") {
      ctx.lineWidth = w.ps.size;
      ctx.lineCap = "round";
      ctx.strokeStyle = w.ps.tool === "eraser" ? w.ps.secondary : w.ps.primary;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  });

  canvas.addEventListener("mouseup", (e) => {
    if (!w.ps.drawing) return;
    const { x, y } = getPos(e);
    if (w.ps.tool === "rect") {
      const width = x - w.ps.startX;
      const height = y - w.ps.startY;
      ctx.fillStyle = `${w.ps.primary}cc`;
      ctx.strokeStyle = w.ps.primary;
      ctx.lineWidth = Math.max(1, Math.floor(w.ps.size / 2));
      ctx.fillRect(w.ps.startX, w.ps.startY, width, height);
      ctx.strokeRect(w.ps.startX + 0.5, w.ps.startY + 0.5, width, height);
    }
    stopDrawing();
  });

  canvas.addEventListener("mouseleave", stopDrawing);
  window.addEventListener("mouseup", stopDrawing);

  updatePsStatus(w);
}

function updatePsStatus(w) {
  const toolLabel = w.querySelector(".ps-tool-label");
  const sizeLabel = w.querySelector(".ps-size-label");
  if (toolLabel) toolLabel.textContent = w.ps.tool[0].toUpperCase() + w.ps.tool.slice(1);
  if (sizeLabel) sizeLabel.textContent = `${w.ps.size}px`;
}

function setPsTool(btn, tool) {
  const w = btn.closest(".window");
  w.ps.tool = tool;
  w.querySelectorAll(".ps-tool").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  updatePsStatus(w);
}

function psApplyFilter(btn, type) {
  const w = btn.closest(".window");
  const { ctx, canvas } = w.ps;
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = img.data;
  for (let i = 0; i < data.length; i += 4) {
    let [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (type === "grayscale") {
      const avg = (r + g + b) / 3;
      r = g = b = avg;
    } else if (type === "invert") {
      r = 255 - r;
      g = 255 - g;
      b = 255 - b;
    } else if (type === "contrast") {
      const factor = 1.2;
      r = Math.min(255, (r - 128) * factor + 128);
      g = Math.min(255, (g - 128) * factor + 128);
      b = Math.min(255, (b - 128) * factor + 128);
    } else if (type === "bright") {
      r = Math.min(255, r + 18);
      g = Math.min(255, g + 18);
      b = Math.min(255, b + 18);
    } else if (type === "sharpen") {
      const boost = (v) => Math.min(255, v * 1.08 + 10);
      r = boost(r);
      g = boost(g);
      b = boost(b);
    } else if (type === "fade") {
      r = r * 0.9 + 12;
      g = g * 0.9 + 8;
      b = b * 0.8 + 18;
    }
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = a;
  }
  ctx.putImageData(img, 0, 0);
}

function psFillCanvas(btn) {
  const w = btn.closest(".window");
  const { ctx, canvas, primary } = w.ps;
  ctx.fillStyle = primary;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function psTriggerOpen(btn) {
  const w = btn.closest(".window");
  w.querySelector(".ps-file-input").click();
}

function psNewDocument(btn) {
  const w = btn.closest(".window");
  const { ctx, canvas } = w.ps;
  ctx.fillStyle = "#fdfdfd";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function psExport(btn) {
  const w = btn.closest(".window");
  const { canvas } = w.ps;
  const url = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = url;
  link.download = "oriel-photoshop.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function initPaint(w) {
  const c = w.querySelector("canvas"),
    ctx = c.getContext("2d"),
    p = w.querySelector("#paint-palette");
  w.pS = {
    d: false,
    t: "brush",
    c: "#000",
    lx: 0,
    ly: 0
  };
  ctx.fillStyle = "#FFF";
  ctx.fillRect(0, 0, c.width, c.height);
  const cols = [
    "#000",
    "#FFF",
    "#808080",
    "#C0C0C0",
    "#800000",
    "#F00",
    "#808000",
    "#FF0",
    "#008000",
    "#0F0",
    "#008080",
    "#0FF",
    "#000080",
    "#00F",
    "#800080",
    "#F0F"
  ];
  cols.forEach((x) => {
    const s = document.createElement("div");
    s.className = "color-swatch";
    s.style.background = x;
    s.onclick = () => {
      w.querySelectorAll(".color-swatch").forEach((z) =>
        z.classList.remove("active")
      );
      s.classList.add("active");
      w.pS.c = x;
    };
    p.appendChild(s);
  });
  c.onmousedown = (e) => {
    w.pS.d = true;
    const r = c.getBoundingClientRect();
    w.pS.lx = e.clientX - r.left;
    w.pS.ly = e.clientY - r.top;
  };
  c.onmousemove = (e) => {
    if (!w.pS.d) return;
    const r = c.getBoundingClientRect(),
      x = e.clientX - r.left,
      y = e.clientY - r.top;
    ctx.beginPath();
    ctx.moveTo(w.pS.lx, w.pS.ly);
    ctx.lineTo(x, y);
    ctx.strokeStyle = w.pS.t === "eraser" ? "#FFF" : w.pS.c;
    ctx.lineWidth = w.pS.t === "eraser" ? 10 : 2;
    ctx.stroke();
    w.pS.lx = x;
    w.pS.ly = y;
  };
  window.onmouseup = () => {
    if (w.pS) w.pS.d = false;
  };
}

function selectPaintTool(el, t) {
  const w = el.closest(".window");
  w.querySelectorAll(".tool-btn").forEach((b) => b.classList.remove("active"));
  el.classList.add("active");
  w.pS.t = t;
}

function clearPaint(el) {
  const c = el.closest(".window").querySelector("canvas");
  c.getContext("2d").fillRect(0, 0, c.width, c.height);
}

function initConsole(w) {
  w.consoleState = {
    cwd: "C:\\",
    history: [],
    historyIndex: null
  };
  updateConsolePrompt(w);
  const input = w.querySelector(".console-input");
  if (input) input.focus();
}

function getConsoleState(w) {
  if (!w.consoleState) initConsole(w);
  return w.consoleState;
}

function updateConsolePrompt(w) {
  const state = getConsoleState(w);
  const prompt = w.querySelector(".console-line span");
  if (prompt) prompt.textContent = `${state.cwd}>`;
}

function consolePathFromUnix(targetPath, cwd) {
  const unixCwd = cwd.replace(/^C:\\/, "/").replace(/\\/g, "/");
  const normalized = (targetPath || ".").replace(/\\/g, "/");
  const combined = normalized.startsWith("/")
    ? normalized
    : `${unixCwd}/${normalized}`;
  const segments = combined
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.toUpperCase());
  const windowsPath = `C:${segments.length ? "\\" + segments.join("\\") : "\\"}`;
  return resolveConsolePath(windowsPath, cwd);
}

function unixifyPath(path) {
  return path.replace(/^C:\\/, "/").replace(/\\/g, "/") || "/";
}

function cashLs(pathArg, state) {
  const { node } = consolePathFromUnix(pathArg || state.cwd, state.cwd);
  if (!node || node.type !== "dir") {
    return { error: "ls: No such file or directory" };
  }
  const entries = Object.keys(node.children || {}).sort();
  return { lines: entries.length ? entries : ["(empty)"] };
}

function cashPwd(state) {
  return { lines: [unixifyPath(state.cwd)] };
}

function cashCat(pathArg, state) {
  if (!pathArg) return { error: "cat: missing file operand" };
  const { node } = consolePathFromUnix(pathArg, state.cwd);
  if (!node) return { error: `cat: ${pathArg}: No such file or directory` };
  if (node.type === "dir") return { error: `cat: ${pathArg}: Is a directory` };
  return { lines: [node.content || ""] };
}

function cashEcho(argLine) {
  return { lines: [argLine || ""] };
}

function cashMkdir(argLine, state) {
  if (!argLine) return { error: "mkdir: missing operand" };
  const segments = argLine.split(/\s+/).filter(Boolean);
  const created = [];
  for (const seg of segments) {
    const { path, node } = consolePathFromUnix(seg, state.cwd);
    if (node) return { error: `mkdir: cannot create directory '${seg}': File exists` };
    const parentPath = seg.split("/").slice(0, -1).join("/");
    const { node: parent } = consolePathFromUnix(parentPath || state.cwd, state.cwd);
    if (!parent || parent.type !== "dir") {
      return { error: `mkdir: cannot create directory '${seg}': No such file or directory` };
    }
    const newName = seg.split("/").filter(Boolean).pop().toUpperCase();
    parent.children[newName] = { type: "dir", children: {} };
    created.push(seg);
  }
  saveFileSystem();
  return { lines: created.map((c) => `created ${c}`) };
}

function cashTouch(argLine, state) {
  if (!argLine) return { error: "touch: missing file operand" };
  const files = argLine.split(/\s+/).filter(Boolean);
  const created = [];
  for (const file of files) {
    const { path, node } = consolePathFromUnix(file, state.cwd);
    if (node && node.type === "dir") return { error: `touch: ${file}: Is a directory` };
    const parentPath = file.split("/").slice(0, -1).join("/");
    const { node: parent } = consolePathFromUnix(parentPath || state.cwd, state.cwd);
    if (!parent || parent.type !== "dir") {
      return { error: `touch: cannot touch '${file}': No such file or directory` };
    }
    const newName = file.split("/").filter(Boolean).pop().toUpperCase();
    parent.children[newName] = parent.children[newName] || { type: "file", content: "" };
    created.push(file);
  }
  saveFileSystem();
  return { lines: created.map((c) => `updated ${c}`) };
}

function processCashCommand(w, cmd, argLine, rawCmd) {
  const state = getConsoleState(w);
  switch (cmd) {
    case "ls":
      return cashLs(argLine, state);
    case "pwd":
      return cashPwd(state);
    case "cat":
      return cashCat(argLine, state);
    case "echo":
      return cashEcho(argLine);
    case "mkdir":
      return cashMkdir(argLine, state);
    case "touch":
      return cashTouch(argLine, state);
    case "cd": {
      if (!argLine) return { lines: [state.cwd] };
      const { path, node } = consolePathFromUnix(argLine, state.cwd);
      if (node && node.type === "dir" && path) {
        state.cwd = path;
        updateConsolePrompt(w);
        return { lines: [] };
      }
      return { error: `cd: ${argLine}: No such file or directory` };
    }
    default:
      return { error: `'${rawCmd}' is not recognized as an internal or external command.` };
  }
}

function getPathSegments(pathStr) {
  if (!pathStr) return [];
  const cleaned = pathStr.replace(/^[A-Za-z]:/, "").replace(/^\\+/, "");
  return cleaned ? cleaned.split(/\\+/).filter(Boolean) : [];
}

function resolveConsolePath(targetPath, cwd) {
  let baseSegments = getPathSegments(cwd);
  let remaining = targetPath || "";
  const driveMatch = remaining.match(/^([A-Za-z]):/);
  if (driveMatch) {
    if (driveMatch[1].toUpperCase() !== "C") return { path: null, node: null };
    baseSegments = [];
    remaining = remaining.slice(driveMatch[0].length);
  }
  if (remaining.startsWith("\\")) {
    baseSegments = [];
    remaining = remaining.replace(/^\\+/, "");
  }
  const additional = getPathSegments(remaining);
  const segments = [...baseSegments];
  additional.forEach((seg) => {
    if (!seg || seg === ".") return;
    if (seg === "..") segments.pop();
    else segments.push(seg.toUpperCase());
  });
  let node = MOCK_FS["C\\"] || MOCK_FS["C:\\"];
  segments.forEach((seg) => {
    if (!node || !node.children) return;
    const key = Object.keys(node.children).find(
      (k) => k.toUpperCase() === seg
    );
    node = key ? node.children[key] : null;
  });
  const normalizedPath =
    "C:\\" + (segments.length ? segments.join("\\") : "");
  return { path: normalizedPath.replace(/\\\\+/g, "\\"), node };
}

function appendConsoleLine(w, text = "") {
  const output = w.querySelector(".console-output");
  if (!output) return;
  const line = document.createElement("div");
  line.textContent = text;
  output.appendChild(line);
  const consoleEl = w.querySelector(".console");
  if (consoleEl) consoleEl.scrollTop = consoleEl.scrollHeight;
}

function processConsoleCommand(w, input) {
  const state = getConsoleState(w);
  appendConsoleLine(w, `${state.cwd}>${input}`);
  if (!input.trim()) {
    updateConsolePrompt(w);
    return;
  }
  const [rawCmd, ...rest] = input.trim().split(/\s+/);
  const cmd = rawCmd.toLowerCase();
  const argLine = rest.join(" ");
  const lowerArgs = argLine.trim();
  if (cmd === "cls") {
    const output = w.querySelector(".console-output");
    if (output) output.innerHTML = "";
    return;
  }
  if (cmd === "help") {
    [
      "Egg Oriel Console Commands:",
      "HELP    - Show this help text",
      "DIR/LS  - List files and folders",
      "CD      - Change directory (works with Unix-style paths)",
      "PWD     - Print working directory",
      "CAT     - Print file contents",
      "TOUCH   - Create an empty file",
      "MKDIR   - Create folders",
      "CLS     - Clear the screen",
      "ECHO    - Print text"
    ].forEach((line) => appendConsoleLine(w, line));
    return;
  }
  if (cmd === "dir") {
    const { lines, error } = cashLs(lowerArgs || state.cwd, state);
    (error ? [error] : lines).forEach((line) => appendConsoleLine(w, line));
    return;
  }

  const result = processCashCommand(w, cmd, lowerArgs, rawCmd);
  if (result.error) appendConsoleLine(w, result.error);
  (result.lines || []).forEach((line) => appendConsoleLine(w, line));
}

function handleConsoleKey(e) {
  const win = e.target.closest(".window");
  if (!win) return;
  const state = getConsoleState(win);
  if (e.key === "Enter") {
    e.preventDefault();
    processConsoleCommand(win, e.target.value);
    if (e.target.value.trim()) {
      state.history.push(e.target.value.trim());
    }
    state.historyIndex = null;
    e.target.value = "";
    setTimeout(() => e.target.focus(), 0);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (!state.history.length) return;
    if (state.historyIndex === null) state.historyIndex = state.history.length - 1;
    else if (state.historyIndex > 0) state.historyIndex--;
    e.target.value = state.history[state.historyIndex] || "";
    e.target.setSelectionRange(e.target.value.length, e.target.value.length);
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (state.historyIndex === null) return;
    if (state.historyIndex < state.history.length - 1) state.historyIndex++;
    else state.historyIndex = null;
    e.target.value =
      state.historyIndex === null ? "" : state.history[state.historyIndex];
    e.target.setSelectionRange(e.target.value.length, e.target.value.length);
  }
}

async function runCompiler(e) {
  const win = e?.target?.closest(".window") || document.querySelector(".window.active");
  const output = win?.querySelector("#compiler-out");
  const editor = win?.querySelector(".compiler-editor");

  if (!output) return;

  const code = editor?.value || "";
  if (!code.trim()) {
    output.innerHTML = `<pre>No source code provided.</pre>`;
    return;
  }

  output.innerHTML = `<pre>Sending code to Compiler Explorer...</pre>`;

  const payload = {
    source: code,
    options: {
      userArguments: "",
      compilerOptions: { executorRequest: true },
      filters: { execute: true },
      executeParameters: { args: [] }
    }
  };

  const lines = [];
  try {
    const res = await fetch("https://godbolt.org/api/compiler/g131/compile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`compiler service responded with ${res.status}`);
    }

    const data = await res.json();
    const compilerStdout = (data.stdout || []).map((s) => s.text).join("\n").trim();
    const compilerStderr = (data.stderr || []).map((s) => s.text).join("\n").trim();
    const execStdout = (data.execResult?.stdout || [])
      .map((s) => s.text)
      .join("\n")
      .trim();
    const execStderr = (data.execResult?.stderr || [])
      .map((s) => s.text)
      .join("\n")
      .trim();
    const exitCode = data.execResult?.code ?? data.code;

    lines.push("Compilation via Compiler Explorer (gcc 13.1)");
    if (compilerStdout || compilerStderr) {
      lines.push("Compiler output:");
      if (compilerStdout) lines.push(compilerStdout);
      if (compilerStderr) lines.push(compilerStderr);
    }
    lines.push(`Exit code: ${exitCode}`);
    if (execStderr) {
      lines.push("Stderr:");
      lines.push(execStderr);
    }
    lines.push("Program output:");
    lines.push(execStdout || "(no output)");
  } catch (err) {
    lines.push(`Compilation failed: ${err.message}`);
  }

  output.innerHTML = `<pre>${lines.join("\n")}</pre>`;
}

async function runPython(e) {
  const win = e?.target?.closest(".window") || document.querySelector(".window.active");
  const output = win?.querySelector("#python-out");
  const editor = win?.querySelector(".compiler-editor");

  if (!output) return;

  const code = editor?.value || "";

  if (!code.trim()) {
    output.innerHTML = `<pre>No script provided.</pre>`;
    return;
  }

  const body = {
    source: code,
    options: {
      executeParameters: { args: [], stdin: "" },
      compilerOptions: {},
      filters: { execute: true },
      tools: []
    }
  };

  output.innerHTML = `<pre>Sending code to Compiler Explorer...</pre>`;

  try {
    const response = await fetch("https://godbolt.org/api/compiler/python312/compile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const text = await response.text();
    if (!response.ok) throw new Error(text || response.statusText);

    const pre = document.createElement("pre");
    pre.textContent = text;
    output.innerHTML = "";
    output.appendChild(pre);
  } catch (err) {
    const pre = document.createElement("pre");
    pre.textContent = `Execution failed: ${err.message}`;
    output.innerHTML = "";
    output.appendChild(pre);
  }
}

function calcInput(e, v) {
  const d = e.target.closest(".window").querySelector("#calc-disp"),
    val = d.dataset.val;
  if (v === "C") d.dataset.val = "0";
  else if (v === "=") {
    try {
      d.dataset.val = eval(val).toString();
    } catch {
      d.dataset.val = "Err";
    }
  } else d.dataset.val = val === "0" && !"+-*/".includes(v) ? v : val + v;
  d.innerText = d.dataset.val;
}

function initSkiFree(win) {
  const canvas = win.querySelector(".skifree-canvas");
  const layout = win.querySelector(".skifree-layout");
  const scoreEl = win.querySelector(".skifree-score");
  const speedEl = win.querySelector(".skifree-speed");
  const statusEl = win.querySelector(".skifree-status");
  const resetBtn = win.querySelector(".skifree-reset");

  if (!canvas || !layout) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const pressed = {};
  const obstacles = [];
  const skier = { x: width / 2, y: height - 50, vx: 0, jumpTimer: 0 };
  let monster = null; // Monster Object
  let speed = 2.2;
  let score = 0;
  let playing = true;
  let lastTs = 0;
  let raf = 0;

  layout.focus();

  // Inputs
  const onKeyDown = (e) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      pressed[e.key] = true;
    }
  };
  const onKeyUp = (e) => { if (pressed[e.key]) pressed[e.key] = false; };
  layout.addEventListener("keydown", onKeyDown);
  layout.addEventListener("keyup", onKeyUp);

  const resetCourse = () => {
    obstacles.length = 0;
    monster = null;
    score = 0;
    speed = 2.2;
    skier.x = width / 2;
    skier.vx = 0;
    skier.jumpTimer = 0;
    playing = true;
    statusEl.textContent = "Carving fresh powder";
    scoreEl.textContent = "0";
    lastTs = 0;
    layout.focus();
  };

  const spawnObstacle = () => {
    const type = Math.random() < 0.7 ? "tree" : "rock";
    const x = Math.random() * width;
    const y = -50;
    obstacles.push({ x, y, type });
  };

  const drawEntity = (x, y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x - 5, y - 10, 10, 20); // Simple box representation
  };

  // MONSTER LOGIC
  const updateMonster = (dt) => {
    if (!monster && score > 2000) { // Spawn threshold
      monster = { x: Math.random() < 0.5 ? 0 : width, y: -100, speed: 0 };
      statusEl.textContent = "RUN! IT'S THE MONSTER!";
      statusEl.style.color = "red";
    }

    if (monster) {
      monster.speed = speed + 20; // Always faster than you
      // Chase logic
      const dx = skier.x - monster.x;
      const dy = skier.y - monster.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      monster.x += (dx / dist) * monster.speed * dt;
      monster.y += (dy / dist) * monster.speed * dt;

      // Draw Monster
      ctx.fillStyle = "grey";
      ctx.fillRect(monster.x - 10, monster.y - 20, 20, 40); // Big grey box
      ctx.fillStyle = "red"; // Eyes
      ctx.fillRect(monster.x - 5, monster.y - 15, 3, 3);
      ctx.fillRect(monster.x + 2, monster.y - 15, 3, 3);

      // Eat logic
      if (dist < 20) {
        playing = false;
        statusEl.textContent = "CHOMP! Game Over.";
      }
    }
  };

  const drawGame = () => {
    // Clear
    ctx.fillStyle = "#f5fbff";
    ctx.fillRect(0, 0, width, height);
    
    // Draw Skier
    ctx.fillStyle = "red";
    ctx.fillRect(skier.x - 4, skier.y - 10, 8, 20);

    // Draw Obstacles
    obstacles.forEach(o => {
      ctx.fillStyle = o.type === "tree" ? "green" : "grey";
      if(o.type === "tree") {
          ctx.beginPath(); ctx.moveTo(o.x, o.y-10); ctx.lineTo(o.x-5, o.y+5); ctx.lineTo(o.x+5, o.y+5); ctx.fill();
      } else {
          ctx.beginPath(); ctx.arc(o.x, o.y, 5, 0, Math.PI*2); ctx.fill();
      }
    });
  };

  const update = (dt) => {
    if (!playing) return;

    // Skier Physics
    const steer = (pressed["ArrowRight"] ? 1 : 0) - (pressed["ArrowLeft"] ? 1 : 0);
    skier.vx += steer * 150 * dt;
    skier.vx *= 0.9;
    skier.x = Math.max(0, Math.min(width, skier.x + skier.vx * dt));

    // Speed & Score
    const targetSpeed = pressed["ArrowDown"] ? 1.5 : 3.0;
    speed += (targetSpeed - speed) * 0.5 * dt;
    score += speed * dt * 10;
    scoreEl.textContent = Math.floor(score);
    speedEl.textContent = (speed * 10).toFixed(0) + " mph";

    // Obstacles
    if (Math.random() < 0.05) spawnObstacle();
    for (let i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].y += speed * 50 * dt;
      // Collision
      const dx = obstacles[i].x - skier.x;
      const dy = obstacles[i].y - skier.y;
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
        playing = false;
        statusEl.textContent = "Wiped Out!";
      }
      if (obstacles[i].y > height + 50) obstacles.splice(i, 1);
    }
    
    updateMonster(dt);
  };

  const loop = (ts) => {
    const dt = lastTs ? Math.min((ts - lastTs) / 1000, 0.1) : 0;
    lastTs = ts;
    update(dt);
    drawGame();
    if (playing || monster) raf = requestAnimationFrame(loop); // Keep drawing if monster eats you
  };

  resetBtn.onclick = resetCourse;
  resetCourse();
  raf = requestAnimationFrame(loop);

  win.skifreeCleanup = () => {
    cancelAnimationFrame(raf);
    layout.removeEventListener("keydown", onKeyDown);
    layout.removeEventListener("keyup", onKeyUp);
  };
}

function initLineRider(win) {
  const canvas = win.querySelector(".linerider-canvas");
  const statusEl = win.querySelector(".linerider-status");
  const modeButtons = Array.from(win.querySelectorAll(".linerider-mode"));
  const playBtn = win.querySelector(".linerider-play");
  const resetBtn = win.querySelector(".linerider-reset");
  const clearBtn = win.querySelector(".linerider-clear");

  if (!canvas || !statusEl) return;

  const ctx = canvas.getContext("2d");
  const segments = [];
  let mode = "draw";
  let drawing = false;
  let lastPoint = null;
  let sled = null;
  let raf = 0;
  let lastTs = 0;

  const setMode = (m) => {
    mode = m;
    modeButtons.forEach((btn) =>
      btn.classList.toggle("active", btn.dataset.mode === m)
    );
    canvas.style.cursor = m === "draw" ? "crosshair" : "pointer";
  };

  const toCanvas = (evt) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((evt.clientX - rect.left) / rect.width) * canvas.width,
      y: ((evt.clientY - rect.top) / rect.height) * canvas.height
    };
  };

  const resetSled = () => {
    sled = { x: 40, y: 40, vx: 120, vy: 0 };
    statusEl.textContent = "Sled reset. Draw a run and hit Ride.";
    drawScene();
  };

  const stopRide = (message = null) => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (message) statusEl.textContent = message;
  };

  const drawScene = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f1f6ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0b64c0";
    ctx.beginPath();
    segments.forEach((s) => {
      ctx.moveTo(s.x1, s.y1);
      ctx.lineTo(s.x2, s.y2);
    });
    ctx.stroke();

    if (sled) {
      ctx.fillStyle = "#202020";
      ctx.beginPath();
      ctx.arc(sled.x, sled.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffcc00";
      ctx.beginPath();
      ctx.moveTo(sled.x - 10, sled.y + 8);
      ctx.lineTo(sled.x + 12, sled.y + 8);
      ctx.stroke();
    }
  };

  const eraseSegment = (p) => {
    const maxDist = 8;
    for (let i = 0; i < segments.length; i++) {
      const s = segments[i];
      const dx = s.x2 - s.x1;
      const dy = s.y2 - s.y1;
      const lenSq = dx * dx + dy * dy || 1;
      const t = Math.max(
        0,
        Math.min(1, ((p.x - s.x1) * dx + (p.y - s.y1) * dy) / lenSq)
      );
      const projX = s.x1 + dx * t;
      const projY = s.y1 + dy * t;
      const dist = Math.hypot(p.x - projX, p.y - projY);
      if (dist <= maxDist) {
        segments.splice(i, 1);
        statusEl.textContent = "Erased a segment.";
        drawScene();
        return;
      }
    }
    statusEl.textContent = "No nearby segment to erase.";
  };

  const onPointerDown = (e) => {
    const pos = toCanvas(e);
    if (mode === "draw") {
      drawing = true;
      lastPoint = pos;
    } else {
      eraseSegment(pos);
    }
  };

  const onPointerMove = (e) => {
    if (!drawing || mode !== "draw") return;
    const pos = toCanvas(e);
    segments.push({ x1: lastPoint.x, y1: lastPoint.y, x2: pos.x, y2: pos.y });
    lastPoint = pos;
    drawScene();
  };

  const endDraw = () => {
    drawing = false;
    lastPoint = null;
  };

  const intersectSegment = (p1, p2, s) => {
    const p3 = { x: s.x1, y: s.y1 };
    const p4 = { x: s.x2, y: s.y2 };
    const denom =
      (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
    if (denom === 0) return null;
    const t =
      ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) /
      denom;
    const u =
      -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) /
      denom;
    if (t < 0 || t > 1 || u < 0 || u > 1) return null;
    return {
      x: p1.x + t * (p2.x - p1.x),
      y: p1.y + t * (p2.y - p1.y),
      t,
      seg: s
    };
  };

  const findCollision = (p1, p2) => {
    let best = null;
    segments.forEach((s) => {
      const hit = intersectSegment(p1, p2, s);
      if (!hit) return;
      if (!best || hit.t < best.t) best = hit;
    });
    return best;
  };

  const step = (ts) => {
    const dt = lastTs ? Math.min((ts - lastTs) / 1000, 0.05) : 0;
    lastTs = ts;
    if (!sled) resetSled();

    if (dt > 0) {
      sled.vy += 900 * dt;
      const next = { x: sled.x + sled.vx * dt, y: sled.y + sled.vy * dt };
      const hit = findCollision({ x: sled.x, y: sled.y }, next);
      if (hit) {
        sled.x = hit.x;
        sled.y = hit.y;
        const dx = hit.seg.x2 - hit.seg.x1;
        const dy = hit.seg.y2 - hit.seg.y1;
        const len = Math.hypot(dx, dy) || 1;
        const speed = Math.max(40, Math.hypot(sled.vx, sled.vy) * 0.98);
        sled.vx = (dx / len) * speed;
        sled.vy = (dy / len) * speed + 10 * dt;
      } else {
        sled.x = next.x;
        sled.y = next.y;
      }
    }

    drawScene();

    if (sled.y > canvas.height + 80) {
      stopRide("The rider crashed off the course.");
      return;
    }
    if (sled.x < -80 || sled.x > canvas.width + 80) {
      stopRide("The rider left the course.");
      return;
    }
    raf = requestAnimationFrame(step);
  };

  const startRide = () => {
    if (!segments.length) {
      statusEl.textContent = "Draw a track before riding.";
      return;
    }
    if (!sled) resetSled();
    lastTs = 0;
    statusEl.textContent = "Riding...";
    if (!raf) raf = requestAnimationFrame(step);
  };

  modeButtons.forEach((btn) =>
    btn.addEventListener("click", () => setMode(btn.dataset.mode))
  );
  playBtn?.addEventListener("click", startRide);
  resetBtn?.addEventListener("click", () => {
    stopRide();
    resetSled();
  });
  clearBtn?.addEventListener("click", () => {
    stopRide();
    segments.length = 0;
    resetSled();
    statusEl.textContent = "Cleared the canvas.";
  });

  canvas.addEventListener("mousedown", onPointerDown);
  canvas.addEventListener("mousemove", onPointerMove);
  canvas.addEventListener("mouseup", endDraw);
  canvas.addEventListener("mouseleave", endDraw);

  setMode(mode);
  resetSled();

  win.lineRiderCleanup = () => {
    stopRide();
    canvas.removeEventListener("mousedown", onPointerDown);
    canvas.removeEventListener("mousemove", onPointerMove);
    canvas.removeEventListener("mouseup", endDraw);
    canvas.removeEventListener("mouseleave", endDraw);
  };
}

function initSimCity(w) {
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
  const mistakesEl = win.querySelector(".papers-mistakes");

  const nations = ["Orielstotzka", "Kolechia", "Impor", "Arstotzka", "Antegria"];
  const purposes = ["Work", "Visit", "Transit", "Immigrate", "Diplomatic"];
  const firstNames = ["Elena", "Mikhail", "Sara", "Jonas", "Ilya", "Katarina", "Nikolai", "Leah"];
  const lastNames = ["Novak", "Petrov", "Garcia", "Klein", "Ivanov", "Hernandez", "Cerny", "Kozlov"];
  const colors = ["#c0392b", "#8e44ad", "#16a085", "#2980b9", "#d35400", "#7f8c8d"];
  const issues = [
    {
      note: "Passport expired.",
      apply: (p) => (p.expiry = randomDate(false)),
    },
    {
      note: "Forged ID number detected.",
      apply: (p) => (p.id = "X000-FAKE"),
    },
    {
      note: "Photo does not match traveler.",
      apply: (p) => (p.photoMismatch = true),
    },
    {
      note: "Alias listed; identity uncertain.",
      apply: (p) => (p.name = `${pick(firstNames)} ${pick(lastNames)}`),
    },
    {
      note: "Nation currently banned.",
      apply: (p) => (p.nation = "Unknown"),
    },
  ];

  const stats = {
    day: 1,
    credits: 20,
    mistakes: 0,
    processed: 0,
  };

  let current = null;

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomId() {
    return `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}-${
      Math.floor(100 + Math.random() * 900)
    }`;
  }

  function randomDate(valid = true) {
    const now = new Date();
    const delta = valid ? 40 + Math.random() * 220 : -10 - Math.random() * 120;
    now.setDate(now.getDate() + Math.round(delta));
    return now.toISOString().split("T")[0];
  }

  function updateStats() {
    if (dayEl) dayEl.textContent = stats.day;
    if (creditsEl) creditsEl.textContent = stats.credits;
    if (mistakesEl) mistakesEl.textContent = stats.mistakes;
  }

  function log(msg) {
    if (!logEl) return;
    const lines = logEl.innerText.split("\n").filter(Boolean);
    lines.unshift(msg);
    logEl.innerText = lines.slice(0, 8).join("\n");
  }

  function renderEntrant() {
    if (!current) current = generateEntrant();
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
  }

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

const MINES_ROWS = 9;
const MINES_COLS = 9;
const MINES_COUNT = 10;

let mines = [];
let mineState = "ready";
let mineTimer = null;
let mineStartTime = null;
let mineFlags = 0;

function initMinesweeper(w) {
  resetMines(w);
}

function resetMines(w) {
  const win = w || document.querySelector(".window.active");
  if (!win) return;

  const g = win.querySelector("#mines-grid");
  const counter = win.querySelector("#mines-count");
  const timer = win.querySelector("#mines-timer");
  const face = win.querySelector("#mines-face");

  stopMinesTimer();
  mineStartTime = null;
  mineState = "ready";
  mineFlags = 0;

  updateMinesLCD(counter, MINES_COUNT);
  updateMinesLCD(timer, 0);
  if (face) face.textContent = ":)";

  g.innerHTML = "";
  mines = Array.from({ length: MINES_ROWS * MINES_COLS }, () => ({
    m: false,
    r: false,
    f: false,
    n: 0
  }));

  placeMines();
  calculateAdjacency();

  for (let i = 0; i < mines.length; i++) {
    const c = document.createElement("div");
    c.className = "mine-cell";
    c.onclick = () => clickMine(i, g, win);
    c.oncontextmenu = (e) => toggleMineFlag(e, i, g, win);
    g.appendChild(c);
  }
}

function updateMinesLCD(el, val) {
  if (!el) return;
  el.textContent = String(Math.max(0, Math.min(999, val))).padStart(3, "0");
}

function placeMines() {
  let planted = 0;
  while (planted < MINES_COUNT) {
    const idx = Math.floor(Math.random() * mines.length);
    if (!mines[idx].m) {
      mines[idx].m = true;
      planted++;
    }
  }
}

function calculateAdjacency() {
  for (let i = 0; i < mines.length; i++) {
    mines[i].n = getMineNeighbors(i).filter((n) => mines[n].m).length;
  }
}

function getMineNeighbors(i) {
  const x = i % MINES_COLS;
  const y = Math.floor(i / MINES_COLS);
  const neighbors = [];

  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      if (r === 0 && c === 0) continue;
      const nx = x + c;
      const ny = y + r;
      if (nx < 0 || ny < 0 || nx >= MINES_COLS || ny >= MINES_ROWS) continue;
      neighbors.push(ny * MINES_COLS + nx);
    }
  }

  return neighbors;
}

function toggleMineFlag(e, i, g, win) {
  e.preventDefault();
  if (mineState === "lost" || mineState === "won") return;

  const cell = mines[i];
  if (cell.r) return;

  cell.f = !cell.f;
  mineFlags += cell.f ? 1 : -1;

  const counter = win.querySelector("#mines-count");
  updateMinesLCD(counter, MINES_COUNT - mineFlags);

  const el = g.children[i];
  if (cell.f) {
    el.classList.add("flagged");
    el.textContent = "⚑";
  } else {
    el.classList.remove("flagged");
    el.textContent = "";
  }
}

function clickMine(i, g, win) {
  if (mineState === "lost" || mineState === "won") return;
  const cell = mines[i];
  if (cell.r || cell.f) return;

  const timer = win.querySelector("#mines-timer");
  const face = win.querySelector("#mines-face");
  if (!mineStartTime) startMinesTimer(timer);

  revealMineCell(i, g);

  if (cell.m) {
    mineState = "lost";
    if (face) face.textContent = "X(";
    revealAllMines(g, i);
    stopMinesTimer();
    return;
  }

  checkMinesWin(win, g);
}

function revealMineCell(i, g) {
  const cell = mines[i];
  if (cell.r) return;

  const el = g.children[i];
  cell.r = true;
  el.classList.add("revealed");
  el.classList.remove("flagged");
  el.textContent = "";

  if (cell.m) {
    el.classList.add("bomb");
    el.textContent = "*";
    return;
  }

  if (cell.n > 0) {
    el.textContent = cell.n;
    el.classList.add(`c${Math.min(cell.n, 3)}`);
    return;
  }

  getMineNeighbors(i).forEach((n) => {
    if (!mines[n].r && !mines[n].m) revealMineCell(n, g);
  });
}

function revealAllMines(g, triggeredIndex) {
  mines.forEach((cell, idx) => {
    const el = g.children[idx];
    if (cell.m) {
      el.classList.add("revealed", "bomb");
      el.textContent = "*";
      if (idx === triggeredIndex) el.classList.add("blown");
    } else if (cell.f) {
      el.classList.add("revealed");
      el.textContent = "✕";
    }
  });
}

function checkMinesWin(win, g) {
  const revealedSafe = mines.filter((c) => c.r && !c.m).length;
  if (revealedSafe !== MINES_ROWS * MINES_COLS - MINES_COUNT) return;

  mineState = "won";
  const face = win.querySelector("#mines-face");
  if (face) face.textContent = "B)";
  stopMinesTimer();

  // Auto-flag remaining mines
  mines.forEach((cell, idx) => {
    if (cell.m && !cell.f) {
      g.children[idx].textContent = "⚑";
      g.children[idx].classList.add("flagged");
    }
  });
}

function startMinesTimer(timerEl) {
  mineStartTime = Date.now();
  mineTimer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - mineStartTime) / 1000);
    updateMinesLCD(timerEl, elapsed);
  }, 1000);
}

function stopMinesTimer() {
  if (mineTimer) {
    clearInterval(mineTimer);
    mineTimer = null;
  }
}

function initSplash() {
  const splash = document.getElementById("splash-screen");
  if (!splash) return;
  
  const removeSplash = () => {
    splash.style.opacity = "0";
    setTimeout(() => {
        splash.style.display = "none";
    }, 200); 
  };
  
  const timer = setTimeout(removeSplash, 5000);
  
  splash.addEventListener("click", () => {
    clearTimeout(timer);
    removeSplash();
  });
}


// System / General
window.createFolder = createFolder;
window.switchTask = switchTask;
window.endTask = endTask;

// Apps
window.handleConsoleKey = handleConsoleKey; // Fixes the Console App
window.calcInput = calcInput;
window.resetMines = resetMines;
//window.toggleMedia = toggleMedia;
window.selectPaintTool = selectPaintTool;
window.clearPaint = clearPaint;
window.copyCharMap = copyCharMap;
window.runCompiler = runCompiler;
window.runPython = runPython;

// Database App
window.addDbRecord = addDbRecord;
window.exportDbToCsv = exportDbToCsv;
window.deleteDbRecord = deleteDbRecord;

// Photoshop App
window.psTriggerOpen = psTriggerOpen;
window.psNewDocument = psNewDocument;
window.psExport = psExport;
window.setPsTool = setPsTool;
window.psApplyFilter = psApplyFilter;
window.psFillCanvas = psFillCanvas;

// Control Panel
window.openCPColor = openCPColor;
window.openCPDesktop = openCPDesktop;
window.openCPScreensaver = openCPScreensaver;
window.openCPSound = openCPSound;
window.openCPFonts = openCPFonts;
window.applyTheme = applyTheme;
window.setWallpaper = setWallpaper;
window.previewScreensaver = previewScreensaver;
window.applyScreensaver = applyScreensaver;
window.applyFontSelection = applyFontSelection;
window.submitLockPassphrase = submitLockPassphrase;
window.hideUnlockPrompt = hideUnlockPrompt;

window.onload = () => {
  bootDesktop();
  initSplash();
  initScreensaver();
};

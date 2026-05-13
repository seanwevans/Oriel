# Oriel
<img width="2935" height="1659" alt="screen" src="src/assets/screen.png" />

**[Try the Live Demo!](https://seanwevans.github.io/Oriel/)**

Oriel is a high-fidelity retro desktop simulation built with a focus on modularity and system-level abstraction. Unlike static "retro sites," Oriel implements a simulated kernel, a virtual filesystem with native mounting capabilities, and a priority-based process scheduler.

## 🚀 Getting Started

Oriel is built using **Vite** for a modern development experience with vanilla web technologies.

### Prerequisites

* Node.js (Latest LTS recommended)
* npm or yarn

### Installation

1. Clone the repository.
2. Install dependencies:
```bash
npm install

```



### Development

Launch the development server:

```bash
npm run dev

```

### Production Build

Compile the project for deployment:

```bash
npm run build

```

### Development and Testing Commands

Run the ESLint checks for the vanilla ES module source tree:

```bash
npm run lint

```

Run the native Node.js test suite:

```bash
npm test

```

Run the full local verification sequence, including linting, tests, and the production build:

```bash
npm run check

```

## 🛠 Core Architecture

The system is designed around a decoupled "App Host" model that provides applications with access to shared system services.

* **Simulated Kernel:** Manages a collection of virtual processes with a tick-based scheduler (200ms intervals) that simulates CPU time and process states (READY, RUNNING, WAITING).
* **Virtual Filesystem:** Supports a standard mock filesystem, JSON-based export/import, and native folder mounting using the File System Access API where supported.
* **App Registry:** A centralized hub that maps application types to their respective initializers and content providers, allowing for easy expansion.
* **Persistent State:** Saves and restores desktop configuration, window positions, and system settings across sessions.
* **Integrated Audio Engine:** Provides system-wide volume control and tracks media playback across different application windows.

## 📂 Application Catalog

Oriel features a vast library of pre-installed applications spanning several categories.

### Productivity & Utilities

* **Write & Notepad:** Tools for rich-text and plain-text document editing.
* **Calc & TI-83:** Functional arithmetic and graphing calculator emulations.
* **PDF Reader & Markdown Viewer:** Inline document viewers for common formats.
* **Cardfile:** A digital rolodex for managing small notes.
* **Character Map:** A utility to browse and copy symbols from various character sets.

### Games & Simulations

* **Classics:** DOOM, Minecraft Classic, Minesweeper, Solitaire, and SkiFree.
* **Creative Play:** Line Rider, Sandspiel (2D/3D), and Angry Birds.
* **Logic & Puzzles:** Chess, Sudoku, Kakuro, and Reversi.
* **Simulation:** SimCity, Cannon Duel, and Pinball.

### Development & Systems

* **Tiny C & Tiny Python:** Integrated playgrounds for C and Python scripting.
* **Shader Lab:** A GLSL playground for real-time fragment shader experimentation.
* **Postgres:** A SQL console for issuing queries against a virtual database.
* **Hex Editor:** Inspect and modify raw byte data.
* **Packet Lab:** A visualizer for network flow and packet simulations.
* **Oriel VM:** A recursive window that runs a nested instance of the Oriel environment.

### Multimedia & Social

* **Music & Audio:** Beat Lab, MIDI Sequencer, Tracker, and a functional Spotify player.
* **Communication:** IRC Client, Discord (API-driven), Messenger, and a simulated BBS Dialer.
* **Radio:** Global station streaming via Radio Garden and Radio Browser.
* **News:** RSS Reader and NetNews (Usenet-style) readers.

## 🧑‍💻 Developer Notes

### Migrating an app to `BaseApp`

Use this checklist as the completion gate before deleting `LegacyFunctionApp` and `LEGACY_CLEANUP_KEYS`:

- [ ] Implement an app class that extends `BaseApp` and moves static window markup into `getWindowContent()`.
- [ ] Keep `getWindowContent()` side-effect free; move DOM listeners, timers, network requests, media setup, animation loops, and other runtime work into `mount()`.
- [ ] Register every cleanup path through `dispose()` or `BaseApp` helpers such as `listen()`, `setInterval()`, `requestAnimationFrame()`, `trackObjectUrl()`, `trackMediaElement()`, and `trackAbortController()`.
- [ ] Update the manifest entry to use `appClass` and remove legacy `initializer`, `initializerKey`, `contentProvider`, and `contentProviderKey` wiring for that app.
- [ ] Add or update a lifecycle regression test that proves resources owned by the app are released on `dispose()`. Cover the relevant resource category, especially timers, animation frames, media/object URLs, and network `AbortController` usage.

## ⚙️ Configuration

Many network-dependent features can be configured via environment variables in a `.env` file without changing the source code:

| Variable | Description | Default |
| --- | --- | --- |
| `VITE_BROWSER_HOME` | Default landing page for the internal Web Browser. | `https://example.com/` |
| `VITE_BROWSER_PROXY_PREFIX` | Prefix for proxying browser requests. | `https://r.jina.ai/` |
| `VITE_RADIO_BROWSER_BASE` | Base URL for the Radio Browser API. | `https://de1.api.radio-browser.info/json` |
| `VITE_RSS_PROXY_ROOT` | Proxy URL used to fetch RSS/Atom feeds. | `https://api.allorigins.win/raw?url=` |

## 🧪 Technical Stack

* **Framework:** Vanilla JavaScript (ES Modules)
* **Graphics:** Three.js for 3D simulations (Sandspiel3D, Radio Garden)
* **Build Tool:** Vite
* **Testing:** Native Node.js test runner

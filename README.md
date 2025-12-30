# Oriel
[Try it!](https://seanwevans.github.io/Oriel/)

<img width="2935" height="1659" alt="screen" src="src/assets/screen.png" />
Oriel is a small retro desktop simulation built with vanilla HTML, CSS, and JavaScript.

## Applications

- Angry Birds (Bird Slinger) – Slingshot birds at makeshift forts in a browser-based clone of the classic puzzle game.
- BBS Dialer – Simulates dialing into a bulletin board system for a nostalgic terminal experience.
- Beat Lab – Step-sequencer style drum machine for crafting quick rhythms.
- Calc – Simple calculator for basic arithmetic.
- Cannon Duel – Artillery duel where you adjust angle and power to strike your opponent.
- Cardfile – Digital rolodex for storing small notes or cards.
- Character Map – Browse and copy characters from a grid of symbols.
- Checkpoint – Papers, Please-inspired document-checking vignette.
- Chess – Play a game of chess against a built-in opponent.
- Chip Studio – Tracker-style music maker for chiptune sequences.
- Clipboard – View and manage copied clipboard entries inside the OS.
- Clock – Desktop clock with both analog and digital faces.
- Control Panel – Adjust system preferences like themes and behavior.
- Data Manager – Lightweight database-style table for entering records.
- Discord (API) – Minimal client for chatting via the Discord API.
- DOOM – Play a browser port of the classic first-person shooter.
- File Manager – Navigate directories and manage files in the virtual filesystem.
- Hex Editor – Inspect and edit byte-level data in hexadecimal form.
- Image Viewer – Browse and zoom through image files.
- IRC Client – Connect to IRC channels with a retro chat interface.
- Kakuro – Fill-in puzzle similar to a numeric crossword.
- Line Rider – Draw sledding tracks and watch a rider follow your lines.
- Mafia – Text-based social deduction story featuring mystery roles.
- Markdown Viewer – Render Markdown documents inside the desktop.
- Media Player – Play local audio with basic playback controls.
- Messenger – Simple instant messenger for chatting between windows.
- MIDI Sequencer – Multi-track MIDI editor for composing melodies.
- Minesweeper – Classic minefield-clearing logic game.
- Minecraft Classic – Play the in-browser classic edition of Minecraft.
- NetNews – Retro-styled newsreader for browsing syndicated feeds.
- Nintendo 64 – Launch a browser-based N64 emulator shell.
- Notepad – Minimal plain-text editor for quick notes.
- Oriel VM – Virtual machine window running a nested Oriel environment.
- Paintbrush – Basic pixel-friendly paint program.
- Packet Lab – Visualizes packet flows for simple networking experiments.
- PDF Reader – Inline PDF viewer for reading documents.
- Pinball – Browser recreation of the classic Windows pinball table.
- Pixel Studio – Grid-focused pixel art editor.
- Postgres – PostgreSQL console for issuing SQL queries.
- Radio – Stream and browse radio stations via Radio Browser.
- Radio Garden – Explore live radio mapped onto a 3D globe.
- Read Me – In-desktop documentation about Oriel.
- Reset System – Reboot the desktop and clear current session state.
- Retro AI – Chat with an old-school AI persona.
- Reversi – Classic Othello/Reversi board game.
- RSS Reader – Read RSS and Atom feeds with proxy support.
- Sandspiel – Powder sandbox for interacting with falling sand elements.
- Sandspiel3D – 3D twist on the sand simulation sandbox.
- Shader Lab – GLSL playground for experimenting with fragment shaders.
- SkiFree – Ski downhill while dodging obstacles and the yeti.
- Solitaire – Klondike solitaire with cards and piles.
- Sound Recorder – Record and play back audio snippets.
- Spotify – Simple embedded Spotify web player window.
- Sudoku – Number-placement logic puzzle.
- Task List – Process/task viewer for the simulated OS.
- TI-83 Emulator – Emulates a TI-83 graphing calculator.
- Tiny C – Minimal C compiler playground (Tiny C Compiler / TinyCC).
- Tiny Python – Tiny Python interpreter for quick scripts.
- Tracker – Chip-style tracker for sequencing notes and effects.
- Web Browser – Built-in web browser with proxied requests.
- Whiteboard – Freeform drawing canvas with pen and eraser tools.
- Winfile – Windows-style file manager variant.
- Write – Richer document editor akin to a simple word processor.

## Configuration

Network-dependent features (browser proxying, Radio Browser, Radio Garden, and RSS fetching) can be pointed at different endpoints without modifying the source code. Provide any of the following environment variables when running Vite (e.g., via a `.env` file):

- `VITE_BROWSER_HOME` – Default home page for the built-in browser (default: `https://example.com/`).
- `VITE_BROWSER_PROXY_PREFIX` – Prefix used to proxy browser requests (default: `https://r.jina.ai/`).
- `VITE_RADIO_BROWSER_BASE` – Base URL for the Radio Browser API (default: `https://de1.api.radio-browser.info/json`).
- `VITE_RADIO_GARDEN_PROXY` – Proxy endpoint for Radio Garden searches; falls back to `VITE_BROWSER_PROXY_PREFIX` + `http://radio.garden`.
- `VITE_RSS_PROXY_ROOT` – Proxy URL used to fetch RSS/Atom feeds (default: `https://api.allorigins.win/raw?url=`).

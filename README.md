# Oriel
<img width="2935" height="1659" alt="screen" src="screen.png" />
Oriel is a small retro desktop simulation built with vanilla HTML, CSS, and JavaScript.

## Configuration

Network-dependent features (browser proxying, Radio Browser, Radio Garden, and RSS fetching) can be pointed at different endpoints without modifying the source code. Provide any of the following environment variables when running Vite (e.g., via a `.env` file):

- `VITE_BROWSER_HOME` – Default home page for the built-in browser (default: `https://example.com/`).
- `VITE_BROWSER_PROXY_PREFIX` – Prefix used to proxy browser requests (default: `https://r.jina.ai/`).
- `VITE_RADIO_BROWSER_BASE` – Base URL for the Radio Browser API (default: `https://de1.api.radio-browser.info/json`).
- `VITE_RADIO_GARDEN_PROXY` – Proxy endpoint for Radio Garden searches; falls back to `VITE_BROWSER_PROXY_PREFIX` + `http://radio.garden`.
- `VITE_RSS_PROXY_ROOT` – Proxy URL used to fetch RSS/Atom feeds (default: `https://api.allorigins.win/raw?url=`).

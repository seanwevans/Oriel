const DEFAULT_SPOTIFY_EMBED = "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M";
const SPOTIFY_KINDS = ["track", "album", "playlist", "artist", "episode", "show"];

export function getSpotifyContent() {
  return `
    <div class="spotify">
      <div class="spotify-toolbar">
        <input
          type="text"
          class="spotify-input"
          placeholder="Paste a Spotify track, playlist, album, show, or artist link"
          aria-label="Spotify link input"
        />
        <button class="task-btn spotify-load">Load</button>
        <button class="task-btn spotify-reset">Reset</button>
      </div>
      <div class="spotify-status" data-tone="info">
        Paste a Spotify URL or URI (e.g. https://open.spotify.com/track/ID or spotify:track:ID) and click Load.
      </div>
      <div class="spotify-player">
        <iframe
          class="spotify-embed"
          src="${DEFAULT_SPOTIFY_EMBED}"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  `;
}

function formatEmbedUrl(raw) {
  const link = raw?.trim();
  if (!link) return null;

  const uriMatch = link.match(/^spotify:(track|album|playlist|artist|episode|show):([A-Za-z0-9]+)$/i);
  if (uriMatch) {
    const [, kind, id] = uriMatch;
    return `https://open.spotify.com/embed/${kind.toLowerCase()}/${id}`;
  }

  try {
    const url = new URL(link);
    const segments = url.pathname.split("/").filter(Boolean);
    const [first, second, third] = segments;
    const kind = SPOTIFY_KINDS.find((k) => k === first || k === second);
    const id = kind === first ? second : kind === second ? third : null;
    if (kind && id) return `https://open.spotify.com/embed/${kind}/${id}`;
  } catch (err) {
    // Ignore parsing errors; we'll return null below.
  }

  return null;
}

export function initSpotify(win) {
  const input = win.querySelector(".spotify-input");
  const loadBtn = win.querySelector(".spotify-load");
  const resetBtn = win.querySelector(".spotify-reset");
  const iframe = win.querySelector(".spotify-embed");
  const status = win.querySelector(".spotify-status");

  const setStatus = (text, tone = "info") => {
    status.textContent = text;
    status.dataset.tone = tone;
  };

  const updateEmbed = (link) => {
    const embedUrl = formatEmbedUrl(link);
    if (!embedUrl) {
      setStatus(
        "Could not understand that link. Use a Spotify track, album, playlist, artist, show, or episode URL/URI.",
        "error"
      );
      return;
    }

    iframe.src = embedUrl;
    setStatus("Loaded Spotify embed.", "success");
  };

  loadBtn?.addEventListener("click", () => updateEmbed(input?.value));
  resetBtn?.addEventListener("click", () => {
    if (iframe) iframe.src = DEFAULT_SPOTIFY_EMBED;
    if (input) input.value = "";
    setStatus("Reset to featured playlist. Paste another link to load it.", "info");
  });
  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") updateEmbed(input.value);
  });
}

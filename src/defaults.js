export const DEFAULT_PDF_DATA_URI =
  "data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMCA0IDAgUiA+PiA+PiAvTWVkaWFCb3ggWzAgMCA1OTUuMjggODQxLjg5XSA+PgplbmRvYmoKNCAwIG9iago8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL05hbWUgL0YwIC9CYXNlRm9udCAvSGVsdmV0aWNhID4+CmVuZG9iagogNSAwIG9iago8PCAvTGVuZ3RoIDY2ID4+CnN0cmVhbQpCVAovRjAgMjQgVGYKMTIwIDcwMCBUZAooSGVsbG8gV29ybGQhKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDY3IDAwMDAwIG4gCjAwMDAwMDAxNjMgMDAwMDAgbiAKMDAwMDAwMDI2MiAwMDAwMCBuIAowMDAwMDAwMzQ3IDAwMDAwIG4gCnRyYWlsZXIKPDwgL1NpemUgNiAvUm9vdCAxIDAgUiAvSW5mbyA1IDAgUiA+PgpzdGFydHhyZWYKNDY5CiUlRU9G";

export const DEFAULT_MD_SAMPLE =
  `# Welcome to Markdown Viewer\n\n
  This is a simple markdown previewer.
  Try editing the text on the left and watch the preview update.\n\n
  ## Features\n
  - Headings, lists, and links\n
  - **Bold** and *italic* text\n`;

export const DEFAULT_SPLASH_IMAGE = new URL("./assets/splash2.jpeg", import.meta.url).href;
export const DEFAULT_SCREEN_IMAGE = new URL("./assets/screen.png", import.meta.url).href;

export const RSS_PRESETS = [
  { label: "Hacker News", url: "https://hnrss.org/frontpage" },
  { label: "Lobsters", url: "https://lobste.rs/rss" },
  { label: "BBC World", url: "http://feeds.bbci.co.uk/news/world/rss.xml" },
  { label: "Ars Technica", url: "http://feeds.arstechnica.com/arstechnica/index" }
];

export const DEFAULT_RSS_SAMPLE = [
  {
    title: "Welcome to Oriel RSS",
    link: "https://example.com/",
    date: new Date().toISOString(),
    summary:
      "Load a feed from the toolbar presets or paste any RSS/Atom URL. Items appear on the left and show details here."
  }
];

export const IRC_BOT_MESSAGES = [
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

export const RADIO_FALLBACK_PRESETS = [
  {
    name: "BBC Radio 4",
    country: "United Kingdom",
    language: "English",
    tags: "news,spoken word",
    codec: "aac",
    bitrate: 128,
    url: "https://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm",
    url_resolved: "https://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm"
  },
  {
    name: "WQXR 105.9 FM",
    country: "United States",
    language: "English",
    tags: "classical,new york",
    codec: "aac",
    bitrate: 96,
    url: "https://stream.wqxr.org/wqxr-web",
    url_resolved: "https://stream.wqxr.org/wqxr-web"
  },
  {
    name: "FM4",
    country: "Austria",
    language: "German",
    tags: "eclectic,alt",
    codec: "mp3",
    bitrate: 128,
    url: "https://orf-live.ors-shoutcast.at/fm4-q2a",
    url_resolved: "https://orf-live.ors-shoutcast.at/fm4-q2a"
  },
  {
    name: "KEXP 90.3 FM",
    country: "United States",
    language: "English",
    tags: "indie,alternative",
    codec: "aac",
    bitrate: 128,
    url: "https://kexp-mp3-streaming.xcr.com/kexp128.mp3",
    url_resolved: "https://kexp-mp3-streaming.xcr.com/kexp128.mp3"
  },
  {
    name: "FIP",
    country: "France",
    language: "French",
    tags: "eclectic,jazz,world",
    codec: "aac",
    bitrate: 128,
    url: "https://icecast.radiofrance.fr/fip-hifi.aac",
    url_resolved: "https://icecast.radiofrance.fr/fip-hifi.aac"
  }
];

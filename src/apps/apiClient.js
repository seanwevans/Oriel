import { normalizeHttpUrl, trackedFetch } from "../networking.js";

function parseHeaders(raw) {
  return (raw || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce((acc, line) => {
      const [key, ...rest] = line.split(":");
      if (!key || !rest.length) return acc;
      const value = rest.join(":").trim();
      if (value) acc[key.trim()] = value;
      return acc;
    }, {});
}

async function readResponseBody(response) {
  try {
    const text = await response.text();
    try {
      const parsed = JSON.parse(text);
      return { text, pretty: JSON.stringify(parsed, null, 2), isJson: true };
    } catch (err) {
      return { text, pretty: text, isJson: false };
    }
  } catch (err) {
    return { text: "", pretty: "<unable to read body>", isJson: false };
  }
}

function renderHeaders(headers) {
  if (!headers) return "";
  const entries = [];
  headers.forEach((value, key) => entries.push(`${key}: ${value}`));
  if (!entries.length) return "No headers returned.";
  return entries.map((line) => `<div class="httpclient-header-line">${line}</div>`).join("");
}

export function initApiClient(win) {
  const form = win.querySelector(".httpclient-form");
  const methodSelect = win.querySelector(".httpclient-method");
  const urlInput = win.querySelector(".httpclient-url");
  const headersInput = win.querySelector(".httpclient-headers-input");
  const bodyInput = win.querySelector(".httpclient-body-input");
  const sendBtn = win.querySelector(".httpclient-send");
  const statusEl = win.querySelector(".httpclient-status");
  const timingEl = win.querySelector(".httpclient-timing");
  const responseBodyEl = win.querySelector(".httpclient-response-body");
  const responseHeadersEl = win.querySelector(".httpclient-response-headers");
  const previewEl = win.querySelector(".httpclient-preview");

  if (!form || !methodSelect || !urlInput || !sendBtn || !statusEl || !responseBodyEl) return;

  const setLoading = (isLoading) => {
    sendBtn.disabled = isLoading;
    sendBtn.textContent = isLoading ? "Sending..." : "Send";
    form.classList.toggle("httpclient-loading", isLoading);
  };

  const showError = (message) => {
    statusEl.textContent = message;
    statusEl.classList.add("error");
    timingEl.textContent = "";
    responseBodyEl.textContent = "";
    responseHeadersEl.innerHTML = "";
    previewEl.textContent = "";
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const url = normalizeHttpUrl(urlInput.value);
    if (!url) {
      showError("Enter a valid URL first.");
      return;
    }

    const headers = parseHeaders(headersInput.value);
    const bodyText = bodyInput.value || "";
    const method = methodSelect.value || "GET";
    const init = { method, headers };

    if (bodyText && method !== "GET" && method !== "HEAD") {
      init.body = bodyText;
      if (!Object.keys(headers).some((key) => key.toLowerCase() === "content-type")) {
        init.headers["Content-Type"] = "application/json";
      }
    }

    setLoading(true);
    statusEl.classList.remove("error");
    statusEl.textContent = "Waiting for response...";
    timingEl.textContent = "";
    responseBodyEl.textContent = "";
    responseHeadersEl.innerHTML = "";
    previewEl.textContent = bodyText ? bodyText.slice(0, 400) : "";

    const started = performance.now();
    try {
      const response = await trackedFetch(url, init);
      const duration = Math.max(1, Math.round(performance.now() - started));
      const { pretty, isJson } = await readResponseBody(response);
      statusEl.textContent = `${response.status} ${response.statusText || ""}`.trim();
      statusEl.classList.toggle("error", !response.ok);
      timingEl.textContent = `${duration} ms · ${response.headers.get("content-type") || "unknown type"}`;
      responseBodyEl.textContent = pretty || "(empty body)";
      responseBodyEl.dataset.format = isJson ? "json" : "text";
      responseHeadersEl.innerHTML = renderHeaders(response.headers);
    } catch (err) {
      showError(`Request failed: ${err?.message || err}`);
    } finally {
      setLoading(false);
    }
  });
}

export function getApiClientContent() {
  return `
    <div class="httpclient">
      <form class="httpclient-form">
        <div class="httpclient-row">
          <select class="httpclient-method" aria-label="HTTP method">
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>PATCH</option>
            <option>DELETE</option>
            <option>HEAD</option>
          </select>
          <input class="httpclient-url" type="url" required placeholder="https://api.example.com/resource" />
          <button type="submit" class="task-btn primary httpclient-send">Send</button>
        </div>
        <div class="httpclient-row httpclient-row-split">
          <div class="httpclient-field">
            <label>Headers</label>
            <textarea class="httpclient-headers-input" placeholder="Content-Type: application/json\nAuthorization: Bearer ..."></textarea>
            <div class="httpclient-hint">One header per line, using key: value format.</div>
          </div>
          <div class="httpclient-field">
            <label>Body</label>
            <textarea class="httpclient-body-input" placeholder="{\n  \"hello\": \"world\"\n}"></textarea>
            <div class="httpclient-hint">Body is sent as plain text. Default content-type set to JSON if missing.</div>
          </div>
        </div>
        <div class="httpclient-preview" aria-live="polite"></div>
      </form>
      <div class="httpclient-meta">
        <div class="httpclient-status">No request yet.</div>
        <div class="httpclient-timing"></div>
      </div>
      <div class="httpclient-response">
        <div class="httpclient-response-headers" aria-label="Response headers"></div>
        <pre class="httpclient-response-body" aria-label="Response body" tabindex="0"></pre>
      </div>
    </div>
  `;
}

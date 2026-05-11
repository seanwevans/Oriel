import { DEFAULT_MD_SAMPLE } from "../defaults.js";

const SAFE_LINK_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(str) {
  return escapeHtml(str);
}

function getSafeLinkHref(href) {
  const trimmedHref = href.trim();
  if (!trimmedHref || trimmedHref !== href) return null;

  try {
    const url = new URL(trimmedHref);
    if (!SAFE_LINK_PROTOCOLS.has(url.protocol)) return null;
    return url.href;
  } catch {
    return null;
  }
}

function applyTextFormatting(str) {
  let html = escapeHtml(str);
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return html;
}

function applyInline(str) {
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let html = "";
  let lastIndex = 0;

  str.replace(linkPattern, (match, label, href, offset) => {
    html += applyTextFormatting(str.slice(lastIndex, offset));

    const safeHref = getSafeLinkHref(href);
    if (safeHref) {
      html += `<a href="${escapeAttribute(safeHref)}" target="_blank" rel="noopener noreferrer">${applyTextFormatting(label)}</a>`;
    } else {
      html += applyTextFormatting(match);
    }

    lastIndex = offset + match.length;
    return match;
  });

  html += applyTextFormatting(str.slice(lastIndex));
  return html;
}

export function renderMarkdown(text) {
  const lines = text.split(/\r?\n/);
  const output = [];
  let inList = false;
  let inCode = false;

  function closeListIfOpen() {
    if (!inList) return;
    output.push("</ul>");
    inList = false;
  }

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("```") && !trimmed.startsWith("```\"")) {
      closeListIfOpen();
      if (inCode) output.push("</code></pre>");
      else output.push("<pre><code>");
      inCode = !inCode;
      return;
    }

    if (inCode) {
      output.push(escapeHtml(line));
      return;
    }

    if (/^\s*[-*+]\s+/.test(line)) {
      if (!inList) {
        output.push("<ul>");
        inList = true;
      }
      output.push(`<li>${applyInline(line.replace(/^\s*[-*+]\s+/, ""))}</li>`);
      return;
    }

    if (trimmed.startsWith("#")) {
      closeListIfOpen();
      const headingMatch = trimmed.match(/^#+/);
      const level = Math.min(headingMatch ? headingMatch[0].length : 1, 6);
      const content = applyInline(trimmed.replace(/^#+\s*/, ""));
      output.push(`<h${level}>${content}</h${level}>`);
      return;
    }

    if (trimmed === "") {
      closeListIfOpen();
      output.push("<p></p>");
      return;
    }

    closeListIfOpen();
    output.push(`<p>${applyInline(line)}</p>`);
  });

  closeListIfOpen();
  if (inCode) output.push("</code></pre>");

  return output.join("\n");
}

export function initMarkdownViewer(win, initData) {
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

export function getMarkdownContent(initData) {
    const initialText =
      typeof initData === "string"
        ? initData
        : typeof initData?.text === "string"
        ? initData.text
        : DEFAULT_MD_SAMPLE;

    const root = document.createElement("div");
    root.classList.add("md-viewer");

    const toolbar = document.createElement("div");
    toolbar.classList.add("md-toolbar");

    const fileLabel = document.createElement("label");
    fileLabel.classList.add("task-btn", "file-btn");
    const fileLabelText = document.createElement("span");
    fileLabelText.textContent = "Open .md";
    fileLabel.appendChild(fileLabelText);
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".md,text/markdown";
    fileInput.classList.add("md-file-input");
    fileLabel.appendChild(fileInput);
    toolbar.appendChild(fileLabel);

    const sampleButton = document.createElement("button");
    sampleButton.classList.add("task-btn", "md-sample-btn");
    sampleButton.textContent = "Sample";
    toolbar.appendChild(sampleButton);

    const status = document.createElement("div");
    status.classList.add("md-status");
    status.textContent = "Ready";
    toolbar.appendChild(status);

    root.appendChild(toolbar);

    const body = document.createElement("div");
    body.classList.add("md-body");

    const textarea = document.createElement("textarea");
    textarea.classList.add("md-input");
    textarea.spellcheck = false;
    textarea.placeholder = "Paste Markdown here";
    textarea.value = initialText;
    body.appendChild(textarea);

    const preview = document.createElement("div");
    preview.classList.add("md-preview");
    preview.setAttribute("aria-live", "polite");
    body.appendChild(preview);

    root.appendChild(body);

    return root;

}

import { DEFAULT_MD_SAMPLE } from "../defaults.js";

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
    const trimmed = line.trim();

    if (trimmed.startsWith("```") && !trimmed.startsWith("```\"")) {
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
      const headingMatch = trimmed.match(/^#+/);
      const level = Math.min(headingMatch ? headingMatch[0].length : 1, 6);
      const content = applyInline(trimmed.replace(/^#+\s*/, ""));
      output.push(`<h${level}>${content}</h${level}>`);
      if (inList) {
        output.push("</ul>");
        inList = false;
      }
      return;
    }

    if (trimmed === "") {
      if (inList) {
        output.push("</ul>");
        inList = false;
      }
      output.push("<p></p>");
      return;
    }

    output.push(`<p>${applyInline(line)}</p>`);
  });

  if (inList) output.push("</ul>");
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

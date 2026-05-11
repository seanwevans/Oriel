import assert from "node:assert/strict";
import { test } from "node:test";

import { initMarkdownViewer, renderMarkdown } from "./markdown.js";

function renderPreview(markdown) {
  const elements = {
    ".md-input": { value: markdown, addEventListener() {} },
    ".md-preview": { innerHTML: "" },
    ".md-status": { textContent: "" },
    ".md-file-input": { addEventListener() {} },
    ".md-sample-btn": { addEventListener() {} }
  };

  initMarkdownViewer(
    {
      querySelector(selector) {
        return elements[selector] || null;
      }
    },
    "Markdown"
  );

  return elements[".md-preview"].innerHTML;
}

test("renderMarkdown escapes quotes in valid link attributes", () => {
  const html = renderMarkdown('[x](https://example.com/?q="quote"&ok=1)');

  assert.match(html, /<a\b/);
  assert.match(html, /href="https:\/\/example\.com\/\?q=%22quote%22&amp;ok=1"/);
  assert.doesNotMatch(html, /href="[^"]*"quote/);
});

test("markdown preview renders quoted malformed link destinations as plain text", () => {
  const html = renderPreview('[x](" autofocus onfocus=alert(1))');

  assert.doesNotMatch(html, /<a\b/i);
  assert.doesNotMatch(html, /<[^>]+\sonfocus\s*=/i);
  assert.match(html, /\[x\]\(&quot; autofocus onfocus=alert\(1\)\)/);
});

test("markdown preview renders javascript link destinations as plain text", () => {
  const html = renderPreview("[x](javascript:alert(1))");

  assert.doesNotMatch(html, /<a\b/i);
  assert.doesNotMatch(html, /href\s*=\s*["']javascript:/i);
  assert.match(html, /\[x\]\(javascript:alert\(1\)\)/);
});


test("renderMarkdown closes a list before a following heading", () => {
  const html = renderMarkdown("- one\n# Heading");

  assert.equal(html, "<ul>\n<li>one</li>\n</ul>\n<h1>Heading</h1>");
});

test("renderMarkdown closes a list before a following paragraph", () => {
  const html = renderMarkdown("- one\nparagraph");

  assert.equal(html, "<ul>\n<li>one</li>\n</ul>\n<p>paragraph</p>");
});

test("renderMarkdown closes blank-line-terminated lists before blank paragraphs", () => {
  const html = renderMarkdown("- one\n");

  assert.equal(html, "<ul>\n<li>one</li>\n</ul>\n<p></p>");
});

test("renderMarkdown keeps consecutive list items grouped", () => {
  const html = renderMarkdown("- one\n- two");

  assert.equal(html, "<ul>\n<li>one</li>\n<li>two</li>\n</ul>");
});

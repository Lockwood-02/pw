import React from "react";

export default function FileViewer({ filename, content, onClose, accentClass }) {
  const isMarkdown = filename.endsWith(".md");
  const html = React.useMemo(
    () => (isMarkdown ? renderMarkdown(content, accentClass) : content),
    [content, accentClass, isMarkdown]
  );

  React.useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey && (e.key === "x" || e.key === "X")) || e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="text-sm leading-relaxed">
      <div className="mb-2 text-center">{filename}</div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <div className="mt-2 border-t border-terminal-dim/40 pt-1 text-center text-xs text-terminal-dim">
        Press Ctrl+X to exit
      </div>
    </div>
  );
}

function renderMarkdown(md, accentClass) {
  const escapeHtml = (s) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const lines = md.split(/\r?\n/);
  let html = "";
  let inList = false;
  let inCode = false;
  let codeLang = "";
  let codeLines = [];

  const closeList = () => {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  };

  const flushCode = () => {
    if (!inCode) return;
    const code = escapeHtml(codeLines.join("\n"));
    const langClass = codeLang ? `language-${codeLang}` : "";
    html += `<pre class="mb-3 rounded-md border border-white/10 bg-black/40 p-3 overflow-x-auto"><code class="font-mono text-xs ${langClass}">${code}</code></pre>`;
    inCode = false;
    codeLang = "";
    codeLines = [];
  };

  // inline formatting (bold, code, links) — not used inside code blocks
  const inline = (text) => {
    // inline code first so we don't colorize inside backticks
    text = text.replace(/`([^`]+)`/g, (_, m) =>
      `<code class="font-mono text-[0.85em] px-1 py-0.5 rounded bg-white/5 border border-white/10">${escapeHtml(
        m
      )}</code>`
    );

    // **bold**
    text = text.replace(
      /\*\*(.+?)\*\*/g,
      `<strong class="${accentClass}">$1</strong>`
    );

    // _italics_
    text = text.replace(/(?<!\\)_(.+?)(?<!\\)_/g, `<em class="italic">$1</em>`);
    text = text.replace(/\\_/g, "_");

    // [label](url)
    text = text.replace(
      /\[(.+?)\]\((.+?)\)/g,
      `<a href="$2" class="${accentClass} underline" target="_blank" rel="noopener noreferrer">$1</a>`
    );

    return text;
  };

  lines.forEach((raw) => {
    // Handle fenced code start/end: ```lang
    const fence = raw.match(/^```(\s*([\w+-]+))?\s*$/);
    if (fence) {
      if (inCode) {
        // closing fence
        flushCode();
      } else {
        // opening fence
        closeList();
        inCode = true;
        codeLang = (fence[2] || "").trim();
      }
      return;
    }

    if (inCode) {
      codeLines.push(raw);
      return;
    }

    // Headings / lists / paragraphs
    if (/^#\s+/.test(raw)) {
      closeList();
      html += `<h1 class="text-xl font-bold mb-4">${inline(
        raw.replace(/^#\s+/, "")
      )}</h1>`;
    } else if (/^##\s+/.test(raw)) {
      closeList();
      html += `<h2 class="text-lg font-bold mb-2">${inline(
        raw.replace(/^##\s+/, "")
      )}</h2>`;
    } else if (/^-\s+/.test(raw)) {
      if (!inList) {
        html += '<ul class="list-disc pl-4 mb-2">';
        inList = true;
      }
      html += `<li class="mb-1">${inline(raw.replace(/^-\s+/, ""))}</li>`;
    } else if (raw.trim() === "") {
      closeList();
      html += "<br/>";
    } else {
      closeList();
      html += `<p class="mb-2">${inline(raw)}</p>`;
    }
  });

  // close any open structures
  flushCode();
  closeList();

  return html;
}
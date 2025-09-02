import React from "react";

export default function FileViewer({ filename, content, onClose, accentClass }) {
  const html = React.useMemo(() => renderMarkdown(content, accentClass), [content, accentClass]);

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
  const lines = md.split(/\r?\n/);
  let html = "";
  let inList = false;

  const closeList = () => {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  };

  const inline = (text) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, `<strong class="${accentClass}">$1</strong>`)
      .replace(/\[(.+?)\]\((.+?)\)/g, `<a href="$2" class="${accentClass} underline" target="_blank" rel="noopener noreferrer">$1</a>`);
  };

  lines.forEach((line) => {
    if (/^#\s+/.test(line)) {
      closeList();
      html += `<h1 class="text-xl font-bold mb-4">${inline(line.replace(/^#\s+/, ""))}</h1>`;
    } else if (/^##\s+/.test(line)) {
      closeList();
      html += `<h2 class="text-lg font-bold mb-2">${inline(line.replace(/^##\s+/, ""))}</h2>`;
    } else if (/^-\s+/.test(line)) {
      if (!inList) {
        html += '<ul class="list-disc pl-4 mb-2">';
        inList = true;
      }
      html += `<li class="mb-1">${inline(line.replace(/^-\s+/, ""))}</li>`;
    } else if (line.trim() === "") {
      closeList();
      html += "<br/>";
    } else {
      closeList();
      html += `<p class="mb-2">${inline(line)}</p>`;
    }
  });
  closeList();
  return html;
}
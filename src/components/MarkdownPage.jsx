import React from "react";
import { useNavigate } from "react-router";
import FileViewer from "./FileViewer.jsx";

export default function MarkdownPage({ theme, filename, content }) {
  const navigate = useNavigate();
  const accent = {
    green: "text-[#00ff99]",
    amber: "text-terminal-warning",
    ice: "text-[#80eaff]",
    red: "text-[#Ff4e4e]",
  }[theme];

  return (
    <div className="text-sm leading-relaxed">
      <div className="mb-2">
        <button
          onClick={() => navigate(-1)}
          className={`hover:underline ${accent}`}
        >
          ← back
        </button>
      </div>
      <FileViewer
        filename={filename}
        content={content}
        accentClass={accent}
        onClose={() => navigate(-1)}
      />
    </div>
  );
}

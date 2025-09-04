import React from "react";
import { useParams, useNavigate } from "react-router";
import blogsDir from "./Blogs.jsx";
import FileViewer from "./FileViewer.jsx";

export default function BlogPost({ theme }) {
  const { year, file } = useParams();
  const navigate = useNavigate();
  const accent = {
    green: "text-[#00ff99]",
    amber: "text-terminal-warning",
    ice: "text-[#80eaff]",
    red: "text-[#Ff4e4e]",
  }[theme];

  const content = blogsDir.contents[year]?.contents?.[file]?.content;

  if (!content) {
    return (
      <div className="text-sm leading-relaxed">
        <div className="mb-2">
          <button onClick={() => navigate(-1)} className={`hover:underline ${accent}`}>
            ← back
          </button>
        </div>
        <div>Post not found.</div>
      </div>
    );
  }

  return (
    <div className="text-sm leading-relaxed">
      <div className="mb-2">
        <button onClick={() => navigate(-1)} className={`hover:underline ${accent}`}>
          ← back
        </button>
      </div>
      <FileViewer
        filename={file}
        content={content}
        accentClass={accent}
        onClose={() => navigate(-1)}
      />
    </div>
  );
}


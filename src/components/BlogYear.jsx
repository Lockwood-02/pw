import React from "react";
import { Link, useParams } from "react-router";
import blogsDir, { blogIndex } from "./Blogs.jsx";

export default function BlogYear({ theme }) {
  const { year } = useParams();
  const accent = {
    green: "text-[#00ff99]",
    amber: "text-terminal-warning",
    ice: "text-[#80eaff]",
    red: "text-[#Ff4e4e]",
  }[theme];

  const files = Object.keys(blogsDir.contents[year]?.contents || {});
  const info = blogIndex.find((g) => g.year === year);

  return (
    <div className="text-sm leading-relaxed text-center space-y-6">
      <div className="text-left">
        <Link to="/" className={`hover:underline ${accent}`}>
          ← back
        </Link>
      </div>
      {info && (
        <div className="flex flex-col items-center gap-1 select-none">
          <span className={`text-4xl leading-none ${info.color}`}>{info.glyph}</span>
          <span className="text-xs text-terminal-dim">{info.year}</span>
        </div>
      )}
      <div className="grid justify-center gap-1">
        {files.map((name) => (
          <Link
            key={name}
            to={`/blogs/${year}/${name}`}
            className={`hover:underline ${accent}`}
          >
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
}


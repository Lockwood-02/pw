import React from "react";
import { blogIndex } from "./Blogs.jsx";

export default function Home({ theme, onEnter, onCommand }) {
  const accent = {
    green: "text-[#00ff99]",
    amber: "text-terminal-warning",
    ice: "text-[#80eaff]",
    red: "text-[#Ff4e4e]",
  }[theme];


  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // Only trigger if spacebar pressed and not inside an input
      if (e.code === "Space" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault(); // prevent page scroll
        if (typeof onEnter === "function") {
          onEnter();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onEnter]);

  const LinkButton = ({ cmd, children }) => (
    <button
      onClick={() => onCommand(cmd)}
      className={`hover:underline text-left ${accent}`}
    >
      {children}
    </button>
  );

  return (
    <div className="text-sm leading-relaxed text-center space-y-6">
      <div>
        <pre className={`font-mono text-4xl leading-none ${accent}`}>{String.raw`::
/ L`}</pre>
      </div>
      <p className="text-terminal-dim italic">
        We do what we must, because we can
      </p>
      <div className="flex justify-center gap-10 select-none">
        {blogIndex
          .slice()
          .reverse()
          .map((g) => (
            <button
              key={g.year}
              onClick={() => onCommand(`cd blogs/${g.year}`)}
              className="group flex flex-col items-center gap-1 bg-transparent cursor-pointer focus:outline-none"
              aria-label={`blogs ${g.year}`}
            >
              <span
                className={`text-4xl leading-none ${g.color} group-hover:opacity-90`}
              >
                {g.glyph}
              </span>
              <span className="text-xs text-terminal-dim group-hover:opacity-100">
                {g.year}
              </span>
            </button>
          ))}
      </div>


      {/* <div className="grid justify-center gap-1">
        <LinkButton cmd="about">/about →</LinkButton>
        <LinkButton cmd="favorites">/favorites →</LinkButton>
        <LinkButton cmd="research">/research →</LinkButton>
        <LinkButton cmd="projects">/projects →</LinkButton>
      </div> */}
      <div className="pt-4">
        <button
          onClick={() => onEnter()}
          className="px-3 py-1 rounded border border-white/10 hover:border-white/20"
        >
          enter terminal
        </button>
      </div>
    </div>
  );
}

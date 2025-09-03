import React from "react";
import { Link } from "react-router";
import { blogIndex } from "./Blogs.jsx";

export default function Home({ theme, onEnter }) {
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

  return (
    <div className="text-sm leading-relaxed text-center space-y-6">
      <div>
        <pre className={`font-mono text-4xl leading-none ${accent}`}>{String.raw` / /
 / /_`}</pre>
      </div>
      <p className="text-terminal-dim italic">
        We do what we must, because we can
      </p>

      {/* <svg
        viewBox="0 0 532 532"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 mx-auto"
      >
        <g id="a">
          <g id="b">
            <path
              id="c"
              d="m165 32c-57 24-105 69-131 127l248-46"
              fill="white"
            />
            <use transform="rotate(45,266,266)" xlinkHref="#c" />
          </g>
          <use transform="rotate(90,266,266)" xlinkHref="#b" />
        </g>
        <use transform="rotate(180,266,266)" xlinkHref="#a" />
      </svg> */}


      <div className="flex justify-center gap-10 select-none">
        {blogIndex
          .slice()
          .reverse()
          .map((g) => (
            <Link
              key={g.year}
              to={`/blogs/${g.year}`}
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
            </Link>
          ))}
      </div>
      <div className="flex justify-center gap-6 pt-2">
        <Link to="/about" className={`hover:underline ${accent}`}>
          About Me
        </Link>
        <Link to="/interests" className={`hover:underline ${accent}`}>
          Interests
        </Link>
      </div>
      <div className="pt-4">
        <button
          onClick={() => onEnter()}
          className="px-3 py-1 rounded border border-white/10 hover:border-white/20"
        >
          enter terminal mode
        </button>
      </div>
    </div>
  );
}

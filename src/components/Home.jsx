import React from "react";

export default function Home({ theme, onEnter, onCommand }) {
  const accent = {
    green: "text-[#00ff99]",
    amber: "text-terminal-warning",
    ice: "text-[#80eaff]",
    red: "text-[#Ff4e4e]",
  }[theme];

  const glyphs = [
    { char: "Δ", cmd: "about",     color: "text-[#7ee787]" },  // mint/green
    { char: "Ω", cmd: "favorites", color: "text-[#79c0ff]" },  // blue
    { char: "λ", cmd: "research",  color: "text-[#ffa657]" },  // orange
    { char: "θ", cmd: "projects",  color: "text-[#Ff4e4e]" },  // red
  ];


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
        {[
          { char: "Δ", cmd: "about",     color: "text-[#7ee787]", year: 2028 },  // mint/green
          { char: "Ω", cmd: "favorites", color: "text-[#79c0ff]", year: 2027 },  // blue
          { char: "λ", cmd: "research",  color: "text-[#ffa657]", year: 2026 },  // orange
          { char: "θ", cmd: "projects",  color: "text-[#Ff4e4e]", year: 2025 },  // red
        ].map((g) => (
          <button
            key={g.char}
            onClick={() => onCommand(g.cmd)}
            className="group flex flex-col items-center gap-1 bg-transparent cursor-pointer focus:outline-none"
            aria-label={`${g.cmd} (${g.year})`}
          >
            <span className={`text-4xl leading-none ${g.color} group-hover:opacity-90`}>
              {g.char}
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

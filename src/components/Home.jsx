import React from "react";

export default function Home({ theme, onEnter, onCommand }) {
  const accent = {
    green: "text-[#00ff99]",
    amber: "text-terminal-warning",
    ice: "text-[#80eaff]",
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
        face the fear, build the future
      </p>
      <div className="flex justify-center gap-6 text-3xl">
        <a
          onClick={() => onCommand("about")}
          className={`cursor-pointer ${accent}`}
        >
          σ
        </a>
        <a
          onClick={() => onCommand("favorites")}
          className={`cursor-pointer ${accent}`}
        >
          τ
        </a>
        <a
          onClick={() => onCommand("research")}
          className={`cursor-pointer ${accent}`}
        >
          λ
        </a>
        <a
          onClick={() => onCommand("projects")}
          className={`cursor-pointer ${accent}`}
        >
          φ
        </a>
      </div>
      <div className="grid justify-center gap-1">
        <LinkButton cmd="about">/about →</LinkButton>
        <LinkButton cmd="favorites">/favorites →</LinkButton>
        <LinkButton cmd="research">/research →</LinkButton>
        <LinkButton cmd="projects">/projects →</LinkButton>
      </div>
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

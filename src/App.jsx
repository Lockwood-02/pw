import React from "react";
import Terminal from "./components/Terminal.jsx";

export default function App() {
  return (
    <div className="min-h-full grid place-items-center p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-terminal-panel/70 shadow-glow border border-white/5">
        <header className="px-4 pt-4 flex items-center gap-2">
          <div className="flex gap-1">
            <span className="h-3 w-3 rounded-full bg-red-400/60"></span>
            <span className="h-3 w-3 rounded-full bg-yellow-400/60"></span>
            <span className="h-3 w-3 rounded-full bg-green-400/60"></span>
          </div>
          <div className="ml-3 text-terminal-dim text-xs">
            ~/terminal-portfolio
          </div>
        </header>
        <div className="p-4">
          <Terminal />
        </div>
      </div>
    </div>
  );
}

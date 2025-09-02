import React from "react";
import { Routes, Route } from "react-router";
import Terminal from "./components/Terminal.jsx";
import Home from "./components/Home.jsx";
import BlogYear from "./components/BlogYear.jsx";
import BlogPost from "./components/BlogPost.jsx";

export default function App() {
  const [theme, setTheme] = React.useState("green");
  const [screen, setScreen] = React.useState("home");
  const [startCmd, setStartCmd] = React.useState("");

  const glow = {
    green: "shadow-glow-green",
    amber: "shadow-glow-amber",
    ice: "shadow-glow-ice",
    red: "shadow-glow-red",
  }[theme];

  const openTerminal = (cmd = "") => {
    setStartCmd(cmd);
    setScreen("terminal");
  };

  return (
    <div className="min-h-full grid place-items-center p-4">
      <div
        className={`w-full max-w-4xl rounded-2xl bg-terminal-panel/70 border border-white/5 ${glow}`}
      >
        <header className="px-4 pt-4 flex items-center gap-2">
          <div className="flex gap-1">
            <span className="h-3 w-3 rounded-full bg-red-400/60"></span>
            <span className="h-3 w-3 rounded-full bg-yellow-400/60"></span>
            <span className="h-3 w-3 rounded-full bg-green-400/60"></span>
          </div>
          <div className="ml-3 text-terminal-dim text-xs">
            ~/isaaclockwood.dev
          </div>
        </header>
        <div className="p-4">
          <Routes>
            <Route
              path="/"
              element={
                screen === "home" ? (
                  <Home theme={theme} onEnter={() => openTerminal()} />
                ) : (
                  <Terminal
                    theme={theme}
                    setTheme={setTheme}
                    startWith={startCmd}
                    onHome={() => setScreen("home")}
                  />
                )
              }
            />
            <Route path="/blogs/:year" element={<BlogYear theme={theme} />} />
            <Route path="/blogs/:year/:file" element={<BlogPost theme={theme} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

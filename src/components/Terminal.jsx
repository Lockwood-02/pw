import React from "react";

const initialBanner = [
  "Welcome to Isaac's Personal Website",
  "Type \u001b[38;2;0;255;153mhelp\u001b[0m to get started.",
];

const projects = [
  { name: "The Salon", link: "https://example.com/salon", tag: "React/Node" },
  {
    name: "GIS Toolkit",
    link: "https://example.com/gis",
    tag: "Python/ArcGIS",
  },
  {
    name: "BladeCity (Game)",
    link: "https://example.com/bladecity",
    tag: "Godot/Blender",
  },
];

export default function Terminal({ theme, setTheme, startWith, onHome }) {
  const [history, setHistory] = React.useState(
    initialBanner.map((text) => ({ type: "line", text }))
  );
  const [input, setInput] = React.useState("");
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const print = (lines) =>
    setHistory((h) => [
        ...h,
        ...(Array.isArray(lines) ? lines : [lines]).map((line) =>
          typeof line === "string" ? { type: "line", text: line } : line
        ),
      ]);
  const clear = () => setHistory([]);

  const palette = {
    green: "text-[#00ff99]",
    amber: "text-terminal-warning",
    ice: "text-[#80eaff]",
  }[theme];

  const commands = {
    help: {
      description: "- Show available commands",
      run: () => {
        print([
          ...Object.entries(commands).map(
            ([name, { description }]) => ` ${name} ${description}`
          ),
        ]);
      },
    },
    about: {
      description: "- About me",
      run: () => {
        print([
          "Isaac Lockwood — Full‑stack dev & GIS tinkerer.",
          "I build terminal‑style UIs, mapping tools, and moody sci‑fi worlds.",
          "Stack: React, Node, Postgres, Go, ArcGIS Pro, Blender, Godot.",
        ]);
      },
    },
    home: {
      description: "- Return to the Home screen",
      run: () => {
        if (typeof onHome === "function") onHome();
      },
    },
    favorites: {
      description: "- Favorite tools & media",
      run: () => {
        print([
          "Book: Neuromancer",
          "Editor: Vim",
          "Color: #00ff99",
        ]);
      },
    },
    research: {
      description: "- Research interests",
      run: () => {
        print([
          "Real-time GIS visualization",
          "Procedural city generation",
        ]);
      },
    },
    projects: {
      description: "- Featured projects",
      run: () => {
        print(projects.map((p) => `• ${p.name} — ${p.tag} — ${p.link}`));
      },
    },
    contact: {
      description: "- How to reach me",
      run: () => {
        print([
          "Email: hello@example.com",
          "GitHub: https://github.com/your-handle",
          "X: https://x.com/your-handle",
        ]);
      },
    },
    theme: {
      description: "- [green|amber|ice] Switch accent color",
      run: ([choice]) => {
        if (["green", "amber", "ice"].includes(choice)) {
          setTheme(choice);
          print(`Theme set to ${choice}.`);
        } else {
          print("Usage: theme [green|amber|ice]");
        }
      },
    },
    clear: {
      description: "- Clear the screen",
      run: clear,
    },
  };

  const handleCommand = (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;
    print({ type: "cmd", text: cmd });

    const [name, ...args] = cmd.split(/\s+/);
    const command = commands[name.toLowerCase()];
    if (command) {
      command.run(args);
    } else {
      print(`Command not found: ${name}. Type 'help'.`);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleCommand(input);
    setInput("");
  };

  React.useEffect(() => {
    if (startWith) {
      handleCommand(startWith);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startWith]);

  return (
    <div className="text-sm leading-relaxed">
      <div className="space-y-1 min-h-[45vh]">
      {history.map((item, i) =>
          item.type === "cmd" ? (
            <CommandLine key={i} text={item.text} accentClass={palette} />
          ) : (
            <Line key={i} text={item.text} accentClass={palette} />
          )
        )}
      </div>

      <form onSubmit={onSubmit} className="mt-3 flex items-center gap-2">
        <span className={`select-none ${palette}`}>guest@terminal:</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none placeholder-terminal-dim"
          placeholder="type a command… (try: help)"
          autoComplete="off"
        />
        <button
          type="submit"
          className="px-2 py-1 rounded border border-white/10 hover:border-white/20"
        >
          run
        </button>
      </form>
    </div>
  );
}

function CommandLine({ text, accentClass }) {
    return (
      <div className="whitespace-pre-wrap">
        <span className={`select-none ${accentClass}`}>guest@terminal: </span>
        {text}
      </div>
    );
  }

function Line({ text, accentClass }) {
  // very small ANSI color shim for demo: only bright green sequence used above
  const html = text
  // eslint-disable-next-line no-control-regex
    .replace(/\u001b\[38;2;0;255;153m/g, `<span class="${accentClass}">`)
    // eslint-disable-next-line no-control-regex
    .replace(/\u001b\[0m/g, "</span>");

  return (
    <div
      className="whitespace-pre-wrap"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

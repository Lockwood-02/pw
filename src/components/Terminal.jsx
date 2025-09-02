import React from "react";
import aboutMd from "../content/about.md?raw";
import favoritesMd from "../content/favorites.md?raw";
import projectsDir from "./Projects.jsx";
import blogsDir from "./Blogs.jsx";
import FileViewer from "./FileViewer.jsx";

const initialBanner = [
  "Welcome to Isaac's Personal Website",
  "Type \u001b[38;2;0;255;153mhelp\u001b[0m to get started.",
];

const fileTree = {
  type: "dir",
  contents: {
    "about.md": { type: "file", content: aboutMd },
    "favorites.md": { type: "file", content: favoritesMd },
    projects: projectsDir,
    blogs: blogsDir,
  },
};

export default function Terminal({ theme, setTheme, startWith, onHome }) {
  const [history, setHistory] = React.useState(
    initialBanner.map((text) => ({ type: "line", text }))
  );
  const [input, setInput] = React.useState("");
  const [path, setPath] = React.useState([]);
  const [viewer, setViewer] = React.useState(null);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  React.useEffect(() => {
    if (!viewer) {
      inputRef.current?.focus();
    }
  }, [viewer]);

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
    red: "text-[#ff425f]",
  }[theme];

  const getNode = (segments) =>
    segments.reduce(
      (node, segment) => node?.contents?.[segment],
      fileTree
    );

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
    ls: {
      description: "- List files and directories",
      run: ([dir]) => {
        const segments = dir ? dir.split("/").filter(Boolean) : [];
        const target = getNode([...path, ...segments]);
        if (target?.type === "dir") {
          const names = Object.entries(target.contents).map(([name, item]) =>
            item.type === "dir" ? name + "/" : name
          );
          print(names);
        } else if (dir) {
          print(`Directory not found: ${dir}`);
        }
      },
    },
    cd: {
      description: "- Change directory",
      run: ([dir]) => {
        if (!dir) return;
        const segments = dir.split("/").filter(Boolean);
        let newPath = [...path];
        for (const segment of segments) {
          if (segment === "..") {
            newPath = newPath.slice(0, -1);
            continue;
          }
          const current = getNode(newPath);
          const next = current?.contents?.[segment];
          if (next?.type === "dir") {
            newPath.push(segment);
          } else {
            print(`Directory not found: ${dir}`);
            return;
          }
        }
        setPath(newPath);
      },
    },
    home: {
      description: "- Return to the Home screen",
      run: () => {
        if (typeof onHome === "function") onHome();
      },
    },
    nano: {
      description: "- Open file in editor",
      run: ([file]) => {
        if (!file) return;
        const segments = file.split("/").filter(Boolean);
        const filename = segments.pop();
        const dir = getNode([...path, ...segments]);
        const node = dir?.contents?.[filename];
        if (node?.type === "file") {
          setViewer({ filename, content: node.content });
          inputRef.current?.blur();
        } else {
          print(`File not found: ${file}`);
        }
      },
    },
    theme: {
      description: "- [green|amber|ice|red] Switch accent color",
      run: ([choice]) => {
        if (["green", "amber", "ice", "red"].includes(choice)) {
          setTheme(choice);
          print(`Theme set to ${choice}.`);
        } else {
          print("Usage: theme [green|amber|ice|red]");
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
    const currentPath = "/" + path.join("/");
    print({ type: "cmd", text: cmd, path: currentPath });

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

  const promptPath = "/" + path.join("/");

  if (viewer) {
    return (
      <FileViewer
        filename={viewer.filename}
        content={viewer.content}
        accentClass={palette}
        onClose={() => {
          setViewer(null);
          setTimeout(inputRef.current?.focus(), 0);
        }}
      />
    );
  }

  return (
    <>
      {viewer && (
        <FileViewer
          filename={viewer.filename}
          content={viewer.content}
          accentClass={palette}
          onClose={() => {
            setViewer(null);
            setTimeout(inputRef.current?.focus(), 0);
          }}
        />
        )}
      <div className="text-sm leading-relaxed">
        <div className="space-y-1 min-h-[45vh]">
          {history.map((item, i) =>
            item.type === "cmd" ? (
              <CommandLine
                key={i}
                text={item.text}
                path={item.path}
                accentClass={palette}
              />
            ) : (
              <Line key={i} text={item.text} accentClass={palette} />
            )
          )}
        </div>

        <form onSubmit={onSubmit} className="mt-3 flex items-center gap-2">
          <span className={`select-none ${palette}`}>
            guest@terminal:{promptPath}
          </span>
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
    </>
  );
}

function CommandLine({ text, accentClass, path }) {
  return (
    <div className="whitespace-pre-wrap">
      <span className={`select-none ${accentClass}`}>
        guest@terminal:{path} 
      </span>
      &nbsp;{text}
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

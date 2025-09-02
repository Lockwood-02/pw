// Data structure representing the blog directory. Each year has its own
// subdirectory which will contain that year's posts. To add a new year,
// simply append an entry to `blogIndex` below and the home screen as well as
// the terminal file tree will automatically include it.

export const blogIndex = [
  { year: "2025", glyph: "θ", color: "text-[#Ff4e4e]" },
  { year: "2026", glyph: "λ", color: "text-[#ffa657]" },
  { year: "2027", glyph: "Ω", color: "text-[#79c0ff]" },
  { year: "2028", glyph: "Δ", color: "text-[#7ee787]" },
];

// Import every HTML file in the content/blogs directory tree. The eager option
// pulls in the file contents at build time so the terminal can display them
// without additional fetches.
const blogFiles = import.meta.glob("../content/blogs/*/*.html", {
  query: "?raw",
  import: "default",
  eager: true,
});

// Build a file-tree structure consumed by the terminal. Years are sourced from
// `blogIndex` for consistent ordering and styling on the home screen. Each
// year's directory is populated with whatever HTML files exist on disk.
const blogsDir = {
  type: "dir",
  contents: blogIndex.reduce((acc, { year }) => {
    const files = Object.entries(blogFiles)
      .filter(([path]) => path.includes(`/blogs/${year}/`))
      .reduce((fileAcc, [path, content]) => {
        const name = path.split("/").pop();
        fileAcc[name] = { type: "file", content };
        return fileAcc;
      }, {});
    acc[year] = { type: "dir", contents: files };
    return acc;
  }, {}),
};

export default blogsDir;


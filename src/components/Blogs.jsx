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

const blogsDir = {
  type: "dir",
  contents: Object.fromEntries(
    blogIndex.map(({ year }) => [
      year,
      {
        type: "dir",
        contents: {
          "welcome.md": {
            type: "file",
            content: `Blog posts for ${year} coming soon.`,
          },
        },
      },
    ])
  ),
};

export default blogsDir;


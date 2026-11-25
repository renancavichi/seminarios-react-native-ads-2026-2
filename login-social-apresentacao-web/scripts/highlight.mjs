import { createHighlighter } from "shiki";
import { writeFile } from "node:fs/promises";
import { snippets } from "../src/data/snippets.mjs";
const highlighter = await createHighlighter({
  themes: ["github-dark"],
  langs: ["php", "tsx", "javascript", "json", "bash", "dotenv"],
});
const output = Object.fromEntries(
  Object.entries(snippets).map(([id, s]) => [
    id,
    {
      ...s,
      lines: highlighter
        .codeToTokens(s.code, { lang: s.lang, theme: "github-dark" })
        .tokens.map((line) =>
          line.map((t) => ({ text: t.content, color: t.color })),
        ),
    },
  ]),
);
await writeFile(
  new URL("../src/data/highlighted.json", import.meta.url),
  JSON.stringify(output),
);
highlighter.dispose();

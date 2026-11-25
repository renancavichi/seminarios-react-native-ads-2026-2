import { useState } from "react";
import { Check, Copy, FileCode2 } from "lucide-react";
import snippets from "../../data/highlighted.json";
export type SnippetId = keyof typeof snippets;
export function CodeWindow({
  id,
  highlight = [],
  numbers = true,
  reveal,
}: {
  id: SnippetId;
  highlight?: number[];
  numbers?: boolean;
  reveal?: number;
}) {
  const snippet = snippets[id];
  const [status, setStatus] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setStatus("Copiado");
    } catch {
      setStatus("Selecione o código para copiar");
    }
    setTimeout(() => setStatus(""), 2400);
  }
  return (
    <figure className="code-window">
      <figcaption>
        <span className="window-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="filename">
          <FileCode2 size={17} />
          {snippet.file}
        </span>
        <button
          onClick={copy}
          title="Copiar código"
          aria-label={`Copiar ${snippet.file}`}
        >
          {status === "Copiado" ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </figcaption>
      <pre tabIndex={0} aria-label={`Código de ${snippet.file}`}>
        <code>
          {snippet.lines.map((line, i) => (
            <span
              key={i}
              className={`code-line ${highlight.includes(i + 1) ? "highlight" : ""} ${reveal !== undefined && i >= reveal ? "unrevealed" : ""}`}
            >
              {numbers && (
                <span aria-hidden="true" className="line-number">
                  {i + 1}
                </span>
              )}
              <span>
                {line.map((token, j) => (
                  <span key={j} style={{ color: token.color }}>
                    {token.text}
                  </span>
                ))}
              </span>
              {"\n"}
            </span>
          ))}
        </code>
      </pre>
      <span className="copy-status" role="status">
        {status}
      </span>
    </figure>
  );
}

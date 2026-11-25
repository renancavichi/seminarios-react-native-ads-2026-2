import { useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import { FileCode2, Terminal } from 'lucide-react';
import { codeTheme } from '../styles/codeTheme';
import { CopyButton } from './CopyButton';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('json', json);

export type CodeLanguage = 'tsx' | 'ts' | 'bash' | 'js' | 'json';

export interface CodeFile {
  name: string;
  code: string;
  language?: CodeLanguage;
  /** Linhas que casam com o padrão recebem destaque. */
  highlight?: RegExp;
}

interface CodeBlockProps {
  files: CodeFile[];
  className?: string;
  showLineNumbers?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/** Bloco de código com abas (um ou mais arquivos), destaque de sintaxe e botão de copiar. */
export function CodeBlock({ files, className = '', showLineNumbers = true, size = 'md' }: CodeBlockProps) {
  const [active, setActive] = useState(0);
  const file = files[Math.min(active, files.length - 1)];
  const language = file.language ?? 'tsx';
  const code = file.code.replace(/\s+$/, '');
  const lines = code.split('\n');
  const Icon = language === 'bash' ? Terminal : FileCode2;

  return (
    <div className={`code-block code-block--${size} ${className}`}>
      <div className="code-block__bar">
        <div className="code-block__tabs" role="tablist">
          {files.map((f, i) => (
            <button
              key={f.name}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`code-block__tab ${i === active ? 'is-active' : ''}`}
              onClick={() => setActive(i)}
            >
              <Icon size={13} aria-hidden />
              {f.name}
            </button>
          ))}
        </div>
        <CopyButton text={code} />
      </div>
      <div className="code-block__body">
        <SyntaxHighlighter
          language={language}
          style={codeTheme}
          showLineNumbers={showLineNumbers && language !== 'bash'}
          lineNumberStyle={{ minWidth: '2.4em', paddingRight: '1em', color: '#4b5275', userSelect: 'none' }}
          wrapLines
          lineProps={(lineNumber: number) =>
            file.highlight?.test(lines[lineNumber - 1] ?? '')
              ? { className: 'code-line code-line--hl' }
              : { className: 'code-line' }
          }
          customStyle={{ margin: 0, background: 'transparent', padding: '12px 0' }}
          codeTagProps={{ style: { fontFamily: 'var(--mono)' } }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

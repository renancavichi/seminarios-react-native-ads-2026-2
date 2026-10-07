import { CodeHighlight } from '@mantine/code-highlight';

// Thin wrapper so every code sample in the site looks consistent.
export default function CodeBlock({ code, language = 'tsx', ...props }) {
  return (
    <CodeHighlight
      code={code.trim()}
      language={language}
      radius="md"
      withCopyButton
      {...props}
    />
  );
}

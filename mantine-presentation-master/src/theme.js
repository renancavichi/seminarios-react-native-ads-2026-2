import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'indigo',
  defaultRadius: 'md',
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontFamilyMonospace:
    '"JetBrains Mono", "Fira Code", Menlo, Consolas, monospace',
  headings: {
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: '700',
  },
  cursorType: 'pointer',
  defaultGradient: { from: 'indigo', to: 'cyan', deg: 45 },
  shadows: {
    md: '0 4px 18px rgba(0, 0, 0, 0.06)',
    xl: '0 12px 36px rgba(0, 0, 0, 0.08)',
  },
});

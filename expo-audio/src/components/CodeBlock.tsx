import type { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

/** Destaque de sintaxe simples (regex), suficiente para slides. */
const TOKEN =
  /(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|\b(const|let|await|async|function|return|if|else|import|from|export|new|true|false|null|type)\b|\b(\d+(?:\.\d+)?)\b|([A-Za-z_$][\w$]*)(?=\()/g;

// comentário, string, palavra-chave, número, chamada de função
const TOKEN_COLORS = ['#7A7E85', '#9CBF7A', '#CF8E6D', '#6FB3C4', '#E2C08D'];
const MONO = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'Consolas, Menlo, monospace' });

function highlight(line: string, key: string) {
  const parts: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of line.matchAll(TOKEN)) {
    const start = m.index ?? 0;
    if (start > last) parts.push(line.slice(last, start));
    const group = m.slice(1).findIndex((g) => g !== undefined);
    parts.push(
      <Text key={`${key}-${i++}`} style={{ color: TOKEN_COLORS[group] }}>
        {m[0]}
      </Text>,
    );
    last = start + m[0].length;
  }
  if (last < line.length) parts.push(line.slice(last));
  return parts;
}

type Props = { code: string; title?: string; fontSize?: number };

export function CodeBlock({ code, title, fontSize = 14 }: Props) {
  const lines = code.split('\n');
  return (
    <View style={styles.box}>
      {title && (
        <View style={styles.header}>
          <Text style={[styles.title, { fontFamily: MONO }]}>{title}</Text>
        </View>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.code}>
        <View>
          {lines.map((line, idx) => (
            <Text key={idx} style={[styles.line, { fontSize, lineHeight: fontSize * 1.6, fontFamily: MONO }]}>
              {line.length ? highlight(line, String(idx)) : ' '}
            </Text>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.code,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: { color: colors.textMuted, fontSize: 12 },
  code: { padding: 16 },
  line: { color: '#D4D4D4' },
});

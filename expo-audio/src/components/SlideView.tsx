/**
 * Desenho de um slide (usado na tela /slides).
 */
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { CodeBlock } from '@/components/CodeBlock';
import type { Slide } from '@/slides/content';
import { colors } from '@/theme/colors';

const MONO = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'Consolas, Menlo, monospace' });

type Props = {
  slide: Slide;
  scale: number;
  wide: boolean;
};

export function SlideView({ slide, scale, wide }: Props) {
  return slide.cover ? (
    <Cover slide={slide} scale={scale} />
  ) : (
    <Body slide={slide} scale={scale} wide={wide} />
  );
}

function Cover({ slide, scale }: { slide: Slide; scale: number }) {
  return (
    <View style={styles.cover}>
      <Text style={[styles.coverTitle, { fontSize: 72 * scale, lineHeight: 80 * scale }]}>{slide.title}</Text>
      {slide.subtitle && (
        <Text style={[styles.coverSubtitle, { fontSize: 21 * scale, lineHeight: 30 * scale }]}>{slide.subtitle}</Text>
      )}
      <View style={styles.coverRule} />
      <Text style={styles.coverMeta}>Sonora, app de exemplo · Expo SDK 58</Text>
    </View>
  );
}

function Body({ slide, scale, wide }: Props) {
  const hasSide = !!(slide.code && slide.bullets);
  const codeTitle = slide.codeLabel ?? slide.file;

  return (
    <View>
      {slide.section && <Text style={[styles.section, { fontSize: 14 * scale }]}>{slide.section}</Text>}
      <Text style={[styles.title, { fontSize: 38 * scale, lineHeight: 46 * scale }]}>{slide.title}</Text>

      <View style={[styles.body, wide && hasSide && styles.bodyWide]}>
        {slide.bullets && (
          <View style={[styles.bullets, wide && hasSide && { flex: 1 }]}>
            {slide.bullets.map((b) => (
              <View key={b} style={styles.bulletRow}>
                <View style={[styles.bulletMark, { marginTop: 14 * scale }]} />
                <Text style={[styles.bullet, { fontSize: 19 * scale, lineHeight: 28 * scale }]}>{b}</Text>
              </View>
            ))}
          </View>
        )}

        {slide.code && (
          <View style={wide && hasSide ? { flex: 1.2 } : undefined}>
            <CodeBlock code={slide.code} title={codeTitle} fontSize={(wide ? 14 : 12) * scale} />
          </View>
        )}

        {slide.table && <Table table={slide.table} scale={scale} />}
      </View>

      {slide.demo && (
        <View style={styles.footerRow}>
          <Pressable style={styles.demoBtn} onPress={() => router.push(slide.demo!.href)}>
            <Text style={styles.demoText}>Abrir no app: {slide.demo.label}</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.accent} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

function Table({ table, scale }: { table: NonNullable<Slide['table']>; scale: number }) {
  const fontSize = 17 * scale;
  return (
    <View style={styles.table}>
      <View style={[styles.tr, styles.thead]}>
        {table.head.map((h, i) => (
          <Text key={i} style={[styles.th, { fontSize: fontSize * 0.85 }, i === 0 && styles.firstCol]}>
            {h}
          </Text>
        ))}
      </View>
      {table.rows.map((row, r) => (
        <View key={r} style={[styles.tr, r === table.rows.length - 1 && { borderBottomWidth: 0 }]}>
          {row.map((cell, c) => (
            <Text
              key={c}
              style={[
                styles.td,
                { fontSize, lineHeight: fontSize * 1.4 },
                c === 0 && styles.firstCol,
                table.monoCols?.includes(c) && { fontFamily: MONO, fontSize: fontSize * 0.88 },
              ]}
            >
              {cell}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cover: { maxWidth: 900 },
  coverTitle: { color: colors.text, fontWeight: '700' },
  coverSubtitle: { color: colors.textMuted, marginTop: 20 },
  coverRule: { width: 64, height: 2, backgroundColor: colors.accent, marginTop: 40, marginBottom: 16 },
  coverMeta: { color: colors.textMuted, fontSize: 14 },
  section: { color: colors.accent, marginBottom: 10 },
  title: { color: colors.text, fontWeight: '700' },
  body: { marginTop: 32, gap: 28 },
  bodyWide: { flexDirection: 'row', alignItems: 'flex-start', gap: 48 },
  bullets: { gap: 16 },
  bulletRow: { flexDirection: 'row', gap: 14 },
  bulletMark: { width: 6, height: 2, backgroundColor: colors.textMuted },
  bullet: { color: colors.text, flex: 1 },
  table: { borderWidth: 1, borderColor: colors.border, borderRadius: 4, maxWidth: 1000 },
  tr: { flexDirection: 'row', borderBottomWidth: 1, borderColor: colors.border },
  thead: { backgroundColor: colors.surface },
  th: { flex: 1, color: colors.textMuted, paddingHorizontal: 16, paddingVertical: 10, fontWeight: '600' },
  td: { flex: 1, color: colors.text, paddingHorizontal: 16, paddingVertical: 12 },
  firstCol: { flex: 1.4 },
  footerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 32 },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  demoText: { color: colors.accent, fontSize: 14, fontWeight: '600' },
});

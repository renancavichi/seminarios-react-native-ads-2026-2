import { ReactNode } from 'react';
import { Image, Linking, Platform, Pressable, Text, View } from 'react-native';
import { IMAGES } from './images';
import { Item, Slide, TextLine } from './types';

// Fontes do PPTX: Calibri (texto) e Courier New (código)
export const FONT = Platform.select({ web: "Calibri, Carlito, 'Segoe UI', Arial, sans-serif", default: undefined });
export const MONO = Platform.select({ web: "'Courier New', Courier, 'Liberation Mono', monospace", ios: 'Courier New', default: 'monospace' });

type ItemOver = { fill?: string; line?: { c: string; w: number } | null };

/** Desenha uma forma ou imagem do slide (medidas em polegadas × u = pixels). */
export function ItemView({ it, u, over }: { it: Item; u: number; over?: ItemOver }) {
  const base = { position: 'absolute' as const, left: it.x * u, top: it.y * u, width: it.w * u, height: it.h * u };
  if (it.k === 'img') {
    return <Image source={IMAGES[it.src as string]} style={base} resizeMode="stretch" />;
  }
  const line = over && 'line' in over ? over.line : it.line;
  const radius = it.k === 'ellipse' ? 9999 : it.k === 'rrect' ? Math.min((it.r ?? 0) * u, (it.w * u) / 2, (it.h * u) / 2) : 0;
  return (
    <View
      style={[base, {
        backgroundColor: over?.fill ?? it.fill ?? 'transparent',
        borderRadius: radius,
        borderWidth: line ? Math.max(1, line.w * u) : 0,
        borderColor: line ? line.c : 'transparent',
      }]}
    />
  );
}

/** Desenha uma linha de texto na mesma posição, tamanho e cor do slide. */
export function TextView({ t, u, text, color }: { t: TextLine; u: number; text?: string; color?: string }) {
  const first = t.runs[0];
  const fs = (first.s * u) / 72;
  const mono = first.m;
  const asc = mono ? 0.833 : 0.952;
  const lh = fs * (mono ? 1.133 : 1.22);
  const full = t.runs.map((r) => r.t).join('');
  const isLink = full.startsWith('docs.expo.dev');
  const node = (
    <Text
      allowFontScaling={false}
      onPress={isLink ? () => Linking.openURL('https://' + full.trim()) : undefined}
      style={[
        { position: 'absolute', left: t.x * u, top: t.y * u - asc * fs, width: (20 - t.x) * u, fontSize: fs, lineHeight: lh },
        Platform.OS === 'web' ? ({ whiteSpace: 'pre' } as object) : null,
      ]}
    >
      {text !== undefined ? (
        <Text style={{ color: color ?? first.c, fontWeight: first.b ? '700' : '400', fontFamily: first.m ? MONO : FONT, fontSize: fs }}>{text}</Text>
      ) : (
        t.runs.map((r, i) => (
          <Text key={i} style={{
            color: color ?? r.c, fontWeight: r.b ? '700' : '400', fontFamily: r.m ? MONO : FONT, fontSize: (r.s * u) / 72,
            textDecorationLine: isLink ? 'underline' : 'none',
          }}>{r.t}</Text>
        ))
      )}
    </Text>
  );
  return node;
}

/** Área clicável por cima de uma forma do slide. */
export function Hit({ it, u, onPress }: { it: Item; u: number; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{ position: 'absolute', left: it.x * u, top: it.y * u, width: it.w * u, height: it.h * u, borderRadius: 9999 }}
    />
  );
}

type Hidden = { items?: number[]; texts?: number[] };

/** Um slide inteiro, idêntico ao PPTX. `hidden` esconde peças que viram componentes ao vivo. */
export default function SlideCanvas({ slide, u, hidden, children }: { slide: Slide; u: number; hidden?: Hidden; children?: ReactNode }) {
  return (
    <View style={{ width: 20 * u, height: 11.25 * u, backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
      {slide.items.map((it, i) => (hidden?.items?.includes(i) ? null : <ItemView key={'i' + i} it={it} u={u} />))}
      {slide.texts.map((t, i) => (hidden?.texts?.includes(i) ? null : <TextView key={'t' + i} t={t} u={u} />))}
      {children}
    </View>
  );
}

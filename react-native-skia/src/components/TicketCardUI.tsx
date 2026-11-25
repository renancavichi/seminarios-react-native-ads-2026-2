import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { SLIDES, SlideMetadata } from '../constants/theme';

interface TicketCardUIProps {
  cardX: number;
  cardY: number;
  cardWidth: number;
  cardHeight: number;
  slide: SlideMetadata;
  onSelectSlide: (index: number) => void;
  onActivatePower: () => void;
}

export const TicketCardUI: React.FC<TicketCardUIProps> = ({
  cardX,
  cardY,
  cardWidth,
  cardHeight,
  slide,
  onSelectSlide,
  onActivatePower,
}) => {
  const handleStep = (delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const next = (slide.index + delta + SLIDES.length) % SLIDES.length;
    onSelectSlide(next);
  };

  const handleDotPress = (idx: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onSelectSlide(idx);
  };

  return (
    <View
      style={[
        styles.container,
        {
          left: cardX,
          top: cardY,
          width: cardWidth,
          height: cardHeight,
        },
      ]}
      pointerEvents="box-none"
    >
      {/* 1. Cabeçalho: Tag da Equipe/Facção & Contador do Slide */}
      <View style={styles.topSection}>
        <View style={styles.tagRow}>
          <View
            style={[
              styles.factionBadge,
              {
                backgroundColor: slide.accentColor + '20',
                borderColor: slide.accentColor + '66',
              },
            ]}
          >
            <Text
              style={[styles.factionTagText, { color: slide.accentColor }]}
              numberOfLines={1}
            >
              {slide.factionTag}
            </Text>
          </View>
          <Text style={styles.slideCounter}>
            0{slide.index + 1} / 0{SLIDES.length}
          </Text>
        </View>

        {/* Nome do Personagem / Equipe */}
        <Text style={styles.characterTitle} numberOfLines={1}>
          {slide.title}
        </Text>
        <Text
          style={[styles.characterSubtitle, { color: slide.accentColor }]}
          numberOfLines={1}
        >
          {slide.subtitle}
        </Text>
      </View>

      {/* 2. Bloco de Curiosidade Real (Fatos dos Quadrinhos / Produção) */}
      <View
        style={[
          styles.triviaBox,
          { borderLeftColor: slide.accentColor },
        ]}
      >
        <Text style={[styles.triviaHeader, { color: slide.accentColor }]}>
          ★ CURIOSIDADE OFICIAL
        </Text>
        <Text style={styles.triviaText}>{slide.trivia}</Text>
      </View>

      {/* 3. Dica de Poder Interativo do Emblema */}
      <Pressable
        style={[
          styles.powerBanner,
          {
            borderColor: slide.accentColor + '55',
            backgroundColor: slide.accentColor + '14',
          },
        ]}
        onPress={onActivatePower}
      >
        <Text style={styles.powerHintText} numberOfLines={2}>
          ⚡ {slide.interactionHint}
        </Text>
      </Pressable>

      {/* 4. Rodapé: Indicador de Navegação e Seletor de Slides */}
      <View style={styles.footerSection}>
        <View style={styles.navControlsRow}>
          <Pressable
            style={styles.stepButton}
            onPress={() => handleStep(-1)}
            hitSlop={8}
          >
            <Text style={styles.stepButtonText}>‹ ANTERIOR</Text>
          </Pressable>

          <View style={styles.dotsRow}>
            {SLIDES.map((s, idx) => {
              const active = idx === slide.index;
              return (
                <Pressable
                  key={s.id}
                  onPress={() => handleDotPress(idx)}
                  hitSlop={6}
                  style={[
                    styles.dot,
                    {
                      width: active ? 18 : 7,
                      backgroundColor: active
                        ? slide.accentColor
                        : 'rgba(255, 255, 255, 0.28)',
                    },
                  ]}
                />
              );
            })}
          </View>

          <Pressable
            style={styles.stepButton}
            onPress={() => handleStep(1)}
            hitSlop={8}
          >
            <Text style={styles.stepButtonText}>PRÓXIMO ›</Text>
          </Pressable>
        </View>

        <Text style={styles.navIndicatorText}>
          Arraste para o lado para trocar • Toque no emblema para ativar
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    paddingHorizontal: 18,
    paddingVertical: 14,
    justifyContent: 'space-between',
    zIndex: 20,
  },
  topSection: {
    gap: 2,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  factionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    maxWidth: '82%',
  },
  factionTagText: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 1,
  },
  slideCounter: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1,
    marginRight: 14,
  },
  characterTitle: {
    color: '#f8fafc',
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 1.8,
  },
  characterSubtitle: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  triviaBox: {
    backgroundColor: 'rgba(2, 6, 12, 0.52)',
    borderLeftWidth: 3,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 3,
  },
  triviaHeader: {
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  triviaText: {
    color: '#e2e8f0',
    fontSize: 11,
    lineHeight: 15.5,
    fontWeight: '500',
  },
  powerBanner: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  powerHintText: {
    color: '#f8fafc',
    fontSize: 9.5,
    fontWeight: '600',
    lineHeight: 13,
  },
  footerSection: {
    gap: 4,
  },
  navControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  stepButtonText: {
    color: '#e2e8f0',
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 7,
    borderRadius: 3.5,
  },
  navIndicatorText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 8.5,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.4,
  },
});

import { SymbolView, SymbolViewProps } from 'expo-symbols';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { IFSP_GRAY, IFSP_GRAY_DARK, IFSP_GREEN } from '@/constants/ifsp-colors';
import { BottomTabInset } from '@/constants/theme';

export type SensorMenuCard<T extends string> = {
  screen: T;
  icon: SymbolViewProps['name'];
  title: string;
  description: string;
};

export type SensorMenuProps<T extends string> = {
  title: string;
  subtitle: string;
  cards: SensorMenuCard<T>[];
  onSelect: (screen: T) => void;
  /** Conteúdo extra fixado embaixo da tela, logo acima da barra de tabs. */
  footer?: ReactNode;
};

export function SensorMenu<T extends string>({
  title,
  subtitle,
  cards,
  onSelect,
  footer,
}: SensorMenuProps<T>) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.cardGrid}>
        {cards.map((card) => (
          <Pressable key={card.screen} style={styles.card} onPress={() => onSelect(card.screen)}>
            <View style={styles.cardIconWrap}>
              <SymbolView tintColor={IFSP_GREEN} name={card.icon} size={28} />
            </View>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardDescription}>{card.description}</Text>
          </Pressable>
        ))}
      </View>

      {footer && <View style={styles.footer}>{footer}</View>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: IFSP_GRAY_DARK,
  },
  content: {
    alignItems: 'center',
    flexGrow: 1,
  },
  header: {
    marginTop: 60,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#c4c4c4',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  cardGrid: {
    marginTop: 32,
    width: '100%',
    paddingHorizontal: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    flexBasis: '45%',
    flexGrow: 1,
    alignItems: 'center',
    gap: 8,
    backgroundColor: IFSP_GRAY,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  cardIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: IFSP_GRAY_DARK,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardDescription: {
    color: '#c4c4c4',
    fontSize: 12,
    textAlign: 'center',
  },
  footer: {
    marginTop: 24,
    marginBottom: BottomTabInset + 12,
    alignItems: 'center',
  },
});

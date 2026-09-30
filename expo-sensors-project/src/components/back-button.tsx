import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { IFSP_GREEN } from '@/constants/ifsp-colors';

export function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.backButton} onPress={onPress}>
      <SymbolView tintColor={IFSP_GREEN} name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }} size={22} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});

import { Text, Pressable, StyleSheet } from 'react-native';
import ChoiceSymbol from './game/ChoiceSymbol';

export default function ChoiceDisplay({ escolha, onPress, selected = false, disabled = false }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Escolher ${escolha.title}`} accessibilityState={{ selected, disabled }}
      disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.item, selected && styles.selected, pressed && styles.pressed]}>
      <ChoiceSymbol choice={escolha} size={36} color={selected ? '#3658b3' : '#647084'} />
      <Text style={[styles.title, selected && styles.selectedText]}>{escolha.title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: { flex: 1, minHeight: 76, padding: 8, gap: 6, borderWidth: 2, borderColor: '#e3e7ee', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderRadius: 14 },
  selected: { backgroundColor: '#edf2ff', borderColor: '#5274cc' },
  pressed: { opacity: 0.7 },
  title: { fontSize: 14, color: '#536174', fontWeight: '600' },
  selectedText: { color: '#3658b3' },
});

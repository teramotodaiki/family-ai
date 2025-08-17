import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Colors } from '../../../src/theme';
import type { Suggestion } from '../../../src/types/chat';

type Props = {
  colors: Colors;
  suggestions: Suggestion[];
  onSelect: (text: string) => void;
};

export default function ChatSuggestions({
  colors,
  suggestions,
  onSelect,
}: Props) {
  return (
    <View style={styles.container}>
      {suggestions.map((s) => (
        <TouchableOpacity
          key={s.id}
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={() => onSelect(s.text)}
        >
          <Text style={[styles.text, { color: colors.text }]}>{s.text}</Text>
          <Text style={[styles.subtext, { color: colors.muted }]}>
            {s.subtext}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  card: {
    backgroundColor: '#0f0f0f',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  text: { color: '#fff', fontSize: 16, fontWeight: '600' },
  subtext: { color: '#888', fontSize: 12, marginTop: 4 },
});

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Colors } from '../../../src/theme';

type Props = {
  colors: Colors;
  paddingTop: number;
  onPressMenu: () => void;
  onPressTitle: () => void;
  selectedModelLabel: string;
};

export default function ChatHeader({
  colors,
  paddingTop,
  onPressMenu,
  onPressTitle,
  selectedModelLabel,
}: Props) {
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop,
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPressMenu}
        style={styles.headerButton}
        testID='menu-button'
      >
        <Ionicons name='menu' size={24} color={colors.text} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.title}
        onPress={onPressTitle}
        testID='header-title'
      >
        <Text style={[styles.titleText, { color: colors.text }]}>
          {selectedModelLabel}
        </Text>
        <Ionicons name='chevron-down' size={16} color={colors.text} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.headerButton} testID='refresh-button'>
        <Ionicons name='refresh-outline' size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  titleText: { fontSize: 16, fontWeight: '600', marginRight: 4, color: '#fff' },
});

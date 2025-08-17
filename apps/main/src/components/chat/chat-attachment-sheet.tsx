import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Colors } from '../../../src/theme';

type AttachmentOption = {
  id: string;
  label: string;
  icon: 'camera' | 'circle' | 'list';
};

type Props = {
  colors: Colors;
  visible: boolean;
  bottomInset: number;
  options: AttachmentOption[];
  onClose: () => void;
};

export default function ChatAttachmentSheet({
  colors,
  visible,
  bottomInset,
  options,
  onClose,
}: Props) {
  if (!visible) return null;
  return (
    <View
      style={[
        styles.container,
        { bottom: 70 + bottomInset, backgroundColor: colors.surface },
      ]}
    >
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={styles.option}
          onPress={onClose}
        >
          {option.icon === 'camera' && (
            <Ionicons name='camera' size={32} color={colors.text} />
          )}
          {option.icon === 'circle' && (
            <View
              style={[
                styles.circleIcon,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.text,
                },
              ]}
            />
          )}
          {option.icon === 'list' && (
            <Ionicons name='list' size={32} color={colors.text} />
          )}
          {option.label ? (
            <Text style={[styles.optionLabel, { color: colors.text }]}>
              {option.label}
            </Text>
          ) : null}
        </TouchableOpacity>
      ))}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name='sunny' size={24} color={colors.text} />
          <Text style={[styles.actionText, { color: colors.text }]}>
            より長く思考する
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name='psychology' size={24} color={colors.text} />
          <Text style={[styles.actionText, { color: colors.text }]}>
            エージェントモード
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name='search' size={24} color={colors.text} />
          <Text style={[styles.actionText, { color: colors.text }]}>
            Deep Research
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name='book' size={24} color={colors.text} />
          <Text style={[styles.actionText, { color: colors.text }]}>
            あらゆる学びをサポート
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name='image' size={24} color={colors.text} />
          <Text style={[styles.actionText, { color: colors.text }]}>
            画像を作成する
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  option: { alignItems: 'center', marginBottom: 16 },
  optionLabel: { color: '#fff', fontSize: 12, marginTop: 4 },
  circleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#fff',
  },
  actions: { marginTop: 20 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  actionText: { color: '#fff', fontSize: 16 },
});

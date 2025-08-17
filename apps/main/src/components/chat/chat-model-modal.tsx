import { Ionicons } from '@expo/vector-icons';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Colors } from '../../../src/theme';
import type { Model } from '../../../src/types/chat';

type Props = {
  colors: Colors;
  visible: boolean;
  onClose: () => void;
  models: Model[];
  selectedModel: string;
  onSelect: (name: string) => void;
};

export default function ChatModelModal({
  colors,
  visible,
  onClose,
  models,
  selectedModel,
  onSelect,
}: Props) {
  return (
    <Modal
      animationType='slide'
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.content, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            モデルを選択
          </Text>
          {models.map((model) => (
            <TouchableOpacity
              key={model.id}
              style={[styles.option, { borderTopColor: colors.border }]}
              onPress={() => onSelect(model.name)}
            >
              <View style={styles.optionInfo}>
                <Text style={[styles.optionName, { color: colors.text }]}>
                  {model.name}
                </Text>
                <Text style={[styles.optionDesc, { color: colors.muted }]}>
                  {model.description}
                </Text>
              </View>
              {selectedModel === model.name && (
                <Ionicons name='checkmark' size={24} color='#007AFF' />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 16 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  optionInfo: { flex: 1 },
  optionName: { color: '#fff', fontSize: 16, fontWeight: '500' },
  optionDesc: { color: '#666', fontSize: 14, marginTop: 2 },
});

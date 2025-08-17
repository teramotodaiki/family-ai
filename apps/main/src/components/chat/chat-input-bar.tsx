import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import type { Colors } from '../../../src/theme';

type Props = {
  colors: Colors;
  value: string;
  onChange: (t: string) => void;
  onSend: () => void;
  sending: boolean;
  onToggleAttachments: () => void;
  bottomInset: number;
  sendIconColor: string;
};

export default function ChatInputBar({
  colors,
  value,
  onChange,
  onSend,
  sending,
  onToggleAttachments,
  bottomInset,
  sendIconColor,
}: Props) {
  return (
    <View
      style={[
        styles.container,
        { paddingBottom: 12 + bottomInset, borderTopColor: colors.border },
      ]}
    >
      <TouchableOpacity
        style={[styles.attachButton, { backgroundColor: colors.inputBg }]}
        onPress={onToggleAttachments}
      >
        <Ionicons name='add' size={28} color={colors.text} />
      </TouchableOpacity>

      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.inputBg, color: colors.text },
        ]}
        value={value}
        onChangeText={onChange}
        placeholder='質問してみましょう'
        placeholderTextColor={colors.muted}
        multiline
        testID='chat-input'
        accessibilityLabel='chat-input'
        returnKeyType='send'
      />

      <TouchableOpacity
        style={[styles.sendButton, { backgroundColor: colors.accent }]}
        testID='send-button'
        accessibilityLabel='send-button'
        disabled={sending || !value.trim()}
        onPress={onSend}
      >
        <Ionicons name='arrow-up' size={20} color={sendIconColor} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

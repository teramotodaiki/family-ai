import { StyleSheet, Text, View } from 'react-native';
import type { Colors } from '../../../src/theme';
import type { Message } from '../../../src/types/chat';

type Props = {
  colors: Colors;
  messages: Message[];
};

export default function ChatMessages({ colors, messages }: Props) {
  return (
    <>
      {messages.map((m) => (
        <View
          key={m.id}
          style={[
            styles.bubble,
            {
              alignSelf: m.isUser ? 'flex-end' : 'flex-start',
              backgroundColor: m.isUser
                ? colors.bubbleUserBg
                : colors.bubbleAiBg,
            },
          ]}
          testID={m.isUser ? 'message-user' : 'message-assistant'}
          accessibilityLabel={m.isUser ? 'message-user' : 'message-assistant'}
        >
          <Text style={[styles.text, { color: colors.text }]}>{m.text}</Text>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  bubble: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
  },
  text: { color: '#fff', fontSize: 16 },
});

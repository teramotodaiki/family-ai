import type { ChatCompletionsResponse } from '@family/core';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChatAttachmentSheet from '../../src/components/chat/chat-attachment-sheet';
import ChatHeader from '../../src/components/chat/chat-header';
import ChatInputBar from '../../src/components/chat/chat-input-bar';
import ChatMessages from '../../src/components/chat/chat-messages';
import ChatModelModal from '../../src/components/chat/chat-model-modal';
import ChatSuggestions from '../../src/components/chat/chat-suggestions';
import { createChatCompletion } from '../../src/lib/api';
import { loadMessages, saveMessages } from '../../src/lib/conversation-storage';
import { useTheme } from '../../src/theme';
import type { Message, Model, Suggestion } from '../../src/types/chat';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors, theme } = useTheme();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [modelModalVisible, setModelModalVisible] = useState(false);
  const [selectedModel, setSelectedModel] = useState('GPT-5');
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [sending, setSending] = useState(false);
  const sendIconColor = theme === 'dark' ? '#000' : '#fff';

  useEffect(() => {
    (async () => {
      const stored = await loadMessages();
      setMessages(stored);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await saveMessages(messages);
    })();
  }, [messages]);

  const suggestions: Suggestion[] = [
    { id: '1', text: 'Explain MCP', subtext: 'structured content' },
    { id: '2', text: 'Explore AI', subtext: 'agent frameworks' },
    { id: '3', text: 'Summary', subtext: 'AI research' },
  ];

  const models: Model[] = [
    { id: 'gpt5', name: 'GPT-5', description: 'フラッグシップモデル' },
    {
      id: 'gpt5-thinking',
      name: 'GPT-5 Thinking',
      description: 'より深い回答を得る',
    },
  ];

  const attachmentOptions = [
    { id: 'photo', label: '写真', icon: 'camera' as const },
    { id: 'file', label: '', icon: 'circle' as const },
    { id: 'code', label: 'すべてを表示する', icon: 'list' as const },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ChatHeader
          colors={colors}
          paddingTop={insets.top + 8}
          onPressMenu={() => {
            const drawer = navigation.getParent?.('drawer');
            if (drawer) drawer.dispatch(DrawerActions.openDrawer());
            else navigation.dispatch(DrawerActions.openDrawer());
          }}
          onPressTitle={() => setModelModalVisible(true)}
          selectedModelLabel={selectedModel}
        />

        <ScrollView
          style={styles.messagesContainer}
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={styles.messagesContent}
        >
          {messages.length === 0 ? (
            <ChatSuggestions
              colors={colors}
              suggestions={suggestions}
              onSelect={setInputText}
            />
          ) : (
            <ChatMessages colors={colors} messages={messages} />
          )}
        </ScrollView>

        <ChatInputBar
          colors={colors}
          value={inputText}
          onChange={setInputText}
          sending={sending}
          onToggleAttachments={() => setShowAttachmentOptions((v) => !v)}
          bottomInset={insets.bottom}
          sendIconColor={sendIconColor}
          onSend={async () => {
            const text = inputText.trim();
            if (!text || sending) return;

            const userMessage: Message = {
              id: Date.now().toString(),
              text,
              isUser: true,
              timestamp: new Date(),
            };
            const nextMessages = [...messages, userMessage];
            setMessages(nextMessages);
            setInputText('');

            setSending(true);
            try {
              const openAiMessages = [
                {
                  role: 'system',
                  content:
                    'You are a concise, kind assistant for families with kids. Keep answers short and safe.',
                },
                ...nextMessages.map((m) => ({
                  role: m.isUser ? 'user' : 'assistant',
                  content: m.text,
                })),
              ];

              const data: ChatCompletionsResponse = await createChatCompletion({
                model: 'gpt-4o-mini',
                messages: openAiMessages,
                max_tokens: 256,
                temperature: 0.7,
              });

              const content = (
                data.choices?.[0]?.message?.content || ''
              ).trim();
              const assistantMessage: Message = {
                id: (Date.now() + 2).toString(),
                text: content || '…',
                isUser: false,
                timestamp: new Date(),
              };
              setMessages((prev) => [...prev, assistantMessage]);
            } catch {
              const errorReply: Message = {
                id: (Date.now() + 3).toString(),
                text: 'ネットワークに問題があります。時間をおいて再試行してください。',
                isUser: false,
                timestamp: new Date(),
              };
              setMessages((prev) => [...prev, errorReply]);
            } finally {
              setSending(false);
            }
          }}
        />

        <ChatModelModal
          colors={colors}
          visible={modelModalVisible}
          onClose={() => setModelModalVisible(false)}
          models={models}
          selectedModel={selectedModel}
          onSelect={(name) => {
            setSelectedModel(name);
            setModelModalVisible(false);
          }}
        />

        <ChatAttachmentSheet
          colors={colors}
          visible={showAttachmentOptions}
          bottomInset={insets.bottom}
          options={attachmentOptions}
          onClose={() => setShowAttachmentOptions(false)}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  keyboardAvoid: { flex: 1 },
  messagesContainer: { flex: 1 },
  messagesContent: { paddingBottom: 16 },
});

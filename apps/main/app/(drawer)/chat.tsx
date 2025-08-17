import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { postJson } from '../../src/lib/request';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Suggestion {
  id: string;
  text: string;
  subtext: string;
}

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [modelModalVisible, setModelModalVisible] = useState(false);
  const [selectedModel, setSelectedModel] = useState('GPT-5');
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [sending, setSending] = useState(false);
  const emailRef = useRef<TextInput>(null);

  const suggestions: Suggestion[] = [
    { id: '1', text: 'Explain MCP', subtext: 'structured content' },
    { id: '2', text: 'Explore AI', subtext: 'agent frameworks' },
    { id: '3', text: 'Summary', subtext: 'AI research' },
  ];

  const models = [
    { id: 'gpt5', name: 'GPT-5', description: 'フラッグシップモデル' },
    {
      id: 'gpt5-thinking',
      name: 'GPT-5 Thinking',
      description: 'より深い回答を得る',
    },
  ];

  const attachmentOptions = [
    { id: 'photo', label: '写真', icon: 'camera' },
    { id: 'file', label: '', icon: 'circle' },
    { id: 'code', label: 'すべてを表示する', icon: 'list' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={[styles.customHeader, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity
            onPress={() => {
              // In expo-router, the Drawer is a parent navigator of this screen
              // Ensure we dispatch the action on the parent (Drawer) navigator
              const parent = navigation.getParent?.();
              if (parent) {
                parent.dispatch(DrawerActions.openDrawer());
              }
            }}
            style={styles.headerButton}
            testID='menu-button'
          >
            <Ionicons name='menu' size={24} color='#fff' />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerTitle}
            onPress={() => setModelModalVisible(true)}
            testID='header-title'
          >
            <Text style={styles.headerTitleText}>ChatGPT 5</Text>
            <Ionicons name='chevron-down' size={16} color='#fff' />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerButton} testID='refresh-button'>
            <Ionicons name='refresh-outline' size={24} color='#fff' />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.messagesContainer}
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {messages.length === 0 && (
            <View style={styles.suggestionsContainer}>
              {suggestions.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion.id}
                  style={styles.suggestionCard}
                  onPress={() => setInputText(suggestion.text)}
                >
                  <Text style={styles.suggestionText}>{suggestion.text}</Text>
                  <Text style={styles.suggestionSubtext}>
                    {suggestion.subtext}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.isUser ? styles.userMessage : styles.aiMessage,
              ]}
              testID={message.isUser ? 'message-user' : 'message-assistant'}
              accessibilityLabel={
                message.isUser ? 'message-user' : 'message-assistant'
              }
            >
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          ))}
        </ScrollView>

        <View
          style={[styles.inputContainer, { paddingBottom: 12 + insets.bottom }]}
        >
          <TouchableOpacity
            style={styles.attachButton}
            onPress={() => setShowAttachmentOptions(!showAttachmentOptions)}
          >
            <Ionicons name='add' size={28} color='#fff' />
          </TouchableOpacity>

          <TextInput
            ref={emailRef}
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder='質問してみましょう'
            placeholderTextColor='#666'
            multiline
            testID='chat-input'
            accessibilityLabel='chat-input'
            returnKeyType='send'
          />

          <TouchableOpacity
            style={styles.sendButton}
            testID='send-button'
            accessibilityLabel='send-button'
            disabled={sending || !inputText.trim()}
            onPress={async () => {
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

              const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
              if (!apiKey) {
                const errorReply: Message = {
                  id: (Date.now() + 1).toString(),
                  text: 'APIキーが設定されていません。EXPO_PUBLIC_OPENAI_API_KEY を設定してください。',
                  isUser: false,
                  timestamp: new Date(),
                };
                setMessages((prev) => [...prev, errorReply]);
                return;
              }

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

                type ChatCompletionResponse = {
                  choices?: { message?: { content?: string } }[];
                };

                const data = await postJson<
                  {
                    model: string;
                    messages: { role: string; content: string }[];
                    max_tokens: number;
                    temperature: number;
                  },
                  ChatCompletionResponse
                >(
                  'https://api.openai.com/v1/chat/completions',
                  {
                    model: 'gpt-4o-mini',
                    messages: openAiMessages,
                    max_tokens: 256,
                    temperature: 0.7,
                  },
                  {
                    Authorization: `Bearer ${apiKey}`,
                  }
                );

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
              } catch (e) {
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
          >
            <Ionicons name='arrow-up' size={20} color='#000' />
          </TouchableOpacity>
        </View>

        {/* Model Selection Modal */}
        <Modal
          animationType='slide'
          transparent
          visible={modelModalVisible}
          onRequestClose={() => setModelModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModelModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>モデルを選択</Text>
              {models.map((model) => (
                <TouchableOpacity
                  key={model.id}
                  style={styles.modelOption}
                  onPress={() => {
                    setSelectedModel(model.name);
                    setModelModalVisible(false);
                  }}
                >
                  <View style={styles.modelInfo}>
                    <Text style={styles.modelName}>{model.name}</Text>
                    <Text style={styles.modelDescription}>
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

        {/* Attachment Options */}
        {showAttachmentOptions && (
          <View
            style={[styles.attachmentOptions, { bottom: 70 + insets.bottom }]}
          >
            {attachmentOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.attachmentOption}
                onPress={() => setShowAttachmentOptions(false)}
              >
                {option.icon === 'camera' && (
                  <Ionicons name='camera' size={32} color='#fff' />
                )}
                {option.icon === 'circle' && <View style={styles.circleIcon} />}
                {option.icon === 'list' && (
                  <Ionicons name='list' size={32} color='#fff' />
                )}
                {option.label ? (
                  <Text style={styles.attachmentLabel}>{option.label}</Text>
                ) : null}
              </TouchableOpacity>
            ))}
            <View style={styles.attachmentActions}>
              <TouchableOpacity style={styles.attachmentActionButton}>
                <Ionicons name='sunny' size={24} color='#fff' />
                <Text style={styles.attachmentActionText}>
                  より長く思考する
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.attachmentActionButton}>
                <MaterialIcons name='psychology' size={24} color='#fff' />
                <Text style={styles.attachmentActionText}>
                  エージェントモード
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.attachmentActionButton}>
                <Ionicons name='search' size={24} color='#fff' />
                <Text style={styles.attachmentActionText}>Deep Research</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.attachmentActionButton}>
                <Ionicons name='book' size={24} color='#fff' />
                <Text style={styles.attachmentActionText}>
                  あらゆる学びをサポート
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.attachmentActionButton}>
                <Ionicons name='image' size={24} color='#fff' />
                <Text style={styles.attachmentActionText}>画像を作成する</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  keyboardAvoid: { flex: 1 },
  customHeader: {
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
  headerTitle: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerTitleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  messagesContainer: { flex: 1 },
  suggestionsContainer: { padding: 16, gap: 12 },
  suggestionCard: {
    backgroundColor: '#0f0f0f',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  suggestionText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  suggestionSubtext: { color: '#888', fontSize: 12, marginTop: 4 },
  messageBubble: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
  },
  userMessage: { backgroundColor: '#1a1a1a', alignSelf: 'flex-end' },
  aiMessage: { backgroundColor: '#0f0f0f', alignSelf: 'flex-start' },
  messageText: { color: '#fff', fontSize: 16 },
  inputContainer: {
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
  textInput: {
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
  attachmentOptions: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  attachmentOption: { alignItems: 'center', marginBottom: 16 },
  attachmentLabel: { color: '#fff', fontSize: 12, marginTop: 4 },
  circleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#fff',
  },
  attachmentActions: { marginTop: 20 },
  attachmentActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  attachmentActionText: { color: '#fff', fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  modelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  modelInfo: { flex: 1 },
  modelName: { color: '#fff', fontSize: 16, fontWeight: '500' },
  modelDescription: { color: '#666', fontSize: 14, marginTop: 2 },
});

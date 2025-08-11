import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import I18n from "@family/ui";

type Role = "user" | "assistant";
type Message = { id: string; role: Role; content: string };

type ChatCompletionResponse = {
  choices?: { message?: { content?: string } }[];
};

export default function ChatScreen() {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const listRef = useRef<FlatList<Message>>(null);
  const [welcomed, setWelcomed] = useState<boolean>(false);
  const [showNetworkError, setShowNetworkError] = useState<boolean>(false);

  const canSend = useMemo(
    () => input.trim().length > 0 && !sending,
    [input, sending]
  );

  const onSend = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    const userMsg: Message = {
      id: String(Date.now()),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);

    if (!apiKey) {
      throw new Error(
        "Environment variable EXPO_PUBLIC_OPENAI_API_KEY is not set."
      );
    }

    setSending(true);
    try {
      const openAiMessages = [
        {
          role: "system",
          content:
            "You are a concise, kind assistant for families with kids. Keep answers short and safe.",
        },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: text },
      ];

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: openAiMessages,
          max_tokens: 256,
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}: ${txt}`);
      }

      const data: ChatCompletionResponse = await res.json();
      const content: string = data.choices?.[0]?.message?.content?.trim() ?? "";
      const assistantMsg: Message = {
        id: String(Date.now() + 2),
        role: "assistant",
        content: content || "...",
      };
      setMessages((prev) => [...prev, assistantMsg]);
      requestAnimationFrame(() =>
        listRef.current?.scrollToEnd({ animated: true })
      );
    } catch (e) {
      setShowNetworkError(true);
    } finally {
      setSending(false);
    }
  }, [apiKey, input, messages, sending]);

  const renderItem = useCallback(({ item }: { item: Message }) => {
    const isUser = item.role === "user";
    return (
      <View
        style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}
        accessibilityRole="text"
      >
        <Text
          style={[styles.bubbleText, isUser ? styles.userText : styles.aiText]}
        >
          {item.content}
        </Text>
      </View>
    );
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
      keyboardVerticalOffset={88}
    >
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          <I18n ja="かぞくAI" en="Family AI" />
        </Text>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: true })
        }
      />

      <View style={styles.inputRow}>
        <I18n ja="メッセージを入力..." en="Type a message...">
          {(placeholder) => (
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor="#999"
              value={input}
              onChangeText={setInput}
              editable={!sending}
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel={placeholder}
            />
          )}
        </I18n>
        <Pressable
          onPress={onSend}
          disabled={!canSend}
          style={({ pressed }) => [
            styles.sendButton,
            { opacity: canSend ? (pressed ? 0.8 : 1) : 0.5 },
          ]}
          accessibilityRole="button"
        >
          <Text style={styles.sendText}>
            <I18n ja="送信" en="Send" />
          </Text>
        </Pressable>
      </View>

      {/* Inject welcome message once, via I18n */}
      {!welcomed && (
        <I18n ja="こんにちは！なんでも聞いてね。" en="Hello! Ask me anything.">
          {(welcome) => (
            <EffectOnce
              run={() => {
                setMessages((prev) => [
                  ...prev,
                  {
                    id: String(Date.now()),
                    role: "assistant",
                    content: welcome,
                  },
                ]);
                setWelcomed(true);
              }}
            />
          )}
        </I18n>
      )}

      {/* Network error injection via I18n */}
      {showNetworkError && (
        <I18n
          ja="ネットワークに問題があります。再試行してください。"
          en="Network issue. Please try again."
        >
          {(text) => (
            <EffectOnce
              run={() => {
                setMessages((prev) => [
                  ...prev,
                  {
                    id: String(Date.now() + 2),
                    role: "assistant",
                    content: text,
                  },
                ]);
                setShowNetworkError(false);
              }}
            />
          )}
        </I18n>
      )}
    </KeyboardAvoidingView>
  );
}

function EffectOnce({ run }: { run: () => void }) {
  useEffect(() => {
    run();
    // run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  title: { fontSize: 20, fontWeight: "600", color: "#111" },
  list: { flex: 1 },
  listContent: { padding: 16 },
  bubble: {
    maxWidth: "85%",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  userBubble: { backgroundColor: "#DCF8C6", alignSelf: "flex-end" },
  aiBubble: { backgroundColor: "#F1F1F1" },
  bubbleText: { fontSize: 16, lineHeight: 22 },
  userText: { color: "#111" },
  aiText: { color: "#111" },
  inputRow: {
    flexDirection: "row",
    padding: 12,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
    alignItems: "center",
    gap: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    minWidth: 64,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  sendText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});

import * as SecureStore from 'expo-secure-store';
import type { Message } from '../types/chat';

const STORAGE_KEY = 'conversation';

type StoredMessage = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
};

export async function loadMessages(): Promise<Message[]> {
  try {
    const raw = await SecureStore.getItemAsync(STORAGE_KEY);
    if (!raw) return [];
    const data: StoredMessage[] = JSON.parse(raw);
    return data.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [];
  }
}

export async function saveMessages(messages: Message[]): Promise<void> {
  try {
    const data: StoredMessage[] = messages.map((m) => ({
      ...m,
      timestamp: m.timestamp.toISOString(),
    }));
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.warn('Failed to save conversation');
  }
}

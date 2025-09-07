import type { Message, Model, Suggestion } from '../types/chat';

export const mockMessages: Message[] = [
  {
    id: '1',
    text: 'こんにちは',
    isUser: true,
    timestamp: new Date('2024-01-01T10:00:00Z'),
  },
  {
    id: '2',
    text: 'こんにちは！何かお手伝いできることはありますか？',
    isUser: false,
    timestamp: new Date('2024-01-01T10:00:01Z'),
  },
];

export const mockModels: Model[] = [
  { id: 'gpt5', name: 'GPT-5', description: 'フラッグシップモデル' },
  {
    id: 'gpt5-thinking',
    name: 'GPT-5 Thinking',
    description: 'より深い回答を得る',
  },
];

export const mockSuggestions: Suggestion[] = [
  { id: '1', text: 'Explain MCP', subtext: 'structured content' },
  { id: '2', text: 'Explore AI', subtext: 'agent frameworks' },
  { id: '3', text: 'Summary', subtext: 'AI research' },
];

export const mockAttachmentOptions = [
  { id: 'camera', label: '写真', icon: 'camera' as const },
  { id: 'files', label: 'すべてを表示する', icon: 'list' as const },
  { id: 'circle', label: '', icon: 'circle' as const },
];

export const mockColors = {
  background: '#000',
  surface: '#0f0f0f',
  border: '#1a1a1a',
  text: '#fff',
  muted: '#888',
  inputBg: '#1a1a1a',
  accent: '#fff',
  bubbleUserBg: '#1a1a1a',
  bubbleAiBg: '#0f0f0f',
  headerTint: '#fff',
};

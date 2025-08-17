import type {
  ChatCompletionsRequest,
  ChatCompletionsResponse,
} from '@family/core';
import { postJson } from './request';

const DEFAULT_BASE = __DEV__
  ? 'http://localhost:8787'
  : 'https://family-ai-api.i1013235329.workers.dev';
const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_BASE;

export async function createChatCompletion(
  body: ChatCompletionsRequest
): Promise<ChatCompletionsResponse> {
  return postJson(`${API_BASE}/v1/chat/completions`, body);
}

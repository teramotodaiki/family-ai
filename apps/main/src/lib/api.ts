import type {
  ChatCompletionsRequest,
  ChatCompletionsResponse,
} from '@family/core';
import { postJson } from './request';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL;

export async function createChatCompletion(
  body: ChatCompletionsRequest
): Promise<ChatCompletionsResponse> {
  if (!API_BASE) {
    throw new Error('EXPO_PUBLIC_API_BASE_URL is not configured');
  }
  return postJson(`${API_BASE}/v1/chat/completions`, body);
}

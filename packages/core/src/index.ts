export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type ChatCompletionsRequest = {
  model: string;
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
};

export type ChatCompletionsResponse = {
  id?: string;
  choices?: { message?: { content?: string } }[];
};

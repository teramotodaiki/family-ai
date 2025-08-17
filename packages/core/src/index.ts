export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type ChatCompletionsRequest = {
  messages: ChatMessage[];
};

export type ChatCompletionsResponse = {
  id?: string;
  choices?: { message?: { content?: string } }[];
};

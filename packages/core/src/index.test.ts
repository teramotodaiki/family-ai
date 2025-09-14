import type {
  ChatCompletionsRequest,
  ChatCompletionsResponse,
  ChatMessage,
} from './index';

describe('Core Types', () => {
  describe('ChatMessage', () => {
    it('should have correct structure for user message', () => {
      const userMessage: ChatMessage = {
        role: 'user',
        content: 'Hello, how are you?',
      };

      expect(userMessage.role).toBe('user');
      expect(userMessage.content).toBe('Hello, how are you?');
    });

    it('should have correct structure for assistant message', () => {
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: 'I am doing well, thank you!',
      };

      expect(assistantMessage.role).toBe('assistant');
      expect(assistantMessage.content).toBe('I am doing well, thank you!');
    });

    it('should have correct structure for system message', () => {
      const systemMessage: ChatMessage = {
        role: 'system',
        content: 'You are a helpful assistant.',
      };

      expect(systemMessage.role).toBe('system');
      expect(systemMessage.content).toBe('You are a helpful assistant.');
    });
  });

  describe('ChatCompletionsRequest', () => {
    it('should have correct structure', () => {
      const request: ChatCompletionsRequest = {
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Hello!' },
        ],
      };

      expect(request.messages).toHaveLength(2);
      expect(request.messages[0].role).toBe('system');
      expect(request.messages[1].role).toBe('user');
    });

    it('should work with empty messages array', () => {
      const request: ChatCompletionsRequest = {
        messages: [],
      };

      expect(request.messages).toHaveLength(0);
    });
  });

  describe('ChatCompletionsResponse', () => {
    it('should have correct structure with all optional fields', () => {
      const response: ChatCompletionsResponse = {
        id: 'chatcmpl-123',
        choices: [
          {
            message: {
              content: 'Hello! How can I help you today?',
            },
          },
        ],
      };

      expect(response.id).toBe('chatcmpl-123');
      expect(response.choices).toHaveLength(1);
      expect(response.choices?.[0]?.message?.content).toBe(
        'Hello! How can I help you today?'
      );
    });

    it('should work with minimal structure', () => {
      const response: ChatCompletionsResponse = {};

      expect(response.id).toBeUndefined();
      expect(response.choices).toBeUndefined();
    });

    it('should work with empty choices', () => {
      const response: ChatCompletionsResponse = {
        choices: [],
      };

      expect(response.choices).toHaveLength(0);
    });
  });
});

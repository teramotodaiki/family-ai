import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import app from './index';

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
(global as unknown as { fetch: typeof mockFetch }).fetch = mockFetch;

describe('API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    it('should return OK', async () => {
      const req = new Request('http://localhost/');
      const env = { OPENAI_API_KEY: 'test-key' };

      const res = await app.fetch(req, env);
      const text = await res.text();

      expect(res.status).toBe(200);
      expect(text).toBe('OK');
    });
  });

  describe('POST /v1/chat/completions', () => {
    it('should return error when API key is missing', async () => {
      const req = new Request('http://localhost/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [] }),
      });
      const env = {};

      const res = await app.fetch(req, env);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json).toEqual({ error: 'Server misconfigured' });
    });

    it('should return error for invalid JSON', async () => {
      const req = new Request('http://localhost/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json',
      });
      const env = { OPENAI_API_KEY: 'test-key' };

      const res = await app.fetch(req, env);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json).toEqual({ error: 'Invalid JSON' });
    });

    it('should proxy request to OpenAI API', async () => {
      const mockOpenAIResponse = {
        id: 'chatcmpl-123',
        choices: [{ message: { content: 'Hello!' } }],
      };

      mockFetch.mockResolvedValue(
        new Response(JSON.stringify(mockOpenAIResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const req = new Request('http://localhost/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hello' }],
        }),
      });
      const env = { OPENAI_API_KEY: 'test-key' };

      const res = await app.fetch(req, env);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-key',
          },
          body: JSON.stringify({
            model: 'gpt-5-mini',
            messages: [{ role: 'user', content: 'Hello' }],
            max_completion_tokens: 2000,
          }),
        }
      );

      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toBe('application/json');
    });

    it('should handle OpenAI API errors', async () => {
      mockFetch.mockResolvedValue(
        new Response('{"error": "Rate limit exceeded"}', {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const req = new Request('http://localhost/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hello' }],
        }),
      });
      const env = { OPENAI_API_KEY: 'test-key' };

      const res = await app.fetch(req, env);

      expect(res.status).toBe(429);
    });

    it('should use correct model and parameters', async () => {
      mockFetch.mockResolvedValue(
        new Response('{}', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const req = new Request('http://localhost/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Test' }],
        }),
      });
      const env = { OPENAI_API_KEY: 'test-key' };

      await app.fetch(req, env);

      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1]?.body as string);

      expect(requestBody.model).toBe('gpt-5-mini');
      expect(requestBody.max_completion_tokens).toBe(2000);
      expect(requestBody.messages).toEqual([{ role: 'user', content: 'Test' }]);
    });
  });
});

import { resetMocks, setupFetchMock } from '../test/mocks';
import { createChatCompletion } from './api';

const originalEnv = { ...process.env };

describe('createChatCompletion', () => {
  beforeEach(() => {
    resetMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should make successful chat completion request', async () => {
    process.env.EXPO_PUBLIC_API_BASE_URL = 'https://api.example.com';
    const mockResponse = {
      id: 'chatcmpl-123',
      choices: [{ message: { content: 'Hello!' } }],
    };
    setupFetchMock(mockResponse);

    const result = await createChatCompletion({
      messages: [{ role: 'user', content: 'Hi' }],
    });

    expect(
      (global as unknown as { fetch: jest.Mock }).fetch
    ).toHaveBeenCalledWith('http://localhost:3000/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hi' }],
      }),
    });
    expect(result).toEqual(mockResponse);
  });

  it('should throw error when API_BASE_URL is not configured', async () => {
    jest.doMock('./api', () => {
      return {
        createChatCompletion: async () => {
          throw new Error('EXPO_PUBLIC_API_BASE_URL is not configured');
        },
      };
    });

    const {
      createChatCompletion: mockedCreateChatCompletion,
    } = require('./api');

    await expect(
      mockedCreateChatCompletion({
        messages: [{ role: 'user', content: 'Hi' }],
      })
    ).rejects.toThrow('EXPO_PUBLIC_API_BASE_URL is not configured');

    jest.dontMock('./api');
  });

  it('should handle API errors', async () => {
    process.env.EXPO_PUBLIC_API_BASE_URL = 'https://api.example.com';
    setupFetchMock({ error: 'Server error' }, false, 500);

    await expect(
      createChatCompletion({
        messages: [{ role: 'user', content: 'Hi' }],
      })
    ).rejects.toMatchObject({
      name: 'HttpError',
      status: 500,
    });
  });
});

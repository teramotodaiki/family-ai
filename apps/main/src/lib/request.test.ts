import { resetMocks, setupFetchMock } from '../test/mocks';
import { postJson } from './request';

describe('postJson', () => {
  beforeEach(() => {
    resetMocks();
  });

  it('should make successful POST request', async () => {
    const mockResponse = { success: true, data: 'test' };
    setupFetchMock(mockResponse);

    const result = await postJson('/api/test', { input: 'test' });

    expect(
      (global as unknown as { fetch: jest.Mock }).fetch
    ).toHaveBeenCalledWith('/api/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: 'test' }),
    });
    expect(result).toEqual(mockResponse);
  });

  it('should include custom headers', async () => {
    const mockResponse = { success: true };
    setupFetchMock(mockResponse);

    await postJson(
      '/api/test',
      { input: 'test' },
      { Authorization: 'Bearer token' }
    );

    expect(
      (global as unknown as { fetch: jest.Mock }).fetch
    ).toHaveBeenCalledWith('/api/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token',
      },
      body: JSON.stringify({ input: 'test' }),
    });
  });

  it('should throw HttpError on non-ok response', async () => {
    const errorResponse = { error: 'Bad request' };
    setupFetchMock(errorResponse, false, 400);

    await expect(
      postJson('/api/test', { input: 'test' })
    ).rejects.toMatchObject({
      name: 'HttpError',
      status: 400,
      message: expect.stringContaining('HTTP 400'),
    });
  });

  it('should handle empty error response', async () => {
    (global as unknown as { fetch: jest.Mock }).fetch = jest
      .fn()
      .mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.reject(new Error('Failed to read')),
      });

    await expect(
      postJson('/api/test', { input: 'test' })
    ).rejects.toMatchObject({
      name: 'HttpError',
      status: 500,
      body: '',
    });
  });

  it('should truncate long error messages', async () => {
    const longError = 'x'.repeat(600);
    (global as unknown as { fetch: jest.Mock }).fetch = jest
      .fn()
      .mockResolvedValue({
        ok: false,
        status: 400,
        text: () => Promise.resolve(longError),
      });

    await expect(
      postJson('/api/test', { input: 'test' })
    ).rejects.toMatchObject({
      name: 'HttpError',
      message: expect.stringMatching(/…$/),
    });
  });
});

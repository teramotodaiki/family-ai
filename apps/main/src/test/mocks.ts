export const mockFetch = jest.fn();

export const mockCreateChatCompletion = jest.fn();

export const setupApiMocks = () => {
  jest.mock('../lib/api', () => ({
    createChatCompletion: mockCreateChatCompletion,
  }));
};

export const setupFetchMock = (response: unknown, ok = true, status = 200) => {
  mockFetch.mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(response),
    text: () => Promise.resolve(JSON.stringify(response)),
  });
  (global as unknown as { fetch: typeof mockFetch }).fetch = mockFetch;
};

export const resetMocks = () => {
  jest.clearAllMocks();
  mockFetch.mockClear();
  mockCreateChatCompletion.mockClear();
};

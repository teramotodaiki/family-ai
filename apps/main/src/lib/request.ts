export type HttpError = {
  name: 'HttpError';
  message: string;
  status: number;
  body?: string;
};

export async function postJson<TReq, TRes>(
  url: string,
  body: TReq,
  headers: Record<string, string> = {}
): Promise<TRes> {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await safeReadText(res);
    const err: HttpError = {
      name: 'HttpError',
      message: `HTTP ${res.status}: ${truncate(text, 500)}`,
      status: res.status,
      body: text,
    };
    throw err;
  }

  return (await res.json()) as TRes;
}

async function safeReadText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return '';
  }
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) + '…' : s;
}


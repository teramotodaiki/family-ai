import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  OPENAI_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Minimal CORS without external deps
app.use('*', cors());

app.get('/', (c) => c.text('OK'));

app.post('/v1/chat/completions', async (c) => {
  const apiKey = c.env.OPENAI_API_KEY;
  if (!apiKey) return c.json({ error: 'Server misconfigured' }, 500);

  let body: {
    messages?: { role: string; content: string }[];
  };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON' }, 400);
  }

  const payload = {
    model: 'gpt-5-mini',
    messages: body.messages,
    max_completion_tokens: 2000
  };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  return new Response(res.body, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'application/json',
    },
  });
});

export default app;

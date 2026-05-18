import { NextResponse } from 'next/server';
import { getCachedAIContext } from '@/lib/context-cache';
import { sanitizeInput } from '@/lib/sanitize';
import { siteUrl } from '@/lib/site';
import type { Language } from '@/lib/language';
import pricingConfig from '@/data/pricing-config.json';

export const dynamic = 'force-dynamic';

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
};

function methodNotAllowed() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405, headers: { ...NO_STORE_HEADERS, Allow: 'POST' } });
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL_FALLBACK = 'llama-3.1-8b-instant';
const GROQ_BASE_DELAY_MS = 1500;

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';
const GEMINI_MAX_RETRIES = 2;

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 10;
const ipHits = new Map<string, { count: number; resetAt: number }>();

async function callGemini(systemPrompt: string, messages: ChatMessage[]): Promise<{ ok: true; text: string } | { ok: false; status: number; text: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { ok: false, status: 503, text: 'Gemini not configured' };
  }

  const contents = messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  // Prepend system prompt as a user message with a model acknowledgment so the API stays happy
  const geminiContents = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'OK' }] },
    ...contents,
  ];

  for (let attempt = 0; attempt <= GEMINI_MAX_RETRIES; attempt++) {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: geminiContents,
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.3,
        },
      }),
    });

    if (response.status === 429 && attempt < GEMINI_MAX_RETRIES) {
      const delay = GROQ_BASE_DELAY_MS * (2 ** attempt);
      console.warn(`Gemini rate limit (attempt ${attempt + 1}), retrying in ${delay}ms…`);
      await new Promise((resolve) => { setTimeout(resolve, delay); });
      continue;
    }

    if (!response.ok) {
      const text = await response.text();
      console.error('Gemini error:', text);
      return { ok: false, status: response.status, text };
    }

    const data = await response.json() as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
        finishReason?: string;
      }>;
      error?: { message?: string };
    };

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (reply) {
      return { ok: true, text: reply };
    }

    return { ok: false, status: 502, text: data?.error?.message || 'Empty Gemini response' };
  }

  return { ok: false, status: 429, text: 'Gemini rate limited after retries' };
}

async function callGroq(systemPrompt: string, messages: ChatMessage[]): Promise<{ ok: true; text: string } | { ok: false; status: number; text: string }> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return { ok: false, status: 503, text: 'Groq not configured' };
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL_FALLBACK,
      max_tokens: 300,
      temperature: 0.3,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('Groq error:', text);
    return { ok: false, status: response.status, text };
  }

  const data = await response.json() as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const reply = data?.choices?.[0]?.message?.content;
  if (reply) {
    return { ok: true, text: reply };
  }

  return { ok: false, status: 502, text: 'Empty Groq response' };
}

async function callAIWithFallback(systemPrompt: string, messages: ChatMessage[]): Promise<{ ok: true; text: string } | { ok: false; status: number; text: string }> {
  // 1. Try Gemini Flash first (free tier: 1M TPM)
  const geminiResult = await callGemini(systemPrompt, messages);
  if (geminiResult.ok) {
    return geminiResult;
  }

  console.warn('Gemini failed, falling back to Groq 8b-instant…');

  // 2. Fallback to Groq 8b-instant
  return callGroq(systemPrompt, messages);
}

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const DESTRUCTIVE_REQUEST_PATTERNS = [
  /\b(usuń|usun|skasuj|wykasuj|kasuj|wymaż|wymaz|zniszcz|anuluj|dezaktywuj|odłącz|odlacz)\b/i,
  /\b(delete|remove|erase|destroy|drop|truncate|deactivate|disable|cancel|disconnect)\b/i,
  /\b(opublikuj|publikuj|zmień|zmien|edytuj|zaktualizuj|nadpisz|utwórz|stwórz|dodaj)\b/i,
  /\b(publish|edit|update|overwrite|create|add|insert|modify)\b/i,
];

const ADMIN_TARGET_PATTERNS = [
  /\b(post|posta|wpis|wpisu|blog|bloga|projekt|projektu|stron[ayę]|usług[aię]|polityk[aię]|faq|sanity|cms|newsletter|subskrypcj[aię]|konto|dane|rekord|baz[ayę])\b/i,
  /\b(blog post|project|page|service|privacy policy|cms|sanity|newsletter|subscription|account|data|record|database)\b/i,
];

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = request.headers.get('x-real-ip')?.trim();
  const netlifyIp = request.headers.get('x-nf-client-connection-ip')?.trim();
  return forwardedFor || realIp || netlifyIp || 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const current = ipHits.get(ip);

  if (!current || current.resetAt <= now) {
    ipHits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (current.count >= MAX_REQUESTS) {
    return true;
  }

  current.count += 1;
  return false;
}

function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');

  if (!origin) {
    return process.env.NODE_ENV !== 'production';
  }

  try {
    const originUrl = new URL(origin);
    const allowedUrl = new URL(siteUrl);
    const isLocalDevelopment = process.env.NODE_ENV !== 'production'
      && (originUrl.hostname === 'localhost' || originUrl.hostname === '127.0.0.1');
    return originUrl.origin === allowedUrl.origin || isLocalDevelopment;
  } catch {
    return false;
  }
}

function isLanguage(value: unknown): value is Language {
  return value === 'en' || value === 'pl';
}

function detectLanguageFromText(text: string): Language {
  const normalized = text.toLowerCase();
  const polishSignals = [
    'czy', 'możesz', 'mozesz', 'proszę', 'prosze', 'usuń', 'usun', 'jak', 'jaki', 'jaka', 'ile', 'cena', 'wycena', 'strona', 'usługa', 'usluga',
  ];
  const englishSignals = [
    'can', 'could', 'please', 'what', 'how', 'price', 'pricing', 'service', 'project', 'website', 'delete', 'remove',
  ];
  const polishScore = polishSignals.reduce((score, signal) => score + (normalized.includes(signal) ? 1 : 0), 0);
  const englishScore = englishSignals.reduce((score, signal) => score + (normalized.includes(signal) ? 1 : 0), 0);
  return englishScore > polishScore ? 'en' : 'pl';
}

function getRequestedLanguage(record: Record<string, unknown>, messages: ChatMessage[]): Language {
  if (isLanguage(record.language)) {
    return record.language;
  }

  const latestUserMessage = [...messages].reverse().find((message) => message.role === 'user');
  return detectLanguageFromText(latestUserMessage?.content || '');
}

function isDestructiveOrAdminRequest(message: string): boolean {
  const hasDestructiveVerb = DESTRUCTIVE_REQUEST_PATTERNS.some((pattern) => pattern.test(message));
  const hasAdminTarget = ADMIN_TARGET_PATTERNS.some((pattern) => pattern.test(message));
  return hasDestructiveVerb && hasAdminTarget;
}

function getAdminRefusal(language: Language): string {
  if (language === 'en') {
    return 'I cannot delete, edit, publish, create, or modify any website, CMS, blog, project, account, newsletter, or database data. I only provide information about AppCrates services and can suggest contacting the site owner through the contact form.';
  }

  return 'Nie mogę usuwać, edytować, publikować, tworzyć ani modyfikować żadnych danych strony, CMS, bloga, projektów, kont, newslettera ani bazy danych. Mogę tylko udzielać informacji o usługach AppCrates i zasugerować kontakt przez formularz.';
}

function buildSystemPrompt(language: Language, context: string): string {
  const services = Object.values(pricingConfig.services as Record<string, { label: string }>)
    .map((s) => s.label)
    .join(', ');

  if (language === 'en') {
    return `You are a short, helpful AppCrates assistant. Reply in English unless the user clearly writes in Polish. Keep answers to maximum 3 sentences.

AppCrates offers: ${services}.
For more precise estimated pricing, suggest the calculator at /en/kalkulator. For contact, suggest the contact form.

STRICT RULES:
- You may provide rough price ranges and typical timelines when the selected context contains them, but always say they are estimates, not a final quote or offer.
- Never guarantee an exact price, deadline, scope, availability, or business result.
- If the project is complex or the context is insufficient, ask 1-2 clarifying questions and suggest the calculator or contact form.
- No admin/CMS/database access. Never claim you can modify anything.

CONTEXT:
${context}`;
  }

  return `Jesteś krótkim, pomocnym asystentem AppCrates. Odpowiadaj po polsku, chyba że użytkownik pisze po angielsku. Maksymalnie 3 zdania.

AppCrates oferuje: ${services}.
Przy pytaniach o dokładniejszą orientacyjną wycenę zasugeruj kalkulator /pl/kalkulator. Przy kontakcie zasugeruj formularz kontaktowy.

ŚCISŁE ZASADY:
- Możesz podawać orientacyjne widełki cenowe i typowe terminy, jeśli są w wybranym kontekście, ale zawsze zaznaczaj, że to szacunek, a nie finalna wycena ani oferta.
- Nigdy nie gwarantuj dokładnej ceny, terminu, zakresu, dostępności ani wyniku biznesowego.
- Jeśli projekt jest złożony albo brakuje danych, zadaj 1-2 pytania doprecyzowujące i zasugeruj kalkulator lub formularz kontaktowy.
- Brak dostępu admin/CMS/baza danych. Nie twierdź, że możesz cokolwiek zmodyfikować.

KONTEKST:
${context}`;
}

function normalizeMessages(value: unknown): ChatMessage[] | null {
  if (!Array.isArray(value) || value.length < 1 || value.length > 20) {
    return null;
  }

  const messages = value.map((message) => {
    if (!message || typeof message !== 'object') {
      return null;
    }

    const record = message as Record<string, unknown>;
    const content = sanitizeInput(String(record.content || '').slice(0, 500));

    if (!content) {
      return null;
    }

    return {
      role: record.role === 'assistant' ? 'assistant' : 'user',
      content,
    } satisfies ChatMessage;
  });

  if (messages.some((message) => !message)) {
    return null;
  }

  return messages as ChatMessage[];
}

function getModelMessages(messages: ChatMessage[]): ChatMessage[] {
  const firstUserMessage = messages.find((message) => message.role === 'user');
  const recentMessages = messages.slice(-6);

  if (!firstUserMessage || recentMessages.includes(firstUserMessage)) {
    return recentMessages;
  }

  return [firstUserMessage, ...recentMessages].slice(-7);
}

export async function POST(request: Request) {
  try {
    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: NO_STORE_HEADERS });
    }

    const ip = getClientIp(request);

    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: NO_STORE_HEADERS });
    }

    if (!process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'Chat is not configured' }, { status: 503, headers: NO_STORE_HEADERS });
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Bad request' }, { status: 400, headers: NO_STORE_HEADERS });
    }

    const record = body && typeof body === 'object' ? body as Record<string, unknown> : null;

    if (!record || record.honeypot) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: NO_STORE_HEADERS });
    }

    const messages = normalizeMessages(record.messages);

    if (!messages) {
      return NextResponse.json({ error: 'Bad request' }, { status: 400, headers: NO_STORE_HEADERS });
    }

    const language = getRequestedLanguage(record, messages);
    const latestUserMessage = [...messages].reverse().find((message) => message.role === 'user');

    if (latestUserMessage && isDestructiveOrAdminRequest(latestUserMessage.content)) {
      return NextResponse.json({ reply: getAdminRefusal(language) }, { status: 200, headers: NO_STORE_HEADERS });
    }

    const latestQuery = latestUserMessage?.content || '';
    const context = await getCachedAIContext(language, latestQuery);
    const systemPrompt = buildSystemPrompt(language, context);
    const aiResult = await callAIWithFallback(systemPrompt, getModelMessages(messages));

    if (!aiResult.ok) {
      console.error('AI provider error:', aiResult.text);
      return NextResponse.json({ error: 'Chat provider error' }, { status: aiResult.status === 429 ? 429 : 502, headers: NO_STORE_HEADERS });
    }

    const reply = sanitizeInput(aiResult.text);

    return NextResponse.json({ reply }, { status: 200, headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error('Chat route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: NO_STORE_HEADERS });
  }
}

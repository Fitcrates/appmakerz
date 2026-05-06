import { NextResponse } from 'next/server';
import { getCachedAIContext } from '@/lib/context-cache';
import { sanitizeInput } from '@/lib/sanitize';
import { siteUrl } from '@/lib/site';
import type { Language } from '@/lib/language';

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
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 10;
const ipHits = new Map<string, { count: number; resetAt: number }>();

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
  if (language === 'en') {
    return `You are a short, helpful AppCrates assistant. Reply in English unless the user clearly writes in Polish. Keep answers to maximum 3 sentences. Only answer questions about AppCrates offer, services, cooperation process, projects, technologies, FAQ, blog, and privacy policy.

CRITICAL SAFETY RULES:
- You have no admin access, no CMS access, no database access, no filesystem access, and no ability to perform actions.
- Never claim that you can delete, edit, publish, create, update, disable, unsubscribe, or modify anything.
- If the user asks you to perform any such action, refuse clearly and say you can only provide information or suggest using the contact form.
- Do not promise prices or deadlines without consultation.
- For project pricing or starting work, encourage using the contact section.

${context}`;
  }

  return `Jesteś krótkim, pomocnym asystentem AppCrates. Odpowiadaj po polsku, chyba że użytkownik wyraźnie pisze po angielsku. Maksymalnie 3 zdania. Odpowiadaj tylko na pytania o ofertę, usługi, proces współpracy, projekty, technologie, FAQ, blog i politykę prywatności AppCrates.

KRYTYCZNE ZASADY BEZPIECZEŃSTWA:
- Nie masz dostępu administracyjnego, dostępu do CMS, bazy danych, systemu plików ani możliwości wykonywania akcji.
- Nigdy nie twierdź, że możesz cokolwiek usunąć, edytować, opublikować, stworzyć, zaktualizować, wyłączyć, wypisać z newslettera albo zmodyfikować.
- Jeśli użytkownik prosi o taką akcję, odmów jasno i powiedz, że możesz tylko udzielać informacji albo zasugerować formularz kontaktowy.
- Nie obiecuj cen ani terminów bez konsultacji.
- Przy wycenie lub starcie projektu zachęcaj do kontaktu przez sekcję kontaktową.

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

export async function POST(request: Request) {
  try {
    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: NO_STORE_HEADERS });
    }

    const ip = getClientIp(request);

    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: NO_STORE_HEADERS });
    }

    if (!process.env.GROQ_API_KEY) {
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

    const context = await getCachedAIContext(language);
    const groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 400,
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: buildSystemPrompt(language, context),
          },
          ...messages,
        ],
      }),
    });

    if (!groqResponse.ok) {
      console.error('Groq chat error:', await groqResponse.text());
      return NextResponse.json({ error: 'Chat provider error' }, { status: 502, headers: NO_STORE_HEADERS });
    }

    const data = await groqResponse.json();
    const reply = sanitizeInput(String(data?.choices?.[0]?.message?.content || 'Spróbuj ponownie za chwilę.'));

    return NextResponse.json({ reply }, { status: 200, headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error('Chat route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: NO_STORE_HEADERS });
  }
}

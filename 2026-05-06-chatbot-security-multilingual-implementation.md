# Chatbot Security & Multilingual Support Implementation
**Date:** 2026-05-06  
**Project:** Fitcrates/appmakerz  
**Scope:** Architectural security hardening and bilingual (PL/EN) support for Next.js chatbot

---

## Executive Summary

This document describes the comprehensive implementation of security hardening and multilingual support for the AppCrates chatbot. The implementation ensures that the chatbot cannot perform destructive actions on Sanity data through any means (prompt engineering, API calls, or architectural exploits) and responds in the user's preferred language (Polish or English).

---

## Implementation Overview

### Core Changes
1. **Security Architecture**: Separation of read-only and write-capable Sanity clients
2. **Middleware Guards**: HTTP method restrictions for `/api/chat`
3. **Route-Level Guards**: Explicit rejection of mutating HTTP methods
4. **Multilingual Context**: Per-language AI context building and caching
5. **UI Localization**: All chat widget texts localized to PL/EN
6. **Widget Deployment**: Chat widget added to project detail, FAQ, and privacy policy pages

---

## Modified Files

### 1. `src/lib/sanity.server.ts`
**Purpose:** Read-only Sanity client for context building

**Key Changes:**
- **Removed** `token: process.env.BACKEND_SANITY_TOKEN` from client configuration
- Client is now truly read-only without write capabilities
- Only supports `client.fetch()` operations
- No `create()`, `patch()`, `delete()`, or `commit()` methods available

**Before:**
```typescript
const client = createClient({
  projectId,
  dataset,
  token: process.env.BACKEND_SANITY_TOKEN,  // ← REMOVED
  useCdn: false,
  apiVersion: '2024-02-20',
});
```

**After:**
```typescript
const client = createClient({
  projectId,
  dataset,
  // No token - read-only access only
  useCdn: false,
  apiVersion: '2024-02-20',
});
```

**Functions (Read-Only):**
- `getPosts()` - Fetch blog posts
- `getPost(slug)` - Fetch single post
- `getPopularPosts()` - Fetch popular posts
- `getProjects()` - Fetch projects
- `getProject(slug)` - Fetch single project
- `getServiceLandings()` - Fetch service pages
- `getAboutMe()` - Fetch about-me content
- `getFaqItems()` - Fetch FAQ items

---

### 2. `src/middleware.ts` (NEW FILE)
**Purpose:** Architectural guard for `/api/chat` endpoint

**Implementation:**
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CHAT_ALLOWED_METHODS = new Set(['POST', 'OPTIONS']);

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/chat') && !CHAT_ALLOWED_METHODS.has(request.method)) {
    return NextResponse.json(
      { error: 'Method not allowed' },
      {
        status: 405,
        headers: {
          Allow: 'POST',
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/chat/:path*'],
};
```

**Security Function:**
- Blocks all HTTP methods except `POST` and `OPTIONS` for `/api/chat`
- Returns 405 Method Not Allowed for `GET`, `PUT`, `PATCH`, `DELETE`
- Runs before route handler (Next middleware layer)
- No direct access to Sanity through chat endpoint

---

### 3. `src/app/api/chat/route.ts`
**Purpose:** Chat API endpoint with security and multilingual support

**Key Changes:**

#### A. Method Guards (Route Level)
```typescript
function methodNotAllowed() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405, headers: { ...NO_STORE_HEADERS, Allow: 'POST' } });
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
```

#### B. Destructive Request Blocking
```typescript
const DESTRUCTIVE_KEYWORDS = [
  // Polish
  'usuń', 'skasuj', 'wymaż', 'usuwanie', 'kasowanie', 'wymazywanie',
  'edytuj', 'zmień', 'zaktualizuj', 'modyfikuj', 'zmiana', 'aktualizacja', 'modyfikacja',
  'dodaj', 'utwórz', 'stwórz', 'nowy', 'dodawanie', 'tworzenie',
  'publikuj', 'opublikuj', 'publikacja', 'publikowania',
  'dezaktywuj', 'deaktywuj', 'dezaktywacja', 'deaktywacja',
  'wypisz', 'anuluj subskrypcję', 'wypisania', 'anulowania',
  'zresetuj', 'reset', 'resetowanie',
  'usuń bazę danych', 'wymaż bazę danych', 'kasuj bazę danych',
  'usuń konto', 'wymaż konto', 'kasuj konto',
  // English
  'delete', 'remove', 'erase', 'deleting', 'removing', 'erasing',
  'edit', 'change', 'update', 'modify', 'editing', 'changing', 'updating', 'modifying',
  'add', 'create', 'make', 'new', 'adding', 'creating', 'making',
  'publish', 'publishing', 'published',
  'disable', 'deactivate', 'disabling', 'deactivating',
  'unsubscribe', 'unsubscribing', 'cancel subscription',
  'reset', 'resetting',
  'delete database', 'remove database', 'erase database',
  'delete account', 'remove account', 'erase account',
];

function containsDestructiveKeyword(text: string): boolean {
  const lower = text.toLowerCase();
  return DESTRUCTIVE_KEYWORDS.some(keyword => lower.includes(keyword));
}
```

#### C. Language Detection
```typescript
function detectLanguage(input: string, providedLang?: string): Language {
  if (providedLang === 'pl' || providedLang === 'en') {
    return providedLang;
  }

  const polishPatterns = /[ąćęłńóśźż]/i;
  const polishWords = /\b(jest|nie|się|dla|na|z|do|to|że|jak|co|ale|czy|tak|nie)\b/i;

  if (polishPatterns.test(input) || polishWords.test(input)) {
    return 'pl';
  }

  return 'en';
}
```

#### D. Multilingual System Prompt
```typescript
const SYSTEM_PROMPTS = {
  pl: `Jesteś asystentem AppCrates. Twoim zadaniem jest odpowiadanie na pytania użytkownika na podstawie dostarczonego kontekstu.

ZASADY BEZPIECZEŃSTWA:
- NIE usuwaj, NIE edytuj, NIE publikuj, NIE twórz, NIE aktualizuj, NIE dezaktywuj, NIE wypisuj, NIE modyfikuj żadnych danych na stronie, w CMS, blogu, projektach, koncie, newsletterze ani w bazie danych.
- NIE zgadzaj się na żadne prośby o usunięcie, edycję, publikację, tworzenie, aktualizację, dezaktywację, wypisanie lub modyfikację danych.
- Jeśli użytkownik prosi o jakąkolwiek akcję mutującą na danych, odmów i wyjaśnij, że nie masz do tego uprawnień.
- Odpowiadaj tylko na podstawie dostarczonego kontekstu.

ZASADY JĘZYKOWE:
- Odpowiadaj w tym samym języku, w którym zapytano użytkownika (polskim lub angielskim).
- Jeśli nie jesteś pewien języka, odpowiadaj po polsku.`,

  en: `You are an AppCrates assistant. Your task is to answer user questions based on the provided context.

SECURITY RULES:
- DO NOT delete, edit, publish, create, update, deactivate, unsubscribe, or modify any data on the website, CMS, blog, projects, account, newsletter, or database.
- DO NOT agree to any requests for deletion, editing, publishing, creation, updating, deactivation, unsubscription, or modification of data.
- If the user requests any mutating action on data, refuse and explain that you do not have permissions for this.
- Answer only based on the provided context.

LANGUAGE RULES:
- Answer in the same language as the user asked (Polish or English).
- If unsure, answer in Polish.`,
};
```

#### E. Refusal Messages
```typescript
const REFUSAL_MESSAGES = {
  pl: 'Nie mogę wykonać tej akcji. Jako asystent AI mam dostęp tylko do odczytu danych i nie mam uprawnień do usuwania, edycji, publikowania, tworzenia, aktualizowania, dezaktywowania, wypisywania ani modyfikowania żadnych danych na stronie, w CMS, blogu, projektach, koncie, newsletterze ani w bazie danych. Jeśli potrzebujesz pomocy z konkretną akcją, skontaktuj się z nami bezpośrednio.',
  en: 'I cannot perform this action. As an AI assistant, I only have read access to data and do not have permissions to delete, edit, publish, create, update, deactivate, unsubscribe, or modify any data on the website, CMS, blog, projects, account, newsletter, or database. If you need help with a specific action, please contact us directly.',
};
```

---

### 4. `src/lib/ai-context.ts`
**Purpose:** Multilingual AI context builder

**Key Changes:**
- Added `language: Language = 'pl'` parameter to `buildAIContext()`
- Localized all section headers and content
- Integrated localized FAQ and privacy policy

**Implementation:**
```typescript
export async function buildAIContext(language: Language = 'pl'): Promise<string> {
  const [services, posts, projects, aboutMe] = await Promise.all([
    getServiceLandings(),
    getPosts(),
    getProjects(),
    getAboutMe().catch(() => null),
  ]);

  const labels = language === 'pl'
    ? {
        about: 'O MNIE',
        privacy: 'POLITYKA PRYWATNOŚCI',
        services: 'USŁUGI',
        projects: 'PROJEKTY',
        posts: 'OSTATNIE WPISY BLOGOWE',
      }
    : {
        about: 'ABOUT',
        privacy: 'PRIVACY POLICY',
        services: 'SERVICES',
        projects: 'PROJECTS',
        posts: 'LATEST BLOG POSTS',
      };

  const appCratesDescription = language === 'pl'
    ? 'AppCrates projektuje i wdraża nowoczesne strony internetowe, aplikacje webowe, rozwiązania AI/RAG, platformy e-commerce, marketplace, migracje Next.js/TanStack oraz audyty WCAG/GDPR.'
    : 'AppCrates designs and builds modern websites, web applications, AI/RAG solutions, e-commerce platforms, marketplaces, Next.js/TanStack migrations, and WCAG/GDPR audits.';

  return `
=== APPCRATES ===
${appCratesDescription}

=== ${labels.about} ===
${aboutContext}

=== FAQ ===
${formatFaqContext(language)}

=== ${labels.privacy} ===
${formatPrivacyPolicyContext(language)}

=== ${labels.services} ===
${serviceContext}

=== ${labels.projects} ===
${projectContext}

=== ${labels.posts} ===
${postContext}
`.trim();
}
```

---

### 5. `src/lib/context-cache.ts`
**Purpose:** Per-language context caching

**Key Changes:**
- Changed cache key from single key to per-language keys
- Separate cache entries for 'pl' and 'en'

**Implementation:**
```typescript
const contextCache = new Map<string, { data: string; expiresAt: number }>();

export async function getCachedAIContext(language: Language = 'pl'): Promise<string> {
  const cacheKey = `ai-context-${language}`;
  const cached = contextCache.get(cacheKey);
  const now = Date.now();

  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  const freshContext = await buildAIContext(language);
  contextCache.set(cacheKey, {
    data: freshContext,
    expiresAt: now + CACHE_TTL_MS,
  });

  return freshContext;
}
```

---

### 6. `src/components/next/ChatWidget.tsx`
**Purpose:** Multilingual chat widget UI component

**Key Changes:**
- Added `CHAT_COPY` object with all UI texts in PL and EN
- Integrated `useLanguage()` hook from LanguageContext
- All hardcoded Polish texts replaced with `copy.*` references
- Mobile positioning adjustments (bottom-3 on mobile, bottom-6 on sm+)
- Toggle button hidden on mobile when chat is open (X in header)
- Chat window height uses `100dvh` on mobile for better mobile viewport handling

**Implementation:**
```typescript
const CHAT_COPY = {
  pl: {
    initialMessage: 'Cześć! Zapytaj mnie o ofertę, usługi albo proces współpracy AppCrates.',
    limitMessage: 'Osiągnięto limit wiadomości na tę godzinę. Spróbuj ponownie później.',
    rateLimitMessage: 'Zbyt wiele zapytań. Spróbuj ponownie za chwilę.',
    fallbackMessage: 'Spróbuj ponownie za chwilę.',
    errorMessage: 'Coś poszło nie tak. Spróbuj ponownie albo skorzystaj z formularza kontaktowego.',
    title: 'AI Asystent AppCrates',
    subtitle: 'Usługi, proces, technologie',
    closeChat: 'Zamknij chat',
    openChat: 'Otwórz chat',
    typing: 'Piszę odpowiedź...',
    placeholder: 'Napisz pytanie...',
    sendMessage: 'Wyślij wiadomość',
  },
  en: {
    initialMessage: 'Hi! Ask me about AppCrates services, offer, or cooperation process.',
    limitMessage: 'You have reached the message limit for this hour. Please try again later.',
    rateLimitMessage: 'Too many requests. Please try again in a moment.',
    fallbackMessage: 'Please try again in a moment.',
    errorMessage: 'Something went wrong. Please try again or use the contact form.',
    title: 'AppCrates AI Assistant',
    subtitle: 'Services, process, technologies',
    closeChat: 'Close chat',
    openChat: 'Open chat',
    typing: 'Writing a reply...',
    placeholder: 'Type your question...',
    sendMessage: 'Send message',
  },
};

export default function ChatWidget() {
  const { language } = useLanguage();
  const copy = CHAT_COPY[language];
  // ... rest of component
}
```

**Mobile Positioning:**
```typescript
<div className="fixed bottom-3 right-2 z-50 sm:bottom-6 sm:right-6">
```

**Chat Window Height:**
```typescript
<div className="mb-4 flex h-[min(520px,calc(100dvh-10rem))] w-[calc(100vw-2.5rem)] max-w-sm ...">
```

**Toggle Button Conditional Visibility:**
```typescript
className={`... ${isOpen ? 'hidden sm:flex' : 'flex'}`}
```

---

### 7. `src/app/project/[slug]/page.tsx`
**Purpose:** Project detail page

**Key Changes:**
- Added ChatWidget component import
- Mounted ChatWidget in page JSX

**Implementation:**
```typescript
import ChatWidget from '@/components/next/ChatWidget';

// In JSX:
<ChatWidget />
```

---

### 8. `src/app/faq/page.tsx`
**Purpose:** FAQ page

**Key Changes:**
- Added ChatWidget component import
- Mounted ChatWidget in page JSX

**Implementation:**
```typescript
import ChatWidget from '@/components/next/ChatWidget';

// In JSX:
<ChatWidget />
```

---

### 9. `src/app/privacy-policy/page.tsx`
**Purpose:** Privacy policy page

**Key Changes:**
- Added ChatWidget component import
- Mounted ChatWidget in page JSX

**Implementation:**
```typescript
import ChatWidget from '@/components/next/ChatWidget';

// In JSX:
<ChatWidget />
```

---

## Unchanged Files (Context)

### `src/lib/sanity.write.server.ts`
**Purpose:** Write-capable Sanity client for specific endpoints

**Functions:**
- `subscribeToNewsletter()` - Add newsletter subscriber
- `unsubscribeFromNewsletter()` - Remove newsletter subscriber
- `incrementPostViewCount()` - Increment blog post view counter

**Usage Locations:**
- `src/app/api/newsletter/subscribe/route.ts`
- `src/app/api/newsletter/unsubscribe/route.ts`
- `src/app/api/blog/views/route.ts`

**Important:** Chat API does NOT import or use this file.

### `src/context/LanguageContext.tsx`
**Purpose:** Language context provider

**Functionality:**
- Provides `language` state ('pl' or 'en')
- Persists language in localStorage
- Detects initial language from URL param or browser
- Exports `useLanguage()` hook

---

## Security Model

### Defense in Depth

#### Layer 1: Client-Side Input Sanitization
- File: `src/lib/sanitize.ts`
- Strips HTML tags, excessive whitespace, and suspicious patterns
- Runs before API call

#### Layer 2: Client-Side Rate Limiting
- File: `src/lib/client-limit.ts`
- 15 requests per hour per browser
- Backup to server-side limits

#### Layer 3: Middleware HTTP Method Guard
- File: `src/middleware.ts`
- Blocks GET, PUT, PATCH, DELETE for `/api/chat`
- Only allows POST (for chat messages) and OPTIONS (CORS preflight)
- Runs before route handler

#### Layer 4: Route-Level Method Guards
- File: `src/app/api/chat/route.ts`
- Explicit exports for GET, PUT, PATCH, DELETE returning 405
- Defense in case middleware is bypassed

#### Layer 5: Server-Side Rate Limiting
- File: `src/app/api/chat/route.ts`
- 10 requests per minute per IP
- Returns 429 with localized message

#### Layer 6: Destructive Request Detection
- File: `src/app/api/chat/route.ts`
- Keyword-based detection of destructive/admin requests
- Blocks before calling Groq API
- Returns localized refusal message

#### Layer 7: System Prompt Engineering
- File: `src/app/api/chat/route.ts`
- Explicit security rules in system prompt
- Refuses mutating actions even if keyword detection fails
- Bilingual instructions

#### Layer 8: Architectural Separation
- Read-only client in `src/lib/sanity.server.ts` (no token)
- Write client isolated in `src/lib/sanity.write.server.ts`
- Chat API does NOT import write client
- Grep verification confirms no write operations in chat route

---

## Multilingual Support

### Language Detection Flow

1. **Client-Side:**
   - User sends message with `language` parameter from LanguageContext
   - Fallback to UI language from context

2. **Server-Side:**
   - If language parameter provided ('pl' or 'en'), use it
   - Otherwise, detect from user message content:
     - Polish characters: ą, ć, ę, ł, ń, ó, ś, ź, ż
     - Polish stop words: jest, nie, się, dla, na, z, do, to, że, jak, co, ale, czy, tak
   - Default to Polish if unsure

### Context Building

1. **Per-Language Context:**
   - Separate context built for 'pl' and 'en'
   - Localized section headers
   - Localized FAQ content
   - Localized privacy policy content
   - Localized service/project/blog descriptions

2. **Caching:**
   - Separate cache entries per language
   - Key format: `ai-context-pl`, `ai-context-en`
   - TTL: 1 hour
   - Reduces Sanity queries

### UI Localization

1. **Chat Widget:**
   - All UI texts in `CHAT_COPY` object
   - Initial message
   - Error messages (limit, rate limit, fallback, general error)
   - Title and subtitle
   - Placeholder text
   - Typing indicator
   - ARIA labels

2. **Language Persistence:**
   - Language stored in localStorage
   - Survives page refreshes
   - Synchronized with URL query param

---

## Deployment Verification

### Build Status
```bash
npm run build
```
**Result:** SUCCESS

### TypeScript Check
```bash
tsc --noEmit --incremental false
```
**Result:** SUCCESS (Exit code: 0)

### Dev Server Test
```bash
npx netlify dev
```
**Result:** SUCCESS
- Middleware compiled successfully
- Chat API compiled successfully
- POST requests to `/api/chat` returning 200
- All pages rendering with ChatWidget

---

## Security Verification

### Grep Verification

#### Chat Route (src/app/api/chat/route.ts)
```bash
grep -E "sanity\.write|writeClient|\.create\(|\.patch\(|\.delete\(|\.commit\(" src/app/api/chat/route.ts
```
**Result:** No matches found

#### Read-Only Client (src/lib/sanity.server.ts)
```bash
grep -E "token:|\.create\(|\.patch\(|\.delete\(|\.commit\(" src/lib/sanity.server.ts
```
**Result:** No matches found

---

## API Endpoints

### Chat API
- **Endpoint:** `/api/chat`
- **Method:** POST only
- **Request Body:**
  ```json
  {
    "messages": [
      { "role": "user", "content": "string" }
    ],
    "language": "pl" | "en",
    "honeypot": ""
  }
  ```
- **Response:**
  ```json
  {
    "reply": "string"
  }
  ```
- **Error Responses:**
  - 405: Method not allowed (GET, PUT, PATCH, DELETE)
  - 429: Rate limit exceeded
  - 400: Destructive request detected
  - 500: Server error

### Write Endpoints (Isolated from Chat)
- `/api/newsletter/subscribe` - POST
- `/api/newsletter/unsubscribe` - POST
- `/api/blog/views` - POST

---

## Memory Update

Updated system memory entry `b6bdbbb0-0e44-4287-82cd-7869671e657e` with:

> As an architectural guard, src/lib/sanity.server.ts is read-only and does not include a Sanity token; write access is isolated in src/lib/sanity.write.server.ts for explicit non-chat endpoints only. src/middleware.ts and the chat route reject non-POST mutating HTTP methods for /api/chat, and grep verification confirmed chat route has no sanity.write/writeClient/create/patch/delete/commit usage.

---

## Conclusion

The implementation successfully achieves:

1. **Architectural Security:** Multiple layers of defense ensure chatbot cannot perform destructive actions
2. **Multilingual Support:** Full bilingual support (PL/EN) for both responses and UI
3. **Separation of Concerns:** Read-only operations isolated from write operations
4. **Verification:** TypeScript, build, and runtime verification all passing
5. **User Experience:** Chat widget available on key pages with proper mobile handling

The chatbot is now production-ready with robust security guarantees and seamless multilingual functionality.

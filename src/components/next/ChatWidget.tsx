'use client';

import { FormEvent, KeyboardEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MessageCircle, Send, X } from 'lucide-react';
import { checkClientLimit } from '@/lib/client-limit';
import { useLanguage } from '@/context/LanguageContext';
import { localizedPath } from '@/lib/i18n-routing';
import pricingConfig from '@/data/pricing-config.json';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const MESSAGES_KEY = 'appcrates_chat_messages';
const OPEN_KEY = 'appcrates_chat_open';

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
    contactCta: 'Idź do formularza kontaktowego',
    calculatorCta: 'Otwórz kalkulator wyceny',
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
    contactCta: 'Go to the contact form',
    calculatorCta: 'Open pricing calculator',
  },
};

export default function ChatWidget() {
  const { language } = useLanguage();
  const router = useRouter();
  const copy = CHAT_COPY[language];
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: copy.initialMessage }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRestored, setIsRestored] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function openCalculator() {
    const userTexts = messages
      .filter((msg) => msg.role === 'user')
      .map((msg) => msg.content.toLowerCase())
      .join(' ');

    const serviceKey = userTexts.includes('sklep') || userTexts.includes('ecommerce') || userTexts.includes('e-commerce')
      ? 'ecommerce'
      : userTexts.includes('marketplace')
        ? 'marketplace'
        : userTexts.includes('ai') || userTexts.includes('chatbot')
          ? 'ai'
          : userTexts.includes('saas') || userTexts.includes('aplikac')
            ? 'saas'
            : 'website';

    const service = (pricingConfig.services as Record<string, { base?: Record<string, unknown>; cms?: Record<string, unknown>; features?: Record<string, unknown> }>)[serviceKey];

    const detectedBase = service?.base
      ? userTexts.includes('design mam') || userTexts.includes('gotowy projekt') || userTexts.includes('mam design')
        ? 'have_design'
        : userTexts.includes('template') || userTexts.includes('gotowy układ')
          ? 'template'
          : userTexts.includes('indywidualny') || userTexts.includes('od zera') || userTexts.includes('custom')
            ? 'custom'
            : userTexts.includes('prosta') || userTexts.includes('landing') || userTexts.includes('one page')
              ? 'simple_landing'
              : undefined
      : undefined;

    const detectedCms = service?.cms
      ? userTexts.includes('bez panelu') || userTexts.includes('bez cms')
        ? 'none'
        : userTexts.includes('podgląd') || userTexts.includes('wygodniejsza')
          ? 'sanity_visual'
          : userTexts.includes('panel') || userTexts.includes('cms') || userTexts.includes('edycji')
            ? 'sanity_form'
            : undefined
      : undefined;

    const detectedFeatures: string[] = [];
    if (service?.features) {
      if (userTexts.includes('blog')) detectedFeatures.push('blog');
      if (userTexts.includes('formularz kontaktowy') || userTexts.includes('kontaktowy')) detectedFeatures.push('contact_form');
      if (userTexts.includes('więcej język') || userTexts.includes('wielojęzyczna')) detectedFeatures.push('i18n');
      if (userTexts.includes('animacj')) detectedFeatures.push('animations');
      if (userTexts.includes('seo')) detectedFeatures.push('seo_setup');
      if (userTexts.includes('statystyk') || userTexts.includes('analytics')) detectedFeatures.push('analytics');
      if (userTexts.includes('cookie') || userTexts.includes('baner')) detectedFeatures.push('cookie_banner');
      if (userTexts.includes('szybkość') || userTexts.includes('performance') || userTexts.includes('przyspieszenie')) detectedFeatures.push('performance');
      if (userTexts.includes('newsletter') || userTexts.includes('email')) detectedFeatures.push('newsletter');
      if (userTexts.includes('dodatkowe podstron') || userTexts.includes('więcej stron')) detectedFeatures.push('extra_pages');
      // Ecommerce-specific
      if (userTexts.includes('płatności') || userTexts.includes('stripe')) detectedFeatures.push('stripe');
      if (userTexts.includes('przelew') || userTexts.includes('blik') || userTexts.includes('p24')) detectedFeatures.push('p24');
      if (userTexts.includes('dostaw')) detectedFeatures.push('shipping');
    }

    const hasConcreteParams = detectedBase !== undefined || detectedCms !== undefined || detectedFeatures.length > 0;

    if (hasConcreteParams) {
      const prefill = {
        service: serviceKey,
        base: detectedBase,
        cms: detectedCms,
        features: detectedFeatures,
        deadline: 'standard',
      };
      sessionStorage.setItem('calculatorPrefill', JSON.stringify(prefill));
    }
    // If no concrete params detected, do NOT set calculatorPrefill — user will walk through the full form from step 0

    setIsOpen(false);
    router.push(localizedPath(language, '/kalkulator'));
  }

  // Load persisted chat state on mount (useLayoutEffect so it runs before saving useEffect)
  useLayoutEffect(() => {
    const savedMessages = sessionStorage.getItem(MESSAGES_KEY);
    const savedOpen = sessionStorage.getItem(OPEN_KEY);

    if (savedOpen === 'true') {
      setIsOpen(true);
    }

    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch {
        // ignore
      }
    }

    setIsRestored(true);
  }, []);

  // Persist messages and open state
  useEffect(() => {
    if (!isRestored) {
      return;
    }
    sessionStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }, [messages, isRestored]);

  useEffect(() => {
    sessionStorage.setItem(OPEN_KEY, String(isOpen));
  }, [isOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    setMessages((current) => {
      if (current.length !== 1 || current[0].role !== 'assistant') {
        return current;
      }

      return [{ role: 'assistant', content: copy.initialMessage }];
    });
  }, [copy.initialMessage]);

  async function sendMessageToAPI(nextMessages: ChatMessage[]) {
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-requested-with': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          messages: nextMessages,
          language,
          honeypot: '',
        }),
      });

      if (response.status === 429) {
        setMessages((current) => [
          ...current,
          { role: 'assistant', content: copy.rateLimitMessage },
        ]);
        return;
      }

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data = await response.json();
      const reply = typeof data?.reply === 'string' && data.reply.trim()
        ? data.reply.trim()
        : copy.fallbackMessage;

      setMessages((current) => [...current, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: 'assistant', content: copy.errorMessage },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    const trimmedInput = input.trim();

    if (!trimmedInput || loading) {
      return;
    }

    if (!checkClientLimit()) {
      setMessages((current) => [
        ...current,
        { role: 'assistant', content: copy.limitMessage },
      ]);
      return;
    }

    const userMessage: ChatMessage = { role: 'user', content: trimmedInput };
    const nextMessages = [...messages, userMessage].slice(-5);
    setMessages(nextMessages);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await sendMessageToAPI(nextMessages);
  }

  async function retryLastMessage() {
    if (loading) {
      return;
    }

    // Find last user message before the latest assistant error message
    const lastAssistantIndex = messages.length - 1;
    if (messages[lastAssistantIndex]?.role !== 'assistant') {
      return;
    }

    const lastUserIndex = messages.findLastIndex((msg, idx) => msg.role === 'user' && idx < lastAssistantIndex);
    if (lastUserIndex < 0) {
      return;
    }

    const retryMessages = messages.slice(0, lastAssistantIndex).slice(-5);
    setMessages(retryMessages);

    await sendMessageToAPI(retryMessages);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  return (
    // MOBILE: bottom-20 żeby nie wchodzić pod navbar; SM+: bottom-6
    <div className="fixed bottom-3 right-2 z-50 sm:bottom-8 sm:right-8">
      {isOpen ? (
        // MOBILE: chat zajmuje pełną szerokość z małymi marginesami i nie wychodzi poza ekran w pionie
        <div className="mb-4 flex h-[min(520px,calc(100dvh-10rem))] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-white/10 bg-indigo-950/95 shadow-2xl shadow-teal-950/40 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-white">{copy.title}</p>
              <p className="text-xs text-white/45">{copy.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={copy.closeChat}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[86%]">
                  <div className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${message.role === 'user'
                    ? 'bg-teal-300 text-indigo-950'
                    : 'border border-white/10 bg-white/[0.06] text-white/80'}`}
                  >
                    {message.content}
                  </div>
                  {message.role === 'assistant' && index === messages.length - 1 && !loading ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(message.content === copy.errorMessage || message.content === copy.rateLimitMessage || message.content === copy.fallbackMessage) ? (
                        <button
                          type="button"
                          onClick={retryLastMessage}
                          className="inline-flex rounded-xl border border-red-300/30 px-3 py-1.5 text-xs font-medium text-red-200 transition-colors hover:border-red-300 hover:bg-red-300 hover:text-indigo-950"
                        >
                          {language === 'pl' ? 'Spróbuj ponownie' : 'Try again'}
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={openCalculator}
                            className="inline-flex rounded-xl border border-teal-300/30 px-3 py-1.5 text-xs font-medium text-teal-200 transition-colors hover:border-teal-300 hover:bg-teal-300 hover:text-indigo-950"
                          >
                            {copy.calculatorCta}
                          </button>
                          <a
                            href="/#contact"
                            onClick={() => setIsOpen(false)}
                            className="inline-flex rounded-xl border border-white/15 px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:border-white/35 hover:text-white"
                          >
                            {copy.contactCta}
                          </a>
                        </>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

            {loading ? (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-white/45">{copy.typing}</div>
              </div>
            ) : null}
            <div ref={endRef} />
          </div>

          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-white/10 p-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                const el = event.target;
                el.style.height = 'auto';
                el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder={copy.placeholder}
              maxLength={500}
              disabled={loading}
              rows={1}
              className="min-w-0 flex-1 resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-teal-300/70 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-300 text-indigo-950 transition-all hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={copy.sendMessage}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      ) : null}

      {/* Toggle button:
          - Na mobile (< sm): pokazuj tylko gdy chat jest ZAMKNIĘTY (gdy otwarty, X jest już w headerze chatu)
          - Na sm+: zawsze widoczny */}
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-indigo-950 text-indigo-950 shadow-lg shadow-teal-950/40 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950 ${isOpen ? 'hidden sm:flex' : 'flex'}`}
        aria-label={isOpen ? copy.closeChat : copy.openChat}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-teal-300" />
        ) : (
          <>
            <div className="relative">
              <Image
                src="/media/AppcratesLogoSmaller.webp"
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-contain"
                aria-hidden="true"
              />
              <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-indigo-950 bg-teal-300 text-indigo-950 shadow-md shadow-teal-950/30">
                <MessageCircle className="h-4 w-4" />
              </span>
            </div>

            {/* Electric border — outside the button */}
            <span
              className="pointer-events-none absolute -inset-[2px] rounded-full border-2 border-teal-300/70 animate-[electricPulse_2s_ease-in-out_infinite]"
              style={{ filter: 'url(#electric-turbulence)' }}
            />
            <span className="pointer-events-none absolute -inset-[2px] rounded-full border-2 border-teal-300/30" style={{ filter: 'blur(4px)' }} />
            <span className="pointer-events-none absolute -inset-6 rounded-full bg-teal-300/10 blur-2xl animate-[electricGlow_3s_ease-in-out_infinite]" />

            <svg width="0" height="0" className="absolute" aria-hidden="true">
              <defs>
                <filter id="electric-turbulence" x="-50%" y="-50%" width="200%" height="200%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="5" result="noise">
                    <animate attributeName="baseFrequency" values="0.015;0.035;0.015" dur="2.5s" repeatCount="indefinite" />
                  </feTurbulence>
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>
            </svg>

            <style>{`
              @keyframes electricGlow {
                0%, 100% { opacity: 0.25; transform: scale(1); }
                50% { opacity: 0.6; transform: scale(1.06); }
              }
              @keyframes electricPulse {
                0%, 100% { opacity: 0.6; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.03); }
              }
            `}</style>
          </>
        )}
      </button>
    </div>
  );
}
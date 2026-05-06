'use client';

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { MessageCircle, Send, X } from 'lucide-react';
import { checkClientLimit } from '@/lib/client-limit';
import { useLanguage } from '@/context/LanguageContext';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

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
  },
};

export default function ChatWidget() {
  const { language } = useLanguage();
  const copy = CHAT_COPY[language];
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: copy.initialMessage }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

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
    const nextMessages = [...messages, userMessage].slice(-20);
    setMessages(nextMessages);
    setInput('');
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      void sendMessage();
    }
  }

  return (
    // MOBILE: bottom-20 żeby nie wchodzić pod navbar; SM+: bottom-6
    <div className="fixed bottom-3 right-2 z-50 sm:bottom-6 sm:right-6">
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
                    <a
                      href="/#contact"
                      onClick={() => setIsOpen(false)}
                      className="mt-2 inline-flex rounded-xl border border-teal-300/30 px-3 py-1.5 text-xs font-medium text-teal-200 transition-colors hover:border-teal-300 hover:bg-teal-300 hover:text-indigo-950"
                    >
                      {copy.contactCta}
                    </a>
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
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={copy.placeholder}
              maxLength={500}
              disabled={loading}
              className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-teal-300/70 disabled:cursor-not-allowed disabled:opacity-60"
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
        className={`relative flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-indigo-950 text-indigo-950 shadow-lg shadow-teal-950/40 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950 ${isOpen ? 'hidden sm:flex' : 'flex'}`}
        aria-label={isOpen ? copy.closeChat : copy.openChat}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-teal-300" />
        ) : (
          <>
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
          </>
        )}
      </button>
    </div>
  );
}
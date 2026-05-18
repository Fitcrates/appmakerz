'use client';

import { FormEvent, useState } from 'react';
import type { PriceResult, QuoteSelectionSummary, ServiceConfig } from '@/lib/calculator/types';
import type { Language } from '@/lib/language';

type StepContactProps = {
  service?: ServiceConfig;
  summary: QuoteSelectionSummary;
  price: PriceResult;
  language: Language;
  copy: {
    name: string;
    email: string;
    phone: string;
    message: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
  };
};

const initialForm = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

export default function StepContact({ service, summary, price, language, copy }: StepContactProps) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const noPrice = Boolean(service?.noPrice);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          selection: summary,
          priceMin: noPrice ? 0 : price.min,
          priceMax: noPrice ? 0 : price.max,
          noPrice,
          language,
        }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || copy.error);
      }

      setForm(initialForm);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : copy.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="quote-name" className="mb-2 block text-xs uppercase tracking-[0.18em] text-teal-300">{copy.name}</label>
          <input
            id="quote-name"
            name="name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            required
            autoComplete="name"
            disabled={status === 'submitting'}
            className="w-full border-0 border-b border-white/20 bg-transparent px-0 py-4 text-white outline-none transition-colors [color-scheme:dark] focus:border-teal-300 disabled:opacity-60"
          />
        </div>
        <div>
          <label htmlFor="quote-email" className="mb-2 block text-xs uppercase tracking-[0.18em] text-teal-300">{copy.email}</label>
          <input
            id="quote-email"
            name="email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            required
            autoComplete="email"
            disabled={status === 'submitting'}
            className="w-full border-0 border-b border-white/20 bg-transparent px-0 py-4 text-white outline-none transition-colors [color-scheme:dark] focus:border-teal-300 disabled:opacity-60"
          />
        </div>
      </div>
      <div>
        <label htmlFor="quote-phone" className="mb-2 block text-xs uppercase tracking-[0.18em] text-teal-300">{copy.phone}</label>
        <input
          id="quote-phone"
          name="phone"
          value={form.phone}
          onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
          autoComplete="tel"
          disabled={status === 'submitting'}
            className="w-full border-0 border-b border-white/20 bg-transparent px-0 py-4 text-white outline-none transition-colors [color-scheme:dark] focus:border-teal-300 disabled:opacity-60"
        />
      </div>
      <div>
        <label htmlFor="quote-message" className="mb-2 block text-xs uppercase tracking-[0.18em] text-teal-300">{copy.message}</label>
        <textarea
          id="quote-message"
          name="message"
          value={form.message}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          rows={4}
          disabled={status === 'submitting'}
          className="w-full resize-none border-0 border-b border-white/20 bg-transparent px-0 py-4 text-white outline-none transition-colors [color-scheme:dark] focus:border-teal-300 disabled:opacity-60"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="group relative inline-flex w-full items-center justify-center overflow-hidden bg-teal-300 px-8 py-4 font-medium text-indigo-950 transition-all duration-500 hover:shadow-[0_0_50px_rgba(94,234,212,0.35)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        <span className="relative z-10">{status === 'submitting' ? copy.sending : copy.submit}</span>
        <span className="absolute inset-0 -translate-x-full bg-white transition-transform duration-500 group-hover:translate-x-0" aria-hidden="true" />
      </button>
      {status === 'success' ? <p className="border border-teal-300/25 bg-teal-300/10 p-4 text-sm text-teal-100">{copy.success}</p> : null}
      {status === 'error' ? <p className="border border-red-300/25 bg-red-400/10 p-4 text-sm text-red-100">{errorMessage}</p> : null}
    </form>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowLeft, Check, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/translations/translations';

type UnsubscribeStatus = 'loading' | 'success' | 'error' | 'input';

export default function UnsubscribePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const t = translations[language].unsub;
  const token = searchParams?.get('token');

  const [status, setStatus] = useState<UnsubscribeStatus>('loading');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const processTokenUnsubscribe = async () => {
      if (!token) {
        if (isMounted) {
          setStatus('input');
        }
        return;
      }

      try {
        const response = await fetch('/api/newsletter/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to unsubscribe');
        }

        if (isMounted) {
          setStatus('success');
          window.setTimeout(() => router.push('/'), 2500);
        }
      } catch (unsubscribeError) {
        if (isMounted) {
          setStatus('error');
          setError(unsubscribeError instanceof Error ? unsubscribeError.message : 'Failed to unsubscribe');
        }
      }
    };

    void processTokenUnsubscribe();

    return () => {
      isMounted = false;
    };
  }, [router, token]);

  const handleManualUnsubscribe = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email.trim()) {
      setError(language === 'pl' ? 'Adres email jest wymagany.' : 'Email address is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to unsubscribe');
      }

      setStatus('success');
      window.setTimeout(() => router.push('/'), 2500);
    } catch (unsubscribeError) {
      setStatus('error');
      setError(unsubscribeError instanceof Error ? unsubscribeError.message : 'Failed to unsubscribe');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-indigo-950 flex items-center justify-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 p-8 sm:p-12">
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-teal-300/50" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-teal-300/50" />

          {status === 'loading' ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-6 border-2 border-teal-300/30 border-t-teal-300 rounded-full animate-spin" />
              <p className="text-white/50 font-jakarta">{language === 'pl' ? 'Przetwarzanie...' : 'Processing...'}</p>
            </div>
          ) : null}

          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-6 bg-teal-300/10 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-teal-300" />
              </div>
              <h1 className="text-2xl text-white font-jakarta font-light mb-2">{t.title.line1}</h1>
              <p className="text-white/50 font-jakarta">{t.note.line1}</p>
              <p className="text-white/30 font-jakarta text-sm mt-4">{t.note.line2}</p>
            </div>
          ) : null}

          {status === 'error' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-6 bg-red-400/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-2xl text-white font-jakarta font-light mb-2">{t.error.line1}</h1>
              <p className="text-white/50 font-jakarta mb-6">{error || t.error.line2}</p>
              <button type="button" onClick={() => setStatus('input')} className="text-teal-300 hover:text-teal-200 font-jakarta transition-colors">
                {t.error.line3}
              </button>
            </div>
          ) : null}

          {status === 'input' ? (
            <div>
              <div className="mb-8">
                <div className="w-12 h-12 mb-6 bg-teal-300/10 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-teal-300" />
                </div>
                <h1 className="text-2xl sm:text-3xl text-white font-jakarta font-light mb-2">{t.title.line1}</h1>
                <p className="text-white/50 font-jakarta text-sm">{t.title.line2}</p>
              </div>

              <form onSubmit={handleManualUnsubscribe} className="space-y-6">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    placeholder={t.title.line3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/30 font-jakarta focus:border-teal-300/50 focus:outline-none transition-colors"
                  />
                </div>

                {error ? <p className="text-red-400 font-jakarta text-sm">{error}</p> : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-teal-300 text-indigo-950 font-jakarta font-medium hover:bg-teal-200 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (language === 'pl' ? 'Wypisywanie...' : 'Unsubscribing...') : t.title.line4}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="inline-flex items-center text-white/50 hover:text-teal-300 font-jakarta text-sm transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  {language === 'pl' ? 'Powrot do strony glownej' : 'Back to home'}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </motion.div>
    </main>
  );
}

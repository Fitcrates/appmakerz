import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { translations } from '../translations/translations';
import { unsubscribeWithToken, unsubscribeWithEmail } from '../services/newsletter';

type UnsubscribeStatus = 'loading' | 'success' | 'error' | 'input';

const Unsubscribe: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language].unsub;

  const [status, setStatus] = useState<UnsubscribeStatus>('loading');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    const processTokenUnsubscribe = async () => {
      if (!token) {
        setStatus('input');
        return;
      }

      try {
        await unsubscribeWithToken(token);
        setStatus('success');
        // Redirect to home page after 2 seconds if using token
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (error) {
        console.error('Error:', error);
        setStatus('error');
      }
    };

    processTokenUnsubscribe();
  }, [token, navigate]);

  const handleManualUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!email) {
      setError('Email is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await unsubscribeWithEmail(email);
      if (result.success) {
        setStatus('success');
        // Redirect to home page after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to unsubscribe');
      setStatus('input'); // Keep the form visible on error
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="min-h-screen bg-[#140F2D] text-white flex items-center justify-center">
            <div className="animate-pulse">Loading...</div>
          </div>
        );

      case 'success':
        return (
          <div className="min-h-screen bg-[#140F2D] text-white p-8">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4">{t.title.line1}</h1>
              <p className="mb-6">{t.note.line2}</p>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="min-h-screen bg-[#140F2D] text-white p-8">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4">Error</h1>
              <p className="mb-6">{t.note.line2}</p>
              <div className="mt-6">
                <button 
                  onClick={() => setStatus('input')}
                  className="text-teal-300 hover:text-teal-400 transition-colors"
                >
                  Try manual unsubscribe
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="min-h-screen bg-[#140F2D] text-white p-8 ">
            <div className="max-w-2xl mx-auto mt-24">
              <h1 className="text-3xl font-bold mb-4 text-center">{t.title.line1}</h1>
              <form onSubmit={handleManualUnsubscribe} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block mb-2">
                    {t.title.line2}
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded bg-white/90 border border-white/20 text-white"
                    placeholder={t.title.line3}
                  />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Unsubscribing...' : t.title.line4}
                </button>
              </form>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Header />
      {renderContent()}
      <Footer />
    </>
  );
};

export default Unsubscribe;
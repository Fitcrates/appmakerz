import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { unsubscribeWithToken, unsubscribeWithEmail } from '../services/newsletter';
import HeaderNew from '../components/new/HeaderNew';
import FooterNew from '../components/new/FooterNew';

type UnsubscribeStatus = 'loading' | 'success' | 'error' | 'input';

const UnsubscribeNew: React.FC = () => {
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
        const result = await unsubscribeWithToken(token);
        if (result.success) {
          setStatus('success');
          setTimeout(() => navigate('/'), 3000);
        } else {
          throw new Error(result.message || 'Failed to unsubscribe');
        }
      } catch (error) {
        console.error('Error:', error);
        setStatus('error');
        setError(error instanceof Error ? error.message : 'Failed to unsubscribe');
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
        setTimeout(() => navigate('/'), 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to unsubscribe');
      setStatus('input');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <HeaderNew />
      
      <main className="min-h-screen bg-indigo-950 flex items-center justify-center px-4 py-24">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute w-[200%] h-32 -rotate-12 top-1/3"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(94, 234, 212, 0.1), transparent)',
              filter: 'blur(60px)',
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-md"
        >
          {/* Card */}
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 p-8 sm:p-12">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-teal-300/50" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-teal-300/50" />

            {status === 'loading' && (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-6 border-2 border-teal-300/30 border-t-teal-300 rounded-full animate-spin" />
                <p className="text-white/50 font-jakarta">Processing...</p>
              </div>
            )}

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-teal-300/10 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-teal-300" />
                </div>
                <h1 className="text-2xl text-white font-jakarta font-light mb-2">
                  {t.title.line1}
                </h1>
                <p className="text-white/50 font-jakarta">
                  {t.note?.line2 || 'You have been unsubscribed successfully.'}
                </p>
                <p className="text-white/30 font-jakarta text-sm mt-4">
                  Redirecting to home...
                </p>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-red-400/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h1 className="text-2xl text-white font-jakarta font-light mb-2">
                  {(t as any).error?.line1 || 'Error'}
                </h1>
                <p className="text-white/50 font-jakarta mb-6">
                  {error || (t as any).error?.line2 || 'There was an error processing your request.'}
                </p>
                <button
                  onClick={() => setStatus('input')}
                  className="text-teal-300 hover:text-teal-200 font-jakarta transition-colors"
                >
                  {(t as any).error?.line3 || 'Try manual unsubscribe'}
                </button>
              </motion.div>
            )}

            {status === 'input' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Header */}
                <div className="mb-8">
                  <div className="w-12 h-12 mb-6 bg-teal-300/10 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-teal-300" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl text-white font-jakarta font-light mb-2">
                    {t.title.line1}
                  </h1>
                  <p className="text-white/50 font-jakarta text-sm">
                    {t.title.line2}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleManualUnsubscribe} className="space-y-6">
                  <div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder={t.title.line3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/30 font-jakarta focus:border-teal-300/50 focus:outline-none transition-colors"
                    />
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 font-jakarta text-sm"
                    >
                      {error}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-teal-300 text-indigo-950 font-jakarta font-medium hover:bg-teal-200 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Unsubscribing...' : t.title.line4}
                  </button>
                </form>

                {/* Back link */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center text-white/50 hover:text-teal-300 font-jakarta text-sm transition-colors group"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to home
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>

      <FooterNew />
    </>
  );
};

export default UnsubscribeNew;

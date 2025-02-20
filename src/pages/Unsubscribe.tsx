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
        const result = await unsubscribeWithToken(token);
        if (result.success) {
          setStatus('success');
          // Redirect to home page after 2 seconds if using token
          setTimeout(() => {
            navigate('/');
          }, 2000);
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
          <div className="min-h-screen bg-[#140F2D] text-white flex items-center justify-center mt-24">
            <div className="animate-pulse">Loading...</div>
          </div>
        );

      case 'success':
        return (
          <div className="min-h-screen bg-[#140F2D] text-white p-8 mt-24">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4">{t.title.line1}</h1>
              <p className="mb-6">{t.note.line2}</p>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="min-h-screen bg-[#140F2D] text-white p-8 mt-24">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4">{t.error?.line1 || 'Error'}</h1>
              <p className="mb-6">{error || t.error?.line2 || 'There was an error processing your unsubscribe request.'}</p>
              <div className="mt-6">
                <button 
                  onClick={() => setStatus('input')}
                  className="text-teal-300 hover:text-teal-400 transition-colors"
                >
                  {t.error?.line3 || 'Try manual unsubscribe'}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          
          <div className="h-[90vh] bg-[#140F2D] relative text-white p-8 overflow-hidden">
            {/* Diagonal glow stripe from corner to corner */}
            <div 
              className="absolute h-24 "
              style={{
                background: 'rgba(45, 212, 191, 0.35)',
                filter: 'blur(45px)',
                boxShadow: '0 0 70px 50px rgba(45, 212, 191, 0.35)',
                width: '200vw', // Make it wider than the screen
                right: '-50vw', // Position it to extend beyond left edge
                top: '40%',
                transform: 'rotate(17deg)', // Adjust angle as needed
                transformOrigin: 'center center'
                
              }}
            />
            
            {/*  light enhancement  */}
            <div 
              className="absolute h-24"
              style={{
                background: 'rgba(45, 212, 191, 0.17)',
                filter: 'blur(45px)',
                width: '150vw',
                right: '-25vw',
                top: '45%',
                transform: 'rotate(17deg)',
                transformOrigin: 'center center',
               
              }}
            />
            
          
          {/* Content box */}
          <div className="flex items-center justify-center min-h-screen">
          <div className=" relative max-w-2xl  mx-auto ring-1 ring-white/20 p-16 bg-white/5 backdrop-blur-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-4 text-center">{t.title.line1}</h1>
            <form onSubmit={handleManualUnsubscribe} className="space-y-4" id="unsubscribe-form">
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
                  className="w-full p-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-white/50 outline-none no-arrows text-sm sm:text-base"
                  placeholder={t.title.line3}
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="GlowButton  justify-center w-full px-6 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Unsubscribing...' : t.title.line4}
              </button>
            </form>
          </div>
          </div>
        </div>
        );
    }
  };

  return (
    <>
      <Header />
      {renderContent()}
      <Footer  />
    </>
  );
};

export default Unsubscribe;

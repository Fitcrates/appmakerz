import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { v4 as uuidv4 } from 'uuid';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewsletterModal: React.FC<NewsletterModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const t = translations[language].modal;
  const modalRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mathProblem, setMathProblem] = useState({ num1: 0, num2: 0, answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');

  // Static categories
  const availableCategories = ['Dev', 'No-code', 'Wellness'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      generateMathProblem();
    }
  }, [isOpen]);

  const generateMathProblem = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setMathProblem({
      num1,
      num2,
      answer: num1 + num2
    });
    setUserAnswer('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (parseInt(userAnswer) !== mathProblem.answer) {
      setError(t.error?.captcha || 'Incorrect CAPTCHA answer. Please try again.');
      generateMathProblem();
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/.netlify/functions/handleSubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          categories,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to subscribe');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setEmail('');
        setCategories([]);
      }, 2000);
    } catch (error) {
      console.error('Error creating subscriber:', error);
      setError(t.error?.line1 || 'Failed to subscribe. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50 p-4 overflow-y-auto animate-fadeIn">
      <div ref={modalRef} className="w-full max-w-[95%] md:max-w-2xl animate-scaleIn">
        <div className="bg-[#140F2D] rounded-lg p-4 sm:p-8 md:p-12 w-full ring-1 ring-teal-300/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h4 className="text-xl sm:text-2xl text-white font-jakarta font-light mb-4">{t.title.line1}</h4>

            {success ? (
              <div className="text-green-600 font-medium">{t.notify}</div>
            ) : (
              <>
                <div className="mb-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.title.line2}
                    required
                    className="w-full p-2 rounded bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-white/50 outline-none text-sm sm:text-base"
                  />
                </div>

                <div className="mb-6">
                  <p className="text-white mb-2 text-sm sm:text-base">{t.subtitle.line1}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableCategories.map((category) => (
                      <label key={category} className="flex items-center space-x-2 text-white text-sm sm:text-base">
                        <input
                          type="checkbox"
                          checked={categories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                          className="peer hidden"
                        />
                        <div className="w-4 h-4 border-2 GlowButton border-white rounded-md flex items-center justify-center peer-checked:bg-teal-300 peer-checked:text-black relative">
                          <span className="opacity-0 peer-checked:opacity-100 transition-opacity">✓</span>
                        </div>
                        <span>{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <p className="text-white font-jakarta text-sm sm:text-base mb-2">
                    {t.captcha} {mathProblem.num1} + {mathProblem.num2}?
                  </p>
                  <div className="relative w-full max-w-xs">
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder={t.captcha2}
                      required
                      className="peer-hidden w-full p-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-white/50 outline-none no-arrows text-sm sm:text-base"
                    />
                    <div className="absolute inset-y-0 right-0 flex flex-col items-center">
                      <button
                        type="button"
                        onClick={() => setUserAnswer((prev) => (prev ? Number(prev) + 1 : 1))}
                        className="w-4 h-[1.3rem] text-teal-300 text-xs flex items-center justify-center rounded-tr-lg border border-white/20 hover:bg-teal-400 hover:text-black"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserAnswer((prev) => (prev && prev > 0 ? Number(prev) - 1 : 0))}
                        className="w-4 h-[1.3rem] text-teal-300 text-xs flex items-center justify-center rounded-br-lg border border-white/20 hover:bg-teal-400 hover:text-black"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </div>

                {error && <div className="text-red-500 mt-4 text-sm sm:text-base">{error}</div>}

                <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-4 sm:space-y-0 items-center mt-6">
                  <button
                    type="submit"
                    disabled={!email || isSubmitting || (parseInt(userAnswer) !== mathProblem.answer)}
                    className={`GlowButton w-auto sm:w-auto justify-center ${!email || parseInt(userAnswer) !== mathProblem.answer ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Subscribing...' : t.subtitle.line2}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-white hover:text-teal-300 transition-colors text-center sm:text-left"
                  >
                    {t.subtitle.line3}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsletterModal;

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';

interface NewsletterModalNewProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewsletterModalNew: React.FC<NewsletterModalNewProps> = ({ isOpen, onClose }) => {
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

  const availableCategories = ['Dev', 'No-code', 'Wellness'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
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
    setMathProblem({ num1, num2, answer: num1 + num2 });
    setUserAnswer('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (parseInt(userAnswer) !== mathProblem.answer) {
      setError((t as any).error?.captcha || 'Incorrect answer. Please try again.');
      generateMathProblem();
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/.netlify/functions/handleSubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, categories }),
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
      setError((t as any).error?.line1 || 'Failed to subscribe. Please try again later.');
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-indigo-950/95 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-indigo-950 border border-white/10 p-8 sm:p-12"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-teal-300/50" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-teal-300/50" />

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-teal-300/10 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-teal-300" />
                </div>
                <h3 className="text-2xl text-white font-jakarta font-light mb-2">
                  {t.notify || 'Successfully subscribed!'}
                </h3>
                <p className="text-white/50 font-jakarta">Check your inbox for confirmation.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header */}
                <div className="mb-8">
                  <div className="w-12 h-12 mb-6 bg-teal-300/10 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-teal-300" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl text-white font-jakarta font-light mb-2">
                    {t.title.line1}
                  </h3>
                  <p className="text-white/50 font-jakarta text-sm">
                    Get updates on new projects and articles.
                  </p>
                </div>

                {/* Email input */}
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.title.line2}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/30 font-jakarta focus:border-teal-300/50 focus:outline-none transition-colors"
                  />
                </div>

                {/* Categories */}
                <div>
                  <p className="text-white/70 font-jakarta text-sm mb-3">{t.subtitle.line1}</p>
                  <div className="flex flex-wrap gap-2">
                    {availableCategories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleCategoryToggle(category)}
                        className={`px-4 py-2 border font-jakarta text-sm transition-all ${
                          categories.includes(category)
                            ? 'bg-teal-300 border-teal-300 text-indigo-950'
                            : 'border-white/20 text-white/70 hover:border-white/40'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CAPTCHA */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-white/70 font-jakarta text-sm mb-2">
                    {t.captcha} {mathProblem.num1} + {mathProblem.num2}?
                  </p>
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder={t.captcha2}
                    required
                    className="w-32 px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-white/30 font-jakarta focus:border-teal-300/50 focus:outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                {/* Error */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 font-jakarta text-sm"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={!email || isSubmitting || parseInt(userAnswer) !== mathProblem.answer}
                    className={`flex-1 px-6 py-3 bg-teal-300 text-indigo-950 font-jakarta font-medium transition-all ${
                      !email || parseInt(userAnswer) !== mathProblem.answer
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-teal-200'
                    }`}
                  >
                    {isSubmitting ? 'Subscribing...' : t.subtitle.line2}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 border border-white/20 text-white/70 font-jakarta hover:border-white/40 hover:text-white transition-colors"
                  >
                    {t.subtitle.line3}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsletterModalNew;

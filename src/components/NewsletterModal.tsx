import React, { useState, useEffect } from 'react';
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

  const [email, setEmail] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch unique categories from posts
    const fetchCategories = async () => {
      const query = `*[_type == "post"].categories[]`;
      const result = await fetch('/.netlify/functions/fetchCategories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
        }),
      });
      const data = await result.json();
      // Get unique categories
      const uniqueCategories = [...new Set(data.flat())];
      setAvailableCategories(uniqueCategories);
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setError(t.error.line1);
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
    <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
      <div className="bg-[#140F2D]/80 rounded-lg p-8 max-w-md w-full mx-4">
        <h4 className="text-2xl text-white font-jakarta font-light mb-4">{t.title.line1}</h4>
        
        {success ? (
          <div className="text-green-600 font-medium">
            {t.notify}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.title.line2}
                required
                className="w-full p-2 rounded bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-white/50 outline-none"
              />
            </div>

            <div className="mb-4">
              <p className="text-white mb-2">{t.subtitle.line1}</p>
              <div className="space-y-2">
                {availableCategories.map((category) => (
                  <label key={category} className="flex items-center space-x-2 text-white">
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

            {error && (
              <div className="text-red-500 mb-4">
                {error}
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="GlowButton mt-4"
              >
                {isSubmitting ? 'Subscribing...' : t.subtitle.line2}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-white hover:text-teal-300 transition-colors mt-4"
              >
                {t.subtitle.line3}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewsletterModal;

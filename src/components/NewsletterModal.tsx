import React, { useState, useEffect } from 'react';
import { client } from '../lib/sanity.client';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewsletterModal: React.FC<NewsletterModalProps> = ({ isOpen, onClose }) => {
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
      const result = await client.fetch(query);
      // Get unique categories
      const uniqueCategories = [...new Set(result.flat())];
      setAvailableCategories(uniqueCategories);
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!email) {
      setError('Email is required');
      setIsSubmitting(false);
      return;
    }

    if (categories.length === 0) {
      setError('Please select at least one category');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/.netlify/functions/handleNewsletterSubscription', {
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
        throw new Error(data.error || 'Failed to subscribe');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setEmail('');
        setCategories([]);
      }, 2000);
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
      console.error('Error creating subscriber:', err);
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
    <div className="fixed inset-0 bg-white/80  flex items-center justify-center z-50">
      <div className="bg-[#140F2D]/80 rounded-lg p-8 max-w-md w-full mx-4">
        <h4 className="text-2xl text-white font-jakarta font-light mb-4">Subscribe to Newsletter</h4>
        
        {success ? (
          <div className="text-green-600 font-medium">
            Successfully subscribed! Thank you.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-2 rounded bg-white/10 text-white placeholder-white/50 border border-white/20"
                required
              />
            </div>

            <div className="mb-4">
              <p className="text-white mb-2">Select categories you're interested in:</p>
              <div className="space-y-2">
                {availableCategories.map((category) => (
                  <label key={category} className="flex items-center space-x-2 text-white">
                    <input
                      type="checkbox"
                      checked={categories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="form-checkbox"
                    />
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

            <div className="flex justify-between">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-[#140F2D] px-4 py-2 rounded hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-white hover:text-white/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewsletterModal;

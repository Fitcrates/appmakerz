import React, { useState, useEffect } from 'react';
import { writeClient as client } from '../lib/sanity.client';
import { v4 as uuidv4 } from 'uuid';

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
      // Create subscriber document in Sanity
      await client.create({
        _type: 'subscriber',
        email,
        subscribedCategories: categories,
        unsubscribeToken: uuidv4(),
        isActive: true,
      });

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
    <div className="fixed inset-0 bg-white/80 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#140F2D]/80 rounded-lg p-8 max-w-md w-full mx-4">
        <h4 className="text-2xl text-white font-bold mb-4">Subscribe to Newsletter</h4>
        
        {success ? (
          <div className="text-green-600 font-medium">
            Successfully subscribed! Thank you.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">
                Select Categories
              </label>
              <div className="space-y-2">
                {availableCategories.map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={categories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="peer hidden"
/>
<div className="w-4 h-4 border-2 border-white rounded-md flex items-center justify-center peer-checked:bg-teal-300 peer-checked:border-teal-300">
✓
      </div>
                    <span className="ml-2 text-white">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm mb-4">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-white hover:text-teal-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="GlowButton px-4 py-2 text-sm font-medium "
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewsletterModal;

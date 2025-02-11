import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Subscriber {
  _id: string;
  email: string;
  subscribedCategories: string[];
  isActive: boolean;
  subscribedAt: string;
}

const SubscriberList = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await fetch('/.netlify/functions/getSubscribers');
        if (!response.ok) {
          throw new Error('Failed to fetch subscribers');
        }
        const result = await response.json();
        setSubscribers(result);
      } catch (err) {
        console.error('Error fetching subscribers:', err);
        setError('Failed to load subscribers');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-t from-[#140F2D]/80 via-teal-300 to-[#140F2D]/80 flex items-center justify-center"
      >
        <div className="text-white text-xl">Loading subscribers...</div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-t from-[#140F2D]/80 via-teal-300 to-[#140F2D]/80 flex items-center justify-center"
      >
        <div className="text-red-400 text-xl">{error}</div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-t from-[#140F2D]/80 via-teal-300 to-[#140F2D]/80 p-8"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Newsletter Subscribers</h1>
        <div className="bg-[#140F2D]/80 rounded-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-white border-b border-gray-700">
                  <th className="pb-4">Email</th>
                  <th className="pb-4">Categories</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Subscribed At</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr key={subscriber._id} className="text-white/80 border-b border-gray-700/50">
                    <td className="py-4">{subscriber.email}</td>
                    <td className="py-4">
                      {subscriber.subscribedCategories.join(', ')}
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          subscriber.isActive
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {subscriber.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4">
                      {subscriber.subscribedAt ? new Date(subscriber.subscribedAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Unknown date'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {subscribers.length === 0 && (
            <div className="text-white/60 text-center py-8">
              No subscribers found
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SubscriberList;

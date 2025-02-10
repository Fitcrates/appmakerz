import React, { useState } from 'react';
import { sendTestNewsletter } from '../utils/testNewsletter';

const NewsletterTest = () => {
  const [postId, setPostId] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState('');

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    setDetails('');
    
    try {
      const result = await sendTestNewsletter(postId, email);
      if (result.success) {
        setStatus('success');
        setMessage('Test email sent successfully!');
      } else {
        setStatus('error');
        setMessage(result.error?.message || 'Failed to send test email');
        if (result.error?.details) {
          setDetails(result.error.details);
        }
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'An error occurred');
      if (error.stack) {
        setDetails(error.stack);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[#140F2D]/80 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Test Newsletter Email</h2>
      
      <div className="mb-6 p-4 bg-[#1E1836]/50 rounded">
        <h3 className="text-white font-medium mb-2">Instructions:</h3>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>Enter the post ID (e.g., "drafts.your-post-id")</li>
          <li>Enter your email address (must be subscribed)</li>
          <li>The post must be published in Sanity Studio</li>
          <li>Make sure the post has a title and slug</li>
        </ul>
      </div>

      <form onSubmit={handleTest} className="space-y-4">
        <div>
          <label htmlFor="postId" className="block text-sm font-medium text-white">
            Post ID
          </label>
          <input
            type="text"
            id="postId"
            value={postId}
            onChange={(e) => setPostId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 bg-[#1E1836] text-white"
            placeholder="drafts.your-post-id"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white">
            Test Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 bg-[#1E1836] text-white"
            placeholder="your@email.com"
            required
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            status === 'loading'
              ? 'bg-teal-500/50 cursor-not-allowed'
              : 'bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
          }`}
        >
          {status === 'loading' ? 'Sending...' : 'Send Test Email'}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-4 rounded ${
            status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}
        >
          <p className="font-medium">{message}</p>
          {details && (
            <pre className="mt-2 text-sm overflow-x-auto whitespace-pre-wrap">
              {details}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsletterTest;

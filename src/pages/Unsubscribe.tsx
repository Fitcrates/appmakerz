import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { writeClient as client } from '../lib/sanity.client';

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'input'>('loading');
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
        // Find and update the subscriber
        const subscriber = await client.fetch(
          `*[_type == "subscriber" && unsubscribeToken == $token][0]._id`,
          { token }
        );

        if (!subscriber) {
          setStatus('error');
          return;
        }

        // Update the subscriber to inactive
        await client
          .patch(subscriber)
          .set({ isActive: false })
          .commit();

        setStatus('success');
        // Redirect to home page after 2 seconds if using token
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (error) {
        console.error('Error unsubscribing:', error);
        setStatus('error');
      }
    };

    processTokenUnsubscribe();
  }, [token, navigate]);

  const handleManualUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Find subscriber by email
      const subscriber = await client.fetch(
        `*[_type == "subscriber" && email == $email && isActive == true][0]`,
        { email }
      );

      if (!subscriber) {
        setError('No active subscription found for this email.');
        setIsSubmitting(false);
        return;
      }

      // Update the subscriber to inactive
      await client
        .patch(subscriber._id)
        .set({ isActive: false })
        .commit();

      setStatus('success');
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error('Error unsubscribing:', err);
      setError('Failed to process unsubscribe request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-[#140F2D]/80 via-teal-300 to-[#140F2D]/80 flex items-center justify-center px-4">
      <div className="bg-[#140F2D]/80 rounded-lg p-8 max-w-md w-full mx-4">
        {status === 'loading' && (
          <div className="text-center">
            <h4 className="text-2xl text-white font-bold mb-4">Processing...</h4>
            <p className="text-white/80">Please wait while we process your unsubscribe request.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <h4 className="text-2xl text-white font-bold mb-4">Successfully Unsubscribed</h4>
            <p className="text-white/80">
              You have been successfully unsubscribed from our newsletter.
              You will no longer receive email notifications about new blog posts.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <h4 className="text-2xl text-white font-bold mb-4">Error</h4>
            <p className="text-white/80">
              We couldn't process your unsubscribe request.
              The link might be invalid or expired.
              Try entering your email below to unsubscribe manually.
            </p>
            {/* Show manual unsubscribe form when token is invalid */}
            <div className="mt-6">
              {setStatus('input')}
            </div>
          </div>
        )}

        {status === 'input' && (
          <>
            <h4 className="text-2xl text-white font-bold mb-4">Unsubscribe from Newsletter</h4>
            <form onSubmit={handleManualUnsubscribe}>
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

              {error && (
                <div className="text-red-400 text-sm mb-4">
                  {error}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="GlowButton px-4 py-2 text-sm font-medium text-white"
                >
                  {isSubmitting ? 'Processing...' : 'Unsubscribe'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;
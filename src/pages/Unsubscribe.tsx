import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

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
        const response = await fetch('/.netlify/functions/handleUnsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error('Failed to unsubscribe');
        }

        setStatus('success');
        // Redirect to home page after 2 seconds if using token
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (error) {
        console.error('Error:', error);
        setStatus('error');
      }
    };

    processTokenUnsubscribe();
  }, [token, navigate]);

  const handleManualUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/.netlify/functions/handleUnsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to unsubscribe');
      }

      setStatus('success');
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to unsubscribe');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#140F2D] text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#140F2D] text-white p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Successfully Unsubscribed</h1>
          <p className="mb-6">You have been successfully unsubscribed from our newsletter.</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-[#140F2D] text-white p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p className="mb-6">There was an error processing your unsubscribe request.</p>
          <div className="mt-6">
            {setStatus('input')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#140F2D] text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">Unsubscribe from Newsletter</h1>
        <form onSubmit={handleManualUnsubscribe} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white"
              placeholder="Enter your email address"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Unsubscribing...' : 'Unsubscribe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Unsubscribe;

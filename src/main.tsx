import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import { LanguageProvider } from './context/LanguageContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (garbage collection time, formerly cacheTime)
      refetchOnWindowFocus: false,
    },
  },
});

// Lazy load routes
const AnimatedRoutes = React.lazy(() => import('./Animatedroutes'));

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <Router>
        <React.Suspense fallback={<div className='bg-[#140F2D] min-h-screen'>Loading...</div>}>
          <AnimatedRoutes />
        </React.Suspense>
      </Router>
    </LanguageProvider>
  </QueryClientProvider>
);
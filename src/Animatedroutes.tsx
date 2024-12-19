import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import App from './App';
import Blog from './Blog';
import Pricing from './Pricing';
import StudioPage from './StudioPage';
import BlogPostPage from './components/BlogPostPage';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<App />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/studio" element={<StudioPage />} />
    </Routes>
  );
};

export default AnimatedRoutes;
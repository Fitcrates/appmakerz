import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from './config/email.config';
import Admin from './components/admin/Admin'; // Adjust path
import App from './App';
import Blog from './Blog';
import Pricing from './Pricing';
import './index.css';

// Initialize EmailJS
emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/admin" element={<Admin />} /> {/* Admin Dashboard */}
      </Routes>
    </Router>
  </StrictMode>
);
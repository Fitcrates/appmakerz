import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from './config/email.config';
import './index.css';
import AnimatedRoutes from './Animatedroutes';

// Initialize EmailJS
emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <AnimatedRoutes />
    </Router>
  </StrictMode>
);
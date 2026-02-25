import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Mail, ArrowRight, Check } from 'lucide-react';
import { HashLink } from 'react-router-hash-link';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';

const getFooterNavItems = (t: typeof translations.en.nav) => [
  { name: t.home, hash: 'hero' },
  { name: t.about, hash: 'about' },
  { name: t.projects, hash: 'projects' },
  { name: t.services, hash: 'services' },
  { name: t.solutions, hash: 'solutions' },
  { name: t.contact, hash: 'contact' },
];

// Email validation helper
const validateEmail = (email: string): { isValid: boolean; error: string } => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  // Trim whitespace
  const trimmedEmail = email.trim();

  // Check for basic format
  if (trimmedEmail.length < 5) {
    return { isValid: false, error: 'Email is too short' };
  }

  if (trimmedEmail.length > 254) {
    return { isValid: false, error: 'Email is too long' };
  }

  // RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  // Check for @ symbol
  const atIndex = trimmedEmail.indexOf('@');
  if (atIndex === -1) {
    return { isValid: false, error: 'Email must contain @' };
  }

  // Check domain part
  const domain = trimmedEmail.substring(atIndex + 1);
  if (!domain.includes('.')) {
    return { isValid: false, error: 'Please enter a valid domain' };
  }

  // Check for common typos
  const domainLower = domain.toLowerCase();
  const typoPatterns = [
    { pattern: /gmai[l]?\.co[mn]?$/i, suggestion: 'gmail.com' },
    { pattern: /gmial\.com$/i, suggestion: 'gmail.com' },
    { pattern: /yaho[o]?\.co[mn]?$/i, suggestion: 'yahoo.com' },
    { pattern: /hotmai[l]?\.co[mn]?$/i, suggestion: 'hotmail.com' },
  ];

  for (const { pattern, suggestion } of typoPatterns) {
    if (pattern.test(domainLower) && domainLower !== suggestion) {
      return { isValid: false, error: `Did you mean ${trimmedEmail.split('@')[0]}@${suggestion}?` };
    }
  }

  return { isValid: true, error: '' };
};

const FooterNew: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { language } = useLanguage();
  const t = translations[language].footer;
  const navT = translations[language].nav;
  const footerNavItems = getFooterNavItems(navT);
  
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear error when user starts typing
    if (error && value) {
      setError('');
    }
  };

  const handleEmailBlur = () => {
    setTouched(true);
    if (email) {
      const validation = validateEmail(email);
      if (!validation.isValid) {
        setError(validation.error);
      }
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email before submitting
    const validation = validateEmail(email);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/.netlify/functions/handleSubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), categories: ['Dev', 'No-code', 'Wellness'] }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to subscribe');
      }

      setIsSubscribed(true);
      setEmail('');
      setTouched(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEmailValid = email && validateEmail(email).isValid;

  return (
    <footer className="relative bg-indigo-950" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-16 lg:py-20 border-t border-white/10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-6 bg-teal-300/10 rounded-full">
              <Mail className="w-5 h-5 text-teal-300" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-light text-white font-jakarta mb-3">
              {t.newsletter.title}
            </h3>
            <p className="text-white/40 font-jakarta mb-8">
              {t.newsletter.description}
            </p>

            {isSubscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-teal-300/10 text-teal-300 font-jakarta"
              >
                <Check className="w-5 h-5" />
                <span>{t.newsletter.success}</span>
              </motion.div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    id="newsletter-email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    placeholder={t.newsletter.placeholder}
                    required
                    aria-label="Email address for newsletter"
                    aria-required="true"
                    autoComplete="email"
                    className={`w-full px-4 py-3 bg-white/5 border text-white placeholder-white/30 font-jakarta focus:outline-none focus:ring-2 focus:ring-teal-300/30 transition-colors ${
                      error && touched ? 'border-red-400/50 focus:border-red-400' : 'border-white/10 focus:border-teal-300/50'
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !isEmailValid}
                  className="group px-6 py-3 bg-teal-300 text-indigo-950 font-jakarta font-medium hover:bg-teal-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950"
                  aria-label={isSubmitting ? 'Subscribing to newsletter...' : 'Subscribe to newsletter'}
                >
                  <span>{isSubmitting ? t.newsletter.subscribing : t.newsletter.button}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}

            {error && (
              <p className="mt-3 text-red-400 font-jakarta text-sm">{error}</p>
            )}
          </div>
        </div>

        {/* Main footer content */}
        <div className="py-16 lg:py-24 border-t border-white/10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Left - Brand */}
            <div>
              <a href="#hero" className="inline-block mb-8">
                <span className="text-3xl font-jakarta font-light text-white">
                  App<span className="text-teal-300">Crates</span>
                </span>
              </a>
              <p className="text-white/40 font-jakarta font-light max-w-md text-lg leading-relaxed">
                {t.brand.description}
              </p>
            </div>

            {/* Right - Links */}
            <div className="grid grid-cols-2 gap-8">
              <nav aria-label="Footer navigation">
                <h4 className="text-xs text-white/30 font-jakarta tracking-widest uppercase mb-6">{t.navigation}</h4>
                <ul className="space-y-4" role="list">
                  {footerNavItems.map((link) => (
                    <li key={link.name}>
                      <HashLink
                        smooth
                        to={`/#${link.hash}`}
                        className="text-white/60 font-jakarta hover:text-teal-300 transition-colors"
                      >
                        {link.name}
                      </HashLink>
                    </li>
                  ))}
                </ul>
              </nav>

              <div>
                <h4 className="text-xs text-white/30 font-jakarta tracking-widest uppercase mb-6">{t.connect}</h4>
                <ul className="space-y-4" role="list">
                  <li>
                    <a
                      href="mailto:aeonofshreds@gmail.com"
                      className="text-white/60 font-jakarta hover:text-teal-300 transition-colors"
                    >
                      {t.links.email}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/Fitcrates"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 font-jakarta hover:text-teal-300 transition-colors"
                    >
                      {t.links.github}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/in/arkadiusz-wawrzyniak-5a536015a"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 font-jakarta hover:text-teal-300 transition-colors"
                    >
                      {t.links.linkedin}
                    </a>
                  </li>
                  <li>
                    <a
                      href="/blog"
                      className="text-white/60 font-jakarta hover:text-teal-300 transition-colors"
                    >
                      {t.links.blog}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-sm font-jakarta">
            {t.copyright.replace('{year}', currentYear.toString())}
          </p>

          <div className="flex items-center gap-8">
            <a
              href="/privacy-policy"
              className="text-white/20 text-sm font-jakarta hover:text-teal-300 transition-colors"
            >
              {t.legal.privacy}
            </a>
            <a
              href="/unsubscribe"
              className="text-white/20 text-sm font-jakarta hover:text-teal-300 transition-colors"
            >
              {t.legal.unsubscribe}
            </a>
            
            {/* Back to top */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -2 }}
              className="group flex items-center gap-2 text-white/20 text-sm font-jakarta hover:text-teal-300 transition-colors focus:outline-none focus:text-teal-300"
              aria-label="Scroll back to top of page"
            >
              <span>{t.backToTop}</span>
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterNew;

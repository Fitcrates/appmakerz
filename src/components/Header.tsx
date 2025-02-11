import React from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const scrollToElement = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 100; // Adjust this value based on your header height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    };

    // If we're not on the homepage, navigate there first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation and lazy loading to complete
      setTimeout(scrollToElement, 500); // Increased timeout to account for lazy loading
    } else {
      scrollToElement();
    }
    
    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed w-full backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6 border-b border-white">
          {/* Logo */}
          <button 
            onClick={handleLogoClick} 
            className="text-2xl font-light flex-shrink-0"
          >
            <span className="text-white font-bold">app</span>
            <span className="text-white font-thin font-jakarta">crates</span>
          </button>
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 mx-6 flex-grow flex justify-end items-center">
            <button
              onClick={() => setLanguage(language === 'en' ? 'pl' : 'en')}
              className="px-3 py-1 rounded-md bg-white/30 text-white hover:bg-teal-300 transition-colors mr-4"
            >
              {language === 'en' ? 'PL' : 'EN'}
            </button>
            <button
              onClick={() => scrollToSection('hero')}
              className="text-white font-thin font-jakarta hover:scale-110 hover:text-teal-300 transform transition-transform duration-300 tracking-wide"
            >
              {t.navigation.home}
            </button>
            <Link
              to="/blog"
              className="text-white font-thin font-jakarta hover:scale-110 hover:text-teal-300 transform transition-transform duration-300 tracking-wide"
            >
              {t.navigation.blog}
            </Link>
            <button
              onClick={() => scrollToSection('about')}
              className="text-white font-thin font-jakarta hover:scale-110 hover:text-teal-300 transform transition-transform duration-300 tracking-wide"
            >
              {t.navigation.about}
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className="text-white font-thin font-jakarta hover:scale-110 hover:text-teal-300 transform transition-transform duration-300 tracking-wide"
            >
              {t.navigation.projects}
            </button>
            <Link
              to="/pricing"
              className="text-white font-thin font-jakarta hover:scale-110 hover:text-teal-300 transform transition-transform duration-300 tracking-wide"
            >
              {t.navigation.pricing}
            </Link>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-white font-thin font-jakarta hover:scale-110 hover:text-teal-300 transform transition-transform duration-300 tracking-wide"
            >
              {t.navigation.contact}
            </button>
          </nav>

          {/* Mobile menu button and language toggle */}
          <div className="lg:hidden flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'pl' : 'en')}
              className="px-3 py-1 rounded-md bg-white/30 text-white hover:bg-teal-300 transition-colors"
            >
              {language === 'en' ? 'PL' : 'EN'}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              className="text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-[#140F2D]/95 backdrop-blur-sm">
              <nav className="flex flex-col space-y-4 p-4">
                <button
                  onClick={() => scrollToSection('home')}
                  className="text-white font-thin font-jakarta hover:text-teal-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.navigation.home}
                </button>
                <Link
                  to="/blog"
                  className="text-white font-thin font-jakarta hover:text-teal-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.navigation.blog}
                </Link>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-white font-thin font-jakarta hover:text-teal-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.navigation.about}
                </button>
                <button
                  onClick={() => scrollToSection('projects')}
                  className="text-white font-thin font-jakarta hover:text-teal-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.navigation.projects}
                </button>
                <Link
                  to="/pricing"
                  className="text-white font-thin font-jakarta hover:text-teal-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.navigation.pricing}
                </Link>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-white font-thin font-jakarta hover:text-teal-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.navigation.contact}
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

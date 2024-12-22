import React from 'react';
import { Menu, X } from 'lucide-react';
import { HashLink } from 'react-router-hash-link';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { language, setLanguage } = useLanguage();

  return (
    <header className="fixed w-full backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6 border-b border-white mb-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-light flex-shrink-0">
            <span className="text-white">{'{'}</span>
            <span className="text-white font-light font-jakarta">AppCrates</span>
            <span className="text-white">{'}'}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 mx-6 flex-grow flex justify-end items-center">
            <button
              onClick={() => setLanguage(language === 'en' ? 'pl' : 'en')}
              className="px-3 py-1 rounded-md bg-white/30 text-white hover:bg-teal-300 transition-colors mr-4"
            >
              {language === 'en' ? 'PL' : 'EN'}
            </button>
            <HashLink
              smooth
              to="/#home"
              className="text-white font-light font-jakarta hover:scale-110 transform transition-transform duration-300"
            >
              Home
            </HashLink>
            <Link
              to="/blog"
              className="text-white font-light font-jakarta hover:scale-110 transform transition-transform duration-300"
            >
              Blog
            </Link>
            <HashLink
              smooth
              to="/#about"
              className="text-white font-light font-jakarta hover:scale-110 transform transition-transform duration-300"
            >
              About
            </HashLink>
            <HashLink
              smooth
              to="/#projects"
              className="text-white font-light font-jakarta hover:scale-110 transform transition-transform duration-300"
            >
              Projects
            </HashLink>
            <Link
              to="/pricing"
              className="text-white font-light font-jakarta hover:scale-110 transform transition-transform duration-300"
            >
              Pricing
            </Link>
            <HashLink
              smooth
              to="/#contact"
              className="text-white font-light font-jakarta hover:scale-110 transform transition-transform duration-300"
            >
              Contact
            </HashLink>
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
            >
              {isMenuOpen ? (
                <X size={24} className="text-white" />
              ) : (
                <Menu size={24} className="text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t">
            <nav className="px-2 pt-2 pb-3 space-y-1">
              <HashLink
                smooth
                to="/#home"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </HashLink>
              <Link
                to="/blog"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <HashLink
                smooth
                to="/#about"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </HashLink>
              <HashLink
                smooth
                to="/#projects"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </HashLink>
              <Link
                to="/pricing"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <HashLink
                smooth
                to="/#contact"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </HashLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

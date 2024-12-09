import React from 'react';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';
import { HashLink } from 'react-router-hash-link';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link to="/" className="text-2xl font-bold text-gray-900 flex-shrink-0">AppCrates</Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 mx-6 flex-grow justify-center">
            <HashLink smooth to="/" className="text-gray-700 hover:text-gray-900 whitespace-nowrap">
              Home
            </HashLink>
            <Link to="/blog" className="text-gray-700 hover:text-gray-900 whitespace-nowrap">
              Blog
            </Link>
            <HashLink smooth to="/#about" className="text-gray-700 hover:text-gray-900 whitespace-nowrap">
              About
            </HashLink>
            <HashLink smooth to="/#projects" className="text-gray-700 hover:text-gray-900 whitespace-nowrap">
              Projects
            </HashLink>
            <Link to="/pricing" className="text-gray-700 hover:text-gray-900 whitespace-nowrap">
              Pricing
            </Link>
            <HashLink smooth to="/#contact" className="text-gray-700 hover:text-gray-900 whitespace-nowrap">
              Contact
            </HashLink>
          </nav>

          {/* Social Links */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            <a href="https://github.com" className="text-gray-700 hover:text-gray-900">
              <Github size={20} />
            </a>
            <a href="https://linkedin.com" className="text-gray-700 hover:text-gray-900">
              <Linkedin size={20} />
            </a>
            <a href="mailto:contact@example.com" className="text-gray-700 hover:text-gray-900">
              <Mail size={20} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <nav className="px-2 pt-2 pb-3 space-y-1">
            <HashLink 
              smooth 
              to="/" 
              className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </HashLink>
            <Link 
              to="/news" 
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
            <HashLink 
              smooth 
              to="/#pricing" 
              className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </HashLink>
            <HashLink 
              smooth 
              to="/#contact" 
              className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </HashLink>
            
            {/* Mobile Social Links */}
            <div className="flex space-x-4 px-3 py-2">
              <a href="https://github.com" className="text-gray-700 hover:text-gray-900">
                <Github size={20} />
              </a>
              <a href="https://linkedin.com" className="text-gray-700 hover:text-gray-900">
                <Linkedin size={20} />
              </a>
              <a href="mailto:contact@example.com" className="text-gray-700 hover:text-gray-900">
                <Mail size={20} />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

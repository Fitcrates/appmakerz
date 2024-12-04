import React from 'react';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';
import { HashLink } from 'react-router-hash-link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="text-2xl font-bold text-gray-900">AppCrates</div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <HashLink smooth to="/" className="text-gray-700 hover:text-gray-900">
              Home
            </HashLink>
            <HashLink to="/news" className="text-gray-700 hover:text-gray-900">
            News
            </HashLink>
            <HashLink smooth to="/#about" className="text-gray-700 hover:text-gray-900">
              About
            </HashLink>
            <HashLink smooth to="/#projects" className="text-gray-700 hover:text-gray-900">
              Projects
            </HashLink>
            <HashLink smooth to="/#contact" className="text-gray-700 hover:text-gray-900">
              Contact
            </HashLink>
          </nav>

          {/* Social Links */}
          <div className="hidden md:flex items-center space-x-4">
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
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link to="/#about" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
              About
            </Link>
            <Link to="/#projects" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
              Projects
            </Link>
            <Link to="/#contact" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

import React from 'react';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-gray-900">Portfolio</div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-gray-700 hover:text-gray-900">Home</a>
            <a href="#about" className="text-gray-700 hover:text-gray-900">About</a>
            <a href="#projects" className="text-gray-700 hover:text-gray-900">Projects</a>
            <a href="#contact" className="text-gray-700 hover:text-gray-900">Contact</a>
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
            <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-gray-900">Home</a>
            <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-gray-900">About</a>
            <a href="#projects" className="block px-3 py-2 text-gray-700 hover:text-gray-900">Projects</a>
            <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-gray-900">Contact</a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
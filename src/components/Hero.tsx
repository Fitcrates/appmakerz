import React from 'react';
import { ArrowDown } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Creative Developer
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Crafting digital experiences with passion and precision
          </p>
          <a
            href="#projects"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            View My Work
            <ArrowDown className="ml-2" size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
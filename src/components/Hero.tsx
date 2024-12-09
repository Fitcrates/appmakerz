import React from 'react';
import { ArrowDown } from 'lucide-react';
import background from './background.svg'; // Adjust the path as needed

const Hero = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 bg-black bg-opacity-70 rounded-md">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Creative Developer
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8">
            Crafting digital experiences with passion and precision
          </p>
          <a
            href="#projects"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white shadow-lg hover:shadow-2xl transition-shadow duration-600 bg-indigo-600 hover:bg-indigo-700"
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

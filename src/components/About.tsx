import React from 'react';
import { Code, Palette, Globe } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">About Me</h2>
          <p className="mt-4 text-xl text-gray-600">Passionate about creating beautiful and functional web experiences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Code className="text-indigo-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Development</h3>
            <p className="text-gray-600">Building robust and scalable applications with modern technologies</p>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Palette className="text-indigo-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Design</h3>
            <p className="text-gray-600">Creating intuitive and beautiful user interfaces</p>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Globe className="text-indigo-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Strategy</h3>
            <p className="text-gray-600">Developing effective solutions to meet business goals</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
import React from 'react';
import { Code, Palette, Globe } from 'lucide-react';
import background from './background.svg';

const About = () => {
  return (
    <section
      id="about"
      className="py-40"
      style={{ backgroundColor: '#140F2D' }}
    >
      {/* Main container */}
      <div className="max-w-7xl mx-auto mb-18 px-4 sm:px-6 lg:px-8 mt-14">
        {/* Heading */}
        <div className="text-left text-4xl sm:text-6xl mb-16 tracking-wide ">
        <span className="text-white font-biglight font-jakarta">I can help</span>{' '}
        <span className="text-teal-300 font-biglight font-jakarta">you</span>{' '}
        <span className="text-white font-biglight font-jakarta">with</span>{' '}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center mt-36">
          {/* Development Card */}
          <div className="h-96 w-full md:w-80 rounded-lg  transition 
          duration-300 flex flex-col relative"
          >
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-48 h-24">
              <div className="w-full h-full bg-red-500 rounded-full blur-2xl transform -rotate-[2deg]"></div>
            </div>
            
            {/* Text Content */}
            <div className="h-1/2 py-6 flex flex-col mt-auto backdrop-blur-sm">
              <h3 className="text-2xl font-light text-white text-left mt-0 font-jakarta font-medium">Development</h3>
              <p className="text-white text-left mt-4 font-light font-jakarta">
                Building custom applications for small and medium businesses
              </p>
            </div>
          </div>

          {/* Design Card */}
          <div className="h-96 w-full md:w-80 backdrop-blur-sm rounded-lg  transition 
          duration-300 flex flex-col relative"
          >
            {/* Elliptical Blur Effect */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-48 h-24">
              <div className="w-full h-full bg-teal-400 rounded-full blur-2xl transform -rotate-[2deg]"></div>
            </div>
            
            {/* Text Content */}
            <div className="h-1/2 py-6 flex flex-col mt-auto">
              <h3 className="text-2xl font-light text-white text-left mt-0 font-jakarta font-medium">Design</h3>
              <p className="text-white text-left backdrop-blur-sm mt-4 font-light font-jakarta">
                Creating beautiful and intuitive user interfaces
              </p>
            </div>
          </div>

          {/* Strategy Card */}
          <div className="h-96 w-full md:w-80 backdrop-blur-sm rounded-lg transition 
          duration-300 flex flex-col relative"
          >
            {/* Elliptical Blur Effect */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-48 h-24">
              <div className="w-full h-full bg-purple-500 rounded-full blur-2xl transform -rotate-[2deg]"></div>
            </div>
            
            {/* Text Content */}
            <div className="h-1/2 py-6 flex flex-col mt-auto">
              <h3 className="text-2xl font-light text-white text-left mt-0 font-jakarta font-medium">Strategy</h3>
              <p className="text-white backdrop-blur-sm text-left mt-4 font-light font-jakarta">
                Developing effective solutions to meet business goals
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

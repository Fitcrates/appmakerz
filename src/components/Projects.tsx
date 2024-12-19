import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const Projects = () => {
  return (
    <section 
    id="projects"
    className="py-40 bg-[#140F2D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8 -mt-36">
        {/* Heading */}
        <div className="flex items-center justify-between mb-16">
          <span className="text-7xl text-white font-normal font-jakarta">
            Projects
          </span>
          <span className="text-3xl text-teal-300 font-biglight font-jakarta text-right -mb-10">
            Some of my recent work
          </span>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-28 justify-items-center">
          {/* Custom Website Card */}
          <div
            className="h-96 w-full md:w-80 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 
            ring-1 ring-white ring-opacity-80 flex flex-col relative"
          >
            {/* Top Image Section */}
            <div className="h-1/2 relative overflow-hidden bg-[#140F2D] transform hover:scale-110 transition duration-300">
              <img
                src="https://i.postimg.cc/bJNbW8y3/stronaapp.png"
                alt="Custom Website"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text Content */}
            <div
              className="h-1/2 p-6 flex flex-col relative"
              style={{
                backgroundImage: 'url(https://i.postimg.cc/7YkLfyC9/tlokarta1.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'bottom',
              }}
            >
              <h3 className="text-2xl font-light text-white text-left -mt-2 font-jakarta font-normal">
                Custom website
              </h3>
              <p className="text-white text-left mt-8 font-extralight font-jakarta leading-snug tracking-normal text-justify text-sm">
                Building custom websites and applications for small and medium businesses.
              </p>
              <div className="absolute bottom-6 left-6 space-x-2">
                <span className="px-4 py-1 rounded-full ring-1 bg-teal-300/60 bg-blur-sm text-black text-sm font-jakarta">
                  react
                </span>
                <span className="px-4 py-1 rounded-full ring-1 bg-teal-300/60 bg-blur-sm text-black text-sm font-jakarta">
                  tailwind
                </span>
                <span className="px-4 py-1 rounded-full ring-1 bg-teal-300/60 bg-blur-sm text-black text-sm font-jakarta">
                  typescript
                </span>
              </div>
              
            </div>
          </div>

          {/* Custom App Card */}
          <div
            className="h-96 w-full md:w-80 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 
            ring-1 ring-white ring-opacity-80 flex flex-col relative"
          >
            {/* Top Image Section */}
            <div className="h-1/2 relative overflow-hidden bg-[#140F2D] transform hover:scale-110 transition duration-300">
              <img
                src="https://i.postimg.cc/G9ws5dmv/fsimage.jpg"
                alt="Custom App"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text Content */}
            <div
              className="h-1/2 p-6 flex flex-col relative"
              style={{
                backgroundImage: 'url(https://i.postimg.cc/VksLWBWb/tlokarta2.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'bottom',
              }}
            >
              <h3 className="text-2xl font-light text-white text-left -mt-2 font-jakarta font-normal">
                Custom app
              </h3>
              <p className="text-white text-left mt-8 font-extralight font-jakarta leading-snug tracking-normal text-justify text-sm">
                Developing effective solutions to meet your business goals.
              </p>
              <div className="absolute bottom-6 left-6 space-x-2">
                <span className="px-4 py-1 rounded-full ring-1 bg-teal-300/60 bg-blur-sm text-black text-sm font-jakarta">
                  appsheets
                </span>
              </div>
              <div className="absolute bottom-6 right-6">
                <ArrowUpRight className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Portfolio Website Card */}
          <div
            className="h-96 w-full md:w-80 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 
            ring-1 ring-white ring-opacity-80 flex flex-col relative"
          >
            {/* Top Image Section */}
            <div className="h-1/2 relative overflow-hidden bg-[#140F2D] transform hover:scale-110 transition duration-300">
              <img
                src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&q=80&w=800"
                alt="Portfolio Website"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text Content */}
            <div
              className="h-1/2 p-6 flex flex-col relative"
              style={{
                backgroundImage: 'url(https://i.postimg.cc/jS8qgwM3/tlokarta3.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'bottom',
              }}
            >
              <h3 className="text-2xl font-light text-white text-left -mt-2 font-jakarta font-normal">
                Portfolio website
              </h3>
              <p className="text-white text-left mt-8 font-extralight font-jakarta leading-snug tracking-normal text-justify text-sm">
                Creating beautiful and intuitive user interfaces.
              </p>
              <div className="absolute bottom-6 left-6 space-x-2">
                <span className="px-4 py-1 rounded-full ring-1 bg-teal-300/60 bg-blur-sm text-black text-sm font-jakarta"> 
                  react
                </span>
                <span className="px-4 py-1 rounded-full ring-1 bg-teal-300/60 bg-blur-sm text-black text-sm font-jakarta">
                  tailwind
                </span>
              </div>
              <div className="absolute bottom-6 right-6">
                <ArrowUpRight className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;

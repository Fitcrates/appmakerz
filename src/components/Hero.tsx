import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const Hero = () => {
  return (
    <section
      id="home"
      style={{
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        backgroundImage: `url(https://i.postimg.cc/VsR5xjyL/tlohero.png)`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
      className="min-h-screen h-screen w-full flex items-end bg-fixed pb-16 overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-end px-4 sm:px-6 lg:px-8">
        {/* Left Section: Heading */}
        <div className="flex flex-col justify-end mb-8 md:mb-0">
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-light text-white tracking-tight font-jakarta font-normal leading-[0.9]">
            Creative
          </h1>
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-light text-white tracking-tight font-jakarta font-normal leading-[0.9]">
            Web
          </h1>
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-light text-white tracking-tight font-jakarta font-normal leading-[0.9]">
            Developer
          </h1>
        </div>

        {/* Right Section: Text + Arrow */}
        <div className="flex items-end space-x-2 md:-space-x-6">
          {/* Text Column */}
          <div className="flex flex-col justify-between">
            <div className="flex flex-col gap-0">
              <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight -mb-2">
                Crafting digital
              </span>
              <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight -mb-2">
                experiences
              </span>
              <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight -mb-2">
                with passion
              </span>
              <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight -mb-2">
                and precision.
              </span>
            </div>
          </div>

          {/* Arrow Column */}
          <div className="flex justify-end ml-2 md:ml-4">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-white hover:text-indigo-500 text-shadow-fuchsia transform transition-transform duration-300 
              hover:scale-125 flex items-end cursor-pointer"
            >
              <ArrowUpRight
                className="w-auto h-32 md:h-60 -mb-8 md:-mb-16"
                strokeWidth={0.7}
                strokeLinecap="butt"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

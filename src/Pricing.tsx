import React from 'react';
import { Check } from 'lucide-react';

const Pricing = () => {
  return (
    <section className="w-full py-20 sm:py-32 bg-[#140F2D]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-white mb-4 font-jakarta">
            Pricing Plans
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 font-light max-w-2xl mx-auto">
            Choose the perfect plan for your business needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* Basic Plan */}
          <div className="w-full relative p-6 sm:p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-teal-500/50 transition-all duration-300 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-10 transition duration-300"></div>
            <h3 className="text-xl sm:text-2xl font-medium text-white mb-4">Basic</h3>
            <div className="mb-6">
              <span className="text-4xl sm:text-5xl font-bold text-white">$499</span>
              <span className="text-gray-400 ml-2">/ project</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-teal-500 mr-3" />
                <span>Custom Website Design</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-teal-500 mr-3" />
                <span>Mobile Responsive</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-teal-500 mr-3" />
                <span>5 Pages</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-teal-500 mr-3" />
                <span>Basic SEO</span>
              </li>
            </ul>
            <button className="w-full py-3 px-6 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition duration-300">
              Get Started
            </button>
          </div>

          {/* Professional Plan */}
          <div className="w-full relative p-6 sm:p-8 bg-gradient-to-b from-teal-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl border border-teal-500/50 hover:border-teal-400 transition-all duration-300 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-purple-500 rounded-2xl opacity-10 group-hover:opacity-20 transition duration-300"></div>
            <div className="absolute -top-4 right-6 bg-teal-500 text-white text-sm font-medium px-3 py-1 rounded-full">
              Popular
            </div>
            <h3 className="text-xl sm:text-2xl font-medium text-white mb-4">Professional</h3>
            <div className="mb-6">
              <span className="text-4xl sm:text-5xl font-bold text-white">$999</span>
              <span className="text-gray-400 ml-2">/ project</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-teal-500 mr-3" />
                <span>Everything in Basic</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-teal-500 mr-3" />
                <span>E-commerce Integration</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-teal-500 mr-3" />
                <span>10 Pages</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-teal-500 mr-3" />
                <span>Advanced SEO</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-teal-500 mr-3" />
                <span>Analytics Integration</span>
              </li>
            </ul>
            <button className="w-full py-3 px-6 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-medium transition duration-300">
              Get Started
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="w-full relative p-6 sm:p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-teal-500/50 transition-all duration-300 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-10 transition duration-300"></div>
            <h3 className="text-xl sm:text-2xl font-medium text-white mb-4">Enterprise</h3>
            <div className="mb-6">
              <span className="text-4xl sm:text-5xl font-bold text-white">Custom</span>
              <span className="text-gray-400 ml-2">/ project</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-teal-500 mr-3" />
                <span>Everything in Professional</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-teal-500 mr-3" />
                <span>Custom Features</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-teal-500 mr-3" />
                <span>Unlimited Pages</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-teal-500 mr-3" />
                <span>Priority Support</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-teal-500 mr-3" />
                <span>Custom Integrations</span>
              </li>
            </ul>
            <button className="w-full py-3 px-6 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;

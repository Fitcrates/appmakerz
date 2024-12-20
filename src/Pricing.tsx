import React from 'react';
import Header from './components/Header';
import Contact from './components/Contact';
import { ArrowUpRight } from 'lucide-react';
import { useScrollToTop } from './hooks/useScrollToTop';

const PricingTable = () => {
  const handlePlanClick = (planName: string) => {
    const url = new URL(window.location.href);
    url.hash = 'contact';
    const searchParams = new URLSearchParams();
    searchParams.set('plan', planName);
    window.history.replaceState({}, '', `${url.hash}?${searchParams.toString()}`);
    window.dispatchEvent(new Event('hashchange'));
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  const plans = [
    {
      name: 'Entry App Plan',
      price: '$150',
      features: ['1 functionality', 'Implementation into workspace'],
    },
    {
      name: 'Basic App Plan',
      price: '$500',
      features: ['Up to 5 functionalities', 'Priority support', 'Advanced Features'],
    },
    {
      name: 'Custom App Plan',
      price: 'Custom Pricing',
      features: [
        '5+ Functionalities',
        'Dedicated & Continuous Support',
        'Custom Integrations',
        'Implementation into workspace',
      ],
    },
    {
      name: 'Portfolio Website',
      price: '$200',
      features: ['Featured Portfolio', 'Responsive Design', 'Contact Form - SMTP'],
    },
    {
      name: 'Custom Website',
      price: 'From $500',
      features: [
        'Fullstack implementation',
        'Personalized',
        'Custom Integrations',
        'CMS',
        'Blog',
        'Node.js',
        'Contact Form - SMTP',
        'Custom designed',
      ],
    },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen">
      <section
        id="pricing-hero"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          backgroundImage: `url(https://i.postimg.cc/VsR5xjyL/tlohero.png)`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
        className="min-h-screen h-screen w-full flex items-end bg-fixed pb-16"
      >
        <div className="max-w-7xl mx-auto w-full flex justify-between items-end px-8">
          {/* Left Section: Heading */}
          <div className="flex flex-col justify-end">
            <h1 className="text-7xl md:text-9xl lg:text-9xl font-light text-white tracking-tight font-jakarta font-normal leading-[0.9]">
              Pricing 
            </h1>
            <h1 className="text-7xl md:text-9xl lg:text-9xl font-light text-white tracking-tight font-jakarta font-normal leading-[0.9]">
              Plans
            </h1>
          </div>

          {/* Right Section: Text + Arrow */}
          <div className="flex items-end -space-x-6">
            {/* Text Column */}
            <div className="flex flex-col justify-between">
              <div className="flex flex-col gap-0">
                <span className="text-xl md:text-3xl text-black tracking-wider font-jakarta font-extralight -mb-2">
                  Affordable
                </span>
                <span className="text-xl md:text-3xl text-black tracking-wider font-jakarta font-extralight -mb-2">
                  solutions
                </span>
                <span className="text-xl md:text-3xl text-black tracking-wider font-jakarta font-extralight -mb-2">
                  tailored to
                </span>
                <span className="text-xl md:text-3xl text-black tracking-wider font-jakarta font-extralight -mb-2">
                  your needs.
                </span>
              </div>
            </div>

            {/* Arrow Column */}
            <div className="flex justify-end ml-2 md:ml-4">
              <a
                href="#pricing-boxes"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('pricing-boxes')?.scrollIntoView({ behavior: 'smooth' });
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

      <section
        id="pricing-boxes"
        className="py-20"
        style={{ backgroundColor: '#140F2D' }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="z-48 shadow-sm rounded-lg shadow-lg p-6 hover:shadow-teal-100 hover:shadow-xl 
                transform hover:scale-105 transition duration-300 flex flex-col h-full ring-1 ring-white/80"
              >
                <h3 className="text-2xl font-semibold text-white font-jakarta font-normal mb-4">{plan.name}</h3>
                <p className="text-4xl font-jakarta font-light text-white mb-4">{plan.price}</p>
                <ul className="mb-4 space-y-2 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-white font-jakarta font-light flex items-center">
                      <span className="mr-2 text-teal-300">✔</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePlanClick(plan.name)}
                  className="bg-teal-300 text-black px-4 py-2 rounded-full self-start mt-auto hover:bg-teal-400"
                >
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const Pricing = () => {
  useScrollToTop();
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      {/* Pricing Table */}
      <div>
        <PricingTable />
      </div>

      {/* Contact Section */}
      <Contact />
    </div>
    
  );
};

export default Pricing;

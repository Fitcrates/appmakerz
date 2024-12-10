import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import Header from './components/Header';

const PricingTable = () => {
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
      name: 'Custom Website',
      price: 'From $500',
      features: ['Fullstack implementation', 'Personalized'],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {plans.map((plan, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">{plan.name}</h3>
          <p className="text-4xl font-bold text-blue-500 mb-4">{plan.price}</p>
          <ul className="mb-4 space-y-2">
            {plan.features.map((feature, i) => (
              <li key={i} className="text-gray-600 flex items-center">
                <span className="mr-2 text-blue-500">✔</span>
                {feature}
              </li>
            ))}
          </ul>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Choose Plan
          </button>
        </div>
      ))}
    </div>
  );
};

const Pricing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Include Header at the top level */}
      <Header />
      <section id="pricing" className="flex-grow py-20 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-5xl font-bold text-gray-900">Pricing</h2>
            <p className="mt-4 text-xl text-gray-600">Transparent pricing for your needs</p>
          </div>
          <PricingTable />
        </div>
      </section>
      <footer className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} Portfolio of Fitcrates.</p>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;

import React from 'react';
import Header from './components/Header';
import Contact from './components/Contact';
const News = () => {
  return (
    <div className="relative">
      {/* Include the shared Header component */}
      <Header />
      {/* News Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-indigo-200 to-indigo-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              News Page
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8">
              Stay updated with the latest news from the world.
            </p>
          </div>
        </div>
      </section>
      <Contact />
      <footer className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} Portfolio of Fitcrates.</p>
        </div>
      </footer>
    </div>
  );
};

export default News;

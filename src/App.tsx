import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <div className="relative">
          <Hero />
        </div>
        <About />
        <Projects />
        <Contact />
      </main>
      <footer className="bg-[#140F2D] text-xs text-white py-8 text-jakarta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} Portfolio of Arkadiusz Wawrzyniak. <br /> Graphic design by Weronika Grzesiowska</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

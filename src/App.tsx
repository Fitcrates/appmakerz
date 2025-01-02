import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import CookieConsent from './components/CookieConsent';
import Footer from './components/Footer';

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
      <Footer />
      <CookieConsent />
    </div>
  );
}

export default App;

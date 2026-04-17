'use client';

import { useEffect } from 'react';
import NextHeader from '@/components/next/NextHeader';
import NextFooter from '@/components/next/NextFooter';
import HeroNew from '@/components/new/HeroNew';
import TechStackNew from '@/components/new/TechStackNew';
import AboutNew from '@/components/new/AboutNew';
import ServicesNew from '@/components/new/ServicesNew';
import ProjectsNew from '@/components/new/ProjectsNew';
import SolutionsNew from '@/components/new/SolutionsNew';
import ContactNew from '@/components/new/ContactNew';
import CookieConsentNew from '@/components/new/CookieConsentNew';
import { CursorGlowProvider } from '@/context/CursorGlowContext';

function scrollToHashWithOffset() {
  if (typeof window === 'undefined' || !window.location.hash) {
    return;
  }

  const targetId = decodeURIComponent(window.location.hash.slice(1));
  if (!targetId) {
    return;
  }

  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  const headerOffset = 92;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
}

export default function HomePageClient() {
  useEffect(() => {
    const runScroll = () => {
      window.setTimeout(scrollToHashWithOffset, 50);
    };

    runScroll();
    window.addEventListener('hashchange', runScroll);
    return () => window.removeEventListener('hashchange', runScroll);
  }, []);

  return (
    <CursorGlowProvider>
      <div className="bg-indigo-950 min-h-screen">
        <NextHeader />
        <main>
          <HeroNew />
          <TechStackNew />
          <AboutNew />
          <ServicesNew />
          <ProjectsNew />
          <SolutionsNew />
          <ContactNew />
        </main>
        <NextFooter />
        <CookieConsentNew />
      </div>
    </CursorGlowProvider>
  );
}

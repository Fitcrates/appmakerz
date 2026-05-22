'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import NextHeader from '@/components/next/NextHeader';
import NextFooter from '@/components/next/NextFooter';
import ChatWidget from '@/components/next/ChatWidget';
import HeroNew from '@/components/new/HeroNew';
import type { Post, Project } from '@/types/sanity.types';

const TechStackNew = dynamic(() => import('@/components/new/TechStackNew'));
const AboutNew = dynamic(() => import('@/components/new/AboutNew'));
const ServicesNew = dynamic(() => import('@/components/new/ServicesNew'));
const ProjectsNew = dynamic(() => import('@/components/new/ProjectsNew'));
const SolutionsNew = dynamic(() => import('@/components/new/SolutionsNew'));
const LatestBlogPostsSection = dynamic(() => import('@/components/next/LatestBlogPostsSection'));
const ContactNew = dynamic(() => import('@/components/new/ContactNew'));

interface HomePageClientProps {
  projects?: Project[];
  posts?: Post[];
}

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

export default function HomePageClient({ projects, posts }: HomePageClientProps) {
  useEffect(() => {
    const runScroll = () => {
      window.setTimeout(scrollToHashWithOffset, 50);
    };

    runScroll();
    window.addEventListener('hashchange', runScroll);
    return () => window.removeEventListener('hashchange', runScroll);
  }, []);

  return (
    <div className="bg-indigo-950 min-h-screen">
      <NextHeader />
      <main>
        <HeroNew />
        <TechStackNew />
        <AboutNew />
        <ServicesNew />
        <ProjectsNew sanityProjects={projects} />
        <SolutionsNew />
        <LatestBlogPostsSection posts={posts} />
        <ContactNew />
      </main>
      <NextFooter />
      <ChatWidget />
    </div>
  );
}

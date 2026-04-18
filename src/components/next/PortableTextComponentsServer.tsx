import type { PortableTextComponents } from '@portabletext/react';
import { urlFor } from '@/lib/sanity.server';
import SpotlightText from '@/components/new/SpotlightText';
import PortableTextCodeBlock from '@/components/next/PortableTextCodeBlock';
import styles from '@/components/next/PortableTextCodeBlock.module.css';

export const portableTextComponentsServer: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl lg:text-5xl font-light text-white font-jakarta mt-12 mb-6">
        <SpotlightText as="span" className="font-inherit" baseClassName="!text-white" glowSize={140} glowColor="#5eead4">
          {children}
        </SpotlightText>
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl lg:text-4xl font-light text-white font-jakarta mt-10 mb-5">
        <SpotlightText as="span" className="font-inherit" baseClassName="!text-white" glowSize={130} glowColor="#5eead4">
          {children}
        </SpotlightText>
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl lg:text-3xl font-light text-white font-jakarta mt-8 mb-4">
        <SpotlightText as="span" className="font-inherit" baseClassName="!text-white" glowSize={120} glowColor="#5eead4">
          {children}
        </SpotlightText>
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl lg:text-2xl font-light text-white font-jakarta mt-6 mb-3">
        <SpotlightText as="span" className="font-inherit" baseClassName="!text-white" glowSize={110} glowColor="#5eead4">
          {children}
        </SpotlightText>
      </h4>
    ),
    normal: ({ children }) => (
      <p className="mb-6 leading-relaxed text-white/70 font-jakarta font-light text-lg">
        <SpotlightText as="span" className="font-inherit" baseClassName="!text-white/70" glowSize={115} glowColor="#5eead4">
          {children}
        </SpotlightText>
      </p>
    ),
    blockquote: ({ children }) => <blockquote className="border-l-2 border-teal-300 pl-6 my-8 italic text-white/60 font-jakarta">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-none space-y-3 mb-6 ml-4">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-inside mb-6 space-y-3 text-white/70 font-jakarta">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex items-start gap-3 text-white/70 font-jakarta font-light">
        <span className="w-1.5 h-1.5 bg-teal-300 rounded-full mt-2.5 flex-shrink-0" />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => <li className="text-white/70 font-jakarta font-light">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-medium text-white">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => <code className={styles.inlineCode}>{children}</code>,
    link: ({ value, children }) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer nofollow' : undefined}
          className="text-teal-300 hover:text-teal-400 underline underline-offset-4 decoration-teal-300/30 hover:decoration-teal-300 transition-colors"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }

      return (
        <figure className="relative w-full my-10">
          <img
            src={urlFor(value).auto('format').fit('max').url()}
            alt={value.alt || ''}
            className="w-full h-auto border border-white/10"
            loading="lazy"
            decoding="async"
          />
          {value.caption ? <figcaption className="text-center text-sm text-white/40 font-jakarta mt-4">{value.caption}</figcaption> : null}
        </figure>
      );
    },
    code: ({ value }) => {
      if (!value?.code) {
        return null;
      }

      return <PortableTextCodeBlock code={value.code} language={value.language} />;
    },
  },
};

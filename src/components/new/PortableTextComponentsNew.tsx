import React from 'react';
import { urlFor } from '../../lib/sanity.client';
import CodeBlock from '../CodeBlock';
import ImageZoom from '../ImageZoom';
import type { PortableTextComponentProps } from '@portabletext/react';
import type { PortableTextBlock, PortableTextMarkDefinition, ArbitraryTypedObject, PortableTextSpan } from '@portabletext/types';

type BlockComponentProps = PortableTextComponentProps<PortableTextBlock<PortableTextMarkDefinition, ArbitraryTypedObject | PortableTextSpan, string, string>>;

export const portableTextComponentsNew = {
  block: {
    h1: ({ children }: BlockComponentProps) => (
      <h1 className="text-4xl lg:text-5xl font-light text-white font-jakarta mt-12 mb-6">{children}</h1>
    ),
    h2: ({ children }: BlockComponentProps) => (
      <h2 className="text-3xl lg:text-4xl font-light text-white font-jakarta mt-10 mb-5">{children}</h2>
    ),
    h3: ({ children }: BlockComponentProps) => (
      <h3 className="text-2xl lg:text-3xl font-light text-white font-jakarta mt-8 mb-4">{children}</h3>
    ),
    h4: ({ children }: BlockComponentProps) => (
      <h4 className="text-xl lg:text-2xl font-light text-white font-jakarta mt-6 mb-3">{children}</h4>
    ),
    normal: ({ children }: BlockComponentProps) => (
      <p className="mb-6 leading-relaxed text-white/70 font-jakarta font-light text-lg">{children}</p>
    ),
    blockquote: ({ children }: BlockComponentProps) => (
      <blockquote className="border-l-2 border-teal-300 pl-6 my-8 italic text-white/60 font-jakarta">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: BlockComponentProps) => (
      <ul className="list-none space-y-3 mb-6 ml-4">{children}</ul>
    ),
    number: ({ children }: BlockComponentProps) => (
      <ol className="list-decimal list-inside mb-6 space-y-3 text-white/70 font-jakarta">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: BlockComponentProps) => (
      <li className="flex items-start gap-3 text-white/70 font-jakarta font-light">
        <span className="w-1.5 h-1.5 bg-teal-300 rounded-full mt-2.5 flex-shrink-0" />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }: BlockComponentProps) => (
      <li className="text-white/70 font-jakarta font-light">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className="font-medium text-white">{children}</strong>
    ),
    em: ({ children }: { children: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    code: ({ children }: { children: React.ReactNode }) => (
      <code className="bg-white/5 text-teal-300 px-2 py-1 rounded font-mono text-sm border border-white/10">
        {children}
      </code>
    ),
    link: ({ value, children }: { value?: { href?: string }; children: React.ReactNode }) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noindex nofollow' : undefined}
          className="text-teal-300 hover:text-teal-400 underline underline-offset-4 decoration-teal-300/30 hover:decoration-teal-300 transition-colors"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }: { value: any }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="relative w-full my-10">
          <ImageZoom
            src={urlFor(value)
              .auto('format')
              .fit('max')
              .url()}
            alt={value.alt || ''}
            className="w-full h-auto"
            loading="lazy"
            fetchPriority="low"
            decoding="async"
          />
          {value.caption && (
            <p className="text-center text-sm text-white/40 font-jakarta mt-4">{value.caption}</p>
          )}
        </div>
      );
    },
    code: ({ value }: { value: { code: string; language?: string } }) => {
      if (!value?.code) return null;
      try {
        return (
          <div className="my-8">
            <CodeBlock
              code={value.code}
              language={value.language || 'javascript'}
            />
          </div>
        );
      } catch (error) {
        console.error('Error rendering code block:', error);
        return null;
      }
    },
  },
};

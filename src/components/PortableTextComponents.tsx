import React from 'react';
import { urlFor } from '../lib/sanity.client';
import CodeBlock from './CodeBlock';
import ImageZoom from './ImageZoom';
import type { PortableTextComponentProps } from '@portabletext/react';
import type { PortableTextBlock, PortableTextMarkDefinition, ArbitraryTypedObject, PortableTextSpan } from '@portabletext/types';

type BlockComponentProps = PortableTextComponentProps<PortableTextBlock<PortableTextMarkDefinition, ArbitraryTypedObject | PortableTextSpan, string, string>>;

export const portableTextComponents = {
  block: {
    h1: ({ children }: BlockComponentProps) => (
      <h1 className="text-4xl font-bold mt-8 mb-4 text-teal-300">{children}</h1>
    ),
    h2: ({ children }: BlockComponentProps) => (
      <h2 className="text-3xl font-bold mt-8 mb-4 text-teal-300">{children}</h2>
    ),
    h3: ({ children }: BlockComponentProps) => (
      <h3 className="text-2xl font-bold mt-6 mb-3 text-white">{children}</h3>
    ),
    h4: ({ children }: BlockComponentProps) => (
      <h4 className="text-xl font-bold mt-4 mb-2 text-white">{children}</h4>
    ),
    normal: ({ children }: BlockComponentProps) => (
      <p className="mb-4 leading-relaxed whitespace-pre-line text-white/70">{children}</p>
    ),
    blockquote: ({ children }: BlockComponentProps) => (
      <blockquote className="border-l-4 border-teal-300 pl-4 my-4 italic text-white/50">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: BlockComponentProps) => (
      <ul className="list-disc list-inside mb-4 text-white/70 marker:text-teal-300">{children}</ul>
    ),
    number: ({ children }: BlockComponentProps) => (
      <ol className="list-decimal list-inside mb-4 text-white/70 marker:text-teal-300">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: BlockComponentProps) => <li className="text-white/70">{children}</li>,
    number: ({ children }: BlockComponentProps) => <li className="text-white/70">{children}</li>,
  },
  marks: {
    strong: ({ children }: { children: React.ReactNode }) => <strong className="text-white font-semibold">{children}</strong>,
    em: ({ children }: { children: React.ReactNode }) => <em className="text-white/80">{children}</em>,
    code: ({ children }: { children: React.ReactNode }) => (
      <code className="bg-white/5 text-teal-300 px-1.5 py-0.5 rounded font-mono text-sm">
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
          className="text-teal-300 hover:text-teal-500 underline"
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
        <div className="relative w-full my-6">
          <ImageZoom
            src={urlFor(value)
              .auto('format')
              .fit('max')
              .url()}
            alt={value.alt || ''}
            className="w-full h-auto rounded-lg"
          />
        </div>
      );
    },
    code: ({ value }: { value: { code: string; language?: string } }) => {
      if (!value?.code) return null;
      try {
        return (
          <CodeBlock
            code={value.code}
            language={value.language || 'javascript'}
          />
        );
      } catch (error) {
        console.error('Error rendering code block:', error);
        return null;
      }
    },
  },
};

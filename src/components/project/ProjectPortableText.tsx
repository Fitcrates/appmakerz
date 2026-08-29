import type { PortableTextComponents } from '@portabletext/react';
import { portableTextComponentsServer } from '@/components/next/PortableTextComponentsServer';

/**
 * Project-page flavour of the shared Portable Text renderer.
 *
 * Two differences from the blog: headings get anchor ids so the in-page
 * navigation can target them, and H2s carry the same hairline rule used by
 * section headings, so authored sections and legacy body content look alike.
 */
export function createProjectPortableTextComponents(anchors: Map<string, string>): PortableTextComponents {
  const headingId = (children: any): string | undefined => {
    const text = extractText(children);
    return text ? anchors.get(text) : undefined;
  };

  return {
    ...portableTextComponentsServer,
    block: {
      h1: ({ children }) => (
        <h2
          id={headingId(children)}
          className="scroll-mt-28 text-3xl lg:text-4xl font-light font-oxanium text-white mt-16 mb-6 pb-4 border-b border-white/10 first:mt-0"
        >
          {children}
        </h2>
      ),
      h2: ({ children }) => (
        <h2
          id={headingId(children)}
          className="scroll-mt-28 text-2xl lg:text-3xl font-light font-oxanium text-white mt-16 mb-6 pb-4 border-b border-white/10 first:mt-0"
        >
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="scroll-mt-28 text-xl lg:text-2xl font-normal font-oxanium text-teal-300/90 mt-10 mb-4">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="scroll-mt-28 text-lg lg:text-xl font-medium font-plex text-white mt-8 mb-3">
          {children}
        </h4>
      ),
      normal: ({ children }) => (
        <p className="mb-6 leading-[1.75] text-white/75 font-light font-plex text-[1.0625rem] lg:text-lg">
          {children}
        </p>
      ),
      blockquote: ({ children }) => (
        <blockquote className="my-10 border-l-2 border-teal-300 bg-white/[0.03] py-5 pl-6 pr-4 text-white/70 font-light italic">
          {children}
        </blockquote>
      ),
    },
  };
}

function extractText(node: any): string {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return '';
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join('');
  }

  if (typeof node === 'object' && node.props) {
    return extractText(node.props.children);
  }

  return '';
}

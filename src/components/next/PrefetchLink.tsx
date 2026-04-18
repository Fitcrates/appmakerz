'use client';

import Link, { type LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { forwardRef, type AnchorHTMLAttributes, type FocusEvent, type MouseEvent, type TouchEvent } from 'react';

type PrefetchLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    prefetchOnIntent?: boolean;
  };

function getPrefetchTarget(href: LinkProps['href']) {
  if (typeof href !== 'string' || !href.startsWith('/')) {
    return null;
  }

  if (href.startsWith('/#')) {
    return '/';
  }

  const [path] = href.split('#');
  return path || '/';
}

const PrefetchLink = forwardRef<HTMLAnchorElement, PrefetchLinkProps>(function PrefetchLink(
  {
    href,
    onMouseEnter,
    onFocus,
    onTouchStart,
    prefetch = true,
    prefetchOnIntent = true,
    ...props
  },
  ref,
) {
  const router = useRouter();

  const prefetchRoute = () => {
    if (!prefetchOnIntent) {
      return;
    }

    const target = getPrefetchTarget(href);
    if (!target) {
      return;
    }

    router.prefetch(target);
  };

  const handleMouseEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    prefetchRoute();
    onMouseEnter?.(event);
  };

  const handleFocus = (event: FocusEvent<HTMLAnchorElement>) => {
    prefetchRoute();
    onFocus?.(event);
  };

  const handleTouchStart = (event: TouchEvent<HTMLAnchorElement>) => {
    prefetchRoute();
    onTouchStart?.(event);
  };

  return (
    <Link
      ref={ref}
      href={href}
      prefetch={prefetch}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      onTouchStart={handleTouchStart}
      {...props}
    />
  );
});

export default PrefetchLink;

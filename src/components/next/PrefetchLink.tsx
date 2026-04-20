'use client';

import Link, { type LinkProps } from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { forwardRef, type AnchorHTMLAttributes, type FocusEvent, type MouseEvent, type TouchEvent } from 'react';
import { useRouteTransition } from '@/components/next/RouteTransitionProvider';

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

function getNavigationTarget(href: LinkProps['href']) {
  if (typeof href === 'string' && href.startsWith('/')) {
    return href;
  }

  return getPrefetchTarget(href);
}

const PrefetchLink = forwardRef<HTMLAnchorElement, PrefetchLinkProps>(function PrefetchLink(
  {
    href,
    onClick,
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
  const pathname = usePathname();
  const { beginNavigation } = useRouteTransition();

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

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    if (typeof href === 'string' && href.startsWith('/#') && pathname === '/') {
      return;
    }

    const target = getNavigationTarget(href);
    if (!target || target === pathname) {
      return;
    }

    event.preventDefault();
    beginNavigation(target, () => {
      router.push(typeof href === 'string' ? href : target);
    });
  };

  return (
    <Link
      ref={ref}
      href={href}
      prefetch={prefetch}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      onTouchStart={handleTouchStart}
      {...props}
    />
  );
});

export default PrefetchLink;

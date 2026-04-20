'use client';

import type { CSSProperties } from 'react';

type RouteTransitionDisplayProps = {
  target?: string;
  variant?: 'overlay' | 'loading';
  phase?: 'pre-cover' | 'cover' | 'hold' | 'reveal';
};

const STRIPE_ROWS = [
  { width: 136, left: -22, delay: 0 },
  { width: 118, left: -8, delay: 70 },
  { width: 148, left: -26, delay: 145 },
  { width: 126, left: -10, delay: 210 },
  { width: 160, left: -32, delay: 285 },
  { width: 121, left: -6, delay: 350 },
  { width: 142, left: -20, delay: 425 },
];

export default function RouteTransitionDisplay({
  target: _target,
  variant = 'overlay',
  phase = 'pre-cover',
}: RouteTransitionDisplayProps) {
  const isOverlay = variant === 'overlay';

  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden ${
        isOverlay
          ? 'pointer-events-none fixed inset-0 z-[120]'
          : 'pointer-events-none relative min-h-screen'
      }`}
    >
      <div className={`route-stripes route-stripes--${variant} route-stripes--${variant === 'overlay' ? phase : 'loading'}`}>
        <div className="route-stripes__backdrop" />
        <div className="route-stripes__rows">
          {STRIPE_ROWS.map((stripe, rowIndex) => (
            <div key={`stripe-${rowIndex}`} className="route-stripes__row">
              <span
                className="route-stripes__bar"
                style={
                  {
                    '--stripe-width': `${stripe.width}vw`,
                    '--stripe-left': `${stripe.left}vw`,
                    '--stripe-delay': `${stripe.delay}ms`,
                  } as CSSProperties
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

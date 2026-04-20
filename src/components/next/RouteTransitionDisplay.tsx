// src/components/next/RouteTransitionDisplay.tsx
'use client';

import type { CSSProperties } from 'react';

type RouteTransitionDisplayProps = {
  target?: string;
  variant?: 'overlay' | 'loading';
  phase?: 'pre-cover' | 'cover' | 'hold' | 'reveal';
  snapshotMarkup?: string | null;
  snapshotScrollY?: number;
};

/**
 * Edge-to-edge columns, all indigo-900, with staggered delays.
 * Creates a unified surface rising from the bottom with an irregular
 * stepped top edge — like a curtain of interlocking blocks.
 *
 * Columns overlap by ~1% to eliminate sub-pixel gaps.
 * Non-sequential delays prevent left-to-right wave patterns,
 * producing an organic staircase silhouette.
 */
const TRANSITION_COLUMNS = [
  { left: -0.5, width: 14,   delay: 0   },
  { left: 12.5, width: 12,   delay: 75  },
  { left: 23.5, width: 15,   delay: 25  },
  { left: 37.5, width: 11,   delay: 100 },
  { left: 47.5, width: 14,   delay: 40  },
  { left: 60.5, width: 13,   delay: 85  },
  { left: 72.5, width: 12,   delay: 15  },
  { left: 83.5, width: 17.5, delay: 55  },
] as const;

export default function RouteTransitionDisplay({
  variant = 'overlay',
  phase = 'pre-cover',
  snapshotMarkup,
  snapshotScrollY = 0,
}: RouteTransitionDisplayProps) {
  if (variant !== 'overlay') return null;

  return (
    <div
      aria-hidden="true"
      className={`route-transition-overlay route-transition-overlay--${phase} pointer-events-none fixed inset-0 z-[120] overflow-hidden`}
    >
      {snapshotMarkup ? (
        <div className="route-transition-snapshot-shell absolute inset-0">
          <div className="route-transition-snapshot-viewport absolute inset-0 overflow-hidden">
            <div
              className="route-transition-snapshot route-transition-snapshot--base"
            >
              <div
                className="route-transition-snapshot-track"
                style={{
                  transform: `translate3d(0, ${(-snapshotScrollY).toFixed(2)}px, 0)`,
                }}
                dangerouslySetInnerHTML={{ __html: snapshotMarkup }}
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className="route-transition-blocks absolute inset-0">
        {TRANSITION_COLUMNS.map((col, index) => (
          <div
            key={index}
            className="route-transition-block absolute"
            style={
              {
                '--rt-col-left': `${col.left}%`,
                '--rt-col-width': `${col.width}%`,
                '--rt-col-delay': `${col.delay}ms`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}

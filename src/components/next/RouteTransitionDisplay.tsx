// src/components/next/RouteTransitionDisplay.tsx
'use client';

import NoiseTransitionCanvas from '@/components/next/NoiseTransitionCanvas';

type RouteTransitionDisplayProps = {
  target?: string;
  variant?: 'overlay' | 'loading';
  phase?: 'pre-cover' | 'cover' | 'hold' | 'reveal';
  snapshotMarkup?: string | null;
  snapshotScrollY?: number;
};

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

      <NoiseTransitionCanvas phase={phase} />
    </div>
  );
}

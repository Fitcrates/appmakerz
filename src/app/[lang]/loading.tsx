import RouteTransitionDisplay from '@/components/next/RouteTransitionDisplay';

export default function Loading() {
  return (
    <>
      <RouteTransitionDisplay variant="loading" phase="cover" />
      <span className="sr-only" role="status">
        Loading page
      </span>
    </>
  );
}

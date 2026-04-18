import NextHeader from '@/components/next/NextHeader';
import NextFooter from '@/components/next/NextFooter';
import PrefetchLink from '@/components/next/PrefetchLink';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-indigo-950 text-white">
      <NextHeader />
      <main className="pt-32 pb-24 min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-xl">
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 font-jakarta">404</p>
          <h1 className="mt-6 text-4xl lg:text-5xl font-light font-jakarta">Page not found</h1>
          <p className="mt-6 text-white/60 font-jakarta font-light leading-relaxed">
            The page you are looking for does not exist or may have been moved.
          </p>
          <PrefetchLink href="/" className="inline-flex mt-8 px-6 py-3 bg-teal-300 text-indigo-950 font-jakarta font-medium hover:bg-teal-200 transition-colors">
            Back to home
          </PrefetchLink>
        </div>
      </main>
      <NextFooter />
    </div>
  );
}

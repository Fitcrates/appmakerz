import type { Metadata } from 'next';
import { DEFAULT_LANGUAGE } from '@/lib/language';
import './globals.css';

// Every routable page lives under /[lang], whose layout owns <html>. Paths that
// match no route at all never reach that layout, so this file supplies the
// document for them. In-app 404s (a bad slug, an unknown language segment) still
// render src/app/[lang]/not-found.tsx with the full site chrome.
export const metadata: Metadata = {
  title: 'Page not found | AppCrates',
  description: 'The page you are looking for does not exist or may have been moved.',
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang={DEFAULT_LANGUAGE}>
      <body className="bg-indigo-950 text-white antialiased">
        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-xl">
            <p className="text-xs tracking-[0.3em] uppercase text-white/30">404</p>
            <h1 className="mt-6 text-4xl lg:text-5xl font-light">Page not found</h1>
            <p className="mt-6 text-white/60 font-light leading-relaxed">
              The page you are looking for does not exist or may have been moved.
            </p>
            <a
              href={`/${DEFAULT_LANGUAGE}`}
              className="inline-flex mt-8 px-6 py-3 bg-teal-300 text-indigo-950 font-medium hover:bg-teal-200 transition-colors"
            >
              Back to home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}

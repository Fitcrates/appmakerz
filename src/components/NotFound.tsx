import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
  useEffect(() => {
    if (customElements.get('dotlottie-player')) return;

    const existingScript = document.getElementById('dotlottie-player-script');
    if (existingScript) return;

    const script = document.createElement('script');
    script.id = 'dotlottie-player-script';
    script.src = 'https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const DotLottiePlayer = 'dotlottie-player' as any;

  return (
    <div className="bg-[#140F2D] min-h-screen flex items-center justify-center px-4 text-white">
      <Helmet>
        <title>404 - Page Not Found</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <main className="w-full max-w-2xl text-center">
        <div className="mb-6 flex justify-center">
          <DotLottiePlayer
            src="/media/DOL English 404 Astronaut error page.lottie"
            background="transparent"
            speed="1"
            style={{ width: 'min(540px, 100%)', height: 'min(540px, 70vh)' }}
            loop
            autoplay
          />
        </div>

        <h1 className="text-4xl sm:text-5xl font-light mb-3 font-jakarta">404</h1>
        <p className="text-lg sm:text-xl text-white/75 font-jakarta">Page Not Found</p>

        <a
          href="/"
          className="inline-flex mt-8 px-6 py-3 border border-white/20 font-jakarta hover:bg-teal-300 hover:text-[#140F2D] hover:border-teal-300 transition-colors"
        >
          Return to Home
        </a>
      </main>
    </div>
  );
};

export default NotFound;
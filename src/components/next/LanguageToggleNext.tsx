'use client';

import { useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import type { Language } from '@/lib/language';

export default function LanguageToggleNext() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { language, setLanguage } = useLanguage();
  const isHomePage = pathname === '/';

  const handleChange = (nextLanguage: Language) => {
    if (nextLanguage === language) {
      return;
    }

    setLanguage(nextLanguage);
    if (isHomePage) {
      return;
    }

    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="flex rounded-full overflow-hidden bg-white/10 border border-white/20">
      <button
        type="button"
        onClick={() => handleChange('en')}
        disabled={isPending}
        className={`transition-colors ${
          language === 'en'
            ? 'bg-teal-300 text-black rounded-full px-4'
            : 'text-white hover:text-teal-300 px-1'
        }`}
      >
        ENG
      </button>
      <button
        type="button"
        onClick={() => handleChange('pl')}
        disabled={isPending}
        className={`transition-colors ${
          language === 'pl'
            ? 'bg-teal-300 text-black rounded-full px-4'
            : 'text-white hover:text-teal-300 px-1'
        }`}
      >
        PL
      </button>
    </div>
  );
}

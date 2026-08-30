'use client';

import { Check, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Language } from '@/lib/language';
import styles from './MarketplaceGuide.module.css';

function storageKey(language: Language) {
  return `appcrates-marketplace-guide-progress-${language}`;
}

export default function GuideProgress({ language, slug, total }: { language: Language; slug: string; total: number }) {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey(language)) || '[]');
      setCompleted(Array.isArray(stored) ? stored : []);
    } catch {
      setCompleted([]);
    }
  }, [language]);

  const isCompleted = completed.includes(slug);
  const toggle = () => {
    const next = isCompleted ? completed.filter((item) => item !== slug) : [...completed, slug];
    setCompleted(next);
    localStorage.setItem(storageKey(language), JSON.stringify(next));
  };

  return (
    <div className={styles.progressCard}>
      <div>
        <span>{language === 'pl' ? 'Twój postęp' : 'Your progress'}</span>
        <strong>{Math.min(completed.length, total)} / {total}</strong>
      </div>
      <button type="button" onClick={toggle} className={isCompleted ? styles.progressDone : ''}>
        {isCompleted ? <RotateCcw aria-hidden="true" size={16} /> : <Check aria-hidden="true" size={16} />}
        {isCompleted
          ? (language === 'pl' ? 'Oznacz jako nieprzeczytane' : 'Mark as unread')
          : (language === 'pl' ? 'Oznacz jako przeczytane' : 'Mark as read')}
      </button>
    </div>
  );
}


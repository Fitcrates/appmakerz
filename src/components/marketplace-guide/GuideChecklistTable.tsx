'use client';

import { useEffect, useState } from 'react';
import type { Language } from '@/lib/language';
import styles from './MarketplaceGuide.module.css';

export default function GuideChecklistTable({ language, rows }: { language: Language; rows: string[][] }) {
  const key = `appcrates-marketplace-launch-checklist-${language}`;
  const [checked, setChecked] = useState<number[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      setChecked(Array.isArray(stored) ? stored : []);
    } catch {
      setChecked([]);
    }
  }, [key]);

  const toggle = (index: number) => {
    const next = checked.includes(index) ? checked.filter((item) => item !== index) : [...checked, index];
    setChecked(next);
    localStorage.setItem(key, JSON.stringify(next));
  };

  return (
    <div className={styles.checklistWrap}>
      <div className={styles.checklistSummary}>
        <strong>{checked.length} / {Math.max(0, rows.length - 1)}</strong>
        <span>{language === 'pl' ? 'punktów sprawdzonych' : 'checks completed'}</span>
      </div>
      <div className={styles.tableScroll}>
        <table className={styles.contentTable}>
          <thead>
            <tr><th aria-label={language === 'pl' ? 'Gotowe' : 'Complete'} />{rows[0].map((cell, index) => <th key={index} scope="col">{cell}</th>)}</tr>
          </thead>
          <tbody>
            {rows.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex} className={checked.includes(rowIndex) ? styles.checkedRow : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={checked.includes(rowIndex)}
                    onChange={() => toggle(rowIndex)}
                    aria-label={`${language === 'pl' ? 'Oznacz punkt' : 'Mark item'} ${rowIndex + 1}`}
                  />
                </td>
                {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


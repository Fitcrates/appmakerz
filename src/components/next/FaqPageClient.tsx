'use client';

import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FaqContent } from '@/content/faq';
import SearchBar from '@/components/next/SearchBar';

interface FaqPageClientProps {
  content: FaqContent;
}

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="w-full py-6 flex items-center justify-between gap-4 text-left group"
      >
        <h3 className="text-white  text-lg group-hover:text-teal-300 transition-colors font-oxanium font-light">{question}</h3>
        <ChevronDown className={`w-5 h-5 text-white/70 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <p className="text-white/60  font-light pb-6 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FaqPageClient({ content }: FaqPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim();

    if (!normalizedQuery) {
      return content.faqs;
    }

    return content.faqs.filter((faq) => {
      return faq.question.toLowerCase().includes(normalizedQuery) || faq.answer.toLowerCase().includes(normalizedQuery);
    });
  }, [content.faqs, searchQuery]);

  return (
    <div>
      <SearchBar
        id="faq-search"
        label={content.searchPlaceholder}
        placeholder={content.searchPlaceholder}
        value={searchQuery}
        onValueChange={setSearchQuery}
        className="mb-8"
      />

      <div className="border-t border-white/10">
        {filteredFaqs.length ? (
          filteredFaqs.map((faq) => <AccordionItem key={faq.question} question={faq.question} answer={faq.answer} />)
        ) : (
          <div className="text-white/70  py-8 text-center">{content.emptyState}</div>
        )}
      </div>
    </div>
  );
}

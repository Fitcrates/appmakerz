'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import type { FaqContent } from '@/content/faq';

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
        <h3 className="text-white font-jakarta text-lg group-hover:text-teal-300 transition-colors">{question}</h3>
        <ChevronDown className={`w-5 h-5 text-white/40 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <p className="text-white/60 font-jakarta font-light pb-6 leading-relaxed">{answer}</p>
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
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-white/40" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={content.searchPlaceholder}
          className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 font-jakarta text-base py-4 pl-12 pr-4 focus:outline-none focus:border-teal-300/50 transition-colors"
        />
      </div>

      <div className="border-t border-white/10">
        {filteredFaqs.length ? (
          filteredFaqs.map((faq) => <AccordionItem key={faq.question} question={faq.question} answer={faq.answer} />)
        ) : (
          <div className="text-white/40 font-jakarta py-8 text-center">{content.emptyState}</div>
        )}
      </div>
    </div>
  );
}

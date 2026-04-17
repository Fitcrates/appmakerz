'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqAccordionListProps {
  items: Array<{ question: string; answer: string }>;
}

export default function FaqAccordionList({ items }: FaqAccordionListProps) {
  return (
    <div className="border-t border-white/10">
      {items.map((item, index) => (
        <FaqAccordionItem key={`${item.question}-${index}`} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
}

function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="w-full py-6 flex items-center justify-between gap-4 text-left group"
      >
        <h3 className="text-white font-jakarta font-medium text-lg group-hover:text-teal-300 transition-colors">{question}</h3>
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

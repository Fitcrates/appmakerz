'use client';

import type { ReactNode } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children?: ReactNode;
}

export default function SearchBar({
  id,
  label,
  placeholder,
  value,
  onValueChange,
  className = '',
  children,
}: SearchBarProps) {
  return (
    <div className={`group relative w-full flex-shrink-0 border-b border-white/15 ${className}`}>
      <Search
        aria-hidden="true"
        className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 transition-colors duration-300 group-focus-within:text-teal-300"
      />
      <label htmlFor={id} className="sr-only">{label}</label>
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        autoComplete="off"
        className="w-full bg-transparent py-2 pl-7 pr-2 text-sm text-white placeholder:text-white/30 outline-none"
      />
      <div className="pointer-events-none absolute -bottom-[1px] left-0 h-[2px] w-0 bg-teal-300 shadow-[0_0_10px_rgba(94,234,212,0.5)] transition-all duration-500 ease-out group-focus-within:w-full" />
      {children}
    </div>
  );
}

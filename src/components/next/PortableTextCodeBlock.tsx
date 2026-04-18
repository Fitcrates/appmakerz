'use client';

import { useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-php';

import styles from './PortableTextCodeBlock.module.css';

interface PortableTextCodeBlockProps {
  code: string;
  language?: string;
}

const LANGUAGE_LABELS: Record<string, string> = {
  js: 'JavaScript',
  jsx: 'JSX',
  ts: 'TypeScript',
  tsx: 'TSX',
  html: 'HTML',
  markup: 'HTML',
  css: 'CSS',
  json: 'JSON',
  bash: 'Bash',
  sh: 'Shell',
  shell: 'Shell',
  python: 'Python',
  py: 'Python',
  php: 'PHP',
};

const LANGUAGE_ALIASES: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  sh: 'bash',
  shell: 'bash',
  html: 'markup',
  xml: 'markup',
  svg: 'markup',
  py: 'python',
};

function normalizeLanguage(language?: string) {
  const raw = (language || 'text').trim().toLowerCase();
  return LANGUAGE_ALIASES[raw] || raw;
}

function getLanguageLabel(language?: string) {
  const normalized = normalizeLanguage(language);
  return LANGUAGE_LABELS[normalized] || normalized;
}

export default function PortableTextCodeBlock({ code, language }: PortableTextCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  if (!code) {
    return null;
  }

  const normalizedLanguage = normalizeLanguage(language);
  const grammar = Prism.languages[normalizedLanguage];
  const formattedCode = code.replace(/\r\n/g, '\n').replace(/\\n/g, '\n').trim();
  let highlightedCode = Prism.util.encode(formattedCode).toString();

  if (grammar) {
    try {
      highlightedCode = Prism.highlight(formattedCode, grammar, normalizedLanguage);
    } catch (error) {
      console.error(`Failed to highlight code block for language "${normalizedLanguage}":`, error);
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error('Failed to copy code block:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.language}>{getLanguageLabel(language)}</span>
        <button type="button" className={styles.copyButton} onClick={handleCopy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className={styles.pre}>
        <code
          className={`${styles.code} language-${normalizedLanguage}`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  );
}

import React from 'react';
import { Prism as SyntaxHighlighterBase } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props {
  language: string;
  code: string;
  filename?: string;
}

export const SyntaxHighlighter: React.FC<Props> = ({ language, code, filename }) => {
  return (
    <div className="rounded-lg overflow-hidden">
      {filename && (
        <div className="bg-gray-800 px-4 py-2 text-sm text-gray-300">
          {filename}
        </div>
      )}
      <SyntaxHighlighterBase
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1rem',
          backgroundColor: '#1E1E1E',
        }}
      >
        {code}
      </SyntaxHighlighterBase>
    </div>
  );
};

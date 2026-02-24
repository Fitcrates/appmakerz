import React, { useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import styled from 'styled-components';

interface CodeBlockProps {
  code: string;
  language: string;
}

const Container = styled.div`
  position: relative;
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
  background: #1e1e1e;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #2d2d2d;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #2d2d2d;
  color: #d4d4d4;
  font-size: 14px;
  border-bottom: 1px solid #3c3c3c;
`;

const CopyButton = styled.button`
  background: transparent;
  border: none;
  color: #d4d4d4;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 14px;
  transition: color 0.2s;

  &:hover {
    color: #fff;
  }
`;

const Pre = styled.pre`
  margin: 0;
  padding: 16px;
  overflow-x: auto;
  tab-size: 2;
  
  &::-webkit-scrollbar {
    height: 8px;
    background-color: #1e1e1e;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #3c3c3c;
    border-radius: 4px;
  }

  & code {
    font-family: 'Fira Code', 'Consolas', monospace;
    font-size: 14px;
    line-height: 1.5;
    color: #f8f8f2;
    display: inline-block;
    min-width: 100%;
  }
`;

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Normalize line endings and preserve formatting
  const formattedCode = code.replace(/\\n/g, '\n').trim();

  return (
    <Container>
      <Header>
        <span>{language}</span>
        <CopyButton onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </CopyButton>
      </Header>
      <Pre>
        <code className={`language-${language}`}>{formattedCode}</code>
      </Pre>
    </Container>
  );
};

export default CodeBlock;

'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ChatWidget = dynamic(() => import('@/components/next/ChatWidget'), { ssr: false });

export default function DeferredChatWidget() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setEnabled(true), { timeout: 4_000 });
      return () => window.cancelIdleCallback(id);
    }

    const id = globalThis.setTimeout(() => setEnabled(true), 3_000);
    return () => globalThis.clearTimeout(id);
  }, []);

  return enabled ? <ChatWidget /> : null;
}

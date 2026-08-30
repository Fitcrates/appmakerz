'use client';

import { useEffect } from 'react';

interface BlogPostViewTrackerProps {
  postId: string;
}

export default function BlogPostViewTracker({ postId }: BlogPostViewTrackerProps) {
  useEffect(() => {
    if (!postId) {
      return;
    }

    const storageKey = `appcrates:view:${postId}`;
    try {
      if (window.sessionStorage.getItem(storageKey)) return;
      window.sessionStorage.setItem(storageKey, '1');
    } catch {
      // Storage can be unavailable in privacy modes; server-side limiting
      // still prevents repeated writes from becoming unbounded.
    }

    fetch('/api/blog/views', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId }),
      keepalive: true,
    }).catch(() => undefined);
  }, [postId]);

  return null;
}

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

    fetch('/api/blog/views', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId }),
    }).catch(() => undefined);
  }, [postId]);

  return null;
}

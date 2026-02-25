import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPost, getPostBody, getPosts, getPopularPosts } from '../lib/sanity.client';

export const queryKeys = {
  posts: ['posts'] as const,
  popularPosts: ['popularPosts'] as const,
  post: (slug: string) => ['post', slug] as const,
  relatedPosts: (categories: string[]) => ['relatedPosts', categories] as const,
};

export const usePosts = () => {
  return useQuery({
    queryKey: queryKeys.posts,
    queryFn: async () => {
      const posts = await getPosts();
      return posts as any[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (renamed from cacheTime)
    refetchOnWindowFocus: false,
  });
};

export const usePost = (slug: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.post(slug || ''),
    queryFn: () => getPost(slug || ''),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const usePopularPosts = () => {
  return useQuery({
    queryKey: queryKeys.popularPosts,
    queryFn: getPopularPosts,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const usePrefetchPost = () => {
  const queryClient = useQueryClient();

  return (slug: string) => {
    if (!slug) return;
    
    queryClient.prefetchQuery({
      queryKey: queryKeys.post(slug),
      queryFn: () => getPost(slug),
      staleTime: 5 * 60 * 1000,
    });

    // Body is fetched separately by details page, so warm it too.
    void getPostBody(slug);
  };
};

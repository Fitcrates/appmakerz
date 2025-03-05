import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPost, getPosts, getPopularPosts, getProposedPosts } from '../lib/sanity.client';
import type { Post } from '../types/sanity.types';

export const queryKeys = {
  posts: ['posts'] as const,
  popularPosts: ['popularPosts'] as const,
  proposedPosts: ['proposedPosts'] as const,
  post: (slug: string) => ['post', slug] as const,
  relatedPosts: (categories: string[]) => ['relatedPosts', categories] as const,
};

export const usePosts = () => {
  return useQuery({
    queryKey: queryKeys.posts,
    queryFn: getPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

export const usePost = (slug: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.post(slug || ''),
    queryFn: () => getPost(slug || ''),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const usePopularPosts = () => {
  return useQuery({
    queryKey: queryKeys.popularPosts,
    queryFn: getPopularPosts,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useProposedPosts = () => {
  return useQuery({
    queryKey: queryKeys.proposedPosts,
    queryFn: getProposedPosts,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
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
  };
};

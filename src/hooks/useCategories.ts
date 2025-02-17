import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCategories } from '../lib/sanity.client';

export const queryKeys = {
  categories: 'categories',
};

// Custom hook for fetching categories
export const useCategories = () => {
  return useQuery({
    queryKey: [queryKeys.categories],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

// Prefetching function
export const usePrefetchCategories = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: [queryKeys.categories],
      queryFn: getCategories,
      staleTime: 5 * 60 * 1000,
    });
  };
};

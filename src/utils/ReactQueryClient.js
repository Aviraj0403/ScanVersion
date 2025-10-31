import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, 
      retry: 1, // Retry failed queries only once
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
      cacheTime: 1000 * 60 * 10, // Cached data stays in memory for 10 minutes
      onError: (error) => {
        console.error('Global Query Error:', error);
      },
    },
  },
});

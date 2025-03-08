
import { QueryClient } from "@tanstack/react-query";

// Create a new query client with optimized settings
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes default stale time
      cacheTime: 10 * 60 * 1000, // 10 minutes default cache time
      suspense: false, // Don't use React Suspense by default
      useErrorBoundary: false, // Don't use error boundaries by default
    },
  },
});


import { QueryClient } from "@tanstack/react-query";

// Create a new query client with retry disabled
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

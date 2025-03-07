
import React from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

export interface ProvidersProps {
  children: React.ReactNode;
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 دقائق
    },
  },
});

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{ 
            style: { direction: 'rtl' },
            classNames: {
              toast: 'group border-0 p-3 font-medium rounded-md',
              title: 'text-base',
              description: 'text-sm text-gray-500 mt-1',
              success: 'bg-green-50 text-green-700 border-green-100',
              error: 'bg-red-50 text-red-700 border-red-100',
              warning: 'bg-amber-50 text-amber-700 border-amber-100',
              info: 'bg-blue-50 text-blue-700 border-blue-100',
            }
          }}
          closeButton
          richColors
          expand
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

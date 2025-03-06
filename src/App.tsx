
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";

// Import providers
import { StoreDataProvider } from "./providers/StoreDataProvider";
import { ConnectionStatusProvider } from "./providers/ConnectionStatusProvider";
import AppRoutes from "./routes/AppRoutes";

// Create new QueryClient
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionStatusProvider>
        <StoreDataProvider>
          <Toaster richColors position="top-center" />
          <AppRoutes />
        </StoreDataProvider>
      </ConnectionStatusProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;

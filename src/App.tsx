import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, createContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";
import CreateStore from "./pages/CreateStore";
import Auth from "./pages/Auth";
import { secureRetrieve, secureStore, secureRemove } from "./lib/encryption";
import { Session } from "@supabase/supabase-js";

// Create a new query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Create auth context
export const AuthContext = createContext<{
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}>({
  session: null,
  loading: true,
  signOut: async () => {},
});

// Auth provider component
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setLoading(false);
        
        if (session) {
          await secureStore('user-id', session.user.id);
        } else {
          secureRemove('user-id');
        }
      }
    );
    
    const checkCurrentSession = async () => {
      try {
        const userId = await secureRetrieve('user-id');
        
        if (userId) {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            setSession(data.session);
          } else {
            secureRemove('user-id');
          }
        } else {
          const { data } = await supabase.auth.getSession();
          setSession(data.session);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkCurrentSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const signOut = async () => {
    await supabase.auth.signOut();
    secureRemove('user-id');
    setSession(null);
  };
  
  return (
    <AuthContext.Provider value={{ session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected route component with enhanced security
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsVerifying(true);
        
        const userId = await secureRetrieve('user-id');
        
        if (userId) {
          const { data } = await supabase.auth.getSession();
          
          if (data.session && data.session.user.id === userId) {
            setIsAuthenticated(true);
          } else {
            secureRemove('user-id');
            setIsAuthenticated(false);
          }
        } else {
          const { data } = await supabase.auth.getSession();
          
          if (data.session) {
            await secureStore('user-id', data.session.user.id);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsVerifying(false);
      }
    };
    
    checkAuth();
  }, []);

  if (isVerifying) {
    return <div className="flex h-screen items-center justify-center">جاري التحقق...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

// Store check component that redirects users to create store if they don't have one
const StoreCheckRoute = ({ children }: { children: React.ReactNode }) => {
  const [hasStore, setHasStore] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkStore = async () => {
      try {
        setIsChecking(true);
        
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          setHasStore(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('stores')
          .select('id')
          .eq('user_id', sessionData.session.user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Store check error:', error);
          setHasStore(false);
          return;
        }
        
        setHasStore(!!data);
      } catch (error) {
        console.error('Store check error:', error);
        setHasStore(false);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkStore();
  }, []);

  if (isChecking) {
    return <div className="flex h-screen items-center justify-center">جاري التحقق من المتجر...</div>;
  }

  return hasStore ? <>{children}</> : <Navigate to="/create-store" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<Auth />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <StoreCheckRoute>
                    <Dashboard />
                  </StoreCheckRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/products" 
              element={
                <ProtectedRoute>
                  <StoreCheckRoute>
                    <Products />
                  </StoreCheckRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-store" 
              element={
                <ProtectedRoute>
                  <CreateStore />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute>
                  <StoreCheckRoute>
                    <Dashboard />
                  </StoreCheckRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customers" 
              element={
                <ProtectedRoute>
                  <StoreCheckRoute>
                    <Dashboard />
                  </StoreCheckRoute>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/promotions" 
              element={
                <ProtectedRoute>
                  <StoreCheckRoute>
                    <Dashboard />
                  </StoreCheckRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/coupons" 
              element={
                <ProtectedRoute>
                  <StoreCheckRoute>
                    <Dashboard />
                  </StoreCheckRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/categories" 
              element={
                <ProtectedRoute>
                  <StoreCheckRoute>
                    <Dashboard />
                  </StoreCheckRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/payment" 
              element={
                <ProtectedRoute>
                  <StoreCheckRoute>
                    <Dashboard />
                  </StoreCheckRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/shipping" 
              element={
                <ProtectedRoute>
                  <StoreCheckRoute>
                    <Dashboard />
                  </StoreCheckRoute>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/sales-reports" 
              element={
                <ProtectedRoute>
                  <StoreCheckRoute>
                    <Dashboard />
                  </StoreCheckRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/product-analytics" 
              element={
                <ProtectedRoute>
                  <StoreCheckRoute>
                    <Dashboard />
                  </StoreCheckRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer-analytics" 
              element={
                <ProtectedRoute>
                  <StoreCheckRoute>
                    <Dashboard />
                  </StoreCheckRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/financial" 
              element={
                <ProtectedRoute>
                  <StoreCheckRoute>
                    <Dashboard />
                  </StoreCheckRoute>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/inbox" 
              element={
                <ProtectedRoute>
                  <StoreCheckRoute>
                    <Dashboard />
                  </StoreCheckRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/product-inquiries" 
              element={
                <ProtectedRoute>
                  <StoreCheckRoute>
                    <Dashboard />
                  </StoreCheckRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/support" 
              element={
                <ProtectedRoute>
                  <StoreCheckRoute>
                    <Dashboard />
                  </StoreCheckRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reviews" 
              element={
                <ProtectedRoute>
                  <StoreCheckRoute>
                    <Dashboard />
                  </StoreCheckRoute>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/store-info" 
              element={
                <ProtectedRoute>
                  <StoreCheckRoute>
                    <Dashboard />
                  </StoreCheckRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/appearance" 
              element={
                <ProtectedRoute>
                  <StoreCheckRoute>
                    <Dashboard />
                  </StoreCheckRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/system-settings" 
              element={
                <ProtectedRoute>
                  <StoreCheckRoute>
                    <Dashboard />
                  </StoreCheckRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/subscription" 
              element={
                <ProtectedRoute>
                  <StoreCheckRoute>
                    <Dashboard />
                  </StoreCheckRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user-management" 
              element={
                <ProtectedRoute>
                  <StoreCheckRoute>
                    <Dashboard />
                  </StoreCheckRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/security" 
              element={
                <ProtectedRoute>
                  <StoreCheckRoute>
                    <Dashboard />
                  </StoreCheckRoute>
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

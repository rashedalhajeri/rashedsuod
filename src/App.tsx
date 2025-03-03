
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, createContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { secureRetrieve, secureStore, secureRemove } from "./lib/encryption";
import { Session } from "@supabase/supabase-js";

// Import pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CreateStore from "./pages/CreateStore";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const AuthContext = createContext<{
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}>({
  session: null,
  loading: true,
  signOut: async () => {},
});

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

// Modified ProtectedRoute to check if user has a store and redirect accordingly
const ProtectedRoute = ({ children, redirectIfStore = false }: { children: React.ReactNode, redirectIfStore?: boolean }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasStore, setHasStore] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const navigate = Navigate;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsVerifying(true);
        
        const userId = await secureRetrieve('user-id');
        
        if (userId) {
          const { data: sessionData } = await supabase.auth.getSession();
          
          if (sessionData.session && sessionData.session.user.id === userId) {
            setIsAuthenticated(true);
            
            // Check if user has a store
            const { data: storeData, error: storeError } = await supabase
              .from('stores')
              .select('id')
              .eq('user_id', userId)
              .maybeSingle();
            
            if (storeError) throw storeError;
            
            setHasStore(!!storeData);
          } else {
            secureRemove('user-id');
            setIsAuthenticated(false);
            setHasStore(false);
          }
        } else {
          const { data: sessionData } = await supabase.auth.getSession();
          
          if (sessionData.session) {
            await secureStore('user-id', sessionData.session.user.id);
            setIsAuthenticated(true);
            
            // Check if user has a store
            const { data: storeData, error: storeError } = await supabase
              .from('stores')
              .select('id')
              .eq('user_id', sessionData.session.user.id)
              .maybeSingle();
            
            if (storeError) throw storeError;
            
            setHasStore(!!storeData);
          } else {
            setIsAuthenticated(false);
            setHasStore(false);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setHasStore(false);
      } finally {
        setIsVerifying(false);
      }
    };
    
    checkAuth();
  }, []);

  if (isVerifying) {
    return <div className="flex h-screen items-center justify-center">جاري التحقق...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  // Now handle redirection based on store status and requested redirect behavior
  if (hasStore === false && !redirectIfStore) {
    // User doesn't have a store and needs one for this route
    return <Navigate to="/create-store" />;
  }
  
  if (hasStore === true && redirectIfStore) {
    // User has a store and should be redirected to dashboard
    return <Navigate to="/dashboard" />;
  }
  
  // In all other cases, render the children
  return <>{children}</>;
};

// Create a specific route component for CreateStore page with different redirection logic
const CreateStoreRoute = ({ children }: { children: React.ReactNode }) => {
  return <ProtectedRoute redirectIfStore={true}>{children}</ProtectedRoute>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<Auth />} />
            
            {/* Create Store Route - Will redirect to dashboard if user already has a store */}
            <Route 
              path="/create-store" 
              element={
                <CreateStoreRoute>
                  <CreateStore />
                </CreateStoreRoute>
              } 
            />
            
            {/* Dashboard Route - Protected and requires store */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold mb-4">مرحباً بك في لوحة التحكم</h1>
                    <p>تم توجيهك إلى لوحة التحكم لأن لديك متجراً بالفعل.</p>
                  </div>
                </ProtectedRoute>
              } 
            />
            
            {/* Product Details Route - Protected and requires store */}
            <Route 
              path="/products/:productId" 
              element={
                <ProtectedRoute>
                  <ProductDetail />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


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

// Import platform dashboard pages
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/dashboard/Home";
import Products from "./pages/dashboard/Products";
import Orders from "./pages/dashboard/Orders";
import Categories from "./pages/dashboard/Categories";
import Customers from "./pages/dashboard/Customers";
import Payments from "./pages/dashboard/Payments";
import Coupons from "./pages/dashboard/Coupons";
import Settings from "./pages/dashboard/Settings";

// Import store pages
import ProductDetail from "./pages/ProductDetail";
import StoreHome from "./pages/store/Home";
import StoreProducts from "./pages/store/Products";
import StoreProductDetail from "./pages/store/ProductDetail";
import Cart from "./pages/store/Cart";

// Create a new query client with retry disabled
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
            
            const { count, error: storeError } = await supabase
              .from('stores')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', userId);
            
            if (storeError) throw storeError;
            
            setHasStore(count ? count > 0 : false);
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
            
            const { count, error: storeError } = await supabase
              .from('stores')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', sessionData.session.user.id);
            
            if (storeError) throw storeError;
            
            setHasStore(count ? count > 0 : false);
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
  
  if (hasStore === false && !redirectIfStore) {
    return <Navigate to="/create-store" />;
  }
  
  if (hasStore === true && redirectIfStore) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

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
            {/* Platform Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<Auth />} />
            
            <Route 
              path="/create-store" 
              element={
                <CreateStoreRoute>
                  <CreateStore />
                </CreateStoreRoute>
              } 
            />
            
            {/* Dashboard Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardHome />
                </ProtectedRoute>
              } 
            />
            
            <Route
              path="/dashboard/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/dashboard/products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/dashboard/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/dashboard/categories"
              element={
                <ProtectedRoute>
                  <Categories />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/dashboard/customers"
              element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/dashboard/payments"
              element={
                <ProtectedRoute>
                  <Payments />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/dashboard/coupons"
              element={
                <ProtectedRoute>
                  <Coupons />
                </ProtectedRoute>
              }
            />
            
            {/* Store Routes - Using storeId in URL */}
            <Route path="/store/:storeId" element={<StoreHome />} />
            <Route path="/store/:storeId/products" element={<StoreProducts />} />
            <Route path="/store/:storeId/products/:productId" element={<StoreProductDetail />} />
            <Route path="/store/:storeId/cart" element={<Cart />} />
            
            {/* Legacy route - redirect to new structure */}
            <Route 
              path="/products/:productId" 
              element={<ProductDetail />}
            />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

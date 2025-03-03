import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useEffect, useState, createContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";
import CreateStore from "./pages/CreateStore";
import Auth from "./pages/Auth";
import { secureRetrieve, secureStore, secureRemove } from "./lib/encryption";
import { Session } from "@supabase/supabase-js";
import DashboardLayout from "./components/DashboardLayout";

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

const DashboardRoutes = () => {
  return (
    <ProtectedRoute>
      <StoreCheckRoute>
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      </StoreCheckRoute>
    </ProtectedRoute>
  );
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
            <Route path="/create-store" element={
              <ProtectedRoute>
                <CreateStore />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={<DashboardRoutes />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Dashboard />} />
              <Route path="promotions" element={<Dashboard />} />
              <Route path="coupons" element={<Dashboard />} />
              <Route path="categories" element={<Dashboard />} />
              <Route path="payment" element={<Dashboard />} />
              <Route path="shipping" element={<Dashboard />} />
              <Route path="sales-reports" element={<Dashboard />} />
              <Route path="product-analytics" element={<Dashboard />} />
              <Route path="customer-analytics" element={<Dashboard />} />
              <Route path="financial" element={<Dashboard />} />
              <Route path="inbox" element={<Dashboard />} />
              <Route path="product-inquiries" element={<Dashboard />} />
              <Route path="support" element={<Dashboard />} />
              <Route path="reviews" element={<Dashboard />} />
              <Route path="store-info" element={<Dashboard />} />
              <Route path="appearance" element={<Dashboard />} />
              <Route path="system-settings" element={<Dashboard />} />
              <Route path="subscription" element={<Dashboard />} />
              <Route path="user-management" element={<Dashboard />} />
              <Route path="security" element={<Dashboard />} />
            </Route>
            
            <Route path="/products" element={<Navigate to="/dashboard/products" replace />} />
            <Route path="/orders" element={<Navigate to="/dashboard/orders" replace />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

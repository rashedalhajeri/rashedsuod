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
import UnderDevelopmentPage from "./components/dashboard/UnderDevelopmentPage";

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
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <StoreCheckRoute>
                  <Dashboard />
                </StoreCheckRoute>
              </ProtectedRoute>
            } />
            
            {/* Main Navigation Routes */}
            <Route path="/dashboard/orders" element={
              <ProtectedRoute>
                <StoreCheckRoute>
                  <Orders />
                </StoreCheckRoute>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/products" element={
              <ProtectedRoute>
                <StoreCheckRoute>
                  <Products />
                </StoreCheckRoute>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/customers" element={
              <ProtectedRoute>
                <StoreCheckRoute>
                  <UnderDevelopmentPage message="صفحة العملاء قيد التطوير" />
                </StoreCheckRoute>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/categories" element={
              <ProtectedRoute>
                <StoreCheckRoute>
                  <UnderDevelopmentPage message="صفحة الفئات قيد التطوير" />
                </StoreCheckRoute>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/coupons" element={
              <ProtectedRoute>
                <StoreCheckRoute>
                  <UnderDevelopmentPage message="صفحة كوبونات الخصم قيد التطوير" />
                </StoreCheckRoute>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/payment" element={
              <ProtectedRoute>
                <StoreCheckRoute>
                  <UnderDevelopmentPage message="صفحة المدفوعات قيد التطوير" />
                </StoreCheckRoute>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/shipping" element={
              <ProtectedRoute>
                <StoreCheckRoute>
                  <UnderDevelopmentPage message="صفحة الشحن والتوصيل قيد التطوير" />
                </StoreCheckRoute>
              </ProtectedRoute>
            } />
            
            {/* Analytics Routes */}
            <Route path="/dashboard/sales-reports" element={
              <ProtectedRoute>
                <StoreCheckRoute>
                  <UnderDevelopmentPage message="صفحة تقارير المبيعات قيد التطوير" />
                </StoreCheckRoute>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/product-analytics" element={
              <ProtectedRoute>
                <StoreCheckRoute>
                  <UnderDevelopmentPage message="صفحة أداء المنتجات قيد التطوير" />
                </StoreCheckRoute>
              </ProtectedRoute>
            } />
            
            {/* Communication Routes */}
            <Route path="/dashboard/inbox" element={
              <ProtectedRoute>
                <StoreCheckRoute>
                  <UnderDevelopmentPage message="صفحة صندوق الوارد قيد التطوير" />
                </StoreCheckRoute>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/reviews" element={
              <ProtectedRoute>
                <StoreCheckRoute>
                  <UnderDevelopmentPage message="صفحة التقييمات قيد التطوير" />
                </StoreCheckRoute>
              </ProtectedRoute>
            } />
            
            {/* Settings Routes */}
            <Route path="/dashboard/store-info" element={
              <ProtectedRoute>
                <StoreCheckRoute>
                  <UnderDevelopmentPage message="صفحة معلومات المتجر قيد التطوير" />
                </StoreCheckRoute>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/appearance" element={
              <ProtectedRoute>
                <StoreCheckRoute>
                  <UnderDevelopmentPage message="صفحة تخصيص الواجهة قيد التطوير" />
                </StoreCheckRoute>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/system-settings" element={
              <ProtectedRoute>
                <StoreCheckRoute>
                  <UnderDevelopmentPage message="صفحة إعدادات النظام قيد التطوير" />
                </StoreCheckRoute>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/subscription" element={
              <ProtectedRoute>
                <StoreCheckRoute>
                  <UnderDevelopmentPage message="صفحة الاشتراك والباقة قيد التطوير" />
                </StoreCheckRoute>
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

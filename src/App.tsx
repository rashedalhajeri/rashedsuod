import React, { useState, useEffect, createContext, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createClient } from "@supabase/supabase-js";
import { Toaster } from "sonner";
import { secureLocalStorage } from "@/lib/encryption";

// Import pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import CreateStore from "@/pages/CreateStore";
import NotFound from "@/pages/NotFound";
import DashboardHome from "@/pages/dashboard/Home";
import Orders from "@/pages/dashboard/Orders";
import Products from "@/pages/dashboard/Products";
import Categories from "@/pages/dashboard/Categories";
import Customers from "@/pages/dashboard/Customers";
import Payments from "@/pages/dashboard/Payments";
import Coupons from "@/pages/dashboard/Coupons";
import Settings from "@/pages/dashboard/Settings";
import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminStoresPage from "@/pages/admin/Stores";
import ActivityLogsPage from "@/pages/admin/ActivityLogs";

const queryClient = new QueryClient();

// Create Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth Context
interface AuthContextProps {
  session: any;
  user: any;
  signIn: (provider: "google" | "github") => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user || null);
    };

    fetchSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });
  }, []);

  const signIn = async (provider: "google" | "github") => {
    await supabase.auth.signInWithOAuth({
      provider: provider,
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value: AuthContextProps = {
    session,
    user,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Store Data Context
interface StoreDataContextProps {
  storeData: any;
  setStoreData: React.Dispatch<React.SetStateAction<any>>;
}

const StoreDataContext = createContext<StoreDataContextProps | undefined>(
  undefined
);

const StoreDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [storeData, setStoreData] = useState(null);

  return (
    <StoreDataContext.Provider value={{ storeData, setStoreData }}>
      {children}
    </StoreDataContext.Provider>
  );
};

const useStoreData = () => {
  const context = useContext(StoreDataContext);
  if (!context) {
    throw new Error("useStoreData must be used within a StoreDataProvider");
  }
  return context;
};

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userId = await secureLocalStorage.retrieve("user-id");
        if (userId) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error retrieving user ID:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={redirectTo} replace={true} />
  );
};

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StoreDataProvider>
          <Toaster richColors position="top-center" />
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/create-store" element={<CreateStore />} />
              <Route path="/not-found" element={<NotFound />} />
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute redirectTo="/auth">
                  <DashboardHome />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/orders" element={
                <ProtectedRoute redirectTo="/auth">
                  <Orders />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/products" element={
                <ProtectedRoute redirectTo="/auth">
                  <Products />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/categories" element={
                <ProtectedRoute redirectTo="/auth">
                  <Categories />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/customers" element={
                <ProtectedRoute redirectTo="/auth">
                  <Customers />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/payments" element={
                <ProtectedRoute redirectTo="/auth">
                  <Payments />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/coupons" element={
                <ProtectedRoute redirectTo="/auth">
                  <Coupons />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/settings" element={
                <ProtectedRoute redirectTo="/auth">
                  <Settings />
                </ProtectedRoute>
              } />
              
              {/* Admin Panel Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="stores" element={<AdminStoresPage />} />
                <Route path="activity-logs" element={<ActivityLogsPage />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/not-found" />} />
            </Routes>
          </Router>
        </StoreDataProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;

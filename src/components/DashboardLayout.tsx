
import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { LogOut, Settings, ShoppingBag, Home, Package, BarChart, Users } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface Store {
  id: string;
  store_name: string;
  domain_name: string;
  country: string;
  currency: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<Store | null>(null);
  const navigate = useNavigate();

  // Check for auth state and fetch store data
  useEffect(() => {
    const fetchSessionAndStore = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (!sessionData.session) {
          navigate("/");
          return;
        }
        
        setSession(sessionData.session);
        
        // Fetch store data for the authenticated user
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('user_id', sessionData.session.user.id)
          .single();
        
        if (storeError) {
          throw storeError;
        }
        
        setStore(storeData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("حدث خطأ أثناء تحميل بيانات المتجر");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndStore();

    // Set up listener for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        if (event === 'SIGNED_OUT') {
          navigate("/");
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  // Function to handle logout
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("تم تسجيل الخروج بنجاح");
      navigate("/");
    } catch (error: any) {
      console.error("Error signing out:", error.message);
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-600">Linok</span>
            <span className="text-lg font-medium text-gray-600">.me</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {store && (
              <div className="text-gray-700 font-medium">
                {store.store_name}
              </div>
            )}
            
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full flex items-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <LogOut size={16} />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>
      
      {/* Dashboard Content */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm hidden md:block">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <a 
                  href="/dashboard" 
                  className={`flex items-center p-3 rounded-md transition-colors ${
                    window.location.pathname === '/dashboard' 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Home className="h-5 w-5 ml-3" />
                  <span>الرئيسية</span>
                </a>
              </li>
              <li>
                <a 
                  href="/products" 
                  className={`flex items-center p-3 rounded-md transition-colors ${
                    window.location.pathname === '/products' 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Package className="h-5 w-5 ml-3" />
                  <span>المنتجات</span>
                </a>
              </li>
              <li>
                <a 
                  href="/analytics" 
                  className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <BarChart className="h-5 w-5 ml-3" />
                  <span>الإحصائيات</span>
                </a>
              </li>
              <li>
                <a 
                  href="/customers" 
                  className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Users className="h-5 w-5 ml-3" />
                  <span>العملاء</span>
                </a>
              </li>
              <li>
                <a 
                  href="/settings" 
                  className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Settings className="h-5 w-5 ml-3" />
                  <span>الإعدادات</span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

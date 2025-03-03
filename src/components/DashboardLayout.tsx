
import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { LogOut, Settings, ShoppingBag, Home, Package, BarChart, Users, Menu, X, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { secureStore, secureRetrieve, secureRemove, decryptObjectFields } from "@/lib/encryption";

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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
        
        // Save session info securely
        await secureStore('user-id', sessionData.session.user.id);
        
        // Fetch store data for the authenticated user
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('user_id', sessionData.session.user.id)
          .single();
        
        if (storeError) {
          throw storeError;
        }
        
        // Decrypt any sensitive store data before using it
        // In this case, we're assuming the data isn't encrypted in the database yet
        // but we're adding the capability for future use
        const decryptedStoreData = await decryptObjectFields(storeData, []);
        
        setStore(decryptedStoreData);
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
      async (event, newSession) => {
        setSession(newSession);
        if (event === 'SIGNED_OUT') {
          // Clear secure storage on sign out
          secureRemove('user-id');
          navigate("/");
        } else if (event === 'SIGNED_IN' && newSession) {
          // Store user info securely
          await secureStore('user-id', newSession.user.id);
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
      
      // Clear all secure storage
      secureRemove('user-id');
      sessionStorage.removeItem('linok-encryption-key');
      
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

  const navigation = [
    { name: 'الرئيسية', href: '/dashboard', icon: Home },
    { name: 'المنتجات', href: '/products', icon: Package },
    { name: 'الإحصائيات', href: '/analytics', icon: BarChart },
    { name: 'العملاء', href: '/customers', icon: Users },
    { name: 'الإعدادات', href: '/settings', icon: Settings },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleSidebar}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <span className="text-2xl font-bold text-primary-600">Linok</span>
            <span className="text-lg font-medium text-gray-600">.me</span>
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full flex items-center">
              <Shield size={12} className="ml-1" />
              مؤمن
            </span>
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
        <aside className={cn(
          "bg-white shadow-sm fixed md:sticky top-0 bottom-0 lg:block transition-all duration-300 z-50 border-l",
          sidebarOpen ? "w-64" : "w-0 md:w-16 overflow-hidden",
          "md:h-[calc(100vh-64px)]"
        )}>
          <nav className="p-4 h-full flex flex-col">
            <ul className="space-y-2 flex-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center p-3 rounded-md transition-colors",
                        isActive
                          ? "bg-primary-50 text-primary-600" 
                          : "text-gray-700 hover:bg-gray-100",
                        !sidebarOpen && "md:justify-center"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5", sidebarOpen ? "ml-3" : "")} />
                      {sidebarOpen && <span>{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
            
            {store && sidebarOpen && (
              <div className="mt-auto pt-4 border-t border-gray-100">
                <Link
                  to="/store-preview"
                  className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                  target="_blank"
                >
                  <ShoppingBag className="h-5 w-5 ml-3" />
                  <span>زيارة المتجر</span>
                </Link>
              </div>
            )}
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className={cn(
          "flex-grow p-4 transition-all duration-300",
          sidebarOpen ? "md:mr-64" : "md:mr-16"
        )}>
          <div 
            className={cn(
              "max-w-7xl mx-auto transition-opacity duration-300",
              sidebarOpen && "md:mr-0"
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

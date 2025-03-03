
import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase, getStoreData } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { 
  LogOut, 
  Settings, 
  ShoppingBag, 
  Home, 
  Package, 
  BarChart, 
  Users, 
  Menu, 
  X, 
  Shield, 
  ChevronRight, 
  PanelLeft,
  Zap,
  Bell,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { secureStore, secureRetrieve, secureRemove } from "@/lib/encryption";
import { useMediaQuery } from "@/hooks/use-mobile";

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
  const [hasNotifications, setHasNotifications] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  useEffect(() => {
    // Simulate having notifications (in real app would be from a backend)
    setHasNotifications(Math.random() > 0.5);
    
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
        
        await secureStore('user-id', sessionData.session.user.id);
        
        const { data: storeData, error: storeError } = await getStoreData(sessionData.session.user.id);
        
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

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        if (event === 'SIGNED_OUT') {
          secureRemove('user-id');
          navigate("/");
        } else if (event === 'SIGNED_IN' && newSession) {
          await secureStore('user-id', newSession.user.id);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
      <header className="glass-nav bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleSidebar}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">Linok</span>
              <span className="text-lg font-medium text-gray-600">.me</span>
            </div>
            
            <span className="ml-2 text-xs bg-gradient-to-r from-green-100 to-green-50 text-green-800 px-2 py-0.5 rounded-full flex items-center border border-green-200 security-badge">
              <Shield size={12} className="ml-1" />
              مؤمن
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {!isMobile && (
              <div className="relative mx-4">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="search" 
                  className="block w-64 pl-3 pr-10 py-2 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
                  placeholder="البحث في المتجر..." 
                />
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
            >
              <Bell size={20} />
              {hasNotifications && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              )}
            </Button>
            
            {store && (
              <div className="hidden md:block text-gray-700 font-medium glass-effect px-3 py-1.5 rounded-md border border-gray-100">
                {store.store_name}
              </div>
            )}
            
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full flex items-center gap-2 hover:bg-gray-200 transition-colors border border-gray-200"
            >
              <LogOut size={16} />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Sidebar for desktop */}
        <aside className={cn(
          "glass-card bg-white/90 backdrop-blur-sm shadow-sm fixed md:sticky top-16 bottom-0 lg:block transition-all duration-300 z-50 border-l",
          sidebarOpen ? "w-64" : "w-0 md:w-16 overflow-hidden",
          "md:h-[calc(100vh-64px)]"
        )}>
          <nav className="p-4 h-full flex flex-col">
            <ul className="space-y-1 flex-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center p-3 rounded-md transition-colors",
                        isActive
                          ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-600 border-r-4 border-primary-500" 
                          : "text-gray-700 hover:bg-gray-50",
                        !sidebarOpen && "md:justify-center"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5", sidebarOpen ? "ml-3" : "")} />
                      {sidebarOpen && <span>{item.name}</span>}
                      {isActive && sidebarOpen && (
                        <ChevronRight className="mr-auto h-4 w-4 text-primary-500" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
            
            {store && sidebarOpen && (
              <div className="mt-auto pt-4 border-t border-gray-100">
                <Link
                  to="/store-preview"
                  className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  target="_blank"
                >
                  <ShoppingBag className="h-5 w-5 ml-3" />
                  <span>زيارة المتجر</span>
                </Link>
              </div>
            )}
          </nav>
        </aside>
        
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
      
      {/* Mobile bottom navigation */}
      {isMobile && (
        <div className="mobile-nav">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className="mobile-nav-item"
              >
                <item.icon 
                  size={20} 
                  className={isActive ? "text-primary-600" : "text-gray-500"} 
                />
                <span className={cn(
                  "mobile-nav-label",
                  isActive ? "text-primary-600" : "text-gray-500"
                )}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      )}

      {/* AI Assistant button */}
      <div className="ai-assistant-bubble">
        <div className="ai-assistant-pulse"></div>
        <Zap size={20} />
      </div>
    </div>
  );
};

export default DashboardLayout;

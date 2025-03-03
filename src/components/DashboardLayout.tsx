
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
  Search,
  Tag,
  CreditCard,
  Store,
  Percent,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { secureStore, secureRetrieve, secureRemove } from "@/lib/encryption";
import { useMediaQuery, useIsMobile } from "@/hooks/use-mobile";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuLink,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";

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
  const [hasNotifications, setHasNotifications] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

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
    { name: 'الطلبات', href: '/orders', icon: ShoppingBag },
    { name: 'المنتجات', href: '/products', icon: Package },
    { name: 'العملاء', href: '/customers', icon: Users },
    { name: 'الفئات', href: '/categories', icon: Tag },
    { name: 'كيبونات وتسويق', href: '/marketing', icon: Percent },
    { name: 'نظام الدفع', href: '/payment', icon: CreditCard },
    { name: 'المتجر', href: '/store', icon: Store },
    { name: 'الإعدادات', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 rtl">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Logo and store name */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center gap-1">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center shadow-md">
                    <Store className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex flex-col mr-2">
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-gray-800">
                        {store?.store_name || "المتجر"}
                      </span>
                      <span className="text-sm font-medium text-primary-500 mr-1">.me</span>
                    </div>
                    <span className="text-xs text-gray-500 -mt-1">لوحة التحكم</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="flex-1 max-w-md mx-8 hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input 
                  type="search" 
                  className="w-full border border-gray-200 rounded-lg bg-gray-50/80 pr-10 focus:ring-primary-500 text-sm placeholder:text-gray-400"
                  placeholder="البحث في المتجر..." 
                />
              </div>
            </div>

            {/* Notifications and User Menu */}
            <div className="flex items-center gap-4">
              {/* Security Badge */}
              <span className="hidden lg:flex mr-2 text-xs bg-gradient-to-r from-green-100 to-green-50 text-green-800 px-2.5 py-1 rounded-full items-center border border-green-200">
                <Shield size={12} className="ml-1.5" />
                <span className="font-medium">مؤمن</span>
              </span>
              
              {/* Notification Button */}
              <button className="relative p-1 rounded-full text-gray-500 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <span className="sr-only">عرض الإشعارات</span>
                <Bell size={20} />
                {hasNotifications && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
                )}
              </button>
              
              {/* Store Info - Desktop */}
              {store && (
                <div className="hidden lg:flex items-center mr-2 text-gray-700 font-medium bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-sm">
                  <Store size={16} className="ml-2 text-primary-500" />
                  <span>{store.store_name}</span>
                </div>
              )}

              {/* User Menu Button */}
              <div className="border-r border-gray-200 h-8 mx-2 hidden md:block"></div>

              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-700">المدير</span>
                  <span className="text-xs text-gray-500">admin@example.com</span>
                </div>
                
                <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 border border-primary-200">
                  <User size={18} />
                </div>
              </div>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="hidden md:flex mr-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md items-center gap-2 hover:bg-gray-200 transition-colors border border-gray-200 shadow-sm"
              >
                <LogOut size={16} />
                <span className="font-medium">تسجيل الخروج</span>
              </button>
            </div>
          </div>
          
          {/* Secondary Navigation Bar */}
          <div className="border-t border-gray-100 bg-white/50 backdrop-blur-sm py-2 px-4 hidden md:flex items-center justify-between">
            <div className="flex gap-6">
              {navigation.slice(0, 5).map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center text-sm font-medium py-1 px-2 rounded-md transition-colors",
                      isActive 
                        ? "text-primary-600 bg-primary-50 border-b-2 border-primary-500" 
                        : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                    )}
                  >
                    <item.icon size={16} className="ml-1.5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            <div className="flex items-center">
              <button className="px-3 py-1 bg-primary-50 text-primary-600 rounded-md text-sm font-medium flex items-center">
                <Zap size={14} className="ml-1" />
                المساعد الذكي
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex min-h-[calc(100vh-64px)]">
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader />
            <SidebarContent>
              <SidebarGroup>
                <SidebarMenu>
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuLink 
                          href={item.href} 
                          icon={item.icon} 
                          active={isActive}
                        >
                          {item.name}
                        </SidebarMenuLink>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            
            {store && (
              <SidebarFooter>
                <Link
                  to="/store-preview"
                  className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  target="_blank"
                >
                  <ShoppingBag className="h-5 w-5 ml-3" />
                  <span>زيارة المتجر</span>
                </Link>
              </SidebarFooter>
            )}
          </Sidebar>
          
          <main className="flex-grow p-4 transition-all duration-300">
            <div className="max-w-7xl mx-auto transition-opacity duration-300">
              <SidebarTrigger />
              {children}
            </div>
          </main>
        </SidebarProvider>
      </div>
      
      {/* Mobile bottom navigation */}
      {isMobile && (
        <div className="mobile-nav">
          {navigation.slice(0, 4).map((item) => {
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
          
          <button 
            onClick={handleLogout}
            className="mobile-nav-item"
          >
            <LogOut size={20} className="text-gray-500" />
            <span className="mobile-nav-label">خروج</span>
          </button>
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

import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase, getStoreData } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { LogOut, Settings, ShoppingBag, Home, Package, BarChart, Users, Menu, X, Shield, ChevronRight, Zap, Bell, Tag, CreditCard, Store, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { secureStore, secureRetrieve, secureRemove } from "@/lib/encryption";
import { useMediaQuery, useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider, Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuLink, SidebarTrigger, SidebarUserSection } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<Store | null>(null);
  const [hasNotifications, setHasNotifications] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    setHasNotifications(Math.random() > 0.5);
    const fetchSessionAndStore = async () => {
      try {
        const {
          data: sessionData,
          error: sessionError
        } = await supabase.auth.getSession();
        if (sessionError) {
          throw sessionError;
        }
        if (!sessionData.session) {
          navigate("/");
          return;
        }
        setSession(sessionData.session);
        await secureStore('user-id', sessionData.session.user.id);
        const {
          data: storeData,
          error: storeError
        } = await getStoreData(sessionData.session.user.id);
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
    const {
      data: authListener
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      if (event === 'SIGNED_OUT') {
        secureRemove('user-id');
        navigate("/");
      } else if (event === 'SIGNED_IN' && newSession) {
        await secureStore('user-id', newSession.user.id);
      }
    });
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);
  const handleLogout = async () => {
    try {
      const {
        error
      } = await supabase.auth.signOut();
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
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50/50 to-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>;
  }
  const navigation = [{
    name: 'الرئيسية',
    href: '/dashboard',
    icon: Home
  }, {
    name: 'الطلبات',
    href: '/orders',
    icon: ShoppingBag
  }, {
    name: 'المنتجات',
    href: '/products',
    icon: Package
  }, {
    name: 'العملاء',
    href: '/customers',
    icon: Users
  }, {
    name: 'الفئات',
    href: '/categories',
    icon: Tag
  }, {
    name: 'كيبونات وتسويق',
    href: '/marketing',
    icon: Percent
  }, {
    name: 'نظام الدفع',
    href: '/payment',
    icon: CreditCard
  }, {
    name: 'المتجر',
    href: '/store',
    icon: Store
  }, {
    name: 'الإعدادات',
    href: '/settings',
    icon: Settings
  }];
  return <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 rtl">
      <SidebarProvider defaultExpanded={!isMobile}>
        {isMobile && <header className="fixed top-0 left-0 right-0 z-40 glass-nav shadow-sm backdrop-blur-sm bg-white/90">
            <div className="mx-auto">
              <div className="flex h-16 items-center justify-between px-4">
                <div className="flex items-center">
                  <div className="relative h-8 w-8 mr-2">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-md shadow-md transform rotate-3"></div>
                    <div className="absolute inset-0 bg-white rounded-md flex items-center justify-center border border-primary-100">
                      <Store className="h-4 w-4 text-primary-500" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <h1 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        {store?.store_name || "المتجر"}
                      </h1>
                    </div>
                    <span className="text-xs text-gray-500 -mt-1">لوحة التحكم</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 space-x-reverse">
                  <button className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600">
                    <span className="sr-only">الإشعارات</span>
                    <Bell className="h-5 w-5" />
                    {hasNotifications && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>}
                  </button>
                  
                  <SidebarTrigger />
                </div>
              </div>
            </div>
          </header>}

        <div className={cn("flex", isMobile ? "pt-16" : "")}>
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center mx-0">
                  <div className="h-10 w-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center mr-2 shadow-sm mx-[6px]">
                    <Store className="h-5 w-5 text-primary-600 mx-0" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg">{store?.store_name || "المتجر"}</h3>
                    
                  </div>
                </div>
                
                {!isMobile && <div className="flex items-center gap-1">
                    <button className="relative p-1.5 rounded-full hover:bg-gray-100 text-gray-600">
                      <Bell className="h-4 w-4" />
                      {hasNotifications && <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-red-500 ring-1 ring-white animate-pulse"></span>}
                    </button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600">
                          <Settings className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/settings" className="flex items-center cursor-pointer">
                            <Settings className="ml-2 h-4 w-4" />
                            <span>الإعدادات</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(`https://${store?.domain_name}.linok.me`, '_blank')} className="cursor-pointer">
                          <Store className="ml-2 h-4 w-4" />
                          <span>زيارة المتجر</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                          <LogOut className="ml-2 h-4 w-4" />
                          <span>تسجيل الخروج</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>}
              </div>
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarGroup>
                <div className="px-3 py-2">
                  <h4 className="text-xs font-medium text-gray-500 mb-2">القائمة الرئيسية</h4>
                </div>
                <SidebarMenu>
                  {navigation.map(item => {
                  const isActive = location.pathname === item.href;
                  return <SidebarMenuItem key={item.name}>
                        <SidebarMenuLink href={item.href} icon={item.icon} active={isActive}>
                          {item.name}
                        </SidebarMenuLink>
                      </SidebarMenuItem>;
                })}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            
            <SidebarFooter>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">النسخة 1.0.0</span>
                <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
                  <LogOut className="h-3 w-3" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
              
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-3 rounded-lg border border-primary-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 bg-primary-500/10 rounded flex items-center justify-center">
                    <Zap className="h-3.5 w-3.5 text-primary-600" />
                  </div>
                  <span className="text-xs font-medium text-primary-700">تحديثات النظام</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">تم إضافة ميزات جديدة إلى متجرك!</p>
                <button className="w-full text-xs bg-white text-primary-600 hover:text-primary-700 py-1.5 rounded border border-primary-100 transition-colors">
                  استكشف الآن
                </button>
              </div>
            </SidebarFooter>
          </Sidebar>
          
          <main className="flex-grow py-6 px-4 md:px-6 lg:px-8 transition-all duration-300">
            <div className="max-w-7xl mx-auto transition-opacity duration-300">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
      
      {isMobile && <div className="mobile-nav bg-white shadow-lg border-t border-gray-100 rounded-t-xl">
          {navigation.slice(0, 3).map(item => {
        const isActive = location.pathname === item.href;
        return <Link key={item.name} to={item.href} className="mobile-nav-item">
                <item.icon size={20} className={isActive ? "text-primary-600" : "text-gray-500"} />
                <span className={cn("mobile-nav-label", isActive ? "text-primary-600" : "text-gray-500")}>
                  {item.name}
                </span>
              </Link>;
      })}
          
          <Link to="/settings" className="mobile-nav-item">
            <Settings size={20} className={location.pathname === '/settings' ? "text-primary-600" : "text-gray-500"} />
            <span className={cn("mobile-nav-label", location.pathname === '/settings' ? "text-primary-600" : "text-gray-500")}>
              الإعدادات
            </span>
          </Link>
          
          <button onClick={handleLogout} className="mobile-nav-item">
            <LogOut size={20} className="text-gray-500" />
            <span className="mobile-nav-label">خروج</span>
          </button>
        </div>}

      <div className="fixed bottom-20 left-4 md:bottom-8 z-50">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
          <button className="relative flex items-center justify-center h-12 w-12 bg-white rounded-full shadow-lg border border-primary-100 text-primary-600 hover:bg-primary-50 transition-colors">
            <Zap className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>;
};
export default DashboardLayout;
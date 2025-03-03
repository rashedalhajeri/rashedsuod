
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 rtl">
      <header className="fixed top-0 left-0 right-0 z-40 glass-nav shadow-sm">
        <div className="mx-auto">
          <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
            <div className="flex items-center">
              {!isMobile && (
                <button 
                  onClick={() => {}} 
                  className="mr-2 p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-primary-600 transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </button>
              )}
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
            </div>
            
            <div className="hidden md:block max-w-sm w-full mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  <Search className="h-4 w-4" />
                </div>
                <Input 
                  type="search" 
                  placeholder="البحث..." 
                  className="w-full pr-10 border-none bg-gray-100/80 focus:ring-primary-500 text-sm placeholder:text-gray-400 rounded-full h-9"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-1 space-x-reverse">
              <span className="hidden lg:flex text-xs bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 px-2.5 py-1 rounded-full items-center border border-amber-200 mr-2">
                <Shield size={12} className="ml-1.5" />
                <span className="font-medium">حساب مميز</span>
              </span>
              
              <button className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600">
                <span className="sr-only">الإشعارات</span>
                <Bell className="h-5 w-5" />
                {hasNotifications && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
                )}
              </button>
              
              {!isMobile && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1.5 mr-2 border-gray-200 bg-white/60 hover:bg-gray-50"
                  onClick={() => window.open(`https://${store?.domain_name}.linok.me`, '_blank')}
                >
                  <Store className="h-3.5 w-3.5 text-primary-500" />
                  <span className="text-xs font-medium">زيارة المتجر</span>
                </Button>
              )}
              
              {/* User dropdown menu with settings and logout */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative cursor-pointer">
                    <div className="flex items-center pl-2 py-1 rounded-full hover:bg-gray-100 transition-colors">
                      <div className="hidden md:flex flex-col items-end ml-2">
                        <span className="text-xs font-medium text-gray-800">مرحباً، {store?.store_name}</span>
                        <span className="text-xs text-gray-500">متجر مميز</span>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-100 to-white border border-gray-200 flex items-center justify-center text-primary-600">
                        <User size={16} />
                      </div>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>الإعدادات</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => window.open(`https://${store?.domain_name}.linok.me`, '_blank')}
                    className="cursor-pointer"
                  >
                    <Store className="mr-2 h-4 w-4" />
                    <span>زيارة المتجر</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-[6.5rem]">
        <SidebarProvider defaultExpanded={!isMobile}>
          <Sidebar>
            <SidebarHeader>
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-primary-100 rounded-md flex items-center justify-center mr-2">
                    <Store className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{store?.store_name}</h3>
                    <p className="text-xs text-gray-500">متجر إلكتروني</p>
                  </div>
                </div>
                <SidebarTrigger />
              </div>
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarGroup>
                <div className="px-3 py-2">
                  <h4 className="text-xs font-medium text-gray-500 mb-2">القائمة الرئيسية</h4>
                </div>
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
              <SidebarFooter className="border-t border-gray-100 p-4">
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-md p-3 border border-gray-200">
                  <h4 className="font-medium text-sm text-gray-800 mb-2 flex items-center">
                    <Shield className="h-3.5 w-3.5 mr-1.5 text-primary-500" />
                    معلومات المتجر
                  </h4>
                  <div className="space-y-1 text-xs">
                    <p className="flex justify-between text-gray-500">
                      <span>المجال:</span>
                      <span className="font-medium text-gray-800 dir-ltr">{store.domain_name}.linok.me</span>
                    </p>
                    <p className="flex justify-between text-gray-500">
                      <span>البلد:</span>
                      <span className="font-medium text-gray-800">{store.country}</span>
                    </p>
                    <p className="flex justify-between text-gray-500">
                      <span>العملة:</span>
                      <span className="font-medium text-gray-800">{store.currency}</span>
                    </p>
                  </div>
                  <Button 
                    className="w-full mt-3 text-xs h-8" 
                    size="sm"
                    onClick={() => window.open(`https://${store?.domain_name}.linok.me`, '_blank')}
                  >
                    <ShoppingBag className="h-3.5 w-3.5 ml-1" />
                    زيارة المتجر
                  </Button>
                </div>
              </SidebarFooter>
            )}
          </Sidebar>
          
          <main className="flex-grow py-6 px-4 md:px-6 lg:px-8 transition-all duration-300">
            <div className="max-w-7xl mx-auto transition-opacity duration-300">
              {children}
            </div>
          </main>
        </SidebarProvider>
      </div>
      
      {isMobile && (
        <div className="mobile-nav">
          {navigation.slice(0, 3).map((item) => {
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
          
          <Link
            to="/settings"
            className="mobile-nav-item"
          >
            <Settings size={20} className={location.pathname === '/settings' ? "text-primary-600" : "text-gray-500"} />
            <span className={cn(
              "mobile-nav-label",
              location.pathname === '/settings' ? "text-primary-600" : "text-gray-500"
            )}>
              الإعدادات
            </span>
          </Link>
          
          <button 
            onClick={handleLogout}
            className="mobile-nav-item"
          >
            <LogOut size={20} className="text-gray-500" />
            <span className="mobile-nav-label">خروج</span>
          </button>
        </div>
      )}

      <div className="fixed bottom-20 left-4 md:bottom-8 z-50">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
          <button className="relative flex items-center justify-center h-12 w-12 bg-white rounded-full shadow-lg border border-primary-100 text-primary-600 hover:bg-primary-50 transition-colors">
            <Zap className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

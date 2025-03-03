
import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase, getStoreData } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { 
  LogOut, Settings, ShoppingBag, Home, Package, BarChart, Users, Menu, X, Shield, 
  ChevronRight, Zap, Bell, Tag, CreditCard, Store, Percent, Crown, Layers, 
  LayoutDashboard, Star, Mail, MailQuestion, MessageSquare, PieChart, DollarSign,
  Truck, ClipboardList, Wallet, Receipt, Banknote, Activity, TrendingUp,
  Inbox, CalendarRange, Table, FileText, Image, LineChart, Wrench, Gift, 
  Database, ExternalLink, UserCog, HeartHandshake, ShieldCheck, BadgeDollarSign,
  CircleDollarSign, GaugeCircle, ListChecks, BookOpenCheck
} from "lucide-react";
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
  const [currentPlan, setCurrentPlan] = useState<string>("free");
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
        setCurrentPlan(Math.random() > 0.7 ? "premium" : "free");
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

  const mainNavigation = [
    {
      name: 'لوحة التحكم',
      href: '/dashboard',
      icon: LayoutDashboard,
      description: 'نظرة عامة على المبيعات والإحصائيات'
    }, 
    {
      name: 'الطلبات',
      href: '/orders',
      icon: ShoppingBag,
      description: 'إدارة طلبات العملاء وتتبع الشحنات'
    },
    {
      name: 'المنتجات',
      href: '/products',
      icon: Package,
      description: 'إدارة منتجات المتجر والمخزون'
    },
    {
      name: 'العملاء',
      href: '/customers',
      icon: Users,
      description: 'إدارة قاعدة العملاء والولاء'
    }
  ];
  
  const marketingSalesNavigation = [
    {
      name: 'العروض والخصومات',
      href: '/promotions',
      icon: Percent,
      description: 'إدارة العروض الخاصة والتخفيضات'
    },
    {
      name: 'كوبونات الخصم',
      href: '/coupons',
      icon: Gift,
      description: 'إنشاء وإدارة كوبونات الخصم'
    },
    {
      name: 'الفئات',
      href: '/categories',
      icon: Layers,
      description: 'تنظيم المنتجات في فئات وتصنيفات'
    },
    {
      name: 'المدفوعات',
      href: '/payment',
      icon: CreditCard,
      description: 'إعدادات طرق الدفع والمعاملات المالية'
    },
    {
      name: 'الشحن والتوصيل',
      href: '/shipping',
      icon: Truck,
      description: 'إدارة خيارات الشحن وأسعار التوصيل'
    }
  ];
  
  const analyticsNavigation = [
    {
      name: 'تقارير المبيعات',
      href: '/sales-reports',
      icon: BarChart,
      description: 'تحليل أداء المبيعات والإيرادات'
    },
    {
      name: 'أداء المنتجات',
      href: '/product-analytics',
      icon: LineChart,
      description: 'إحصائيات حول أداء المنتجات'
    },
    {
      name: 'تحليل العملاء',
      href: '/customer-analytics',
      icon: PieChart,
      description: 'بيانات عن سلوك العملاء والمشتريات'
    },
    {
      name: 'التدفق المالي',
      href: '/financial',
      icon: TrendingUp,
      description: 'تقارير الإيرادات والمصروفات'
    }
  ];
  
  const communicationNavigation = [
    {
      name: 'صندوق الوارد',
      href: '/inbox',
      icon: Inbox,
      description: 'الرسائل الواردة من العملاء'
    },
    {
      name: 'استفسارات المنتجات',
      href: '/product-inquiries',
      icon: MailQuestion,
      description: 'الرد على استفسارات حول المنتجات'
    },
    {
      name: 'الدعم الفني',
      href: '/support',
      icon: HeartHandshake,
      description: 'تذاكر وطلبات الدعم الفني'
    },
    {
      name: 'التقييمات',
      href: '/reviews',
      icon: Star,
      description: 'تقييمات العملاء والمراجعات'
    }
  ];
  
  const settingsNavigation = [
    {
      name: 'معلومات المتجر',
      href: '/store-info',
      icon: Store,
      description: 'البيانات الأساسية للمتجر وشعاره'
    },
    {
      name: 'تخصيص الواجهة',
      href: '/appearance',
      icon: Image,
      description: 'تخصيص مظهر المتجر والألوان والقوالب'
    },
    {
      name: 'إعدادات النظام',
      href: '/system-settings',
      icon: Wrench,
      description: 'إعدادات النظام والوظائف المتقدمة'
    },
    {
      name: 'الاشتراك والباقة',
      href: '/subscription',
      icon: BadgeDollarSign,
      description: 'تفاصيل الاشتراك وخيارات الترقية'
    },
    {
      name: 'إدارة المستخدمين',
      href: '/user-management',
      icon: UserCog,
      description: 'إضافة وإدارة فريق العمل والصلاحيات'
    },
    {
      name: 'الأمان والخصوصية',
      href: '/security',
      icon: ShieldCheck,
      description: 'إعدادات الأمان وحماية البيانات'
    }
  ];

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
                    <p className="text-xs text-gray-500">{store?.domain_name || "my-store"}.linok.me</p>
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
                  {mainNavigation.map(item => {
                    const isActive = location.pathname === item.href;
                    return <SidebarMenuItem key={item.name}>
                          <SidebarMenuLink href={item.href} icon={item.icon} active={isActive} title={item.description}>
                            {item.name}
                          </SidebarMenuLink>
                        </SidebarMenuItem>;
                  })}
                </SidebarMenu>
              </SidebarGroup>
              
              <SidebarGroup>
                <div className="px-3 py-2 mt-2">
                  <h4 className="text-xs font-medium text-gray-500 mb-2">التسويق والمبيعات</h4>
                </div>
                <SidebarMenu>
                  {marketingSalesNavigation.map(item => {
                    const isActive = location.pathname === item.href;
                    return <SidebarMenuItem key={item.name}>
                          <SidebarMenuLink href={item.href} icon={item.icon} active={isActive} title={item.description}>
                            {item.name}
                          </SidebarMenuLink>
                        </SidebarMenuItem>;
                  })}
                </SidebarMenu>
              </SidebarGroup>
              
              <SidebarGroup>
                <div className="px-3 py-2 mt-2">
                  <h4 className="text-xs font-medium text-gray-500 mb-2">التحليلات والتقارير</h4>
                </div>
                <SidebarMenu>
                  {analyticsNavigation.map(item => {
                    const isActive = location.pathname === item.href;
                    return <SidebarMenuItem key={item.name}>
                          <SidebarMenuLink href={item.href} icon={item.icon} active={isActive} title={item.description}>
                            {item.name}
                          </SidebarMenuLink>
                        </SidebarMenuItem>;
                  })}
                </SidebarMenu>
              </SidebarGroup>
              
              <SidebarGroup>
                <div className="px-3 py-2 mt-2">
                  <h4 className="text-xs font-medium text-gray-500 mb-2">التواصل والدعم</h4>
                </div>
                <SidebarMenu>
                  {communicationNavigation.map(item => {
                    const isActive = location.pathname === item.href;
                    return <SidebarMenuItem key={item.name}>
                          <SidebarMenuLink href={item.href} icon={item.icon} active={isActive} title={item.description}>
                            {item.name}
                          </SidebarMenuLink>
                        </SidebarMenuItem>;
                  })}
                </SidebarMenu>
              </SidebarGroup>
              
              <SidebarGroup>
                <div className="px-3 py-2 mt-2">
                  <h4 className="text-xs font-medium text-gray-500 mb-2">الإعدادات والإدارة</h4>
                </div>
                <SidebarMenu>
                  {settingsNavigation.map(item => {
                    const isActive = location.pathname === item.href;
                    return <SidebarMenuItem key={item.name}>
                          <SidebarMenuLink href={item.href} icon={item.icon} active={isActive} title={item.description}>
                            {item.name}
                          </SidebarMenuLink>
                        </SidebarMenuItem>;
                  })}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            
            <SidebarFooter>
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-3 rounded-lg border border-primary-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <div className={cn(
                      "h-5 w-5 rounded-full flex items-center justify-center",
                      currentPlan === "premium" 
                        ? "bg-gradient-to-br from-yellow-300 to-yellow-500" 
                        : "bg-gradient-to-br from-gray-300 to-gray-400"
                    )}>
                      <Crown className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">
                      الباقة الحالية: {currentPlan === "premium" ? "المميزة" : "المجانية"}
                    </span>
                  </div>
                  
                  {currentPlan === "premium" && (
                    <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full border border-green-200">
                      مفعلة
                    </span>
                  )}
                </div>
                
                {currentPlan === "premium" ? (
                  <div className="mb-2">
                    <p className="text-xs text-gray-600">تستمتع حالياً بجميع المميزات المتاحة في متجرك!</p>
                  </div>
                ) : (
                  <div className="mb-2">
                    <p className="text-xs text-gray-600">قم بترقية متجرك للحصول على ميزات إضافية!</p>
                  </div>
                )}
                
                <button className={cn(
                  "w-full text-xs py-1.5 rounded border transition-colors flex items-center justify-center gap-1.5",
                  currentPlan === "premium"
                    ? "bg-white text-gray-600 hover:text-gray-700 border-gray-200"
                    : "bg-white text-primary-600 hover:text-primary-700 border-primary-100 hover:bg-primary-50"
                )}>
                  {currentPlan === "premium" ? (
                    <>
                      <span>تفاصيل الاشتراك</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-3.5 w-3.5" />
                      <span>ترقية للباقة المميزة</span>
                    </>
                  )}
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
          <Link to="/dashboard" className="mobile-nav-item">
            <LayoutDashboard size={20} className={location.pathname === '/dashboard' ? "text-primary-600" : "text-gray-500"} />
            <span className={cn("mobile-nav-label", location.pathname === '/dashboard' ? "text-primary-600" : "text-gray-500")}>
              الرئيسية
            </span>
          </Link>
          
          <Link to="/orders" className="mobile-nav-item">
            <ShoppingBag size={20} className={location.pathname === '/orders' ? "text-primary-600" : "text-gray-500"} />
            <span className={cn("mobile-nav-label", location.pathname === '/orders' ? "text-primary-600" : "text-gray-500")}>
              الطلبات
            </span>
          </Link>
          
          <Link to="/products" className="mobile-nav-item">
            <Package size={20} className={location.pathname === '/products' ? "text-primary-600" : "text-gray-500"} />
            <span className={cn("mobile-nav-label", location.pathname === '/products' ? "text-primary-600" : "text-gray-500")}>
              المنتجات
            </span>
          </Link>
          
          <Link to="/inbox" className="mobile-nav-item">
            <Inbox size={20} className={location.pathname === '/inbox' ? "text-primary-600" : "text-gray-500"} />
            <span className={cn("mobile-nav-label", location.pathname === '/inbox' ? "text-primary-600" : "text-gray-500")}>
              الرسائل
            </span>
          </Link>
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

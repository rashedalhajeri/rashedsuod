
import React, { useEffect, useState } from "react";
import { supabase, getStoreData } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { 
  Settings, 
  ShoppingBag, 
  Home, 
  Package, 
  BarChart, 
  Users, 
  Loader2,
  TrendingUp,
  Activity,
  DollarSign,
  Shield,
  ArrowRight,
  Bell,
  Brain,
  Zap,
  LineChart,
  Calendar,
  CircleUser
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { secureRetrieve } from "@/lib/encryption";
import AIInsights from "@/components/dashboard/AIInsights";
import { useMediaQuery } from "@/hooks/use-mobile";

interface Store {
  id: string;
  store_name: string;
  domain_name: string;
  country: string;
  currency: string;
}

interface DashboardStats {
  productCount: number;
  orderCount: number;
  customerCount: number;
  revenue: number;
}

const Dashboard: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<Store | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    productCount: 0,
    orderCount: 0,
    customerCount: 0,
    revenue: 0
  });
  const [showCreateStoreDialog, setShowCreateStoreDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
    
    return () => {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    };
  }, []);

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
        
        const userId = await secureRetrieve('user-id') || sessionData.session.user.id;
        
        const { data: storeData, error: storeError } = await getStoreData(userId);
        
        if (storeError) {
          console.error("Store error:", storeError);
          toast.error("حدث خطأ أثناء تحميل بيانات المتجر");
          setLoading(false);
          return;
        }
        
        if (!storeData) {
          setShowCreateStoreDialog(true);
          setLoading(false);
          return;
        }
        
        setStore(storeData);

        if (storeData) {
          const { count: productCount, error: countError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('store_id', storeData.id);
          
          if (countError) {
            console.error("Count error:", countError);
          } else {
            setStats(prev => ({
              ...prev,
              productCount: productCount || 0,
              // للأغراض التجريبية نضع بعض البيانات العشوائية
              orderCount: Math.floor(Math.random() * 20),
              customerCount: Math.floor(Math.random() * 50),
              revenue: Math.floor(Math.random() * 5000)
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("حدث خطأ أثناء تحميل بيانات المتجر");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndStore();
  }, [navigate]);

  const handleCreateStore = () => {
    navigate('/create-store');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-KW', { 
      style: 'currency', 
      currency: store?.currency || 'KWD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary-500 animate-spin mx-auto" />
          <p className="mt-4 text-lg text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  if (showCreateStoreDialog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">مرحباً بك في Linok.me</h1>
          <p className="text-gray-600 mb-6 text-center">لم نجد أي متجر مرتبط بحسابك. قم بإنشاء متجرك الآن للبدء!</p>
          <Button 
            onClick={handleCreateStore}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:bg-primary-700"
          >
            إنشاء متجر جديد
          </Button>
        </div>
      </div>
    );
  }

  // بطاقات الإحصائيات الرئيسية
  const StatCards = () => (
    <div className={isMobile ? "scroll-container" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"}>
      <Card className={`hover-scale card-hover border border-gray-100 bg-white overflow-hidden group ${isMobile ? "w-60 scroll-item flex-shrink-0" : ""}`}>
        <CardContent className="pt-6 p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">المنتجات</p>
              <h3 className="text-2xl font-bold">{stats.productCount}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform duration-300">
              <Package className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className={`hover-scale card-hover border border-gray-100 bg-white overflow-hidden group ${isMobile ? "w-60 scroll-item flex-shrink-0" : ""}`}>
        <CardContent className="pt-6 p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">الطلبات</p>
              <h3 className="text-2xl font-bold">{stats.orderCount}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform duration-300">
              <ShoppingBag className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className={`hover-scale card-hover border border-gray-100 bg-white overflow-hidden group ${isMobile ? "w-60 scroll-item flex-shrink-0" : ""}`}>
        <CardContent className="pt-6 p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">العملاء</p>
              <h3 className="text-2xl font-bold">{stats.customerCount}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform duration-300">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className={`hover-scale card-hover border border-gray-100 bg-white overflow-hidden group ${isMobile ? "w-60 scroll-item flex-shrink-0" : ""}`}>
        <CardContent className="pt-6 p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">الإيرادات</p>
              <h3 className="text-2xl font-bold">{formatCurrency(stats.revenue)}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // مكونات للعرض السريع
  const QuickActions = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="glass-card rounded-lg p-6 hover:shadow-md transition-shadow hover:border-primary-200 border border-gray-100 group animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">المنتجات</h2>
          <Package className="h-6 w-6 text-primary-500 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <p className="text-gray-600 mb-4">إدارة منتجات متجرك</p>
        <Button 
          variant="ghost"
          className="text-primary-600 font-medium hover:underline bg-transparent group-hover:bg-primary-50 flex items-center"
          asChild
        >
          <Link to="/products">
            إدارة المنتجات
            <ArrowRight className="mr-1 h-4 w-4 inline-block" />
          </Link>
        </Button>
      </div>
      
      <div className="glass-card rounded-lg p-6 hover:shadow-md transition-shadow hover:border-primary-200 border border-gray-100 group animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">الإعدادات</h2>
          <Settings className="h-6 w-6 text-primary-500 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <p className="text-gray-600 mb-4">تخصيص إعدادات متجرك</p>
        <Button 
          variant="ghost"
          className="text-primary-600 font-medium hover:underline bg-transparent group-hover:bg-primary-50 flex items-center"
          asChild
        >
          <Link to="/settings">
            تعديل الإعدادات
            <ArrowRight className="mr-1 h-4 w-4 inline-block" />
          </Link>
        </Button>
      </div>
      
      <div className="glass-card rounded-lg p-6 hover:shadow-md transition-shadow hover:border-primary-200 border border-gray-100 group animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">المتجر</h2>
          <Home className="h-6 w-6 text-primary-500 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <p className="text-gray-600 mb-4">زيارة المتجر الخاص بك</p>
        <Button 
          className="text-primary-600 font-medium hover:underline bg-transparent group-hover:bg-primary-50 flex items-center"
          variant="ghost"
          onClick={() => window.open(`https://${store?.domain_name}.linok.me`, '_blank')}
        >
          عرض المتجر
          <ArrowRight className="mr-1 h-4 w-4 inline-block" />
        </Button>
      </div>
    </div>
  );

  // قسم النشاط والأحداث القادمة
  const UpcomingEvents = () => (
    <Card className="border border-gray-100 overflow-hidden mb-8">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <CardTitle className="flex items-center">
          <Calendar className="inline-block ml-2 h-5 w-5 text-primary-500" />
          الأحداث القادمة
        </CardTitle>
        <CardDescription>الأحداث والمهام المقبلة في متجرك</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
              <Calendar size={18} />
            </div>
            <div>
              <p className="font-medium text-gray-800">تجديد الاشتراك</p>
              <p className="text-sm text-gray-600">سينتهي اشتراكك بعد 7 أيام</p>
            </div>
            <Button variant="ghost" size="sm" className="mr-auto">
              تجديد الآن
            </Button>
          </div>
          
          <div className="flex items-center p-3 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-100">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
              <ShoppingBag size={18} />
            </div>
            <div>
              <p className="font-medium text-gray-800">طلب جديد</p>
              <p className="text-sm text-gray-600">لديك طلب جديد بحاجة للمراجعة</p>
            </div>
            <Button variant="ghost" size="sm" className="mr-auto">
              عرض الطلب
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // قسم التحليلات السريعة
  const QuickAnalytics = () => (
    <Card className="border border-gray-100 overflow-hidden mb-8">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <CardTitle className="flex items-center">
          <LineChart className="inline-block ml-2 h-5 w-5 text-primary-500" />
          نظرة سريعة على الأداء
        </CardTitle>
        <CardDescription>ملخص أداء متجرك خلال الأسبوع الماضي</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-5 py-2">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">الزيارات</span>
              <span className="text-sm font-medium text-gray-700">87 زيارة</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">مبيعات اليوم</span>
              <span className="text-sm font-medium text-gray-700">4 طلبات</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">معدل التحويل</span>
              <span className="text-sm font-medium text-gray-700">4.6%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '46%' }}></div>
            </div>
          </div>
          
          <Button 
            variant="ghost"
            className="text-primary-600 font-medium hover:underline bg-transparent w-full flex items-center justify-center"
            asChild
          >
            <Link to="/analytics">
              عرض التحليلات المفصلة
              <ArrowRight className="mr-1 h-4 w-4 inline-block" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // قسم نظرة عامة عن العملاء
  const CustomerOverview = () => (
    <Card className="border border-gray-100 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <CardTitle className="flex items-center">
          <CircleUser className="inline-block ml-2 h-5 w-5 text-primary-500" />
          نظرة على العملاء
        </CardTitle>
        <CardDescription>العملاء الجدد والنشطين في متجرك</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        {stats.customerCount > 0 ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-3">
                  <CircleUser size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">أحمد محمد</p>
                  <p className="text-xs text-gray-500">عميل جديد • منذ يومين</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-500">
                عرض
              </Button>
            </div>
            
            <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-3">
                  <CircleUser size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">نورة العلي</p>
                  <p className="text-xs text-gray-500">عميل نشط • 5 طلبات</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-500">
                عرض
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <h3 className="text-gray-500 font-medium">لا يوجد عملاء بعد</h3>
            <p className="text-gray-400 text-sm">ستظهر هنا معلومات عن عملائك الجدد</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">لوحة التحكم</h1>
            <p className="text-gray-600 flex items-center">
              مرحباً بك في متجرك {store?.store_name}
              <span className="mr-2 text-xs bg-gradient-to-r from-green-100 to-green-50 text-green-800 px-2 py-0.5 rounded-full inline-flex items-center border border-green-200">
                <Shield size={12} className="ml-1" />
                مؤمن ببروتوكول التشفير
              </span>
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => window.open(`https://${store?.domain_name}.linok.me`, '_blank')}
              className="flex items-center gap-2 hover:scale-105 transition-transform duration-300 bg-white border-gray-200"
            >
              <Home className="h-4 w-4" />
              زيارة المتجر
            </Button>
          </div>
        </div>
        
        <StatCards />
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-3 mb-8 bg-gray-100 p-1 border border-gray-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">نظرة عامة</TabsTrigger>
            <TabsTrigger value="store" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">معلومات المتجر</TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">النشاط الأخير</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="animate-fade-in">
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 md:grid-cols-3 gap-6'}`}>
              <div className={`${isMobile ? 'order-2' : 'md:col-span-2'}`}>
                <QuickActions />
                <UpcomingEvents />
                <QuickAnalytics />
              </div>
              
              <div className={`${isMobile ? 'order-1' : 'md:col-span-1'}`}>
                <AIInsights />
                <div className="mt-6">
                  <CustomerOverview />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="store" className="animate-fade-in">
            {store && (
              <div className="bg-white shadow-sm rounded-lg p-6 mb-8 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-5 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                      <ShoppingBag className="inline-block ml-2 h-5 w-5 text-primary-500" />
                      معلومات المتجر
                    </h2>
                    <div className="space-y-3">
                      <p className="flex justify-between border-b border-dashed border-gray-100 pb-2">
                        <span className="font-medium text-gray-600">اسم المتجر:</span> 
                        <span className="text-gray-800">{store.store_name}</span>
                      </p>
                      <p className="flex justify-between border-b border-dashed border-gray-100 pb-2">
                        <span className="font-medium text-gray-600">رابط المتجر:</span> 
                        <span className="text-gray-800">{store.domain_name}.linok.me</span>
                      </p>
                      <p className="flex justify-between border-b border-dashed border-gray-100 pb-2">
                        <span className="font-medium text-gray-600">الدولة:</span> 
                        <span className="text-gray-800">{store.country}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium text-gray-600">العملة:</span> 
                        <span className="text-gray-800">{store.currency}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-5 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                      <BarChart className="inline-block ml-2 h-5 w-5 text-primary-500" />
                      الإحصائيات
                    </h2>
                    <div className="space-y-3">
                      <p className="flex justify-between border-b border-dashed border-gray-100 pb-2">
                        <span className="font-medium text-gray-600">عدد المنتجات:</span> 
                        <span className="text-gray-800">{stats.productCount}</span>
                      </p>
                      <p className="flex justify-between border-b border-dashed border-gray-100 pb-2">
                        <span className="font-medium text-gray-600">عدد الطلبات:</span> 
                        <span className="text-gray-800">{stats.orderCount}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium text-gray-600">عدد العملاء:</span> 
                        <span className="text-gray-800">{stats.customerCount}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="activity" className="animate-fade-in">
            <Card className="border border-gray-100">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <CardTitle className="flex items-center">
                  <Bell className="inline-block ml-2 h-5 w-5 text-primary-500" />
                  النشاط الأخير
                </CardTitle>
                <CardDescription>سجل نشاط متجرك خلال الأيام الأخيرة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 py-4">
                  <div className="flex">
                    <div className="mr-4 relative">
                      <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="absolute top-9 bottom-0 left-1/2 w-0.5 -ml-0.5 bg-gray-200"></div>
                    </div>
                    <div className="pb-4">
                      <p className="text-gray-800 font-medium">تمت إضافة منتج جديد</p>
                      <p className="text-sm text-gray-600">قمت بإضافة منتج "ساعة ذكية"</p>
                      <p className="text-xs text-gray-400 mt-1">منذ 3 ساعات</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-4 relative">
                      <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="absolute top-9 bottom-0 left-1/2 w-0.5 -ml-0.5 bg-gray-200"></div>
                    </div>
                    <div className="pb-4">
                      <p className="text-gray-800 font-medium">عميل جديد مسجل</p>
                      <p className="text-sm text-gray-600">سجل مستخدم جديد في متجرك</p>
                      <p className="text-xs text-gray-400 mt-1">منذ يوم واحد</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-4">
                      <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center">
                        <ShoppingBag className="h-5 w-5 text-orange-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">طلب جديد</p>
                      <p className="text-sm text-gray-600">تم استلام طلب جديد بقيمة {formatCurrency(249)}</p>
                      <p className="text-xs text-gray-400 mt-1">منذ 3 أيام</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

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
  Shield
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { secureRetrieve } from "@/lib/encryption";

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
              productCount: productCount || 0
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
      <div className="min-h-screen flex items-center justify-center">
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
        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">مرحباً بك في Linok.me</h1>
          <p className="text-gray-600 mb-6 text-center">لم نجد أي متجر مرتبط بحسابك. قم بإنشاء متجرك الآن للبدء!</p>
          <Button 
            onClick={handleCreateStore}
            className="w-full bg-primary-600 hover:bg-primary-700"
          >
            إنشاء متجر جديد
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم</h1>
            <p className="text-gray-600">
              مرحباً بك في متجرك {store?.store_name}
              <span className="mr-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full inline-flex items-center">
                <Shield size={12} className="ml-1" />
                مؤمن ببروتوكول التشفير
              </span>
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => window.open(`https://${store?.domain_name}.linok.me`, '_blank')}
              className="flex items-center gap-2 hover-scale"
            >
              <Home className="h-4 w-4" />
              زيارة المتجر
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="hover-scale transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">المنتجات</p>
                  <h3 className="text-2xl font-bold">{stats.productCount}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                  <Package className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-scale transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">الطلبات</p>
                  <h3 className="text-2xl font-bold">{stats.orderCount}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <ShoppingBag className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-scale transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">العملاء</p>
                  <h3 className="text-2xl font-bold">{stats.customerCount}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-scale transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">الإيرادات</p>
                  <h3 className="text-2xl font-bold">{formatCurrency(stats.revenue)}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="overview" className="animate-enter">نظرة عامة</TabsTrigger>
            <TabsTrigger value="store" className="animate-enter">معلومات المتجر</TabsTrigger>
            <TabsTrigger value="activity" className="animate-enter">النشاط الأخير</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow hover-scale">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">المنتجات</h2>
                  <Package className="h-6 w-6 text-primary-500" />
                </div>
                <p className="text-gray-600 mb-4">إدارة منتجات متجرك</p>
                <Button 
                  variant="ghost"
                  className="text-primary-600 font-medium hover:underline bg-transparent"
                  asChild
                >
                  <Link to="/products">إدارة المنتجات</Link>
                </Button>
              </div>
              
              <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow hover-scale">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">الإعدادات</h2>
                  <Settings className="h-6 w-6 text-primary-500" />
                </div>
                <p className="text-gray-600 mb-4">تخصيص إعدادات متجرك</p>
                <Button 
                  variant="ghost"
                  className="text-primary-600 font-medium hover:underline bg-transparent"
                  asChild
                >
                  <Link to="/settings">تعديل الإعدادات</Link>
                </Button>
              </div>
              
              <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow hover-scale">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">المتجر</h2>
                  <Home className="h-6 w-6 text-primary-500" />
                </div>
                <p className="text-gray-600 mb-4">زيارة المتجر الخاص بك</p>
                <Button 
                  className="text-primary-600 font-medium hover:underline bg-transparent"
                  variant="ghost"
                  onClick={() => window.open(`https://${store?.domain_name}.linok.me`, '_blank')}
                >
                  عرض المتجر
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="store" className="animate-fade-in">
            {store && (
              <div className="bg-white shadow rounded-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">معلومات المتجر</h2>
                    <div className="space-y-2">
                      <p><span className="font-medium">اسم المتجر:</span> {store.store_name}</p>
                      <p><span className="font-medium">رابط المتجر:</span> {store.domain_name}.linok.me</p>
                      <p><span className="font-medium">الدولة:</span> {store.country}</p>
                      <p><span className="font-medium">العملة:</span> {store.currency}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">الإحصائيات</h2>
                    <div className="space-y-2">
                      <p><span className="font-medium">عدد المنتجات:</span> {stats.productCount}</p>
                      <p><span className="font-medium">عدد الطلبات:</span> {stats.orderCount}</p>
                      <p><span className="font-medium">عدد العملاء:</span> {stats.customerCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="activity" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>النشاط الأخير</CardTitle>
                <CardDescription>سجل نشاط متجرك خلال الأيام الأخيرة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <Activity className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">لا توجد أنشطة بعد</h3>
                  <p className="text-gray-600">
                    ستظهر هنا سجلات الأنشطة الجديدة مثل الطلبات والعملاء وغيرها.
                  </p>
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

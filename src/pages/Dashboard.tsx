import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, Package, Users, DollarSign, AlertCircle, Tags, Settings } from "lucide-react";
import useStoreData, { getCurrencyFormatter } from "@/hooks/use-store-data";
import { secureRetrieve } from "@/lib/encryption";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Order } from "@/types/orders";

// Import components
import WelcomeSection from "@/features/dashboard/components/WelcomeSection";
import StatsCard from "@/features/dashboard/components/StatsCard";
import SalesChart from "@/features/dashboard/components/SalesChart";
import RecentOrders from "@/features/dashboard/components/RecentOrders";
import RecentProducts from "@/features/dashboard/components/RecentProducts";
import LoadingState from "@/components/ui/loading-state";
import ErrorState from "@/components/ui/error-state";

// Mock data for demonstration
const mockSalesData = [
  { name: "يناير", value: 1500 },
  { name: "فبراير", value: 2500 },
  { name: "مارس", value: 2000 },
  { name: "أبريل", value: 3000 },
  { name: "مايو", value: 2800 },
  { name: "يونيو", value: 3200 },
  { name: "يوليو", value: 3800 },
];

// بيانات الطلبات المحاكاة (متوافقة مع تعريف Order)
const mockRecentOrders: Order[] = [
  {
    id: "ord-1",
    order_number: "10001",
    store_id: "store-1",
    customer_name: "أحمد محمد",
    customer_email: "ahmed@example.com",
    shipping_address: "الرياض، السعودية",
    payment_method: "نقد عند الاستلام",
    status: "delivered",
    total: 255.99,
    created_at: "2023-07-22T10:00:00Z",
    updated_at: "2023-07-22T10:30:00Z"
  },
  {
    id: "ord-2",
    order_number: "10002",
    store_id: "store-1",
    customer_name: "سارة عبدالله",
    customer_email: "sara@example.com",
    shipping_address: "جدة، السعودية",
    payment_method: "بطاقة ائتمان",
    status: "processing",
    total: 189.50,
    created_at: "2023-07-21T14:20:00Z",
    updated_at: "2023-07-21T14:25:00Z"
  },
  {
    id: "ord-3",
    order_number: "10003",
    store_id: "store-1",
    customer_name: "محمد أحمد",
    customer_email: "mohammad@example.com",
    shipping_address: "الدمام، السعودية",
    payment_method: "تحويل بنكي",
    status: "pending",
    total: 340.00,
    created_at: "2023-07-20T09:15:00Z",
    updated_at: "2023-07-20T09:15:00Z"
  },
  {
    id: "ord-4",
    order_number: "10004",
    store_id: "store-1",
    customer_name: "نورة خالد",
    customer_email: "noura@example.com",
    shipping_address: "المدينة، السعودية",
    payment_method: "نقد عند الاستلام",
    status: "shipped",
    total: 129.99,
    created_at: "2023-07-19T16:45:00Z",
    updated_at: "2023-07-19T17:00:00Z"
  }
];

const mockRecentProducts = [
  {
    id: "prod-1",
    name: "قميص أنيق",
    thumbnail: null,
    price: 120,
    stock: 25,
    category: "ملابس رجالية"
  },
  {
    id: "prod-2",
    name: "سماعات بلوتوث",
    thumbnail: null,
    price: 350,
    stock: 8,
    category: "إلكترونيات"
  },
  {
    id: "prod-3",
    name: "حذاء رياضي",
    thumbnail: null,
    price: 210,
    stock: 0,
    category: "أحذية"
  },
  {
    id: "prod-4",
    name: "ساعة ذكية",
    thumbnail: null,
    price: 499,
    stock: 15,
    category: "إلكترونيات"
  }
];

// Dashboard Page
const Dashboard: React.FC = () => {
  // Fetch store data using the custom hook
  const { data: storeData, isLoading, error } = useStoreData();
  
  // Fetch user name
  const [userName, setUserName] = React.useState<string>("المدير");
  
  React.useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userId = await secureRetrieve('user-id');
        if (userId) {
          const { data, error } = await supabase.auth.getUser();
          if (data && data.user) {
            setUserName(data.user.user_metadata?.full_name || data.user.email || "المدير");
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    
    fetchUserName();
  }, []);
  
  if (isLoading) {
    return <LoadingState message="جاري تحميل البيانات..." />;
  }
  
  if (error) {
    return (
      <ErrorState 
        title="حدث خطأ"
        message="لم نتمكن من تحميل بيانات لوحة التحكم"
        onRetry={() => window.location.reload()}
      />
    );
  }
  
  // Format currency based on store settings
  const formatCurrency = getCurrencyFormatter(storeData?.currency || 'SAR');
  
  // Stats data for demonstration
  const statsData = {
    products: 54,
    orders: 128,
    customers: 35,
    revenue: 8425
  };
  
  // Subscription plan status - use basic as default
  const subscriptionStatus = "basic"; // Default value since property doesn't exist in type
  const isBasicPlan = subscriptionStatus === "basic";
  
  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <WelcomeSection 
        storeName={storeData?.store_name || "متجرك"} 
        ownerName={userName}
        newOrdersCount={7}
        lowStockCount={5}
      />
      
      {/* Subscription Alert for Basic Plan */}
      {isBasicPlan && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-amber-800">أنت تستخدم الباقة الأساسية</h4>
            <p className="text-sm text-amber-700 mt-1">
              قم بترقية متجرك إلى الباقة الاحترافية للحصول على المزيد من المميزات المتقدمة
            </p>
            <div className="mt-2">
              <Button asChild size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                <Link to="/dashboard/settings">ترقية الباقة</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="المنتجات"
          value={statsData.products.toString()}
          trend={{ value: 12, isPositive: true }}
          icon={<Package className="h-5 w-5" />}
          iconClassName="bg-blue-100 text-blue-600"
        />
        <StatsCard 
          title="الطلبات"
          value={statsData.orders.toString()}
          trend={{ value: 8, isPositive: true }}
          icon={<ShoppingBag className="h-5 w-5" />}
          iconClassName="bg-orange-100 text-orange-600"
        />
        <StatsCard 
          title="العملاء"
          value={statsData.customers.toString()}
          trend={{ value: 5, isPositive: true }}
          icon={<Users className="h-5 w-5" />}
          iconClassName="bg-green-100 text-green-600"
        />
        <StatsCard 
          title="الإيرادات"
          value={formatCurrency(statsData.revenue)}
          trend={{ value: 14, isPositive: true }}
          icon={<DollarSign className="h-5 w-5" />}
          iconClassName="bg-purple-100 text-purple-600"
        />
      </div>
      
      {/* Sales Chart */}
      <SalesChart 
        data={mockSalesData}
        currency={storeData?.currency || "SAR"}
      />
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button asChild variant="outline" className="h-auto py-4 border-gray-200 hover:border-primary-200 hover:bg-primary-50">
          <Link to="/dashboard/products/new" className="flex flex-col items-center gap-2">
            <Package className="h-6 w-6 text-primary-500" />
            <span>إضافة منتج</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4 border-gray-200 hover:border-primary-200 hover:bg-primary-50">
          <Link to="/dashboard/categories" className="flex flex-col items-center gap-2">
            <Tags className="h-6 w-6 text-primary-500" />
            <span>إدارة التصنيفات</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4 border-gray-200 hover:border-primary-200 hover:bg-primary-50">
          <Link to="/dashboard/orders" className="flex flex-col items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary-500" />
            <span>تتبع الطلبات</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4 border-gray-200 hover:border-primary-200 hover:bg-primary-50">
          <Link to="/dashboard/settings" className="flex flex-col items-center gap-2">
            <Settings className="h-6 w-6 text-primary-500" />
            <span>إعدادات المتجر</span>
          </Link>
        </Button>
      </div>
      
      {/* Activity Summary Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <RecentOrders 
          orders={mockRecentOrders}
        />
        
        <RecentProducts 
          products={mockRecentProducts}
          currency={storeData?.currency || "SAR"}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

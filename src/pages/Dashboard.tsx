
import React from "react";
import useStoreData, { getCurrencyFormatter } from "@/hooks/use-store-data";
import { secureRetrieve } from "@/lib/encryption";
import DashboardLayout from "@/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import LoadingState from "@/components/ui/loading-state";
import ErrorState from "@/components/ui/error-state";

// Import components
import WelcomeSection from "@/features/dashboard/components/WelcomeSection";
import SalesChart from "@/features/dashboard/components/SalesChart";
import PromotionAlert from "@/features/dashboard/components/PromotionAlert";
import DashboardStats from "@/features/dashboard/components/DashboardStats";
import QuickActions from "@/features/dashboard/components/QuickActions";
import ActivitySummary from "@/features/dashboard/components/ActivitySummary";
import { Order, OrderStatus } from "@/types/orders";

// بيانات المبيعات للعرض
const mockSalesData = [
  { name: "يناير", value: 1500 },
  { name: "فبراير", value: 2500 },
  { name: "مارس", value: 2000 },
  { name: "أبريل", value: 3000 },
  { name: "مايو", value: 2800 },
  { name: "يونيو", value: 3200 },
  { name: "يوليو", value: 3800 },
];

// بيانات الطلبات المحاكاة
const mockRecentOrders: Order[] = [
  {
    id: "ord-1",
    order_number: "10001",
    store_id: "store-1",
    customer_name: "أحمد محمد",
    customer_email: "ahmed@example.com",
    customer_phone: undefined,
    shipping_address: "الرياض، السعودية",
    payment_method: "نقد عند الاستلام",
    status: "delivered" as OrderStatus,
    total: 255.99,
    notes: undefined,
    created_at: "2023-07-22T10:00:00Z",
    updated_at: "2023-07-22T10:30:00Z"
  },
  {
    id: "ord-2",
    order_number: "10002",
    store_id: "store-1",
    customer_name: "سارة عبدالله",
    customer_email: "sara@example.com",
    customer_phone: undefined,
    shipping_address: "جدة، السعودية",
    payment_method: "بطاقة ائتمان",
    status: "processing" as OrderStatus,
    total: 189.50,
    notes: undefined,
    created_at: "2023-07-21T14:20:00Z",
    updated_at: "2023-07-21T14:25:00Z"
  },
  {
    id: "ord-3",
    order_number: "10003",
    store_id: "store-1",
    customer_name: "محمد أحمد",
    customer_email: "mohammad@example.com",
    customer_phone: undefined,
    shipping_address: "الدمام، السعودية",
    payment_method: "تحويل بنكي",
    status: "processing" as OrderStatus,
    total: 340.00,
    notes: undefined,
    created_at: "2023-07-20T09:15:00Z",
    updated_at: "2023-07-20T09:15:00Z"
  },
  {
    id: "ord-4",
    order_number: "10004",
    store_id: "store-1",
    customer_name: "نورة خالد",
    customer_email: "noura@example.com",
    customer_phone: undefined,
    shipping_address: "المدينة، السعودية",
    payment_method: "نقد عند الاستلام",
    status: "shipped" as OrderStatus,
    total: 129.99,
    notes: undefined,
    created_at: "2023-07-19T16:45:00Z",
    updated_at: "2023-07-19T17:00:00Z"
  }
];

// بيانات المنتجات المحاكاة
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
  const subscriptionPlan = storeData?.subscription_plan || "basic";
  
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
      <PromotionAlert type={subscriptionPlan} />
      
      {/* Stats Cards */}
      <DashboardStats 
        products={statsData.products}
        orders={statsData.orders}
        customers={statsData.customers}
        revenue={statsData.revenue}
        formatCurrency={formatCurrency}
      />
      
      {/* Sales Chart */}
      <div className="mb-6">
        <SalesChart 
          data={mockSalesData}
          currency={storeData?.currency || "SAR"}
        />
      </div>
      
      {/* Quick Actions */}
      <QuickActions />
      
      {/* Activity Summary Section */}
      <ActivitySummary 
        orders={mockRecentOrders}
        products={mockRecentProducts}
        currency={storeData?.currency || "SAR"}
      />
    </DashboardLayout>
  );
};

export default Dashboard;


import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, Package, Users, DollarSign } from "lucide-react";
import useStoreData, { getCurrencyFormatter } from "@/hooks/use-store-data";
import { motion } from "framer-motion";
import { secureRetrieve } from "@/lib/encryption";

// Components
import WelcomeSection from "@/features/dashboard/components/WelcomeSection";
import StatsCard from "@/features/dashboard/components/StatsCard";
import SalesChart from "@/features/dashboard/components/SalesChart";
import RecentOrders from "@/features/dashboard/components/RecentOrders";
import RecentProducts from "@/features/dashboard/components/RecentProducts";
import { LoadingState } from "@/components/ui/loading-state";

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

const mockRecentOrders = [
  {
    id: "ord-1",
    orderNumber: "10001",
    customerName: "أحمد محمد",
    date: "22 يوليو 2023",
    status: "delivered" as const,
    total: 255.99
  },
  {
    id: "ord-2",
    orderNumber: "10002",
    customerName: "سارة عبدالله",
    date: "21 يوليو 2023",
    status: "processing" as const,
    total: 189.50
  },
  {
    id: "ord-3",
    orderNumber: "10003",
    customerName: "محمد أحمد",
    date: "20 يوليو 2023",
    status: "pending" as const,
    total: 340.00
  },
  {
    id: "ord-4",
    orderNumber: "10004",
    customerName: "نورة خالد",
    date: "19 يوليو 2023",
    status: "shipped" as const,
    total: 129.99
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

// Dashboard Home Page
const Home: React.FC = () => {
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
      <div className="flex flex-col justify-center items-center h-full py-12">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">حدث خطأ</h3>
        <p className="text-gray-600 mb-4">لم نتمكن من تحميل بيانات لوحة التحكم</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
        >
          إعادة المحاولة
        </button>
      </div>
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
  
  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <WelcomeSection 
        storeName={storeData?.store_name || "متجرك"} 
        ownerName={userName}
        newOrdersCount={7}
        lowStockCount={5}
      />
      
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
        currency="ر.س"
      />
      
      {/* Activity Summary Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <RecentOrders 
          orders={mockRecentOrders}
        />
        
        <RecentProducts 
          products={mockRecentProducts}
          currency="ر.س"
        />
      </div>
    </div>
  );
};

export default Home;

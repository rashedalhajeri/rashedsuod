
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Package, Users, DollarSign } from "lucide-react";
import { secureRetrieve } from "@/lib/encryption";
import { motion } from "framer-motion";
import { format, subDays } from "date-fns";
import { ar } from "date-fns/locale";

// Import components from features/dashboard
import StatsCard from "@/features/dashboard/components/StatsCard";
import RecentOrders from "@/features/dashboard/components/RecentOrders";
import RecentProducts from "@/features/dashboard/components/RecentProducts";
import SalesChart from "@/features/dashboard/components/SalesChart";
import WelcomeSection from "@/features/dashboard/components/WelcomeSection";

// Mock data
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
    date: "2023-07-22",
    status: "delivered" as const,
    total: 255.99
  },
  {
    id: "ord-2",
    orderNumber: "10002",
    customerName: "سارة عبدالله",
    date: "2023-07-21",
    status: "processing" as const,
    total: 189.50
  },
  {
    id: "ord-3",
    orderNumber: "10003",
    customerName: "محمد أحمد",
    date: "2023-07-20",
    status: "pending" as const,
    total: 340.00
  },
  {
    id: "ord-4",
    orderNumber: "10004",
    customerName: "نورة خالد",
    date: "2023-07-19",
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

// Dashboard Page
const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [storeData, setStoreData] = useState<any>(null);
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    revenue: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch user session and store data
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user.id || await secureRetrieve('user-id');
        
        if (!userId) {
          navigate('/auth');
          return;
        }
        
        // For now just use mock data, but we'd fetch from Supabase in a real app
        setStats({
          products: 54,
          orders: 128,
          customers: 35,
          revenue: 8425
        });
        
        setStoreData({
          name: "متجر الإلكترونيات",
          owner: "محمد عبدالله"
        });
        
        // Set loading to false
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [navigate]);
  
  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date helper
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: ar });
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-full py-12">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <WelcomeSection 
        storeName={storeData?.name || "متجرك"} 
        ownerName={storeData?.owner || "المدير"} 
        newOrdersCount={7}
        lowStockCount={5}
      />
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="المنتجات"
          value={stats.products}
          icon={<Package className="h-5 w-5" />}
          trend={{ value: 12, isPositive: true }}
          iconClassName="bg-blue-100 text-blue-600"
        />
        <StatsCard 
          title="الطلبات"
          value={stats.orders}
          icon={<ShoppingBag className="h-5 w-5" />}
          trend={{ value: 8, isPositive: true }}
          iconClassName="bg-orange-100 text-orange-600"
        />
        <StatsCard 
          title="العملاء"
          value={stats.customers}
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 5, isPositive: true }}
          iconClassName="bg-green-100 text-green-600"
        />
        <StatsCard 
          title="الإيرادات"
          value={formatCurrency(stats.revenue)}
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: 14, isPositive: true }}
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
          orders={mockRecentOrders.map(order => ({
            ...order,
            date: formatDate(order.date)
          }))}
        />
        
        <RecentProducts 
          products={mockRecentProducts}
          currency="ر.س"
        />
      </div>
    </div>
  );
};

export default Dashboard;

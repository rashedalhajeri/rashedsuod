
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Package, Users, DollarSign, Bell, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { secureRetrieve } from "@/lib/encryption";
import { motion } from "framer-motion";
import { format, subDays } from "date-fns";
import { ar } from "date-fns/locale";

// Import components from features/dashboard
import StatsCard from "@/features/dashboard/components/StatsCard";
import RecentOrders from "@/features/dashboard/components/RecentOrders";
import RecentProducts from "@/features/dashboard/components/RecentProducts";
import SalesChart from "@/features/dashboard/components/SalesChart";

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
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">لوحة التحكم</h1>
        <p className="text-muted-foreground">
          نظرة عامة على متجرك وأدائه
        </p>
      </div>
      
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
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            <Bell className="h-4 w-4 inline-block ml-2" />
            إشعارات ومهام
          </CardTitle>
          <CardDescription>
            قم بإدارة المهام والإشعارات الهامة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-100">
              <h3 className="font-medium mb-2">طلبات قيد الانتظار</h3>
              <p className="text-sm text-muted-foreground mb-3">
                لديك 3 طلبات في انتظار المعالجة
              </p>
              <Button size="sm" variant="outline" asChild>
                <a href="/dashboard/orders?status=pending">
                  معالجة الطلبات
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                </a>
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg bg-red-50 border-red-100">
              <h3 className="font-medium mb-2">منتجات نفدت من المخزون</h3>
              <p className="text-sm text-muted-foreground mb-3">
                5 منتجات نفدت من المخزون وتحتاج للتجديد
              </p>
              <Button size="sm" variant="outline" asChild>
                <a href="/dashboard/products?inStock=0">
                  تحديث المخزون
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                </a>
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg bg-blue-50 border-blue-100">
              <h3 className="font-medium mb-2">تقارير الشهر</h3>
              <p className="text-sm text-muted-foreground mb-3">
                تقارير الشهر الحالي جاهزة للمراجعة
              </p>
              <Button size="sm" variant="outline" asChild>
                <a href="/dashboard/reports">
                  عرض التقارير
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

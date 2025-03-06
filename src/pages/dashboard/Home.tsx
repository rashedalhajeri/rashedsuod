
import React from "react";
import WelcomeSection from "@/features/dashboard/components/WelcomeSection";
import StatsCard from "@/features/dashboard/components/StatsCard";
import PlatformStatsSection from "@/features/dashboard/components/PlatformStatsSection";
import { ShoppingCart, Package, TrendingUp, Users } from "lucide-react";
import { useStoreData } from "@/hooks/use-store-data";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { isAdmin } from "@/utils/auth-utils";
import { useAuthState } from "@/hooks/use-auth-state";

interface DashboardStats {
  newOrdersCount: number;
  lowStockCount: number;
  totalRevenue: number;
  totalCustomers: number;
}

const DashboardHome = () => {
  const { data: storeData } = useStoreData();
  const { userId } = useAuthState();
  const isAdminUser = useQuery({
    queryKey: ['isAdmin', userId],
    queryFn: async () => {
      if (!userId) return false;
      const { data: userData } = await supabase.auth.getUser();
      return isAdmin(userData?.user || null);
    },
    enabled: !!userId,
  });
  
  const { data: stats } = useQuery({
    queryKey: ['dashboardStats', storeData?.id],
    queryFn: async (): Promise<DashboardStats> => {
      if (!storeData?.id) {
        throw new Error("لم يتم العثور على معرف المتجر");
      }
      
      // الطلبات الجديدة (حالة: pending)
      const { count: newOrdersCount, error: ordersError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('store_id', storeData.id)
        .eq('status', 'pending');
        
      if (ordersError) throw ordersError;
      
      // المنتجات التي كمياتها منخفضة (أقل من 5)
      const { count: lowStockCount, error: stockError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('store_id', storeData.id)
        .lt('stock_quantity', 5);
        
      if (stockError) throw stockError;
      
      // إجمالي الإيرادات
      const { data: revenueData, error: revenueError } = await supabase
        .from('orders')
        .select('total')
        .eq('store_id', storeData.id);
        
      if (revenueError) throw revenueError;
      
      const totalRevenue = revenueData.reduce((acc, order) => acc + Number(order.total), 0);
      
      // إجمالي العملاء (فريدين حسب البريد الإلكتروني أو الهاتف)
      const { data: customersData, error: customersError } = await supabase
        .from('orders')
        .select('customer_email, customer_phone')
        .eq('store_id', storeData.id);
        
      if (customersError) throw customersError;
      
      // تحديد العملاء الفريدين استنادًا إلى البريد الإلكتروني أو الهاتف
      const uniqueCustomers = new Set();
      customersData.forEach(customer => {
        if (customer.customer_email) {
          uniqueCustomers.add(customer.customer_email);
        } else if (customer.customer_phone) {
          uniqueCustomers.add(customer.customer_phone);
        }
      });
      
      return {
        newOrdersCount: newOrdersCount || 0,
        lowStockCount: lowStockCount || 0,
        totalRevenue,
        totalCustomers: uniqueCustomers.size
      };
    },
    enabled: !!storeData?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  if (!storeData || !stats) {
    return null; // سيتم عرض حالة التحميل من قبل المكون الأب
  }
  
  return (
    <div className="container py-6 max-w-screen-2xl mx-auto">
      <WelcomeSection
        storeName={storeData.store_name}
        ownerName={userId || ""}
        newOrdersCount={stats.newOrdersCount}
        lowStockCount={stats.lowStockCount}
        storeId={storeData.id}
        storeDomain={storeData.domain_name}
      />
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="الطلبات الجديدة"
          value={stats.newOrdersCount}
          icon={<ShoppingCart className="h-5 w-5" />}
          iconClassName="bg-orange-100 text-orange-600"
        />
        
        <StatsCard
          title="منتجات قاربت على النفاد"
          value={stats.lowStockCount}
          icon={<Package className="h-5 w-5" />}
          iconClassName="bg-red-100 text-red-600"
        />
        
        <StatsCard
          title="إجمالي الإيرادات"
          value={stats.totalRevenue.toFixed(2)}
          icon={<TrendingUp className="h-5 w-5" />}
          iconClassName="bg-green-100 text-green-600"
        />
        
        <StatsCard
          title="العملاء"
          value={stats.totalCustomers}
          icon={<Users className="h-5 w-5" />}
          iconClassName="bg-blue-100 text-blue-600"
        />
      </div>
      
      {/* عرض قسم إحصائيات المنصة فقط للمشرفين */}
      {isAdminUser.data && <PlatformStatsSection />}
    </div>
  );
};

export default DashboardHome;

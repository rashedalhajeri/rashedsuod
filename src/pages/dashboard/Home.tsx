
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import useStoreData, { getCurrencyFormatter } from "@/hooks/use-store-data";
import { secureRetrieve } from "@/lib/encryption";
import DashboardLayout from "@/layouts/DashboardLayout";
import LoadingState from "@/components/ui/loading-state";
import ErrorState from "@/components/ui/error-state";
import { OrderStatus } from "@/types/orders";

// Import components
import WelcomeSection from "@/features/dashboard/components/WelcomeSection";
import SalesChart from "@/features/dashboard/components/SalesChart";
import DashboardStatsSection from "@/features/dashboard/components/DashboardStatsSection";
import SubscriptionAlert from "@/features/dashboard/components/SubscriptionAlert";
import QuickActionButtons from "@/features/dashboard/components/QuickActionButtons";
import ActivitySummarySection from "@/features/dashboard/components/ActivitySummarySection";

// Import service functions
import { fetchDashboardStats, fetchSalesData } from "@/services/stats-service";
import { fetchOrders } from "@/services/order-service";

// Dashboard Home Page
const DashboardHome: React.FC = () => {
  // Fetch store data using the custom hook
  const { storeData, isLoading: isStoreLoading, error: storeError } = useStoreData();
  
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

  // Fetch stats data
  const { data: statsData, isLoading: isStatsLoading, error: statsError } = useQuery({
    queryKey: ['dashboardStats', storeData?.id],
    queryFn: () => fetchDashboardStats(storeData?.id),
    enabled: !!storeData?.id,
  });

  // Fetch sales chart data
  const [period, setPeriod] = React.useState("monthly");
  const { data: salesData, isLoading: isSalesLoading, error: salesError } = useQuery({
    queryKey: ['salesData', storeData?.id, period],
    queryFn: () => fetchSalesData(storeData?.id, period),
    enabled: !!storeData?.id,
  });

  // Fetch recent orders
  const { data: ordersData, isLoading: isOrdersLoading, error: ordersError } = useQuery({
    queryKey: ['recentOrders', storeData?.id],
    queryFn: async () => {
      const result = await fetchOrders(storeData?.id, { pageSize: 5 });
      // Ensure order status conforms to OrderStatus type
      const typedOrders = result.orders.map(order => ({
        ...order,
        status: order.status as OrderStatus // Type assertion to fix TypeScript error
      }));
      return { ...result, orders: typedOrders };
    },
    enabled: !!storeData?.id,
  });

  // Fetch recent products
  const { data: productsData, isLoading: isProductsLoading, error: productsError } = useQuery({
    queryKey: ['recentProducts', storeData?.id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', storeData?.id)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        return data.map(product => ({
          id: product.id,
          name: product.name,
          thumbnail: product.image_url,
          price: Number(product.price),
          stock: product.stock_quantity || 0,
          category: 'بدون تصنيف'  // Default category until we implement categories
        }));
      } catch (error) {
        console.error("Error fetching recent products:", error);
        return [];
      }
    },
    enabled: !!storeData?.id,
  });
  
  const isLoading = isStoreLoading || isStatsLoading || isSalesLoading || isOrdersLoading || isProductsLoading;
  
  // More detailed error handling
  if (storeError) {
    let errorDetails = "تفاصيل الخطأ غير متوفرة";
    
    try {
      if (typeof storeError === 'object' && storeError !== null) {
        // Try to extract a meaningful error message
        const errorObj = storeError as any;
        errorDetails = errorObj.message || 
                      (errorObj.error && errorObj.error.message) || 
                      JSON.stringify(storeError);
                      
        // For common Supabase errors about multiple rows
        if (errorDetails.includes("multiple (or no) rows returned")) {
          errorDetails = "هناك أكثر من متجر مرتبط بحسابك. يرجى الاتصال بالدعم الفني.";
        }
      }
    } catch (e) {
      console.error("Error parsing error object:", e);
    }
    
    return (
      <ErrorState 
        title="تعذر تحميل بيانات المتجر"
        message="لم نتمكن من تحميل بيانات لوحة التحكم"
        details={errorDetails}
        onRetry={() => window.location.reload()}
      />
    );
  }
  
  if (isLoading && (!storeData || !statsData)) {
    return <LoadingState message="جاري تحميل البيانات..." />;
  }
  
  if (statsError || salesError || ordersError || productsError) {
    const activeError = statsError || salesError || ordersError || productsError;
    let errorMessage = "لم نتمكن من تحميل بعض البيانات. يرجى المحاولة مرة أخرى.";
    
    return (
      <ErrorState 
        title="حدث خطأ"
        message={errorMessage}
        onRetry={() => window.location.reload()}
      />
    );
  }
  
  // Format currency based on store settings (always using KWD)
  const formatCurrency = getCurrencyFormatter(storeData?.currency || 'KWD');
  
  // Subscription plan status
  const subscriptionStatus = storeData?.subscription_plan || "free";
  const isBasicPlan = subscriptionStatus === "basic";
  
  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <WelcomeSection 
        storeName={storeData?.store_name || "متجرك"} 
        ownerName={userName}
        newOrdersCount={statsData?.orders || 0}
        lowStockCount={0} // We'll implement this later
      />
      
      {/* Subscription Alert for Basic Plan */}
      <SubscriptionAlert isBasicPlan={isBasicPlan} />
      
      {/* Stats Cards */}
      <DashboardStatsSection stats={statsData || {
        products: 0,
        orders: 0,
        customers: 0,
        revenue: 0
      }} formatCurrency={formatCurrency} />
      
      {/* Sales Chart */}
      <SalesChart 
        data={salesData || []}
        currency="د.ك"
      />
      
      {/* Quick Actions */}
      <QuickActionButtons />
      
      {/* Activity Summary Section */}
      <ActivitySummarySection
        orders={ordersData?.orders || []}
        products={productsData || []}
        currency="KWD"
      />
    </DashboardLayout>
  );
};

export default DashboardHome;

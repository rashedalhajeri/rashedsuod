
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import useStoreData from "@/hooks/use-store-data";
import { secureRetrieve } from "@/lib/encryption";
import { OrderStatus } from "@/types/orders";

// Import service functions
import { fetchDashboardStats, fetchSalesData } from "@/services/stats-service";
import { fetchOrders } from "@/services/order-service";

export const useDashboardData = () => {
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
  
  return {
    storeData,
    userName,
    statsData,
    salesData,
    ordersData,
    productsData,
    isLoading,
    storeError,
    statsError,
    salesError,
    ordersError,
    productsError,
    period,
    setPeriod
  };
};

export default useDashboardData;

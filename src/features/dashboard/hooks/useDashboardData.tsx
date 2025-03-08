
import React from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import useStoreData from "@/hooks/use-store-data";
import { secureRetrieve } from "@/lib/encryption";
import { OrderStatus } from "@/types/orders";

// Import service functions
import { fetchDashboardStats } from "@/services/stats-service";
import { fetchSalesData } from "@/services/stats-service";
import { fetchOrders } from "@/services/order-service";

export const useDashboardData = () => {
  // Fetch store data using the custom hook - this needs to be first
  const { storeData, isLoading: isStoreLoading, error: storeError } = useStoreData();
  
  // Fetch user name
  const [userName, setUserName] = React.useState<string>("المدير");
  const [period, setPeriod] = React.useState("monthly");
  
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

  // Use parallel data fetching with useQueries for better performance
  const dashboardQueries = useQueries({
    queries: [
      // Stats query
      {
        queryKey: ['dashboardStats', storeData?.id],
        queryFn: () => fetchDashboardStats(storeData?.id),
        enabled: !!storeData?.id,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
      },
      // Sales data query
      {
        queryKey: ['salesData', storeData?.id, period],
        queryFn: () => fetchSalesData(storeData?.id, period),
        enabled: !!storeData?.id,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
      },
      // Recent orders query
      {
        queryKey: ['recentOrders', storeData?.id],
        queryFn: async () => {
          const result = await fetchOrders(storeData?.id, { pageSize: 5 });
          // Ensure order status conforms to OrderStatus type
          const typedOrders = result.orders.map(order => ({
            ...order,
            status: order.status as OrderStatus
          }));
          return { ...result, orders: typedOrders };
        },
        enabled: !!storeData?.id,
        staleTime: 2 * 60 * 1000, // 2 minutes
        cacheTime: 5 * 60 * 1000, // 5 minutes 
      },
      // Recent products query
      {
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
              category: 'بدون تصنيف'
            }));
          } catch (error) {
            console.error("Error fetching recent products:", error);
            return [];
          }
        },
        enabled: !!storeData?.id,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
      }
    ]
  });

  // Extract data and loading states from parallel queries
  const [statsQuery, salesQuery, ordersQuery, productsQuery] = dashboardQueries;
  
  // Determine overall loading state
  const isLoading = isStoreLoading || 
    statsQuery.isLoading || 
    salesQuery.isLoading || 
    ordersQuery.isLoading || 
    productsQuery.isLoading;
  
  // Combine all error states
  const hasError = !!storeError || 
    !!statsQuery.error || 
    !!salesQuery.error || 
    !!ordersQuery.error || 
    !!productsQuery.error;
  
  return {
    storeData,
    userName,
    statsData: statsQuery.data,
    salesData: salesQuery.data,
    ordersData: ordersQuery.data,
    productsData: productsQuery.data,
    isLoading,
    storeError,
    statsError: statsQuery.error,
    salesError: salesQuery.error,
    ordersError: ordersQuery.error,
    productsError: productsQuery.error,
    period,
    setPeriod
  };
};

export default useDashboardData;

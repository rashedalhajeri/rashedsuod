
import { supabase } from "@/integrations/supabase/client";
import { format, subDays } from "date-fns";

// Fetch dashboard statistics
export const fetchDashboardStats = async (storeId: string) => {
  try {
    // Fetch products count
    const { count: productsCount, error: productsError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', storeId);

    // Fetch orders count
    const { count: ordersCount, error: ordersError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', storeId);

    // Fetch customers count
    const { count: customersCount, error: customersError } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', storeId);

    // Fetch total revenue
    const { data: revenueData, error: revenueError } = await supabase
      .from('orders')
      .select('total')
      .eq('store_id', storeId);

    if (productsError || ordersError || customersError || revenueError) {
      console.error("Error fetching dashboard stats:", { 
        productsError, ordersError, customersError, revenueError 
      });
      return null;
    }

    // Calculate total revenue
    const totalRevenue = revenueData?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

    return {
      products: productsCount || 0,
      orders: ordersCount || 0,
      customers: customersCount || 0,
      revenue: totalRevenue
    };
  } catch (error) {
    console.error("Error in fetchDashboardStats:", error);
    return null;
  }
};

// Fetch sales data for chart
export const fetchSalesData = async (storeId: string, period = "monthly") => {
  try {
    let daysToFetch = 7; // default for weekly
    
    if (period === "monthly") {
      daysToFetch = 30;
    } else if (period === "yearly") {
      daysToFetch = 365;
    }
    
    // Format today's date
    const today = new Date();
    const formattedDate = format(today, 'yyyy-MM-dd');
    
    // Calculate start date
    const startDate = format(subDays(today, daysToFetch), 'yyyy-MM-dd');
    
    // Fetch sales data from store_stats
    const { data, error } = await supabase
      .from('store_stats')
      .select('date, total_sales')
      .eq('store_id', storeId)
      .gte('date', startDate)
      .lte('date', formattedDate)
      .order('date', { ascending: true });
    
    if (error) {
      console.error("Error fetching sales data:", error);
      return [];
    }
    
    // If no data, return empty array
    if (!data || data.length === 0) {
      return [];
    }
    
    // Transform data for chart
    const chartData = data.map(item => {
      // Format date based on period
      let name = format(new Date(item.date), "dd/MM"); // default for weekly/monthly
      
      if (period === "yearly") {
        name = format(new Date(item.date), "MMM"); // Format as month for yearly
      }
      
      return {
        name,
        value: Number(item.total_sales)
      };
    });
    
    // Aggregate data by name (date/month) if needed
    const aggregatedData = chartData.reduce((acc, item) => {
      const existingItem = acc.find(i => i.name === item.name);
      
      if (existingItem) {
        existingItem.value += item.value;
      } else {
        acc.push(item);
      }
      
      return acc;
    }, [] as { name: string, value: number }[]);
    
    return aggregatedData;
  } catch (error) {
    console.error("Error in fetchSalesData:", error);
    return [];
  }
};

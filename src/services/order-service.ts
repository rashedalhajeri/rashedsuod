
import { supabase } from "@/integrations/supabase/client";
import { Order, OrderStatus } from "@/types/orders";

interface OrderFilters {
  status?: OrderStatus | "all";
  searchQuery?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}

// Fetch orders with pagination and filters
export const fetchOrders = async (storeId: string, filters: OrderFilters = {}) => {
  try {
    const {
      status = "all",
      searchQuery = "",
      page = 0,
      pageSize = 10,
      orderBy = "created_at",
      orderDirection = "desc"
    } = filters;

    // Calculate pagination
    const from = page * pageSize;
    const to = from + pageSize - 1;

    // Build query
    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .eq('store_id', storeId)
      .order(orderBy, { ascending: orderDirection === 'asc' })
      .range(from, to);

    // Apply status filter if not "all"
    if (status !== "all") {
      query = query.eq('status', status);
    }

    // Apply search filter
    if (searchQuery) {
      query = query.or(`order_number.ilike.%${searchQuery}%,customer_name.ilike.%${searchQuery}%,customer_email.ilike.%${searchQuery}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching orders:", error);
      return { orders: [], totalCount: 0 };
    }

    return {
      orders: data || [],
      totalCount: count || 0
    };
  } catch (error) {
    console.error("Error in fetchOrders:", error);
    return { orders: [], totalCount: 0 };
  }
};

// Fetch a single order with details
export const fetchOrderDetails = async (orderId: string) => {
  try {
    // Fetch the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();

    if (orderError) {
      console.error("Error fetching order:", orderError);
      return null;
    }

    if (!order) {
      return null;
    }

    // Fetch order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) {
      console.error("Error fetching order items:", itemsError);
    }

    // Return order with items
    return {
      ...order,
      items: items || []
    };
  } catch (error) {
    console.error("Error in fetchOrderDetails:", error);
    return null;
  }
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select();

    if (error) {
      console.error("Error updating order status:", error);
      return null;
    }

    return data[0];
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    return null;
  }
};

// Delete an order
export const deleteOrder = async (orderId: string) => {
  try {
    // Delete order items first (cascade delete might handle this, but being explicit)
    const { error: itemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', orderId);

    if (itemsError) {
      console.error("Error deleting order items:", itemsError);
      return false;
    }

    // Delete the order
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) {
      console.error("Error deleting order:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteOrder:", error);
    return false;
  }
};

// Fetch order statistics
export const fetchOrderStats = async (storeId: string) => {
  try {
    // Get total count
    const { count: totalCount, error: totalError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', storeId);

    // Get processing count
    const { count: processingCount, error: processingError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', storeId)
      .eq('status', 'processing');

    // Get shipped count
    const { count: shippedCount, error: shippedError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', storeId)
      .eq('status', 'shipped');

    // Get delivered count
    const { count: deliveredCount, error: deliveredError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', storeId)
      .eq('status', 'delivered');

    // Get cancelled count
    const { count: cancelledCount, error: cancelledError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', storeId)
      .eq('status', 'cancelled');

    if (totalError || processingError || shippedError || deliveredError || cancelledError) {
      console.error("Error fetching order stats:", { 
        totalError, processingError, shippedError, deliveredError, cancelledError 
      });
      return null;
    }

    return {
      total: totalCount || 0,
      processing: processingCount || 0,
      shipped: shippedCount || 0,
      delivered: deliveredCount || 0,
      cancelled: cancelledCount || 0
    };
  } catch (error) {
    console.error("Error in fetchOrderStats:", error);
    return null;
  }
};

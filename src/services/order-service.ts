import { supabase } from "@/integrations/supabase/client";
import { Order, OrderStatus, OrderItem } from "@/types/orders";

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

    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .eq('store_id', storeId)
      .order(orderBy, { ascending: orderDirection === 'asc' })
      .range(from, to);

    if (status !== "all") {
      query = query.eq('status', status);
    }

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

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) {
      console.error("Error fetching order items:", itemsError);
    }

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
    const { error: itemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', orderId);

    if (itemsError) {
      console.error("Error deleting order items:", itemsError);
      return false;
    }

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
    const { count: totalCount, error: totalError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', storeId);

    const { count: processingCount, error: processingError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', storeId)
      .eq('status', 'processing');

    const { count: deliveredCount, error: deliveredError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', storeId)
      .eq('status', 'delivered');

    const { count: cancelledCount, error: cancelledError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', storeId)
      .eq('status', 'cancelled');

    if (totalError || processingError || deliveredError || cancelledError) {
      console.error("Error fetching order stats:", { 
        totalError, processingError, deliveredError, cancelledError 
      });
      return null;
    }

    return {
      total: totalCount || 0,
      processing: processingCount || 0,
      delivered: deliveredCount || 0,
      cancelled: cancelledCount || 0
    };
  } catch (error) {
    console.error("Error in fetchOrderStats:", error);
    return null;
  }
};

// Check if order number already exists
export const checkOrderNumberExists = async (storeId: string, orderNumber: string) => {
  try {
    const { count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', storeId)
      .eq('order_number', orderNumber);
    
    if (error) {
      console.error("Error checking order number:", error);
      return true;
    }
    
    return count ? count > 0 : false;
  } catch (error) {
    console.error("Error in checkOrderNumberExists:", error);
    return true;
  }
};

// Generate a unique order number
export const generateUniqueOrderNumber = async (storeId: string) => {
  let isUnique = false;
  let orderNumber = '';
  
  const maxAttempts = 20;
  let attempts = 0;
  
  while (!isUnique && attempts < maxAttempts) {
    const sequentialNumber = Math.floor(Math.random() * 9999) + 1;
    orderNumber = `ORD-${sequentialNumber.toString().padStart(4, '0')}`;
    
    const exists = await checkOrderNumberExists(storeId, orderNumber);
    isUnique = !exists;
    attempts++;
  }
  
  if (!isUnique) {
    const timestamp = Date.now().toString().slice(-6);
    orderNumber = `ORD-${timestamp}`;
  }
  
  return orderNumber;
};

// Create a new order with items
export const createOrder = async (storeId: string, orderData: Omit<Order, "id" | "created_at" | "updated_at">, orderItems: Omit<OrderItem, "id" | "created_at" | "order_id">[]) => {
  try {
    const orderNumber = orderData.order_number;
    const orderNumberExists = await checkOrderNumberExists(storeId, orderNumber);
    
    const finalOrderNumber = orderNumberExists 
      ? await generateUniqueOrderNumber(storeId)
      : orderNumber;
    
    const { data: orderResult, error: orderError } = await supabase
      .from('orders')
      .insert({ ...orderData, order_number: finalOrderNumber, store_id: storeId })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return null;
    }

    const order = orderResult;

    if (orderItems && orderItems.length > 0) {
      const itemsWithOrderId = orderItems.map(item => ({
        ...item,
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsWithOrderId);

      if (itemsError) {
        console.error("Error creating order items:", itemsError);
        // Consider rolling back the order here if needed
      }
    }

    return order;
  } catch (error) {
    console.error("Error in createOrder:", error);
    return null;
  }
};


import { supabase } from "@/integrations/supabase/client";
import { Order, OrderItem, OrderStatus } from "@/types/orders";
import { toast } from "sonner";

// جلب جميع الطلبات
export const fetchOrders = async (
  storeId: string, 
  options?: { 
    status?: OrderStatus | 'all',
    searchQuery?: string,
    page?: number,
    pageSize?: number,
    orderBy?: string, 
    orderDirection?: 'asc' | 'desc'
  }
) => {
  try {
    const {
      status = 'all',
      searchQuery = '',
      page = 0,
      pageSize = 10,
      orderBy = 'created_at',
      orderDirection = 'desc'
    } = options || {};

    // بناء الاستعلام
    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .eq('store_id', storeId);

    // إضافة تصفية الحالة إذا كانت محددة
    if (status !== 'all') {
      query = query.eq('status', status);
    }

    // إضافة البحث إذا كان هناك كلمة بحث
    if (searchQuery) {
      query = query.or(`order_number.ilike.%${searchQuery}%,customer_name.ilike.%${searchQuery}%,customer_email.ilike.%${searchQuery}%,customer_phone.ilike.%${searchQuery}%`);
    }

    // إضافة الترتيب والصفحات
    const from = page * pageSize;
    const to = from + pageSize - 1;
    
    const { data, error, count } = await query
      .order(orderBy, { ascending: orderDirection === 'asc' })
      .range(from, to);

    if (error) throw error;

    console.log("Fetched orders:", data);

    return { 
      orders: data as Order[], 
      totalCount: count || 0 
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    toast.error("حدث خطأ أثناء جلب الطلبات");
    return { orders: [], totalCount: 0 };
  }
};

// جلب تفاصيل طلب محدد مع عناصره
export const fetchOrderDetails = async (orderId: string) => {
  try {
    // جلب الطلب
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;

    // جلب عناصر الطلب
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        products (
          name,
          price
        )
      `)
      .eq('order_id', orderId);

    if (itemsError) throw itemsError;

    // تحويل بيانات العناصر للتنسيق المطلوب
    const items = itemsData.map(item => ({
      ...item,
      product_name: item.products?.name || "منتج محذوف"
    }));

    return {
      ...orderData,
      items
    } as Order;
  } catch (error) {
    console.error("Error fetching order details:", error);
    toast.error("حدث خطأ أثناء جلب تفاصيل الطلب");
    return null;
  }
};

// تحديث حالة الطلب
export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    const statusNames = {
      processing: "قيد المعالجة",
      shipped: "تم الشحن",
      delivered: "تم التوصيل",
      cancelled: "ملغي"
    };

    toast.success(`تم تحديث حالة الطلب إلى ${statusNames[status]}`);
    return data as Order;
  } catch (error) {
    console.error("Error updating order status:", error);
    toast.error("حدث خطأ أثناء تحديث حالة الطلب");
    return null;
  }
};

// إنشاء طلب جديد
export const createOrder = async (
  storeId: string, 
  orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>,
  orderItems?: { product_id: string; quantity: number; unit_price: number; total_price: number }[]
) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([{ 
        ...orderData, 
        store_id: storeId,
        status: orderData.status || 'processing' // تعيين الحالة الافتراضية إلى "قيد المعالجة"
      }])
      .select()
      .single();

    if (error) throw error;

    // إذا كانت هناك عناصر للطلب، قم بإضافتها
    if (orderItems && orderItems.length > 0 && data) {
      const orderItemsWithId = orderItems.map(item => ({
        ...item,
        order_id: data.id
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsWithId);

      if (itemsError) {
        console.error("Error adding order items:", itemsError);
        // في حالة حدوث خطأ، قم بحذف الطلب الذي تم إنشاؤه
        await supabase.from('orders').delete().eq('id', data.id);
        throw itemsError;
      }
    }

    toast.success("تم إنشاء الطلب بنجاح");
    return data as Order;
  } catch (error) {
    console.error("Error creating order:", error);
    toast.error("حدث خطأ أثناء إنشاء الطلب");
    return null;
  }
};

// إضافة عناصر الطلب
export const addOrderItems = async (orderItems: Omit<OrderItem, 'id' | 'created_at'>[]) => {
  try {
    const { data, error } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select();

    if (error) throw error;

    return data as OrderItem[];
  } catch (error) {
    console.error("Error adding order items:", error);
    toast.error("حدث خطأ أثناء إضافة عناصر الطلب");
    return [];
  }
};

// حذف طلب
export const deleteOrder = async (orderId: string) => {
  try {
    // أولاً نحذف عناصر الطلب
    const { error: itemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', orderId);

    if (itemsError) throw itemsError;

    // ثم نحذف الطلب نفسه
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) throw error;

    toast.success("تم حذف الطلب بنجاح");
    return true;
  } catch (error) {
    console.error("Error deleting order:", error);
    toast.error("حدث خطأ أثناء حذف الطلب");
    return false;
  }
};

// جلب إحصائيات الطلبات
export const fetchOrderStats = async (storeId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('status')
      .eq('store_id', storeId);

    if (error) throw error;

    const stats = {
      total: data.length,
      processing: data.filter(order => order.status === 'processing').length,
      shipped: data.filter(order => order.status === 'shipped').length,
      delivered: data.filter(order => order.status === 'delivered').length,
      cancelled: data.filter(order => order.status === 'cancelled').length
    };

    console.log("Order stats:", stats);
    return stats;
  } catch (error) {
    console.error("Error fetching order stats:", error);
    return {
      total: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };
  }
};

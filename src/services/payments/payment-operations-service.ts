
import { supabase } from "@/integrations/supabase/client";
import { Payment, PaymentFilters } from "./types";

// استرجاع المدفوعات مع الفلترة والبحث
export const fetchPayments = async (storeId: string, filters: PaymentFilters = {}) => {
  try {
    const {
      status = "all",
      paymentMethod = "all",
      searchQuery = "",
      startDate,
      endDate,
      page = 0,
      pageSize = 10
    } = filters;
    
    // حساب نطاق الصفحة
    const from = page * pageSize;
    const to = from + pageSize - 1;
    
    // بناء الاستعلام
    let query = supabase
      .from('payments')
      .select('*', { count: 'exact' })
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })
      .range(from, to);
    
    // تطبيق فلتر الحالة
    if (status !== "all") {
      query = query.eq('status', status);
    }
    
    // تطبيق فلتر طريقة الدفع
    if (paymentMethod !== "all") {
      query = query.eq('payment_method', paymentMethod);
    }
    
    // تطبيق فلتر البحث
    if (searchQuery) {
      query = query.or(`transaction_id.ilike.%${searchQuery}%,customer_name.ilike.%${searchQuery}%,customer_email.ilike.%${searchQuery}%`);
    }
    
    // تطبيق فلتر التاريخ
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('created_at', endDate);
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error("Error fetching payments:", error);
      return { payments: [], totalCount: 0 };
    }
    
    return {
      payments: data as Payment[],
      totalCount: count || 0
    };
  } catch (error) {
    console.error("Error in fetchPayments:", error);
    return { payments: [], totalCount: 0 };
  }
};

// استرجاع تفاصيل مدفوعة واحدة
export const fetchPaymentDetails = async (paymentId: string) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        orders:order_id (*)
      `)
      .eq('id', paymentId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching payment details:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in fetchPaymentDetails:", error);
    return null;
  }
};

// تحديث حالة الدفع
export const updatePaymentStatus = async (paymentId: string, status: Payment['status']) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update({ status })
      .eq('id', paymentId)
      .select();
    
    if (error) {
      console.error("Error updating payment status:", error);
      return null;
    }
    
    return data[0];
  } catch (error) {
    console.error("Error in updatePaymentStatus:", error);
    return null;
  }
};

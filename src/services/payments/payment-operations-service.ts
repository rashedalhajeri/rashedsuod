
import { supabase } from "@/integrations/supabase/client";
import { Payment, PaymentFilters, PaymentMethodSummary } from "./types";

// استرجاع المدفوعات مع التصفية والترتيب والصفحات
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
    
    // حساب نطاق الصفحات
    const from = page * pageSize;
    const to = from + pageSize - 1;
    
    // بناء الاستعلام الأساسي
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
      query = query.or(`customer_name.ilike.%${searchQuery}%,customer_email.ilike.%${searchQuery}%,order_id.ilike.%${searchQuery}%,transaction_id.ilike.%${searchQuery}%`);
    }
    
    // تطبيق فلتر التاريخ
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    
    if (endDate) {
      // إضافة يوم واحد للتأكد من شمول اليوم الأخير بالكامل
      const nextDay = new Date(endDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query = query.lt('created_at', nextDay.toISOString());
    }
    
    // تنفيذ الاستعلام
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

// استرجاع ملخص طرق الدفع للمتجر
export const fetchPaymentMethodsSummary = async (storeId: string): Promise<PaymentMethodSummary[]> => {
  try {
    // استرجاع جميع طرق الدفع وعدد المعاملات والمبلغ الإجمالي لكل طريقة
    const { data, error } = await supabase
      .from('payments')
      .select('payment_method, amount')
      .eq('store_id', storeId)
      .eq('status', 'successful');
    
    if (error) {
      console.error("Error fetching payment methods summary:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // تجميع البيانات حسب طريقة الدفع
    const methodSummaries: Record<string, { count: number; amount: number }> = {};
    let totalAmount = 0;
    
    data.forEach(payment => {
      const method = payment.payment_method;
      const amount = Number(payment.amount);
      
      if (!methodSummaries[method]) {
        methodSummaries[method] = { count: 0, amount: 0 };
      }
      
      methodSummaries[method].count += 1;
      methodSummaries[method].amount += amount;
      totalAmount += amount;
    });
    
    // تحويل البيانات إلى المصفوفة المطلوبة مع حساب النسب المئوية
    return Object.keys(methodSummaries).map(method => ({
      method,
      count: methodSummaries[method].count,
      amount: methodSummaries[method].amount,
      percentage: totalAmount > 0 
        ? Math.round((methodSummaries[method].amount / totalAmount) * 100) 
        : 0
    }));
  } catch (error) {
    console.error("Error in fetchPaymentMethodsSummary:", error);
    return [];
  }
};

// استرجاع طرق الدفع الفريدة للفلترة
export const fetchUniquePaymentMethods = async (storeId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('payment_method')
      .eq('store_id', storeId)
      .order('payment_method', { ascending: true });
    
    if (error) {
      console.error("Error fetching unique payment methods:", error);
      return [];
    }
    
    // استخراج القيم الفريدة
    const methods = Array.from(new Set(data.map(p => p.payment_method)));
    return methods;
  } catch (error) {
    console.error("Error in fetchUniquePaymentMethods:", error);
    return [];
  }
};

// استرجاع تفاصيل مدفوعة محددة
export const fetchPaymentDetails = async (paymentId: string): Promise<Payment | null> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching payment details:", error);
      return null;
    }
    
    return data as Payment;
  } catch (error) {
    console.error("Error in fetchPaymentDetails:", error);
    return null;
  }
};

// تحديث حالة مدفوعة
export const updatePaymentStatus = async (paymentId: string, status: Payment['status']): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('payments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', paymentId);
    
    if (error) {
      console.error("Error updating payment status:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updatePaymentStatus:", error);
    return false;
  }
};

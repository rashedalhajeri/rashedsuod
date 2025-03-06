
import { supabase } from "@/integrations/supabase/client";
import { PaymentStats } from "../types";
import { calculateAverageProcessingTime } from "../utils/calculation-utils";

// استرجاع إحصائيات المدفوعات بشكل أكثر تفصيلاً
export const fetchPaymentStats = async (storeId: string): Promise<PaymentStats | null> => {
  try {
    // إجمالي الإيرادات - فقط المدفوعات الناجحة
    const { data: totalRevenueData, error: totalRevenueError } = await supabase
      .from('payments')
      .select('amount')
      .eq('store_id', storeId)
      .eq('status', 'successful');
    
    // المبالغ المعلقة - المدفوعات التي لا تزال معلقة
    const { data: pendingAmountData, error: pendingAmountError } = await supabase
      .from('payments')
      .select('amount')
      .eq('store_id', storeId)
      .eq('status', 'pending');
    
    // المبالغ المستردة - للتحليلات الإضافية
    const { data: refundedAmountData, error: refundedAmountError } = await supabase
      .from('payments')
      .select('amount')
      .eq('store_id', storeId)
      .eq('status', 'refunded');
    
    // معدل النجاح - نسبة المدفوعات الناجحة إلى إجمالي المدفوعات
    const { count: totalCount, error: totalCountError } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', storeId);
    
    const { count: successCount, error: successCountError } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', storeId)
      .eq('status', 'successful');
    
    // متوسط قيمة المعاملة - متوسط قيمة جميع المدفوعات الناجحة
    const { data: avgTransactionData, error: avgTransactionError } = await supabase
      .from('payments')
      .select('amount')
      .eq('store_id', storeId)
      .eq('status', 'successful');
    
    // عدد المعاملات لكل طريقة دفع - لتحليل طرق الدفع الأكثر شيوعًا
    // استخدام الدالة الجديدة count_payment_methods_by_store
    const { data: paymentMethodsData, error: paymentMethodsError } = await supabase
      .rpc('count_payment_methods_by_store', { store_id_param: storeId });
    
    // متوسط وقت المعالجة - حساب متوسط الوقت بين وقت إنشاء المدفوعات ووقت تحديثها للمدفوعات الناجحة
    const { data: processingTimeData, error: processingTimeError } = await supabase
      .from('payments')
      .select('created_at, updated_at')
      .eq('store_id', storeId)
      .eq('status', 'successful')
      .neq('updated_at', 'created_at');
    
    if (totalRevenueError || pendingAmountError || refundedAmountError || 
        totalCountError || successCountError || avgTransactionError || 
        paymentMethodsError || processingTimeError) {
      console.error("Error fetching payment stats:", {
        totalRevenueError, pendingAmountError, refundedAmountError,
        totalCountError, successCountError, avgTransactionError,
        paymentMethodsError, processingTimeError
      });
      return null;
    }
    
    // حساب الإحصائيات
    const totalRevenue = totalRevenueData?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
    const pendingAmount = pendingAmountData?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
    const refundedAmount = refundedAmountData?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
    const successRate = totalCount && totalCount > 0 ? Math.round((successCount || 0) / totalCount * 100) : 0;
    
    // حساب متوسط قيمة المعاملة
    const avgTransactionValue = avgTransactionData && avgTransactionData.length > 0
      ? avgTransactionData.reduce((sum, payment) => sum + Number(payment.amount), 0) / avgTransactionData.length
      : 0;
    
    // حساب متوسط وقت المعالجة بالساعات
    const avgProcessingTime = calculateAverageProcessingTime(processingTimeData || []);
    
    // حساب احصائيات طرق الدفع باستخدام البيانات من الدالة RPC
    const paymentMethodStats: Record<string, number> = {};
    if (paymentMethodsData && Array.isArray(paymentMethodsData)) {
      paymentMethodsData.forEach(item => {
        // Fix: Convert count to number before assignment
        // The RPC function returns count as a string but we need it as a number
        paymentMethodStats[item.payment_method] = Number(item.count);
      });
    }
    
    return {
      totalRevenue,
      pendingAmount,
      refundedAmount,
      successRate,
      avgTransactionValue,
      avgTime: avgProcessingTime,
      paymentMethodStats
    };
  } catch (error) {
    console.error("Error in fetchPaymentStats:", error);
    return null;
  }
};

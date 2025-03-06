
import { supabase } from "@/integrations/supabase/client";
import { PaymentStats } from "./types";

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
    const { data: paymentMethodsData, error: paymentMethodsError } = await supabase
      .from('payments')
      .select('payment_method, count')
      .eq('store_id', storeId)
      .eq('status', 'successful')
      .group('payment_method');
    
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
    let avgProcessingTime = "24 ساعة"; // قيمة افتراضية
    if (processingTimeData && processingTimeData.length > 0) {
      const totalProcessingHours = processingTimeData.reduce((sum, payment) => {
        const createdAt = new Date(payment.created_at).getTime();
        const updatedAt = new Date(payment.updated_at).getTime();
        const diffHours = (updatedAt - createdAt) / (1000 * 60 * 60);
        return sum + diffHours;
      }, 0);
      
      const avgHours = totalProcessingHours / processingTimeData.length;
      if (avgHours < 1) {
        avgProcessingTime = `${Math.round(avgHours * 60)} دقيقة`;
      } else if (avgHours < 24) {
        avgProcessingTime = `${Math.round(avgHours)} ساعة`;
      } else {
        avgProcessingTime = `${Math.round(avgHours / 24)} يوم`;
      }
    }
    
    // تحليل طرق الدفع
    const paymentMethodStats = paymentMethodsData?.reduce((acc, item) => {
      acc[item.payment_method] = parseInt(item.count);
      return acc;
    }, {} as Record<string, number>) || {};
    
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

// استرجاع إحصائيات الاتجاه (النمو أو الانخفاض بالمقارنة مع الفترة السابقة)
export const fetchPaymentTrends = async (storeId: string): Promise<Record<string, { value: number; isPositive: boolean }> | null> => {
  try {
    // تحديد التواريخ للفترات الحالية والسابقة
    const now = new Date();
    const currentPeriodEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentPeriodStart = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const previousPeriodEnd = new Date(currentPeriodStart);
    const previousPeriodStart = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
    
    // الحصول على بيانات المدفوعات للفترة الحالية
    const { data: currentData, error: currentError } = await supabase
      .from('payments')
      .select('amount, status, created_at')
      .eq('store_id', storeId)
      .gte('created_at', currentPeriodStart.toISOString())
      .lte('created_at', currentPeriodEnd.toISOString());
    
    // الحصول على بيانات المدفوعات للفترة السابقة
    const { data: previousData, error: previousError } = await supabase
      .from('payments')
      .select('amount, status, created_at')
      .eq('store_id', storeId)
      .gte('created_at', previousPeriodStart.toISOString())
      .lte('created_at', previousPeriodEnd.toISOString());
    
    if (currentError || previousError) {
      console.error("Error fetching payment trends:", { currentError, previousError });
      return null;
    }
    
    // حساب إجمالي الإيرادات للفترتين
    const currentRevenue = currentData
      ?.filter(payment => payment.status === 'successful')
      .reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
      
    const previousRevenue = previousData
      ?.filter(payment => payment.status === 'successful')
      .reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
    
    // حساب معدل نجاح المدفوعات للفترتين
    const currentSuccessCount = currentData?.filter(payment => payment.status === 'successful').length || 0;
    const currentTotalCount = currentData?.length || 0;
    const currentSuccessRate = currentTotalCount > 0 ? (currentSuccessCount / currentTotalCount) * 100 : 0;
    
    const previousSuccessCount = previousData?.filter(payment => payment.status === 'successful').length || 0;
    const previousTotalCount = previousData?.length || 0;
    const previousSuccessRate = previousTotalCount > 0 ? (previousSuccessCount / previousTotalCount) * 100 : 0;
    
    // حساب نسب التغيير
    const revenueTrend = calculateTrend(previousRevenue, currentRevenue);
    const successRateTrend = calculateTrend(previousSuccessRate, currentSuccessRate);
    
    return {
      revenue: revenueTrend,
      successRate: successRateTrend
    };
  } catch (error) {
    console.error("Error in fetchPaymentTrends:", error);
    return null;
  }
};

// وظيفة مساعدة لحساب نسبة التغيير
const calculateTrend = (previous: number, current: number): { value: number; isPositive: boolean } => {
  if (previous === 0) {
    return { value: current > 0 ? 100 : 0, isPositive: current > 0 };
  }
  
  const percentChange = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(Math.round(percentChange)),
    isPositive: percentChange >= 0
  };
};

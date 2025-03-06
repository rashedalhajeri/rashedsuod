
import { supabase } from "@/integrations/supabase/client";
import { calculateTrend } from "../utils/calculation-utils";

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

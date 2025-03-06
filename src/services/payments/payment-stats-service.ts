
import { supabase } from "@/integrations/supabase/client";
import { PaymentStats } from "./types";

// استرجاع إحصائيات المدفوعات
export const fetchPaymentStats = async (storeId: string): Promise<PaymentStats | null> => {
  try {
    // إجمالي الإيرادات
    const { data: totalRevenueData, error: totalRevenueError } = await supabase
      .from('payments')
      .select('amount')
      .eq('store_id', storeId)
      .eq('status', 'successful');
    
    // المبالغ المعلقة
    const { data: pendingAmountData, error: pendingAmountError } = await supabase
      .from('payments')
      .select('amount')
      .eq('store_id', storeId)
      .eq('status', 'pending');
    
    // معدل النجاح
    const { count: totalCount, error: totalCountError } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', storeId);
    
    const { count: successCount, error: successCountError } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', storeId)
      .eq('status', 'successful');
    
    if (totalRevenueError || pendingAmountError || totalCountError || successCountError) {
      console.error("Error fetching payment stats:", {
        totalRevenueError, pendingAmountError, totalCountError, successCountError
      });
      return null;
    }
    
    const totalRevenue = totalRevenueData?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
    const pendingAmount = pendingAmountData?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
    const successRate = totalCount && totalCount > 0 ? Math.round((successCount || 0) / totalCount * 100) : 0;
    
    return {
      totalRevenue,
      pendingAmount,
      successRate,
      avgTime: "24 ساعة" // قيمة ثابتة في الوقت الحالي، يمكن حسابها في المستقبل
    };
  } catch (error) {
    console.error("Error in fetchPaymentStats:", error);
    return null;
  }
};

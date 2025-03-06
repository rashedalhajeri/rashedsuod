
import { supabase } from "@/integrations/supabase/client";
import { PaymentChartData } from "../types";

// استرجاع بيانات اتجاه المدفوعات (خلال اليوم)
export const fetchDailyPaymentTrend = async (storeId: string): Promise<PaymentChartData[]> => {
  try {
    // تحديد بداية ونهاية اليوم الحالي
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // استرجاع المدفوعات اليومية
    const { data, error } = await supabase
      .from('payments')
      .select('created_at, amount, status')
      .eq('store_id', storeId)
      .gte('created_at', startOfToday.toISOString())
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error("Error fetching daily payment trend:", error);
      return [];
    }
    
    if (!data || data.length === 0) return [];
    
    // تقسيم اليوم إلى فترات من 3 ساعات
    const hoursSegments = [
      { name: 'صباحًا (12-6)', startHour: 0, endHour: 6 },
      { name: 'صباحًا (6-12)', startHour: 6, endHour: 12 },
      { name: 'مساءً (12-6)', startHour: 12, endHour: 18 },
      { name: 'مساءً (6-12)', startHour: 18, endHour: 24 }
    ];
    
    // تجميع البيانات حسب الفترات
    const segmentData = hoursSegments.map(segment => {
      const segmentPayments = data.filter(payment => {
        const hour = new Date(payment.created_at).getHours();
        return hour >= segment.startHour && hour < segment.endHour;
      });
      
      const segmentTotal = segmentPayments.reduce((sum, payment) => {
        if (payment.status === 'successful') {
          return sum + Number(payment.amount);
        }
        return sum;
      }, 0);
      
      return {
        name: segment.name,
        value: segmentTotal
      };
    });
    
    return segmentData;
  } catch (error) {
    console.error("Error in fetchDailyPaymentTrend:", error);
    return [];
  }
};

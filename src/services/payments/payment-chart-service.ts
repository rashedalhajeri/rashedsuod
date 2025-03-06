
import { supabase } from "@/integrations/supabase/client";
import { PaymentChartData } from "./types";

// استرجاع بيانات الرسم البياني للمدفوعات
export const fetchPaymentChartData = async (storeId: string, period: string = "monthly"): Promise<PaymentChartData[]> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('created_at, amount, status')
      .eq('store_id', storeId)
      .eq('status', 'successful')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error("Error fetching payment chart data:", error);
      return [];
    }
    
    if (!data || data.length === 0) return [];
    
    let results: PaymentChartData[] = [];
    
    if (period === "daily") {
      // تجميع البيانات حسب اليوم
      const groupedByDay = data.reduce((acc: Record<string, number>, payment) => {
        const date = new Date(payment.created_at);
        const dayName = new Intl.DateTimeFormat('ar-EG', { weekday: 'long' }).format(date);
        
        if (!acc[dayName]) {
          acc[dayName] = 0;
        }
        acc[dayName] += Number(payment.amount);
        return acc;
      }, {});
      
      results = Object.keys(groupedByDay).map(day => ({
        name: day,
        value: groupedByDay[day]
      }));
    } else if (period === "weekly") {
      // تجميع البيانات حسب الأسبوع
      const groupedByWeek = data.reduce((acc: Record<string, number>, payment) => {
        const date = new Date(payment.created_at);
        const weekNumber = Math.ceil((date.getDate() + ((date.getDay() + 1) % 7)) / 7);
        const weekName = `الأسبوع ${weekNumber}`;
        
        if (!acc[weekName]) {
          acc[weekName] = 0;
        }
        acc[weekName] += Number(payment.amount);
        return acc;
      }, {});
      
      results = Object.keys(groupedByWeek).map(week => ({
        name: week,
        value: groupedByWeek[week]
      }));
    } else {
      // تجميع البيانات حسب الشهر
      const groupedByMonth = data.reduce((acc: Record<string, number>, payment) => {
        const date = new Date(payment.created_at);
        const monthName = new Intl.DateTimeFormat('ar-EG', { month: 'long' }).format(date);
        
        if (!acc[monthName]) {
          acc[monthName] = 0;
        }
        acc[monthName] += Number(payment.amount);
        return acc;
      }, {});
      
      results = Object.keys(groupedByMonth).map(month => ({
        name: month,
        value: groupedByMonth[month]
      }));
    }
    
    return results;
  } catch (error) {
    console.error("Error in fetchPaymentChartData:", error);
    return [];
  }
};

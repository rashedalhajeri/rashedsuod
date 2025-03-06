
import { supabase } from "@/integrations/supabase/client";
import { PaymentChartData } from "../types";

// استرجاع بيانات الرسم البياني للمدفوعات مع تحسينات متعددة
export const fetchPaymentChartData = async (storeId: string, period: string = "monthly"): Promise<PaymentChartData[]> => {
  try {
    // تحديد النطاق الزمني
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case "daily":
        // آخر 7 أيام
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "weekly":
        // آخر 4 أسابيع
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 28);
        break;
      default: // monthly
        // آخر 6 أشهر
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 6);
    }
    
    // تنسيق التاريخ للاستعلام
    const formattedStartDate = startDate.toISOString();
    
    // استرجاع بيانات المدفوعات الناجحة
    const { data, error } = await supabase
      .from('payments')
      .select('created_at, amount, status')
      .eq('store_id', storeId)
      .eq('status', 'successful')
      .gte('created_at', formattedStartDate)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error("Error fetching payment chart data:", error);
      return [];
    }
    
    if (!data || data.length === 0) return [];
    
    // استرجاع البيانات المجمعة حسب الفترة
    switch (period) {
      case "daily":
        return aggregateDataByDay(data);
      case "weekly":
        return aggregateDataByWeek(data);
      default: // monthly
        return aggregateDataByMonth(data);
    }
  } catch (error) {
    console.error("Error in fetchPaymentChartData:", error);
    return [];
  }
};

// تجميع البيانات حسب اليوم
const aggregateDataByDay = (data: any[]): PaymentChartData[] => {
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
  
  // ترتيب الأيام بشكل صحيح
  const daysOrder = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  return daysOrder
    .filter(day => groupedByDay[day] !== undefined)
    .map(day => ({
      name: day,
      value: groupedByDay[day]
    }));
};

// تجميع البيانات حسب الأسبوع
const aggregateDataByWeek = (data: any[]): PaymentChartData[] => {
  // تجميع البيانات حسب الأسبوع
  const groupedByWeek: Record<string, number> = {};
  
  data.forEach(payment => {
    const date = new Date(payment.created_at);
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const weekNumber = Math.ceil((date.getDate() + startOfMonth.getDay() - 1) / 7);
    const monthName = new Intl.DateTimeFormat('ar-EG', { month: 'short' }).format(date);
    const weekName = `الأسبوع ${weekNumber} - ${monthName}`;
    
    if (!groupedByWeek[weekName]) {
      groupedByWeek[weekName] = 0;
    }
    groupedByWeek[weekName] += Number(payment.amount);
  });
  
  // ترتيب الأسابيع بترتيب زمني
  const sortedWeeks = Object.keys(groupedByWeek).sort((a, b) => {
    const aWeekNum = parseInt(a.split(' ')[1]);
    const bWeekNum = parseInt(b.split(' ')[1]);
    const aMonth = a.split(' - ')[1];
    const bMonth = b.split(' - ')[1];
    
    // ترتيب حسب الشهر ثم حسب رقم الأسبوع
    const months = ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const aMonthIdx = months.indexOf(aMonth);
    const bMonthIdx = months.indexOf(bMonth);
    
    if (aMonthIdx !== bMonthIdx) return aMonthIdx - bMonthIdx;
    return aWeekNum - bWeekNum;
  });
  
  return sortedWeeks.map(week => ({
    name: week,
    value: groupedByWeek[week]
  }));
};

// تجميع البيانات حسب الشهر
const aggregateDataByMonth = (data: any[]): PaymentChartData[] => {
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
  
  // ترتيب الأشهر بترتيب زمني
  const months = ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  
  // فلترة الأشهر التي لدينا بيانات لها فقط
  const presentMonths = Object.keys(groupedByMonth);
  
  // رسم بياني للأشهر الأخيرة فقط (حتى 6 أشهر)
  const recentMonths = [...months.slice(-6), ...months.slice(0, 6)]
    .filter(month => presentMonths.includes(month))
    .slice(-6);
  
  return recentMonths.map(month => ({
    name: month,
    value: groupedByMonth[month]
  }));
};

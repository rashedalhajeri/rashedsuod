
import { supabase } from "@/integrations/supabase/client";

export interface Payment {
  id: string;
  store_id: string;
  order_id: string;
  amount: number;
  status: "successful" | "failed" | "pending" | "refunded";
  payment_method: string;
  transaction_id: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  created_at: string;
  updated_at: string;
}

interface PaymentFilters {
  status?: "successful" | "failed" | "pending" | "refunded" | "all";
  paymentMethod?: string;
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

// استرجاع إحصائيات المدفوعات
export const fetchPaymentStats = async (storeId: string) => {
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

// استرجاع بيانات الرسم البياني للمدفوعات
export const fetchPaymentChartData = async (storeId: string, period: string = "monthly") => {
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
    
    let results = [];
    
    if (period === "daily") {
      // تجميع البيانات حسب اليوم
      const groupedByDay = data.reduce((acc, payment) => {
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
      const groupedByWeek = data.reduce((acc, payment) => {
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
      const groupedByMonth = data.reduce((acc, payment) => {
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
export const updatePaymentStatus = async (paymentId: string, status: "successful" | "failed" | "pending" | "refunded") => {
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

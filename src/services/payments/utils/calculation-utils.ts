
// وظيفة مساعدة لحساب نسبة التغيير
export const calculateTrend = (previous: number, current: number): { value: number; isPositive: boolean } => {
  if (previous === 0) {
    return { value: current > 0 ? 100 : 0, isPositive: current > 0 };
  }
  
  const percentChange = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(Math.round(percentChange)),
    isPositive: percentChange >= 0
  };
};

// حساب متوسط وقت المعالجة بالساعات
export const calculateAverageProcessingTime = (processingTimeData: { created_at: string; updated_at: string }[]): string => {
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
  
  return avgProcessingTime;
};

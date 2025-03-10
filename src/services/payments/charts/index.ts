
// مصدر بيانات الرسوم البيانية للمدفوعات

// نموذج بيانات المبيعات الشهرية
export const monthlySalesData = [
  { name: "يناير", value: 1200 },
  { name: "فبراير", value: 1900 },
  { name: "مارس", value: 1500 },
  { name: "أبريل", value: 2200 },
  { name: "مايو", value: 2800 },
  { name: "يونيو", value: 2100 },
  { name: "يوليو", value: 3200 },
  { name: "أغسطس", value: 2800 },
  { name: "سبتمبر", value: 3500 },
  { name: "أكتوبر", value: 2900 },
  { name: "نوفمبر", value: 3800 },
  { name: "ديسمبر", value: 4200 }
];

// نموذج بيانات المبيعات الأسبوعية
export const weeklySalesData = [
  { name: "الأسبوع 1", value: 320 },
  { name: "الأسبوع 2", value: 280 },
  { name: "الأسبوع 3", value: 350 },
  { name: "الأسبوع 4", value: 420 }
];

// نموذج بيانات المبيعات اليومية
export const dailySalesData = [
  { name: "السبت", value: 48 },
  { name: "الأحد", value: 52 },
  { name: "الإثنين", value: 71 },
  { name: "الثلاثاء", value: 65 },
  { name: "الأربعاء", value: 58 },
  { name: "الخميس", value: 75 },
  { name: "الجمعة", value: 85 }
];

// نموذج بيانات المدفوعات حسب الطريقة
export const paymentMethodsData = [
  { name: "بطاقة الائتمان", value: 45 },
  { name: "الدفع عند الاستلام", value: 30 },
  { name: "المحفظة الإلكترونية", value: 15 },
  { name: "تحويل بنكي", value: 10 }
];

// بيانات أدوات التحليل
export const analyticsData = {
  conversionRate: 3.2,
  averageOrderValue: 120,
  returnRate: 2.5,
  customerRetention: 65
};

// وظيفة للحصول على بيانات المبيعات حسب الفترة المحددة
export const getSalesDataByPeriod = (period: 'daily' | 'weekly' | 'monthly') => {
  switch (period) {
    case 'daily':
      return dailySalesData;
    case 'weekly':
      return weeklySalesData;
    case 'monthly':
    default:
      return monthlySalesData;
  }
};

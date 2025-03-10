
// يحتوي هذا الملف على البيانات والوظائف المساعدة لرسومات الإحصائيات

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
}

export const generateMockData = (months: number = 12): ChartDataPoint[] => {
  const mockData: ChartDataPoint[] = [];
  const currentDate = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('ar-SA', { month: 'short' });
    mockData.push({
      name: monthName,
      value: Math.floor(Math.random() * 10000) + 1000
    });
  }
  
  return mockData;
};

export const generateMultiSeriesMockData = (
  seriesCount: number = 2,
  months: number = 12
): ChartSeries[] => {
  const series: ChartSeries[] = [];
  const seriesNames = ["المبيعات", "المصروفات", "الأرباح"];
  
  for (let i = 0; i < seriesCount; i++) {
    series.push({
      name: seriesNames[i],
      data: generateMockData(months)
    });
  }
  
  return series;
};

export const calculateYAxisDomain = (data: ChartDataPoint[]): [number, number] => {
  const values = data.map(item => item.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  // Round to nice numbers
  const minNice = Math.floor(min / 100) * 100;
  const maxNice = Math.ceil(max / 100) * 100 + 100;
  
  return [minNice, maxNice];
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency', 
    currency: 'SAR',
    maximumFractionDigits: 0
  }).format(value);
};

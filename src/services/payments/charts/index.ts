
// Basic chart data exports

export interface ChartDataPoint {
  name: string;
  value: number;
}

export type ChartData = ChartDataPoint[];

// Sample chart data for payments
export const generateSampleChartData = (days: number = 7): ChartData => {
  const data: ChartData = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - (days - i - 1));
    
    data.push({
      name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.floor(Math.random() * 100) + 50
    });
  }
  
  return data;
};

// Export default chart data
export const defaultChartData: ChartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 700 },
  { name: 'Jun', value: 900 },
  { name: 'Jul', value: 1000 }
];

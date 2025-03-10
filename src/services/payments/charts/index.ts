
// Payment chart services

// Example data for a payment chart
export const getPaymentChartData = (storeId: string, period: string = "monthly") => {
  // This would typically fetch from an API, but we're returning mock data for now
  const mockData = [
    { date: '2023-01', amount: 1200 },
    { date: '2023-02', amount: 1800 },
    { date: '2023-03', amount: 2200 },
    { date: '2023-04', amount: 1900 },
    { date: '2023-05', amount: 2400 },
    { date: '2023-06', amount: 2600 }
  ];
  
  return mockData;
};

// Function to get chart configuration
export const getChartConfig = (currency: string = "SAR") => {
  return {
    showGrid: true,
    showTooltip: true,
    currency
  };
};

// Function to format chart data
export const formatChartData = (data: any[], config: any) => {
  return data.map(item => ({
    ...item,
    formattedAmount: new Intl.NumberFormat('ar-SA', {
      style: 'currency', 
      currency: config.currency
    }).format(item.amount)
  }));
};

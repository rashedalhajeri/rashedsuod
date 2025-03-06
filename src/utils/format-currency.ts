
/**
 * Format currency with proper locale and format
 * @param price The price value to format
 * @param currency The currency code (default: SAR)
 * @returns Formatted currency string
 */
export const formatCurrency = (price: number, currency = 'SAR') => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currency
  }).format(price);
};

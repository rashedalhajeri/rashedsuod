
/**
 * Format currency with proper locale
 */
export const formatCurrency = (price: number, currency = 'KWD') => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  }).format(price);
};

/**
 * Convert any Supabase JSON value to string array safely
 */
export const convertToStringArray = (value: any): string[] | null => {
  if (!value) {
    return null;
  }
  
  if (Array.isArray(value)) {
    // Ensure all array elements are strings
    return value.map(item => String(item));
  }
  
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(item => String(item)) : null;
    } catch (e) {
      console.error("Error parsing string to array:", e);
      return null;
    }
  }
  
  return null;
};

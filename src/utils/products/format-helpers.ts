
/**
 * Create a formatter function for a currency
 * @param currency Currency code (default: 'KWD')
 * @param locale Locale for formatting (default: 'en-US')
 * @returns Formatter function
 */
export const createCurrencyFormatter = (currency: string = 'KWD', locale: string = 'en-US') => {
  return (value: number) => {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(value);
  };
};

/**
 * Format a currency value directly
 * @param value The numeric value to format
 * @param currency The currency code
 * @param locale The locale for formatting
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number, currency: string = 'KWD', locale: string = 'en-US'): string => {
  return createCurrencyFormatter(currency, locale)(value);
};

/**
 * Convert any type to a string array
 * @param value The value to convert
 * @returns String array
 */
export const convertToStringArray = (value: any): string[] => {
  if (!value) return [];
  
  if (Array.isArray(value)) {
    return value.map(item => String(item));
  }
  
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map(item => String(item));
      }
      return [value];
    } catch (e) {
      return [value];
    }
  }
  
  return [];
};

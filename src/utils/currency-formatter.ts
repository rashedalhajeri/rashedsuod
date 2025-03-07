
/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param locale - The locale to use (default: ar-SA)
 * @param currency - The currency to use (default: SAR)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  locale: string = "ar-SA",
  currency: string = "SAR"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(amount);
};

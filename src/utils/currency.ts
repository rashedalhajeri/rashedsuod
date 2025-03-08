
/**
 * Formats a number as currency using the browser's Intl API
 * @param amount The amount to format
 * @param currency The currency code (default: KWD for Kuwaiti Dinar)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = "KWD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(amount);
}

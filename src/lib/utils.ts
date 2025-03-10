
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  // Ensure numbers are displayed in English format regardless of locale
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KWD', // دائما الدينار الكويتي
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  });
  
  // Get the formatted string
  let formattedPrice = formatter.format(price);
  
  // Force English digits in the output
  formattedPrice = formattedPrice.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
  
  return formattedPrice;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // التحقق من صحة التاريخ
  if (isNaN(date.getTime())) return '';
  
  // تنسيق بسيط ليوم-شهر-سنة - حرص على أن تكون الأرقام بالإنجليزية
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

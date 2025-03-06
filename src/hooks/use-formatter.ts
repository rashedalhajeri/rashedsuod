
import { getCurrencyFormatter } from "@/hooks/use-store-data";
import { useStoreData } from "@/hooks/use-store-data";

export const useFormatter = () => {
  const { data: storeData } = useStoreData();
  
  const currency = (amount: number | string) => {
    const formatCurrency = getCurrencyFormatter(storeData?.currency || "SAR");
    return formatCurrency(typeof amount === "string" ? parseFloat(amount) : amount);
  };
  
  const date = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    // استخدام صيغة تاريخ عربية
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  };
  
  const number = (num: number | string, maximumFractionDigits = 2) => {
    return new Intl.NumberFormat('ar-SA', {
      maximumFractionDigits
    }).format(typeof num === "string" ? parseFloat(num) : num);
  };
  
  const percent = (value: number | string) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return `${num.toFixed(1)}%`;
  };
  
  return {
    currency,
    date,
    number,
    percent
  };
};

export default useFormatter;

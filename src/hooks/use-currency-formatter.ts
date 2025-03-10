
import { useStoreData } from "./use-store-data";

export type CurrencyFormatterOptions = {
  style?: "decimal" | "currency";
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  useGrouping?: boolean;
};

export const useCurrencyFormatter = (options: CurrencyFormatterOptions = {}) => {
  const { data: storeData } = useStoreData();
  // دائمًا استخدم الدينار الكويتي كعملة افتراضية، بغض النظر عن قيمة storeData
  const currency = "KWD";
  
  const {
    style = "currency",
    minimumFractionDigits = 3,
    maximumFractionDigits = 3,
    useGrouping = true
  } = options;
  
  const formatter = new Intl.NumberFormat("en-US", {
    style: style === "currency" ? "currency" : "decimal",
    currency: style === "currency" ? currency : undefined,
    minimumFractionDigits,
    maximumFractionDigits,
    useGrouping
  });
  
  return (value: number) => formatter.format(value);
};

// Export a standalone version that doesn't require the hook context
export const createCurrencyFormatter = (
  currency: string = "KWD",
  options: CurrencyFormatterOptions = {}
) => {
  // تجاهل المعلمة المدخلة واستخدام KWD دائمًا
  const actualCurrency = "KWD";
  
  const {
    style = "currency",
    minimumFractionDigits = 3,
    maximumFractionDigits = 3,
    useGrouping = true
  } = options;
  
  const formatter = new Intl.NumberFormat("en-US", {
    style: style === "currency" ? "currency" : "decimal",
    currency: style === "currency" ? actualCurrency : undefined,
    minimumFractionDigits,
    maximumFractionDigits,
    useGrouping
  });
  
  return (value: number) => formatter.format(value);
};

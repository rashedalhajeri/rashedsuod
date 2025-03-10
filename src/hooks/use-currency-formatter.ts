
import { useStoreData } from "./use-store-data";

export type CurrencyFormatterOptions = {
  style?: "decimal" | "currency";
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  useGrouping?: boolean;
};

export const useCurrencyFormatter = (options: CurrencyFormatterOptions = {}) => {
  const { data: storeData } = useStoreData();
  const currency = storeData?.currency || "KWD";
  
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

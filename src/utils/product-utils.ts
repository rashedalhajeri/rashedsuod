
import { supabase } from "@/integrations/supabase/client";

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
 * Handle image loading errors and return a fallback image URL
 * @param imageUrl The original image URL
 * @param fallbackUrl The fallback URL (default: '/placeholder.svg')
 * @returns Either the original URL or the fallback URL
 */
export const getImageWithFallback = (imageUrl: string | null, fallbackUrl: string = '/placeholder.svg'): string => {
  if (!imageUrl) return fallbackUrl;
  return imageUrl;
};

/**
 * Get a store's products with filtering options
 * @param storeId The ID of the store
 * @param options Options for filtering and sorting
 * @returns Promise with the products array
 */
export const getStoreProducts = async (
  storeId: string,
  options: {
    categoryId?: string;
    featured?: boolean;
    onSale?: boolean;
    sort?: 'latest' | 'price_low' | 'price_high' | 'best_selling';
    limit?: number;
  } = {}
) => {
  try {
    let query = supabase.from('products').select('*').eq('store_id', storeId);
    
    // Apply filters
    if (options.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }
    
    if (options.featured) {
      query = query.eq('is_featured', true);
    }
    
    if (options.onSale) {
      query = query.not('discount_price', 'is', null);
    }
    
    // Apply sorting
    switch (options.sort) {
      case 'price_low':
        query = query.order('price', { ascending: true });
        break;
      case 'price_high':
        query = query.order('price', { ascending: false });
        break;
      case 'best_selling':
        query = query.order('sales_count', { ascending: false });
        break;
      case 'latest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }
    
    // Apply limit
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching store products:", error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error("Error in getStoreProducts:", err);
    return [];
  }
};

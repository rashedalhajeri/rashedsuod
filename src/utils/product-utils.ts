
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

// Define a return type for our query to avoid deep type instantiation
type StoreProductsReturn = Promise<any[]>;

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
): StoreProductsReturn => {
  try {
    // Build query in stages with proper typing
    const baseQuery = supabase
      .from('products')
      .select('*');

    // First filter by store ID
    let query = baseQuery.eq('store_id', storeId);
    
    // Apply additional filters with proper type handling
    if (options.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }
    
    if (options.featured) {
      query = query.eq('is_featured', true);
    }
    
    if (options.onSale) {
      query = query.not('discount_price', 'is', null);
    }
    
    // Apply sorting based on options
    let sortedQuery = query;
    if (options.sort === 'price_low') {
      sortedQuery = query.order('price', { ascending: true });
    } else if (options.sort === 'price_high') {
      sortedQuery = query.order('price', { ascending: false });
    } else if (options.sort === 'best_selling') {
      sortedQuery = query.order('sales_count', { ascending: false });
    } else {
      // default to latest
      sortedQuery = query.order('created_at', { ascending: false });
    }
    
    // Apply limit if specified
    const finalQuery = options.limit 
      ? sortedQuery.limit(options.limit)
      : sortedQuery;
    
    // Execute query and handle response
    const { data, error } = await finalQuery;
    
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

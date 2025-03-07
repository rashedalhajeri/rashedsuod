
/**
 * DEPRECATED: Use the individual modules in the /products/ directory instead
 * @deprecated
 */

import { supabase } from "@/integrations/supabase/client";

/**
 * DEPRECATED: Use createCurrencyFormatter from format-helpers.ts instead
 * @deprecated
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
 * DEPRECATED: Use getImageWithFallback from image-helpers.ts instead
 * @deprecated
 */
export const getImageWithFallback = (imageUrl: string | null, fallbackUrl: string = '/placeholder.svg'): string => {
  if (!imageUrl) return fallbackUrl;
  return imageUrl;
};

/**
 * DEPRECATED: Use fetchProductsWithFilters from product-fetchers.ts instead
 * @deprecated
 */
export const getStoreProducts = async (
  storeId: string,
  options: any = {}
): Promise<any[]> => {
  try {
    // Break the reference chain to avoid TypeScript's deep instantiation error
    let query = supabase.from('products').select('*');
    
    // Apply store filter
    query = query.eq('store_id', storeId);
    
    // Apply additional filters
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
    if (options.sort === 'price_low') {
      query = query.order('price', { ascending: true });
    } else if (options.sort === 'price_high') {
      query = query.order('price', { ascending: false });
    } else if (options.sort === 'best_selling') {
      query = query.order('sales_count', { ascending: false });
    } else {
      // Default to latest
      query = query.order('created_at', { ascending: false });
    }
    
    // Apply limit if specified
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    // Execute the query
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

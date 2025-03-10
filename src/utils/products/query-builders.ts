
import { SupabaseClient } from '@supabase/supabase-js';

export const buildProductQuery = (
  supabase: SupabaseClient,
  sectionType: string,
  storeId?: string,
  categoryId?: string,
  sectionId?: string,
  limit: number = 25
) => {
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name)
    `);

  // Add store filter if provided
  if (storeId) {
    query = query.eq('store_id', storeId);
  }
  
  // Only active products
  query = query.eq('is_active', true);

  // Add section-specific filters
  switch (sectionType) {
    case 'best_selling':
      // Get best selling products
      query = query
        .order('sales_count', { ascending: false })
        .limit(limit);
      break;
      
    case 'new_arrivals':
      // Get newest products
      query = query
        .order('created_at', { ascending: false })
        .limit(limit);
      break;
      
    case 'featured':
      // Get featured products
      query = query
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);
      break;
      
    case 'on_sale':
      // Get products with discount price
      query = query
        .not('discount_price', 'is', null)
        .order('created_at', { ascending: false })
        .limit(limit);
      break;
      
    case 'category':
      // Get products from a specific category
      if (categoryId) {
        query = query
          .eq('category_id', categoryId)
          .order('created_at', { ascending: false })
          .limit(limit);
      }
      break;
      
    case 'custom':
      // Custom section - need to get product_ids from section first
      if (sectionId) {
        // This is a bit more complex - we'll need to fetch the section first
        // to get the product_ids, then use them in the query
        // This will be handled separately
      }
      break;
      
    default:
      query = query.order('created_at', { ascending: false }).limit(limit);
  }

  return query;
};

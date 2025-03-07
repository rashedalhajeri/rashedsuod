
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Build product query based on section type and filters
 */
export const buildProductQuery = (
  supabase: SupabaseClient,
  sectionType: string,
  storeId?: string,
  categoryId?: string,
  sectionId?: string,
  limit?: number
) => {
  let query = supabase.from('products').select('*');
  
  // Add store filter if provided
  if (storeId) {
    query = query.eq('store_id', storeId);
  }
  
  // Apply section-specific filters
  switch (sectionType) {
    case 'best_selling':
      query = query.order('sales_count', { ascending: false });
      break;
      
    case 'category':
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      query = query.order('created_at', { ascending: false });
      break;
      
    case 'featured':
      query = query.eq('is_featured', true)
        .order('created_at', { ascending: false });
      break;
      
    case 'on_sale':
      query = query.not('discount_price', 'is', null)
        .order('created_at', { ascending: false });
      break;
      
    case 'custom':
      if (sectionId) {
        query = query.eq('section_id', sectionId);
      }
      query = query.order('created_at', { ascending: false });
      break;
      
    default:
      // Default: fetch all products with basic sorting
      query = query.order('created_at', { ascending: false });
      break;
  }
  
  // Apply limit if specified
  if (limit && limit > 0) {
    query = query.limit(limit);
  }
  
  return query;
};

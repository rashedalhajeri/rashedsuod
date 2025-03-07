
import { SupabaseClient } from '@supabase/supabase-js';

// Simple function to help build safe queries
export const createSafeQueryBuilder = () => {
  return {
    buildSortClause: (sort: string | undefined): { column: string; ascending: boolean } => {
      switch (sort) {
        case 'price_low':
          return { column: 'price', ascending: true };
        case 'price_high':
          return { column: 'price', ascending: false };
        case 'best_selling':
          return { column: 'sales_count', ascending: false };
        default:
          return { column: 'created_at', ascending: false };
      }
    }
  };
};

/**
 * Builds a query for fetching products based on section type and filters
 */
export const buildProductQuery = (
  supabase: SupabaseClient, 
  sectionType: string,
  storeId?: string,
  categoryId?: string,
  sectionId?: string,
  limit?: number,
  includeArchived: boolean = false
) => {
  let query = supabase.from('products').select('*, category:categories(*)');
  
  // Apply store filter
  if (storeId) {
    query = query.eq('store_id', storeId);
  }
  
  // Apply category filter
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  // Filter out archived products by default unless explicitly included
  if (!includeArchived) {
    query = query.eq('is_archived', false);
  }
  
  // Apply section type specific filters
  switch (sectionType) {
    case 'featured':
      query = query.eq('is_featured', true);
      break;
    case 'best_selling':
      query = query.order('sales_count', { ascending: false });
      break;
    case 'on_sale':
      query = query.not('discount_price', 'is', null);
      break;
    case 'archived':
      query = query.eq('is_archived', true);
      break;
    default:
      // For custom sections, could add more logic here
      break;
  }
  
  // Apply default sorting if best_selling wasn't already set
  if (sectionType !== 'best_selling') {
    query = query.order('created_at', { ascending: false });
  }
  
  // Apply limit if specified
  if (limit && limit > 0) {
    query = query.limit(limit);
  }
  
  return query;
};

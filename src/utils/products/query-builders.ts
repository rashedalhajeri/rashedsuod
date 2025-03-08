
import { Database } from '@/integrations/supabase/types';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Builds a query to fetch products with various filters
 */
export const buildProductQuery = (
  supabase: SupabaseClient<Database>,
  sectionType: string,
  storeId?: string,
  categoryId?: string,
  sectionId?: string,
  limit?: number,
  includeArchived: boolean = false
) => {
  // Start with a base query
  let query = supabase
    .from('products')
    .select('*, category:categories(name)')
    .eq('is_active', true); // Make sure only active products are shown
    
  // Only include non-archived products unless specifically requested
  if (!includeArchived) {
    query = query.eq('is_archived', false);
  }

  console.log(`Building query for sectionType: ${sectionType}`);

  // Filter by store if provided
  if (storeId) {
    query = query.eq('store_id', storeId);
  }

  // Filter by category if provided
  if (categoryId && categoryId !== 'all' && categoryId !== 'none') {
    query = query.eq('category_id', categoryId);
    console.log(`Filtering by category_id: ${categoryId}`);
  }

  // Filter by section if provided
  if (sectionId && sectionId !== 'all' && sectionId !== 'none') {
    query = query.eq('section_id', sectionId);
    console.log(`Filtering by section_id: ${sectionId}`);
  }

  // Apply additional filters based on sectionType
  switch (sectionType) {
    case 'best_selling':
      query = query.order('sales_count', { ascending: false });
      break;
    case 'new_arrivals':
      query = query.order('created_at', { ascending: false });
      break;
    case 'featured':
      query = query.eq('is_featured', true);
      break;
    case 'on_sale':
      query = query.not('discount_price', 'is', null);
      break;
    case 'category':
      // Already filtered by category_id above
      break;
    case 'custom':
      // For custom sections, filtering by section_id above is enough
      break;
    default:
      // Default sorting for 'all' and other types
      query = query.order('created_at', { ascending: false });
      break;
  }

  // Apply limit if provided
  if (limit && limit > 0) {
    query = query.limit(limit);
  }

  console.log("Final query:", query);
  return query;
};

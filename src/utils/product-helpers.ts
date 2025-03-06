
import { supabase } from "@/integrations/supabase/client";

/**
 * Format a number as currency
 * @param price The price to format
 * @param currency The currency symbol (default: 'KWD')
 * @returns Formatted price string
 */
export const formatCurrency = (price: number, currency: string = 'KWD'): string => {
  return `${price.toFixed(2)} ${currency}`;
};

/**
 * Get the image URL for a category by its name
 * @param categoryName The name of the category
 * @returns The image URL
 */
export const getCategoryImageByName = (categoryName: string): string => {
  // Category images mapping - Ensure dedicated image for "الكل" (ALL)
  const categoryImageMap: Record<string, string> = {
    "الكل": "/public/lovable-uploads/458d1c93-d142-4466-9f1a-1085922105f5.png", // Dedicated image for ALL
    "العيادات": "/public/lovable-uploads/c8a5c4e7-628d-4c52-acca-e8f603036b6b.png",
    "الإلكترونيات": "/public/lovable-uploads/827a00fa-f421-45c3-96d7-b9305fb217d1.jpg",
  };

  return categoryImageMap[categoryName] || "/placeholder.svg";
};

/**
 * Handle image loading errors by replacing with a placeholder
 * @param event The error event
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>): void => {
  const target = event.target as HTMLImageElement;
  console.log("Image failed to load:", target.src);
  target.src = "/placeholder.svg";
};

/**
 * Fetch products from Supabase with various filtering options
 * @param options Filter options for products
 * @returns Promise with array of products
 */
export const fetchProducts = async (options: {
  storeId?: string;
  categoryId?: string;
  isFeatured?: boolean;
  isOnSale?: boolean;
  sectionId?: string;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  try {
    let query = supabase.from('products').select('*');
    
    // Apply filters
    if (options.storeId) {
      query = query.eq('store_id', options.storeId);
    }
    
    if (options.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }
    
    if (options.isFeatured) {
      query = query.eq('is_featured', true);
    }
    
    if (options.isOnSale) {
      query = query.not('discount_price', 'is', null);
    }
    
    if (options.sectionId) {
      query = query.eq('section_id', options.sectionId);
    }
    
    // Apply sorting
    const sortField = options.sortBy || 'created_at';
    const sortDirection = options.sortOrder || 'desc';
    query = query.order(sortField, { ascending: sortDirection === 'asc' });
    
    // Apply limit
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error("Error in fetchProducts:", err);
    return [];
  }
};

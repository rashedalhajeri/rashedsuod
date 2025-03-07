
import { supabase } from "@/integrations/supabase/client";

interface CategoryWithImage {
  name: string;
  image_url?: string | null;
}

/**
 * Fetch all categories with images from a store
 * @param storeId The store ID to fetch categories from
 * @returns Array of categories with name and image URL
 */
export const fetchCategoriesWithImages = async (storeId: string): Promise<CategoryWithImage[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('name, image_url')
      .eq('store_id', storeId)
      .order('sort_order', { ascending: true });
      
    if (error) {
      console.error("Error fetching categories with images:", error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error("Error in fetchCategoriesWithImages:", err);
    return [];
  }
};

/**
 * Check if showing category images is enabled in store settings
 * @param storeId The store ID to check settings for
 * @returns Boolean indicating if category images should be shown
 */
export const isCategoryImagesEnabled = async (storeId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('store_theme_settings')
      .select('show_category_images')
      .eq('store_id', storeId)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching category images setting:", error);
      return true; // Default to true if there's an error
    }
    
    return data?.show_category_images ?? true;
  } catch (err) {
    console.error("Error in isCategoryImagesEnabled:", err);
    return true; // Default to true if there's an exception
  }
};

/**
 * Find the image URL for a specific category by name
 * @param categoryName The name of the category to find
 * @param categories Array of categories with images
 * @returns The image URL if found, undefined otherwise
 */
export const findCategoryImageByName = (
  categoryName: string, 
  categories: CategoryWithImage[]
): string | undefined => {
  const category = categories.find(
    c => c.name.toLowerCase() === categoryName.toLowerCase()
  );
  
  return category?.image_url || undefined;
};

/**
 * Map category names to their image URLs
 * @param categoryNames Array of category names
 * @param categoriesWithImages Array of categories with images
 * @returns Mapping of category names to image URLs
 */
export const mapCategoryNamesToImages = (
  categoryNames: string[],
  categoriesWithImages: CategoryWithImage[]
): Record<string, string | undefined> => {
  const mapping: Record<string, string | undefined> = {};
  
  categoryNames.forEach(name => {
    mapping[name] = findCategoryImageByName(name, categoriesWithImages);
  });
  
  return mapping;
};

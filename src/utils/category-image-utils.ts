
import { supabase } from "@/integrations/supabase/client";

// Default category images for fallback
const defaultCategoryImageMap: Record<string, string> = {
  "الكل": "/public/lovable-uploads/458d1c93-d142-4466-9f1a-1085922105f5.png", // Dedicated image for ALL
  "العيادات": "/public/lovable-uploads/c8a5c4e7-628d-4c52-acca-e8f603036b6b.png",
  "الإلكترونيات": "/public/lovable-uploads/827a00fa-f421-45c3-96d7-b9305fb217d1.jpg",
};

/**
 * Returns an appropriate image URL for a given category name
 * Falls back to placeholder if the category isn't in the map
 */
export const getCategoryImage = (category: string): string => {
  return defaultCategoryImageMap[category] || "/placeholder.svg";
};

/**
 * Fetches a category's image from the database
 */
export const fetchCategoryImage = async (
  categoryName: string, 
  storeId: string
): Promise<string | null> => {
  try {
    // First check if it's the "All" category
    if (categoryName === "الكل") {
      return defaultCategoryImageMap["الكل"];
    }
    
    // Fetch from database
    const { data, error } = await supabase
      .from('categories')
      .select('image_url')
      .eq('store_id', storeId)
      .eq('name', categoryName)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching category image:", error);
      return defaultCategoryImageMap[categoryName] || null;
    }
    
    return data?.image_url || defaultCategoryImageMap[categoryName] || null;
  } catch (err) {
    console.error("Error in fetchCategoryImage:", err);
    return defaultCategoryImageMap[categoryName] || null;
  }
};

/**
 * Fetches all categories with images for a store
 */
export const fetchAllCategoryImages = async (
  storeId: string
): Promise<Record<string, string>> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('name, image_url')
      .eq('store_id', storeId);
      
    if (error) {
      console.error("Error fetching category images:", error);
      return defaultCategoryImageMap;
    }
    
    // Create a map of category names to image URLs
    const categoryImageMap: Record<string, string> = { ...defaultCategoryImageMap };
    
    data.forEach(category => {
      if (category.name && category.image_url) {
        categoryImageMap[category.name] = category.image_url;
      }
    });
    
    return categoryImageMap;
  } catch (err) {
    console.error("Error in fetchAllCategoryImages:", err);
    return defaultCategoryImageMap;
  }
};

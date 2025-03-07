
import { supabase } from "@/integrations/supabase/client";
import { Product, RawProductData } from "./types";
import { mapRawProductToProduct } from "./mappers";
import { databaseClient } from "@/integrations/database/client";

/**
 * Fetch products with filters
 */
export const fetchProductsWithFilters = async (
  sectionType: string,
  storeId?: string,
  categoryId?: string,
  sectionId?: string,
  limit?: number
): Promise<Product[]> => {
  try {
    return await databaseClient.products.fetchProductsWithFilters(
      sectionType,
      storeId,
      categoryId,
      sectionId,
      limit
    );
  } catch (err) {
    console.error("Error in fetchProductsWithFilters:", err);
    return [];
  }
};

/**
 * Get a product by its ID 
 */
export const getProductById = async (productId: string) => {
  try {
    return await databaseClient.products.getProductById(productId);
  } catch (error) {
    console.error('Error fetching product:', error);
    return { data: null, error };
  }
};

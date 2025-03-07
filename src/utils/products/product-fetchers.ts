
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
  limit?: number,
  includeArchived: boolean = false
): Promise<Product[]> => {
  try {
    console.log(`Fetching products with filters:`, { sectionType, storeId, categoryId, sectionId, limit });
    
    // Call database client to fetch products
    const products = await databaseClient.products.fetchProductsWithFilters(
      sectionType,
      storeId,
      categoryId,
      sectionId,
      limit
    );
    
    console.log(`Fetched ${products.length} products`);
    return products;
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

/**
 * Archive or unarchive a product
 */
export const archiveProduct = async (productId: string, isArchived: boolean) => {
  try {
    return await databaseClient.products.archiveProduct(productId, isArchived);
  } catch (error) {
    console.error('Error archiving product:', error);
    return { data: null, error };
  }
};

/**
 * Bulk archive or unarchive products
 */
export const bulkArchiveProducts = async (productIds: string[], isArchived: boolean) => {
  try {
    return await databaseClient.products.bulkArchiveProducts(productIds, isArchived);
  } catch (error) {
    console.error('Error bulk archiving products:', error);
    return { success: false, error };
  }
};

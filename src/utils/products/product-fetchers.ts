
import { Product } from "./types";
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
      limit,
      includeArchived
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
 * Delete a product
 */
export const deleteProduct = async (productId: string) => {
  try {
    return await databaseClient.products.deleteProduct(productId);
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error };
  }
};

/**
 * Bulk delete products
 */
export const bulkDeleteProducts = async (productIds: string[]) => {
  try {
    return await databaseClient.products.bulkDeleteProducts(productIds);
  } catch (error) {
    console.error('Error bulk deleting products:', error);
    return { success: false, error };
  }
};

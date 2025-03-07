
import { supabase } from "@/integrations/supabase/client";
import { Product, RawProductData } from "./types";
import { mapRawProductToProduct } from "./mappers";
import { databaseClient } from "@/integrations/database/client";

/**
 * Update a product
 */
export const updateProduct = async (productId: string, updates: any) => {
  try {
    return await databaseClient.products.updateProduct(productId, updates);
  } catch (error) {
    console.error("Error updating product:", error);
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
    console.error("Error deleting product:", error);
    return { success: false, error };
  }
};

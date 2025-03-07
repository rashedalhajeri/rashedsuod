
import { supabase } from "@/integrations/supabase/client";
import { Product, RawProductData } from "./types";
import { mapRawProductToProduct } from "./mappers";

/**
 * Update a product
 */
export const updateProduct = async (productId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select();
      
    if (error) throw error;
    
    // Modified approach: break the type recursion by using any[] first
    const processedData: Product[] = [];
    
    if (data && data.length > 0) {
      // Convert to any[] to break type recursion
      const rawData: any[] = data;
      
      for (let i = 0; i < rawData.length; i++) {
        // Use simple type casting
        const item = rawData[i] as RawProductData;
        const processed = mapRawProductToProduct(item);
        processedData.push(processed);
      }
    }
    
    return { data: processedData, error: null };
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
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
      
    return { success: !error, error };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error };
  }
};

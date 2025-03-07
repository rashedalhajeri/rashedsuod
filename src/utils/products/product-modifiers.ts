
import { supabase } from "@/integrations/supabase/client";
import { Product } from "./types";

/**
 * Updates a product by its ID
 */
export const updateProduct = async (productId: string, updates: Partial<Product>) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select();
    
    return { data, error };
  } catch (err) {
    console.error('Error updating product:', err);
    return { data: null, error: err };
  }
};

/**
 * Deletes a product by its ID
 */
export const deleteProduct = async (productId: string) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
    
    return { success: !error, error };
  } catch (err) {
    console.error('Error deleting product:', err);
    return { success: false, error: err };
  }
};

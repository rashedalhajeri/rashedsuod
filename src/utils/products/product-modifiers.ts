
import { supabase } from "@/integrations/supabase/client";
import { Product } from "./types";

export const updateProduct = async (id: string, updates: Partial<Product>) => {
  try {
    // Convert Date objects to ISO strings for Supabase
    const formattedUpdates = {
      ...updates,
      created_at: updates.created_at instanceof Date ? updates.created_at.toISOString() : updates.created_at,
      updated_at: updates.updated_at instanceof Date ? updates.updated_at.toISOString() : updates.updated_at
    };
    
    const { data, error } = await supabase
      .from("products")
      .update(formattedUpdates)
      .eq("id", id)
      .select();

    if (error) throw error;
    return { data: data[0], error: null };
  } catch (err) {
    console.error("Error updating product:", err);
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

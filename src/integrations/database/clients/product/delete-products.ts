
import { supabase } from "@/integrations/supabase/client";

export async function deleteProduct(productId: string) {
  try {
    console.log(`Attempting to delete product with ID: ${productId}`);
    
    // Delete the product directly without checking for order_items
    // This works because we've added ON DELETE SET NULL to the foreign key
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
      
    if (error) {
      console.error("Error deleting product:", error);
      return { success: false, error };
    }
    
    console.log("Product successfully deleted");
    return { success: true, error: null };
  } catch (error) {
    console.error("Exception in deleteProduct:", error);
    return { success: false, error };
  }
}

export async function hardDeleteProduct(productId: string) {
  try {
    console.log(`Attempting to permanently delete product with ID: ${productId}`);
    
    // Delete the product directly without checking for order_items
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
      
    if (error) {
      console.error("Error deleting product:", error);
      return { success: false, error };
    }
    
    console.log("Product successfully hard deleted");
    return { success: true, error: null };
  } catch (error) {
    console.error("Exception in hardDeleteProduct:", error);
    return { success: false, error };
  }
}

export async function bulkDeleteProducts(productIds: string[]) {
  try {
    if (productIds.length === 0) {
      return { 
        success: true, 
        error: null, 
        deletedCount: 0,
        archivedCount: 0
      };
    }
    
    console.log(`Attempting to delete ${productIds.length} products`);
    
    // Delete all products regardless of orders
    const { error } = await supabase
      .from('products')
      .delete()
      .in('id', productIds);
      
    if (error) {
      console.error("Error in bulk delete products:", error);
      return { 
        success: false, 
        error, 
        deletedCount: 0,
        archivedCount: 0 
      };
    }
    
    return { 
      success: true, 
      error: null, 
      deletedCount: productIds.length,
      archivedCount: 0
    };
  } catch (error) {
    console.error("Exception in bulkDeleteProducts:", error);
    return { success: false, error, deletedCount: 0, archivedCount: 0 };
  }
}

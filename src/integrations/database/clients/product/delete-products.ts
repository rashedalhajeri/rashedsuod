import { supabase } from "@/integrations/supabase/client";

export async function deleteProduct(productId: string) {
  try {
    console.log(`Attempting to delete product with ID: ${productId}`);
    
    // First, check if there are order_items referencing this product
    const { data: orderItems, error: checkError } = await supabase
      .from('order_items')
      .select('id')
      .eq('product_id', productId);
      
    if (checkError) {
      console.error("Error checking related order items:", checkError);
      return { success: false, error: checkError };
    }
    
    if (orderItems && orderItems.length > 0) {
      console.log(`Found ${orderItems.length} order items related to this product`);
      
      // For products with orders, proceed with deletion but maintain order integrity
      // First, backup the product information to a view or separate processing
      // This is just a log for now since we're going to delete anyway
      console.log("Product has orders but will still be deleted as requested");
    }
    
    // Always delete the product regardless of orders
    console.log("Proceeding to delete the product");
    const { error: deleteProductError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
      
    if (deleteProductError) {
      console.error("Error deleting product:", deleteProductError);
      return { success: false, error: deleteProductError };
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
    
    // Since we're intentionally keeping order_items referencing this product
    // We don't need to check or delete those first - this maintains order history
    
    // Now delete the product
    console.log("Proceeding to delete the product");
    const { error: deleteProductError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
      
    if (deleteProductError) {
      console.error("Error deleting product:", deleteProductError);
      return { success: false, error: deleteProductError };
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

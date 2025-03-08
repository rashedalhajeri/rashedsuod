import { supabase } from "@/integrations/supabase/client";
import { Product, RawProductData } from "@/utils/products/types";
import { mapRawProductToProduct } from "@/utils/products/mappers";
import { buildProductQuery } from "@/utils/products/query-builders";

export interface ProductDatabaseClient {
  fetchProductsWithFilters: (
    sectionType: string,
    storeId?: string,
    categoryId?: string,
    sectionId?: string,
    limit?: number,
    includeArchived?: boolean
  ) => Promise<Product[]>;
  getProductById: (productId: string) => Promise<{ data: Product | null, error: any }>;
  updateProduct: (productId: string, updates: any) => Promise<{ data: Product[] | null, error: any }>;
  deleteProduct: (productId: string) => Promise<{ success: boolean, error: any }>;
  hardDeleteProduct: (productId: string) => Promise<{ success: boolean, error: any }>;
  bulkDeleteProducts: (productIds: string[]) => Promise<{ success: boolean, error: any, deletedCount: number, archivedCount: number }>;
  activateProduct: (productId: string, isActive: boolean) => Promise<{ data: Product | null, error: any }>;
  bulkActivateProducts: (productIds: string[], isActive: boolean) => Promise<{ success: boolean, error: any }>;
  bulkUpdateCategory: (productIds: string[], categoryId: string | null) => Promise<{ success: boolean, error: any }>;
}

export class SupabaseProductClient implements ProductDatabaseClient {
  fetchProductsWithFilters = async (
    sectionType: string,
    storeId?: string,
    categoryId?: string,
    sectionId?: string,
    limit?: number,
    includeArchived: boolean = false
  ): Promise<Product[]> => {
    try {
      let query = buildProductQuery(
        supabase,
        sectionType,
        storeId,
        categoryId,
        sectionId,
        limit
      );
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching products:", error);
        return [];
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      const rawData = data as unknown as RawProductData[];
      const processedProducts: Product[] = [];
      
      for (let i = 0; i < rawData.length; i++) {
        const product = mapRawProductToProduct(rawData[i]);
        processedProducts.push(product);
      }
      
      console.log(`Fetched ${processedProducts.length} active products`);
      return processedProducts;
    } catch (err) {
      console.error("Error in fetchProductsWithFilters:", err);
      return [];
    }
  };

  getProductById = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      
      if (error) throw error;
      
      if (!data) return { data: null, error: null };
      
      const product = mapRawProductToProduct(data as unknown as RawProductData);
      
      return { data: product, error: null };
    } catch (error) {
      console.error('Error fetching product:', error);
      return { data: null, error };
    }
  };

  updateProduct = async (productId: string, updates: any) => {
    try {
      const validUpdates = { ...updates };
      
      if (validUpdates.additional_images && Array.isArray(validUpdates.additional_images)) {
        validUpdates.additional_images = JSON.stringify(validUpdates.additional_images);
      }
      
      if (validUpdates.available_colors && Array.isArray(validUpdates.available_colors)) {
        validUpdates.available_colors = JSON.stringify(validUpdates.available_colors);
      }
      
      if (validUpdates.available_sizes && Array.isArray(validUpdates.available_sizes)) {
        validUpdates.available_sizes = JSON.stringify(validUpdates.available_sizes);
      }
      
      delete validUpdates.category;
      
      console.log("Updating product with data:", validUpdates);
      
      const { data, error } = await supabase
        .from('products')
        .update(validUpdates)
        .eq('id', productId)
        .select();
        
      if (error) throw error;
      
      const processedData: Product[] = [];
      
      if (data && data.length > 0) {
        const rawData = data as unknown as RawProductData[];
        
        for (let i = 0; i < rawData.length; i++) {
          const processed = mapRawProductToProduct(rawData[i]);
          processedData.push(processed);
        }
      }
      
      return { data: processedData, error: null };
    } catch (error) {
      console.error("Error updating product:", error);
      return { data: null, error };
    }
  };

  deleteProduct = async (productId: string) => {
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
        
        // Option 1: Instead of deleting, just set the product as inactive
        const { error: updateError } = await supabase
          .from('products')
          .update({ is_active: false })
          .eq('id', productId);
          
        if (updateError) {
          console.error("Error deactivating product:", updateError);
          return { success: false, error: updateError };
        }
        
        console.log("Product successfully deactivated instead of deleted due to order references");
        return { 
          success: true, 
          error: null,
          deactivated: true 
        };
      }
      
      // If no order items, we can safely delete the product
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
  };

  hardDeleteProduct = async (productId: string) => {
    try {
      console.log(`Attempting to permanently delete product with ID: ${productId}`);
      
      // First, we need to delete all order_items referencing this product
      const { error: deleteItemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('product_id', productId);
        
      if (deleteItemsError) {
        console.error("Error deleting related order items:", deleteItemsError);
        return { success: false, error: deleteItemsError };
      }
      
      // Now delete the product
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
  };

  bulkDeleteProducts = async (productIds: string[]) => {
    try {
      if (productIds.length === 0) {
        return { 
          success: true, 
          error: null, 
          deletedCount: 0,
          archivedCount: 0
        };
      }
      
      console.log(`Attempting to bulk delete/deactivate ${productIds.length} products`);
      
      // First, check which products have order items
      const { data: productsWithOrders, error: checkError } = await supabase
        .from('order_items')
        .select('product_id')
        .in('product_id', productIds);
        
      if (checkError) {
        console.error("Error checking related order items for bulk delete:", checkError);
        return { 
          success: false, 
          error: checkError, 
          deletedCount: 0,
          archivedCount: 0 
        };
      }
      
      // Get unique product IDs with orders
      const productsWithOrdersIds = [...new Set(productsWithOrders?.map(item => item.product_id) || [])];
      console.log(`Found ${productsWithOrdersIds.length} products with orders that will be deactivated instead`);
      
      // Get products without orders that can be safely deleted
      const productsToDelete = productIds.filter(id => !productsWithOrdersIds.includes(id));
      console.log(`Found ${productsToDelete.length} products that can be safely deleted`);
      
      let deleteError = null;
      let deactivateError = null;
      
      // Deactivate products with orders
      if (productsWithOrdersIds.length > 0) {
        const { error } = await supabase
          .from('products')
          .update({ is_active: false })
          .in('id', productsWithOrdersIds);
          
        deactivateError = error;
        
        if (error) {
          console.error("Error deactivating products with orders:", error);
        } else {
          console.log(`Successfully deactivated ${productsWithOrdersIds.length} products`);
        }
      }
      
      // Delete products without orders
      if (productsToDelete.length > 0) {
        const { error } = await supabase
          .from('products')
          .delete()
          .in('id', productsToDelete);
          
        deleteError = error;
        
        if (error) {
          console.error("Error in bulk delete products:", error);
        } else {
          console.log(`Successfully deleted ${productsToDelete.length} products`);
        }
      }
      
      // Determine overall success based on operations that were actually performed
      const success = (
        (productsWithOrdersIds.length === 0 || !deactivateError) && 
        (productsToDelete.length === 0 || !deleteError)
      );
      
      return { 
        success, 
        error: deleteError || deactivateError, 
        deletedCount: deleteError ? 0 : productsToDelete.length,
        archivedCount: deactivateError ? 0 : productsWithOrdersIds.length
      };
    } catch (error) {
      console.error("Exception in bulkDeleteProducts:", error);
      return { success: false, error, deletedCount: 0, archivedCount: 0 };
    }
  };

  activateProduct = async (productId: string, isActive: boolean) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ is_active: isActive })
        .eq('id', productId)
        .select()
        .single();
        
      if (error) throw error;
      
      if (!data) return { data: null, error: null };
      
      const product = mapRawProductToProduct(data as unknown as RawProductData);
      
      return { data: product, error: null };
    } catch (error) {
      console.error("Error updating product active status:", error);
      return { data: null, error };
    }
  };

  bulkActivateProducts = async (productIds: string[], isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: isActive })
        .in('id', productIds);
        
      return { success: !error, error };
    } catch (error) {
      console.error("Error bulk updating products active status:", error);
      return { success: false, error };
    }
  };

  bulkUpdateCategory = async (productIds: string[], categoryId: string | null) => {
    try {
      if (productIds.length === 0) {
        return { success: true, error: null };
      }

      console.log(`Updating category to ${categoryId} for ${productIds.length} products`);
      
      const { error } = await supabase
        .from('products')
        .update({ category_id: categoryId })
        .in('id', productIds);
        
      if (error) {
        console.error("Error updating products category:", error);
        return { success: false, error };
      }
      
      return { success: true, error: null };
    } catch (error) {
      console.error("Exception in bulkUpdateCategory:", error);
      return { success: false, error };
    }
  };
}

export const productClient = new SupabaseProductClient();

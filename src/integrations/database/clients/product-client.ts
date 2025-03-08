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
      
      // First, delete all order_items referencing this product
      console.log("Deleting order items related to the product");
      const { error: deleteItemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('product_id', productId);
        
      if (deleteItemsError) {
        console.error("Error deleting related order items:", deleteItemsError);
        return { success: false, error: deleteItemsError };
      }
      
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
      
      console.log("Product successfully deleted");
      return { success: true, error: null };
    } catch (error) {
      console.error("Exception in deleteProduct:", error);
      return { success: false, error };
    }
  };

  hardDeleteProduct = async (productId: string) => {
    return this.deleteProduct(productId);
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
      
      console.log(`Attempting to bulk delete ${productIds.length} products`);
      
      // First delete all order_items referencing these products
      console.log("Deleting all order items related to the products");
      const { error: deleteItemsError } = await supabase
        .from('order_items')
        .delete()
        .in('product_id', productIds);
        
      if (deleteItemsError) {
        console.error("Error deleting related order items for bulk delete:", deleteItemsError);
        return { 
          success: false, 
          error: deleteItemsError, 
          deletedCount: 0,
          archivedCount: 0 
        };
      }
      
      // Now delete all the selected products
      console.log("Proceeding to delete all products");
      const { error: deleteProductsError } = await supabase
        .from('products')
        .delete()
        .in('id', productIds);
        
      if (deleteProductsError) {
        console.error("Error in bulk delete products:", deleteProductsError);
        return { 
          success: false, 
          error: deleteProductsError, 
          deletedCount: 0,
          archivedCount: 0 
        };
      }
      
      console.log("All products successfully deleted");
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

import { supabase } from "@/integrations/supabase/client";
import { Product, RawProductData } from "@/utils/products/types";
import { mapRawProductToProduct } from "@/utils/products/mappers";
import { buildProductQuery } from "@/utils/products/query-builders";
import { Database } from "@/integrations/supabase/types";

export interface DatabaseClient {
  products: {
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
  };
}

class SupabaseDatabaseClient implements DatabaseClient {
  products = {
    fetchProductsWithFilters: async (
      sectionType: string,
      storeId?: string,
      categoryId?: string,
      sectionId?: string,
      limit?: number,
      includeArchived: boolean = false
    ): Promise<Product[]> => {
      try {
        // استخدام buildProductQuery لبناء استعلام موحد
        let query = buildProductQuery(
          supabase,
          sectionType,
          storeId,
          categoryId,
          sectionId,
          limit
        );
        
        // تنفيذ الاستعلام
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
    },

    getProductById: async (productId: string) => {
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
    },

    updateProduct: async (productId: string, updates: any) => {
      try {
        const validUpdates = { ...updates };
        
        // تحويل القيم النصية من JSON إلى سلاسل نصية
        if (validUpdates.additional_images && Array.isArray(validUpdates.additional_images)) {
          validUpdates.additional_images = JSON.stringify(validUpdates.additional_images);
        }
        
        if (validUpdates.available_colors && Array.isArray(validUpdates.available_colors)) {
          validUpdates.available_colors = JSON.stringify(validUpdates.available_colors);
        }
        
        if (validUpdates.available_sizes && Array.isArray(validUpdates.available_sizes)) {
          validUpdates.available_sizes = JSON.stringify(validUpdates.available_sizes);
        }
        
        // حذف حقول غير ضرورية للتحديث
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
    },

    deleteProduct: async (productId: string) => {
      try {
        // Check if the product is associated with any orders before deleting
        const { data: orderItems, error: checkError } = await supabase
          .from('order_items')
          .select('id')
          .eq('product_id', productId)
          .limit(1);
          
        if (checkError) {
          return { success: false, error: checkError };
        }
        
        // Even if the product is in orders, we will delete it completely
        // This is a change from the previous behavior where we would archive products in orders
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);
          
        return { success: !error, error };
      } catch (error) {
        console.error("Error deleting product:", error);
        return { success: false, error };
      }
    },

    hardDeleteProduct: async (productId: string) => {
      try {
        // This is now the same as regular deleteProduct
        return this.products.deleteProduct(productId);
      } catch (error) {
        console.error("Error hard deleting product:", error);
        return { success: false, error };
      }
    },

    bulkDeleteProducts: async (productIds: string[]) => {
      try {
        if (productIds.length === 0) {
          return { 
            success: true, 
            error: null, 
            deletedCount: 0,
            archivedCount: 0
          };
        }
        
        // Delete all products, regardless of whether they're associated with orders
        const { error } = await supabase
          .from('products')
          .delete()
          .in('id', productIds);
          
        if (error) {
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
        console.error("Error in bulkDeleteProducts:", error);
        return { success: false, error, deletedCount: 0, archivedCount: 0 };
      }
    },

    activateProduct: async (productId: string, isActive: boolean) => {
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
    },

    bulkActivateProducts: async (productIds: string[], isActive: boolean) => {
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
    }
  };
}

export const databaseClient: DatabaseClient = new SupabaseDatabaseClient();

export const setDatabaseClient = (mockClient: DatabaseClient) => {
  return mockClient;
};

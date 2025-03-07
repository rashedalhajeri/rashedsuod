import { supabase } from "@/integrations/supabase/client";
import { Product, RawProductData } from "@/utils/products/types";
import { mapRawProductToProduct } from "@/utils/products/mappers";
import { buildProductQuery } from "@/utils/products/query-builders";

// Interface defining the shape of our database client
export interface DatabaseClient {
  products: {
    fetchProductsWithFilters: (
      sectionType: string,
      storeId?: string,
      categoryId?: string,
      sectionId?: string,
      limit?: number
    ) => Promise<Product[]>;
    getProductById: (productId: string) => Promise<{ data: Product | null, error: any }>;
    updateProduct: (productId: string, updates: any) => Promise<{ data: Product[] | null, error: any }>;
    deleteProduct: (productId: string) => Promise<{ success: boolean, error: any }>;
    archiveProduct: (productId: string, isArchived: boolean) => Promise<{ data: Product | null, error: any }>;
    bulkArchiveProducts: (productIds: string[], isArchived: boolean) => Promise<{ success: boolean, error: any }>;
    activateProduct: (productId: string, isActive: boolean) => Promise<{ data: Product | null, error: any }>;
    bulkActivateProducts: (productIds: string[], isActive: boolean) => Promise<{ success: boolean, error: any }>;
  };
}

// Supabase implementation of our database client
class SupabaseDatabaseClient implements DatabaseClient {
  products = {
    fetchProductsWithFilters: async (
      sectionType: string,
      storeId?: string,
      categoryId?: string,
      sectionId?: string,
      limit?: number
    ): Promise<Product[]> => {
      try {
        const query = buildProductQuery(
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

    archiveProduct: async (productId: string, isArchived: boolean) => {
      try {
        const { data, error } = await supabase
          .from('products')
          .update({ is_archived: isArchived })
          .eq('id', productId)
          .select()
          .single();
          
        if (error) throw error;
        
        if (!data) return { data: null, error: null };
        
        const product = mapRawProductToProduct(data as unknown as RawProductData);
        
        return { data: product, error: null };
      } catch (error) {
        console.error("Error archiving product:", error);
        return { data: null, error };
      }
    },

    bulkArchiveProducts: async (productIds: string[], isArchived: boolean) => {
      try {
        const { error } = await supabase
          .from('products')
          .update({ is_archived: isArchived })
          .in('id', productIds);
          
        return { success: !error, error };
      } catch (error) {
        console.error("Error bulk archiving products:", error);
        return { success: false, error };
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

// Export a singleton instance of the database client
export const databaseClient: DatabaseClient = new SupabaseDatabaseClient();

// Function to allow mock implementation during testing
export const setDatabaseClient = (mockClient: DatabaseClient) => {
  return mockClient;
};

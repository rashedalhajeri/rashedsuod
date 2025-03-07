
import { supabase } from "@/integrations/supabase/client";
import { Product, RawProductData } from "@/utils/products/types";
import { mapRawProductToProduct } from "@/utils/products/mappers";

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
        let query = supabase.from('products').select('*');
        
        // Add store filter if provided
        if (storeId) {
          query = query.eq('store_id', storeId);
        }
        
        // Create the appropriate query based on section type
        switch (sectionType) {
          case 'best_selling':
            query = query.order('sales_count', { ascending: false });
            break;
            
          case 'category':
            if (categoryId) {
              query = query.eq('category_id', categoryId);
            }
            query = query.order('created_at', { ascending: false });
            break;
            
          case 'featured':
            query = query.eq('is_featured', true)
              .order('created_at', { ascending: false });
            break;
            
          case 'on_sale':
            query = query.not('discount_price', 'is', null)
              .order('created_at', { ascending: false });
            break;
            
          case 'custom':
            if (sectionId) {
              query = query.eq('section_id', sectionId);
            }
            query = query.order('created_at', { ascending: false });
            break;
            
          default:
            // Default: fetch all products with basic sorting
            query = query.order('created_at', { ascending: false });
            break;
        }
        
        // Apply limit if specified
        if (limit && limit > 0) {
          query = query.limit(limit);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching products:", error);
          return [];
        }
        
        if (!data || data.length === 0) {
          return [];
        }
        
        // Convert to unknown first to break type recursion, then cast to array
        const rawData = data as unknown as any[];
        const processedProducts: Product[] = [];
        
        // Then process each item individually
        for (let i = 0; i < rawData.length; i++) {
          const item = rawData[i] as RawProductData;
          const product = mapRawProductToProduct(item);
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
        
        // Process the data to ensure proper types
        const product = mapRawProductToProduct(data as RawProductData);
        
        return { data: product, error: null };
      } catch (error) {
        console.error('Error fetching product:', error);
        return { data: null, error };
      }
    },

    updateProduct: async (productId: string, updates: any) => {
      try {
        const { data, error } = await supabase
          .from('products')
          .update(updates)
          .eq('id', productId)
          .select();
          
        if (error) throw error;
        
        // Modified approach: break the type recursion by using unknown first
        const processedData: Product[] = [];
        
        if (data && data.length > 0) {
          // Convert to unknown to break type recursion, then cast to array
          const rawData = data as unknown as any[];
          
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
    }
  };
}

// Export a singleton instance of the database client
export const databaseClient: DatabaseClient = new SupabaseDatabaseClient();

// Function to allow mock implementation during testing
export const setDatabaseClient = (mockClient: DatabaseClient) => {
  return mockClient;
};

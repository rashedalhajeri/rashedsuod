
import { supabase } from "@/integrations/supabase/client";
import { mapRawProductToProduct } from "@/utils/products/mappers";
import { buildProductQuery } from "@/utils/products/query-builders";
import { RawProductData } from "@/utils/products/types";

export async function fetchProductsWithFilters(
  sectionType: string,
  storeId?: string,
  categoryId?: string,
  sectionId?: string,
  limit?: number,
  includeArchived: boolean = false
): Promise<any[]> {
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
    const processedProducts: any[] = [];
    
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
}

export async function getProductById(productId: string) {
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
}

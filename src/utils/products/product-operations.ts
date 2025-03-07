
import { supabase } from "@/integrations/supabase/client";
import { Product, RawProductData } from "./types";
import { convertToStringArray } from "./format-helpers";

/**
 * Helper function to safely convert raw product data from Supabase to a Product object
 */
const mapRawProductToProduct = (rawData: RawProductData): Product => {
  return {
    id: rawData.id,
    name: rawData.name,
    description: rawData.description,
    price: rawData.price,
    category_id: rawData.category_id,
    store_id: rawData.store_id,
    image_url: rawData.image_url,
    stock_quantity: rawData.stock_quantity,
    created_at: rawData.created_at,
    updated_at: rawData.updated_at,
    discount_price: rawData.discount_price,
    track_inventory: Boolean(rawData.track_inventory),
    has_colors: Boolean(rawData.has_colors),
    has_sizes: Boolean(rawData.has_sizes),
    require_customer_name: Boolean(rawData.require_customer_name),
    require_customer_image: Boolean(rawData.require_customer_image),
    additional_images: convertToStringArray(rawData.additional_images),
    available_colors: convertToStringArray(rawData.available_colors),
    available_sizes: convertToStringArray(rawData.available_sizes)
  };
};

/**
 * Fetch products with filters
 */
export const fetchProductsWithFilters = async (
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
    
    // Process data with explicit product creation - fix for excessive type instantiation
    const processedProducts: Product[] = [];
    
    for (const item of data) {
      const rawData = item as RawProductData;
      const product = mapRawProductToProduct(rawData);
      processedProducts.push(product);
    }
    
    return processedProducts;
  } catch (err) {
    console.error("Error in fetchProductsWithFilters:", err);
    return [];
  }
};

/**
 * Get a product by its ID 
 */
export const getProductById = async (productId: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (error) throw error;
    
    if (!data) return { data: null, error: null };
    
    // Process the data to ensure proper types
    const product: Product = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      category_id: data.category_id,
      store_id: data.store_id,
      image_url: data.image_url,
      stock_quantity: data.stock_quantity,
      created_at: data.created_at,
      updated_at: data.updated_at,
      discount_price: data.discount_price,
      track_inventory: Boolean(data.track_inventory),
      has_colors: Boolean(data.has_colors),
      has_sizes: Boolean(data.has_sizes),
      require_customer_name: Boolean(data.require_customer_name),
      require_customer_image: Boolean(data.require_customer_image),
      additional_images: convertToStringArray(data.additional_images),
      available_colors: convertToStringArray(data.available_colors),
      available_sizes: convertToStringArray(data.available_sizes)
    };
    
    return { data: product, error: null };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { data: null, error };
  }
};

/**
 * Update a product
 */
export const updateProduct = async (productId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select();
      
    if (error) throw error;
    
    // Fix for excessive type instantiation - use for loop instead of map
    const processedData: Product[] = [];
    
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const rawData = data[i] as RawProductData;
        const processed = mapRawProductToProduct(rawData);
        processedData.push(processed);
      }
    }
    
    return { data: processedData, error: null };
  } catch (error) {
    console.error("Error updating product:", error);
    return { data: null, error };
  }
};

/**
 * Delete a product
 */
export const deleteProduct = async (productId: string) => {
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
};


import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define types for better type safety
export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category_id?: string | null;
  store_id: string;
  image_url?: string | null;
  additional_images?: string[] | null;
  stock_quantity?: number | null;
  created_at?: string;
  updated_at?: string;
  discount_price?: number | null;
  track_inventory?: boolean;
  has_colors?: boolean;
  has_sizes?: boolean;
  require_customer_name?: boolean;
  require_customer_image?: boolean;
  available_colors?: string[] | null;
  available_sizes?: string[] | null;
}

// Define a raw database product type that exactly matches the database schema
interface RawProductData {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  store_id: string;
  image_url: string | null;
  stock_quantity: number | null;
  created_at: string;
  updated_at: string;
  additional_images: any;
  discount_price: number | null;
  track_inventory: boolean;
  has_colors: boolean;
  has_sizes: boolean;
  require_customer_name: boolean;
  require_customer_image: boolean;
  available_colors: any;
  available_sizes: any;
}

/**
 * Format currency with proper locale
 */
export const formatCurrency = (price: number, currency = 'KWD') => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  }).format(price);
};

/**
 * Helper to handle image errors
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = event.target as HTMLImageElement;
  target.src = "/placeholder.svg";
  // Don't show error in console for better UX
};

/**
 * Upload product image to Supabase Storage
 * @returns Public URL of the uploaded image
 */
export const uploadProductImage = async (file: File, storeId: string): Promise<string | null> => {
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return null;
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image size is too large. Must be less than 5MB');
      return null;
    }
    
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `products/${storeId}/${fileName}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadProductImage:', error);
    toast.error('An unexpected error occurred');
    return null;
  }
};

/**
 * Convert any Supabase JSON value to string array safely
 */
export const convertToStringArray = (value: any): string[] | null => {
  if (!value) {
    return null;
  }
  
  if (Array.isArray(value)) {
    // Ensure all array elements are strings
    return value.map(item => String(item));
  }
  
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(item => String(item)) : null;
    } catch (e) {
      console.error("Error parsing string to array:", e);
      return null;
    }
  }
  
  return null;
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
    
    // Process data with explicit product creation to avoid circular references
    const processedProducts: Product[] = [];
    
    for (const item of data) {
      const product: Product = {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category_id: item.category_id,
        store_id: item.store_id,
        image_url: item.image_url,
        stock_quantity: item.stock_quantity,
        created_at: item.created_at,
        updated_at: item.updated_at,
        discount_price: item.discount_price,
        track_inventory: Boolean(item.track_inventory),
        has_colors: Boolean(item.has_colors),
        has_sizes: Boolean(item.has_sizes),
        require_customer_name: Boolean(item.require_customer_name),
        require_customer_image: Boolean(item.require_customer_image),
        // Safely process JSON arrays
        additional_images: convertToStringArray(item.additional_images),
        available_colors: convertToStringArray(item.available_colors),
        available_sizes: convertToStringArray(item.available_sizes)
      };
      
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
export const getProductById = async (productId: string): Promise<{ data: Product | null, error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
      
    if (error) {
      return { data: null, error };
    }
    
    if (!data) {
      return { data: null, error: new Error('Product not found') };
    }
    
    // Create a properly typed product object
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
      // Safely process JSON arrays
      additional_images: convertToStringArray(data.additional_images),
      available_colors: convertToStringArray(data.available_colors),
      available_sizes: convertToStringArray(data.available_sizes)
    };
    
    return { data: product, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
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
    
    // Process the returned data to match our Product interface
    if (data && data.length > 0) {
      const rawData = data[0];
      
      const processedData: Product = {
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
      
      return { data: [processedData], error: null };
    }
    
    return { data, error: null };
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

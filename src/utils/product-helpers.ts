
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
    
    // Process the data to ensure proper typing of fields
    const processedData: Product[] = data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category_id: product.category_id,
      store_id: product.store_id,
      image_url: product.image_url,
      stock_quantity: product.stock_quantity,
      created_at: product.created_at,
      updated_at: product.updated_at,
      additional_images: convertToStringArray(product.additional_images),
      // Set default values for properties that might not exist in the database
      discount_price: null,
      track_inventory: false,
      has_colors: false,
      has_sizes: false,
      require_customer_name: false,
      require_customer_image: false,
      available_colors: null,
      available_sizes: null
    }));
    
    return processedData;
  } catch (err) {
    console.error("Error in fetchProductsWithFilters:", err);
    return [];
  }
};

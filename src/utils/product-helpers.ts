
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
    
    // Process the data to ensure additional_images is properly typed
    const processedData = data.map(product => {
      let additionalImages: string[] | null = null;
      
      if (product.additional_images) {
        if (Array.isArray(product.additional_images)) {
          additionalImages = product.additional_images;
        } else if (typeof product.additional_images === 'string') {
          try {
            additionalImages = JSON.parse(product.additional_images);
          } catch (e) {
            additionalImages = [];
            console.error("Error parsing additional_images:", e);
          }
        } else {
          // If it's a Json object from Supabase, convert it appropriately
          additionalImages = [];
        }
      }
      
      return {
        ...product,
        additional_images: additionalImages
      } as Product;
    });
    
    return processedData;
  } catch (err) {
    console.error("Error in fetchProductsWithFilters:", err);
    return [];
  }
};

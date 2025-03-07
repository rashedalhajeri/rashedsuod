
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Handle image loading errors and return a fallback image URL
 * @param imageUrl The original image URL
 * @param fallbackUrl The fallback URL (default: '/placeholder.svg')
 * @returns Either the original URL or the fallback URL
 */
export const getImageWithFallback = (imageUrl: string | null, fallbackUrl: string = '/placeholder.svg'): string => {
  if (!imageUrl) return fallbackUrl;
  return imageUrl;
};

/**
 * Handle image error events by setting the fallback image
 * @param event The error event from the img element
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
  const target = event.target as HTMLImageElement;
  console.log("Image failed to load:", target.src);
  target.src = '/placeholder.svg';
  target.onerror = null; // Prevent infinite error loop
};

/**
 * Check if the product-images bucket exists
 * @returns Promise<boolean> indicating if the bucket exists
 */
export const doesProductImagesBucketExist = async (): Promise<boolean> => {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Error checking bucket existence:", error);
      return false;
    }
    
    return buckets?.some(bucket => bucket.name === 'product-images') || false;
  } catch (error) {
    console.error("Unexpected error in doesProductImagesBucketExist:", error);
    return false;
  }
};

/**
 * Upload a product image to Supabase storage
 * @param file The file to upload
 * @param storeId The store ID for organizing storage
 * @returns The public URL of the uploaded image
 */
export const uploadProductImage = async (file: File, storeId: string): Promise<string | null> => {
  try {
    // Check if bucket exists
    const bucketExists = await doesProductImagesBucketExist();
    
    if (!bucketExists) {
      console.error("Product images bucket does not exist");
      toast.error("خطأ في وصول مخزن الصور، يرجى إعادة المحاولة لاحقًا");
      return null;
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${storeId}/products/${fileName}`;
    
    // Optimize image before upload if it's an image
    let optimizedFile = file;
    if (file.type.startsWith('image/')) {
      try {
        optimizedFile = await optimizeImage(file, 1200, 1200);
      } catch (optimizeError) {
        console.error("Error optimizing image:", optimizeError);
        // Continue with original file if optimization fails
      }
    }
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, optimizedFile, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading image:', error);
      
      // Give more specific error messages based on error type
      if (error.message.includes('storage bucket') || error.message.includes('not found')) {
        toast.error("مشكلة في مخزن الصور، يرجى الاتصال بالدعم الفني");
      } else if (error.message.includes('permission')) {
        toast.error("ليس لديك الصلاحية لرفع الصور");
      } else if (error.message.includes('authenticated')) {
        toast.error("يجب تسجيل الدخول لرفع الصور");
      } else {
        toast.error("فشل في رفع الصورة، يرجى المحاولة مرة أخرى");
      }
      
      return null;
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadProductImage:', error);
    toast.error("حدث خطأ غير متوقع أثناء رفع الصورة");
    return null;
  }
};

/**
 * Get a preview of an image before uploading
 * @param file The file to preview
 * @returns A data URL for the image
 */
export const getImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Optimize image size before upload
 * @param file The file to resize
 * @param maxWidth The maximum width
 * @param maxHeight The maximum height
 * @returns A promise that resolves to a File object
 */
export const optimizeImage = (
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1200
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file); // If canvas is not supported, return original file
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const optimizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(optimizedFile);
        },
        file.type,
        0.85 // Quality
      );
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
  });
};

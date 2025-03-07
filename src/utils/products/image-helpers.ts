
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      toast.error('الرجاء اختيار ملف صورة فقط');
      return null;
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('حجم الصورة كبير جداً. يجب أن يكون أقل من 5 ميجابايت');
      return null;
    }
    
    // Ensure the storage bucket exists
    const { data: bucketExists } = await supabase
      .storage
      .getBucket('product-images');
      
    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      const { error: createBucketError } = await supabase
        .storage
        .createBucket('product-images', { public: true });
        
      if (createBucketError) {
        console.error('Error creating storage bucket:', createBucketError);
        toast.error('فشل في إنشاء مساحة تخزين الصور');
        return null;
      }
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
      toast.error('فشل في رفع الصورة');
      return null;
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadProductImage:', error);
    toast.error('حدث خطأ غير متوقع أثناء رفع الصورة');
    return null;
  }
};


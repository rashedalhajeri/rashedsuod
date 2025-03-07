
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { uploadProductImage, doesProductImagesBucketExist } from "@/utils/products/image-helpers";

export const useImageUpload = (storeId?: string, images: string[] = [], maxImages: number = 5) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCheckingBucket, setIsCheckingBucket] = useState(true);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [bucketExists, setBucketExists] = useState<boolean | null>(null);
  
  // Check if bucket exists on component mount
  useEffect(() => {
    const checkBucket = async () => {
      if (!storeId) {
        setIsCheckingBucket(false);
        return;
      }
      
      try {
        setIsCheckingBucket(true);
        const exists = await doesProductImagesBucketExist();
        setBucketExists(exists);
        
        if (!exists) {
          console.warn("Product images bucket doesn't exist or not accessible");
          setUploadError("مشكلة في الوصول إلى مخزن الصور، يرجى التواصل مع الدعم الفني");
        } else {
          // Clear any previous errors if bucket exists
          setUploadError(null);
        }
      } catch (error) {
        console.error("Error checking bucket:", error);
        setUploadError("حدث خطأ في التحقق من مخزن الصور");
      } finally {
        setIsCheckingBucket(false);
      }
    };
    
    checkBucket();
  }, [storeId]);
  
  const handleFileUpload = async (files: FileList, onImagesChange: (images: string[]) => void) => {
    if (!files || files.length === 0) return;
    
    if (images.length + files.length > maxImages) {
      toast.error(`لا يمكن إضافة أكثر من ${maxImages} صور`);
      return;
    }
    
    if (!storeId) {
      toast.error("معرف المتجر مطلوب لرفع الصور");
      setUploadError("معرف المتجر مطلوب لرفع الصور");
      return;
    }
    
    // If bucket doesn't exist, don't try to upload
    if (bucketExists === false) {
      setUploadError("مشكلة في الوصول إلى مخزن الصور، يرجى التواصل مع الدعم الفني");
      toast.error("فشل في الوصول إلى مخزن الصور، يرجى التواصل مع الدعم الفني");
      return;
    }
    
    setIsUploading(true);
    setUploadError(null);
    let successCount = 0;
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`الملف ${file.name} ليس صورة صالحة`);
          return null;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`حجم الملف ${file.name} أكبر من 5 ميجابايت`);
          return null;
        }
        
        // Use the helper function to upload to Supabase storage
        const publicUrl = await uploadProductImage(file, storeId);
        if (publicUrl) successCount++;
        return publicUrl;
      });
      
      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter(url => url !== null) as string[];
      
      if (validUrls.length > 0) {
        onImagesChange([...images, ...validUrls]);
        toast.success(`تم رفع ${validUrls.length} صورة بنجاح`);
        setUploadError(null);
      } else {
        toast.error('فشل في رفع الصور، يرجى المحاولة مرة أخرى');
        setUploadError('فشل في رفع الصور، يرجى المحاولة مرة أخرى');
      }
    } catch (error) {
      console.error('Error processing uploads:', error);
      toast.error('حدث خطأ أثناء رفع الصور');
      setUploadError('حدث خطأ أثناء رفع الصور، يرجى المحاولة مرة أخرى');
    } finally {
      setIsUploading(false);
    }
  };
  
  const retryUpload = async () => {
    setUploadError(null);
    
    // Re-check bucket existence
    setIsCheckingBucket(true);
    try {
      const exists = await doesProductImagesBucketExist();
      setBucketExists(exists);
      
      if (exists) {
        toast.success("تم الاتصال بمخزن الصور بنجاح");
      } else {
        toast.error("لا يزال هناك مشكلة في الوصول إلى مخزن الصور");
        setUploadError("لا يزال هناك مشكلة في الوصول إلى مخزن الصور، يرجى التواصل مع الدعم الفني");
      }
    } catch (error) {
      console.error("Error checking bucket:", error);
      setUploadError("خطأ في التحقق من مخزن الصور");
    } finally {
      setIsCheckingBucket(false);
    }
  };
  
  return {
    isDragging,
    setIsDragging,
    isUploading,
    isCheckingBucket,
    uploadError,
    handleFileUpload,
    retryUpload
  };
};

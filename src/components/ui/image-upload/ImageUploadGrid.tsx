
import React, { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { uploadProductImage } from "@/utils/products/image-helpers";
import ImagePreview from "./ImagePreview";
import UploadDropZone from "./UploadDropZone";
import { ImageUploadProps } from "./types";

const ImageUploadGrid: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
  storeId
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleAddImage = (url: string) => {
    if (images.length < maxImages) {
      onImagesChange([...images, url]);
    } else {
      toast.error(`لا يمكن إضافة أكثر من ${maxImages} صور`);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Handle image URLs from drag and drop
    const items = e.dataTransfer.items;
    if (items) {
      // Check for files
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFileUpload(files);
      } else {
        // Check for string data (URLs)
        for (let i = 0; i < items.length; i++) {
          if (items[i].kind === 'string' && items[i].type.match('^text/uri-list')) {
            items[i].getAsString((url) => {
              if (images.length < maxImages) {
                handleAddImage(url);
              }
            });
          }
        }
      }
    }
  };
  
  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;
    
    if (images.length + files.length > maxImages) {
      toast.error(`لا يمكن إضافة أكثر من ${maxImages} صور`);
      return;
    }
    
    if (!storeId) {
      toast.error("معرف المتجر مطلوب لرفع الصور");
      return;
    }
    
    setIsUploading(true);
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
      } else {
        toast.error('فشل في رفع الصور، يرجى المحاولة مرة أخرى');
      }
    } catch (error) {
      console.error('Error processing uploads:', error);
      toast.error('حدث خطأ أثناء رفع الصور');
    } finally {
      setIsUploading(false);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
    
    // Reset the input value to allow uploading the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="space-y-3">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        multiple 
        className="hidden" 
      />
      
      <div 
        className={cn(
          "grid grid-cols-2 md:grid-cols-3 gap-2",
          images.length === 0 && "grid-cols-1"
        )}
      >
        <AnimatePresence>
          {images.map((image, index) => (
            <ImagePreview
              key={`${image}-${index}`}
              imageUrl={image}
              index={index}
              onRemove={handleRemoveImage}
            />
          ))}
          
          {images.length < maxImages && (
            <UploadDropZone
              isDragging={isDragging}
              isUploading={isUploading}
              onClick={triggerFileInput}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              isEmpty={images.length === 0}
            />
          )}
        </AnimatePresence>
      </div>
      
      {images.length > 0 && (
        <p className="text-xs text-gray-500 text-center">
          الصورة الأولى هي الصورة الرئيسية للمنتج ({images.length} من {maxImages})
        </p>
      )}
    </div>
  );
};

export default ImageUploadGrid;

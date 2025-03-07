
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon, Plus, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { uploadProductImage } from "@/utils/product-helpers";

interface ImageUploadGridProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  storeId?: string;
}

const ImageUploadGrid: React.FC<ImageUploadGridProps> = ({
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
  
  const handleUrlInput = () => {
    const url = prompt("أدخل رابط الصورة");
    if (url && url.trim() !== "") {
      handleAddImage(url.trim());
    }
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
      
      // Check for files
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFileUpload(files);
      }
    }
  };
  
  const handleFileUpload = async (files: FileList) => {
    if (images.length + files.length > maxImages) {
      toast.error(`لا يمكن إضافة أكثر من ${maxImages} صور`);
      return;
    }
    
    if (!storeId) {
      toast.error("Store ID is required for uploading images");
      return;
    }
    
    setIsUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        // Use the helper function to upload to Supabase storage
        const publicUrl = await uploadProductImage(file, storeId);
        return publicUrl;
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error(`فشل رفع الصورة ${file.name}`);
        return null;
      }
    });
    
    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter(url => url !== null) as string[];
      
      onImagesChange([...images, ...validUrls]);
      toast.success(`تم رفع ${validUrls.length} صورة بنجاح`);
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
          "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2",
          images.length === 0 && "grid-cols-1"
        )}
      >
        <AnimatePresence>
          {images.map((image, index) => (
            <motion.div 
              key={`${image}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative group aspect-square rounded-md overflow-hidden border border-gray-200"
            >
              <img 
                src={image} 
                alt={`صورة المنتج ${index + 1}`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => handleRemoveImage(index)}
                  className="h-7 w-7 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              {index === 0 && (
                <div className="absolute top-1 right-1 bg-purple-100 text-purple-800 px-1 py-0.5 rounded text-[9px] font-medium">
                  رئيسية
                </div>
              )}
            </motion.div>
          ))}
          
          {images.length < maxImages && (
            <motion.div
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              className={cn(
                "border-2 border-dashed rounded-md p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all aspect-square",
                isDragging 
                  ? "border-purple-400 bg-purple-50" 
                  : "border-gray-300 hover:border-purple-300 hover:bg-purple-50/50",
                images.length === 0 && "col-span-full h-28 md:h-40",
                isUploading && "opacity-50 pointer-events-none"
              )}
              onClick={triggerFileInput}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isUploading ? (
                <>
                  <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-xs font-medium text-purple-700">
                    جاري الرفع...
                  </p>
                </>
              ) : (
                <>
                  <div className="rounded-full bg-purple-100 p-2 mb-1">
                    <FileImage className="h-4 w-4 text-purple-500" />
                  </div>
                  <p className="text-xs font-medium mb-1 text-purple-700">
                    إضافة صورة
                  </p>
                  <p className="text-[10px] text-gray-500">
                    اضغط لاختيار ملف أو اسحب وأفلت
                  </p>
                </>
              )}
            </motion.div>
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


import React, { useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ImageUploadProps } from "./types";
import ImagePreview from "./ImagePreview";
import UploadDropZone from "./UploadDropZone";
import UploadErrorAlert from "./UploadErrorAlert";
import BucketCheckingState from "./BucketCheckingState";
import { useImageUpload } from "./hooks/useImageUpload";

const ImageUploadGrid: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
  storeId
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    isDragging,
    setIsDragging,
    isUploading,
    isCheckingBucket,
    uploadError,
    handleFileUpload,
    retryUpload
  } = useImageUpload(storeId, images, maxImages);
  
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
        handleFileUpload(files, onImagesChange);
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
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files, onImagesChange);
    }
    
    // Reset the input value to allow uploading the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  if (isCheckingBucket) {
    return <BucketCheckingState />;
  }
  
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
      
      {uploadError && (
        <UploadErrorAlert 
          errorMessage={uploadError}
          onRetry={retryUpload}
          isRetrying={isCheckingBucket}
        />
      )}
      
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
          
          {images.length < maxImages && !uploadError && (
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


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploadGridProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageUploadGrid: React.FC<ImageUploadGridProps> = ({
  images,
  onImagesChange,
  maxImages = 5
}) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleAddImage = (url: string) => {
    if (images.length < maxImages) {
      onImagesChange([...images, url]);
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
    
    const items = e.dataTransfer.items;
    if (items) {
      // استخدم for loop بدلاً من forEach لأننا قد نحتاج للخروج منها مبكراً
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
  };
  
  return (
    <div className="space-y-3">
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
                images.length === 0 && "col-span-full h-28 md:h-40"
              )}
              onClick={handleUrlInput}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="rounded-full bg-purple-100 p-2 mb-1">
                <Plus className="h-3 w-3 text-purple-500" />
              </div>
              <p className="text-xs font-medium mb-1 text-purple-700">
                إضافة صورة
              </p>
              <p className="text-[10px] text-gray-500">
                اسحب وأفلت أو انقر لإضافة رابط
              </p>
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

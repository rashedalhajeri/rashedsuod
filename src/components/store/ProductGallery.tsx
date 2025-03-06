
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GalleryImage {
  original: string;
  thumbnail: string;
}

interface ProductGalleryProps {
  images: GalleryImage[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center">
        <ImageIcon className="h-16 w-16 text-gray-400 mb-3" />
        <p className="text-gray-500">لا توجد صور متاحة للمنتج</p>
      </div>
    );
  }
  
  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  
  const selectImage = (index: number) => {
    setCurrentIndex(index);
  };
  
  return (
    <div className="space-y-4">
      {/* الصورة الرئيسية */}
      <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
        <img 
          src={images[currentIndex].original} 
          alt="صورة المنتج" 
          className="w-full h-full object-contain"
        />
        
        {images.length > 1 && (
          <>
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute top-1/2 right-2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-white/70 hover:bg-white border border-gray-200 shadow-sm"
              onClick={prevImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute top-1/2 left-2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-white/70 hover:bg-white border border-gray-200 shadow-sm"
              onClick={nextImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </>
        )}
        
        {/* نقاط التنقل للصور على الموبايل */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center justify-center space-x-1.5 rtl:space-x-reverse">
            {images.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all focus:outline-none",
                  currentIndex === index 
                    ? "bg-blue-600 w-3" 
                    : "bg-gray-300 hover:bg-gray-400"
                )}
                onClick={() => selectImage(index)}
                aria-label={`انتقل للصورة ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* الصور المصغرة - للشاشات الكبيرة */}
      {images.length > 1 && (
        <div className="flex items-center space-x-2 space-x-reverse overflow-x-auto scrollbar-hide pb-2">
          {images.map((image, index) => (
            <div 
              key={index}
              className={cn(
                "w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 cursor-pointer transition-all duration-200",
                currentIndex === index 
                  ? "border-blue-600 ring-2 ring-blue-100" 
                  : "border-transparent hover:border-gray-300"
              )}
              onClick={() => selectImage(index)}
            >
              <img 
                src={image.thumbnail} 
                alt={`صورة مصغرة ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;

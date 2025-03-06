
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">لا توجد صور متاحة</p>
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
      <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
        <img 
          src={images[currentIndex].original} 
          alt="Product image" 
          className="w-full h-full object-contain"
        />
        
        {images.length > 1 && (
          <>
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute top-1/2 right-2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-white/70 hover:bg-white"
              onClick={prevImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute top-1/2 left-2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-white/70 hover:bg-white"
              onClick={nextImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      
      {/* الصور المصغرة */}
      {images.length > 1 && (
        <div className="flex items-center space-x-2 space-x-reverse overflow-x-auto pb-2">
          {images.map((image, index) => (
            <div 
              key={index}
              className={`w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 cursor-pointer 
                ${currentIndex === index ? 'border-blue-600' : 'border-transparent'}`}
              onClick={() => selectImage(index)}
            >
              <img 
                src={image.thumbnail} 
                alt={`Thumbnail ${index + 1}`} 
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

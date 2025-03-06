
import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductGalleryProps {
  product: any;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ product }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Get all product images
  const allImages = (() => {
    const images = [];
    
    if (product.image_url) {
      images.push(product.image_url);
    }
    
    if (product.additional_images && Array.isArray(product.additional_images)) {
      images.push(...product.additional_images);
    }
    
    return images.length > 0 ? images : ['/placeholder.svg'];
  })();
  
  const handlePrevImage = () => {
    setActiveImageIndex((prev) => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };
  
  const handleNextImage = () => {
    setActiveImageIndex((prev) => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border">
        <img 
          src={allImages[activeImageIndex]} 
          alt={product.name} 
          className="w-full h-full object-contain"
        />
        
        {allImages.length > 1 && (
          <>
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-white/80"
              onClick={handlePrevImage}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-white/80"
              onClick={handleNextImage}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto py-2 px-1">
          {allImages.map((image, index) => (
            <button 
              key={index}
              className={`relative w-16 h-16 rounded border ${
                index === activeImageIndex 
                  ? 'border-blue-600 ring-2 ring-blue-300' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setActiveImageIndex(index)}
              aria-label={`صورة ${index + 1}`}
            >
              <img 
                src={image} 
                alt={`صورة ${index + 1}`}
                className="w-full h-full object-cover rounded"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;

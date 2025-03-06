
import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Maximize, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

interface ProductGalleryProps {
  product: any;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ product }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(0);
  
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
  
  const handleFullscreenPrev = () => {
    setFullscreenImageIndex((prev) => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };
  
  const handleFullscreenNext = () => {
    setFullscreenImageIndex((prev) => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };
  
  const handleOpenFullscreen = (index: number) => {
    setFullscreenImageIndex(index);
  };
  
  return (
    <div className="space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border cursor-pointer group">
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-white/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            )}
            
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-white/80"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenFullscreen(activeImageIndex);
                }}
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogTrigger>
        
        <DialogContent className="max-w-4xl w-full" dir="rtl">
          <div className="relative aspect-square w-full">
            <img 
              src={allImages[fullscreenImageIndex]} 
              alt={`صورة كبيرة ${fullscreenImageIndex + 1}`}
              className="w-full h-full object-contain"
            />
            
            {allImages.length > 1 && (
              <>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-white/80"
                  onClick={handleFullscreenPrev}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-white/80"
                  onClick={handleFullscreenNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
            
            <DialogClose className="absolute top-2 left-2">
              <Button variant="outline" size="sm">إغلاق</Button>
            </DialogClose>
          </div>
          
          {allImages.length > 1 && (
            <div className="flex justify-center gap-2 overflow-x-auto py-4">
              {allImages.map((image, index) => (
                <button 
                  key={index}
                  className={`relative w-16 h-16 rounded border ${
                    index === fullscreenImageIndex 
                      ? 'border-blue-600 ring-2 ring-blue-300' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFullscreenImageIndex(index)}
                  aria-label={`صورة ${index + 1}`}
                >
                  <img 
                    src={image} 
                    alt={`صورة مصغرة ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
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

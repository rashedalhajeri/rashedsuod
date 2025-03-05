
import React, { useState } from "react";

interface ProductGalleryProps {
  mainImage: string | null;
  additionalImages: string[];
  productName: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ 
  mainImage, 
  additionalImages, 
  productName 
}) => {
  const [activeImage, setActiveImage] = useState<string | null>(mainImage);
  
  const allImages = [
    ...(mainImage ? [mainImage] : []),
    ...additionalImages
  ].filter(Boolean);

  const handleImageChange = (image: string) => {
    setActiveImage(image);
  };

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
        {activeImage ? (
          <img 
            src={activeImage} 
            alt={productName} 
            className="w-full h-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <img src="/placeholder.svg" alt="Placeholder" className="w-16 h-16 opacity-50" />
          </div>
        )}
      </div>

      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto py-2 px-1">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleImageChange(image)}
              className={`relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border transition-all ${
                activeImage === image ? "border-primary ring-2 ring-primary ring-opacity-30" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={image}
                alt={`${productName} - ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;

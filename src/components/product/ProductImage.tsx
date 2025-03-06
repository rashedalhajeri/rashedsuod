
import React, { useState } from "react";
import { Share, Heart } from "lucide-react";

interface ProductImageProps {
  imageUrl: string | null;
  name: string;
  discount_percentage?: number;
  is_new?: boolean;
  storeLogo?: string | null;
  storeName?: string | null;
}

const ProductImage: React.FC<ProductImageProps> = ({
  imageUrl,
  name,
  discount_percentage,
  is_new,
  storeLogo,
  storeName
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Default placeholder for products without images
  const defaultPlaceholder = "/placeholder.svg";
  
  // Placeholder for a gallery of images
  const images = [imageUrl];
  
  return (
    <div className="relative">
      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
        <img 
          src={imageUrl || defaultPlaceholder} 
          alt={name}
          className={`w-full h-full object-contain ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            (e.target as HTMLImageElement).onerror = null;
            (e.target as HTMLImageElement).src = defaultPlaceholder;
            setImageLoaded(true);
          }}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}
      </div>
      
      {/* Image pagination indicators */}
      <div className="flex justify-center -mt-6 relative z-10">
        <div className="flex gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
          {[0, 1, 2].map((index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </div>
      
      {/* Actions row */}
      <div className="flex justify-between items-center p-4">
        <div className="flex space-x-4 space-x-reverse">
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-blue-500">
            <Share className="h-5 w-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <Heart className="h-5 w-5" />
          </button>
        </div>
        
        {/* Store logo and name */}
        <div className="flex items-center">
          <span className="text-gray-700 ml-2 font-medium">{storeName || 'المتجر'}</span>
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-teal-500 bg-white flex items-center justify-center">
            {storeLogo ? (
              <img 
                src={storeLogo} 
                alt={storeName || 'المتجر'} 
                className="w-10 h-10 object-contain" 
                onError={(e) => {
                  (e.target as HTMLImageElement).onerror = null;
                  (e.target as HTMLImageElement).src = defaultPlaceholder;
                }}
              />
            ) : (
              <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                {(storeName || 'م').charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImage;

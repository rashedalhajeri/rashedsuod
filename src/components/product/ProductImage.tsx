
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface ProductImageProps {
  imageUrl: string | null;
  name: string;
  discount_percentage?: number;
  is_new?: boolean;
}

const ProductImage: React.FC<ProductImageProps> = ({
  imageUrl,
  name,
  discount_percentage,
  is_new
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <div className="bg-white rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-all">
      <div className="relative aspect-square bg-gray-100 animate-pulse flex items-center justify-center">
        <img 
          src={imageUrl || "/placeholder.svg"} 
          alt={name}
          className={`w-full h-full object-contain ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          onError={(e) => {
            (e.target as HTMLImageElement).onerror = null;
            (e.target as HTMLImageElement).src = "/placeholder.svg";
            setImageLoaded(true);
          }}
          onLoad={() => {
            setImageLoaded(true);
          }}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}
        {/* Badges & Actions */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {discount_percentage && discount_percentage > 0 && (
            <Badge className="bg-red-500 text-white">خصم {discount_percentage}%</Badge>
          )}
          {is_new && (
            <Badge className="bg-green-500 text-white">جديد</Badge>
          )}
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-primary/10 hover:text-primary"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductImage;

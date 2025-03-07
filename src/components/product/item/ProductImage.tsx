
import React from "react";

interface ProductImageProps {
  imageUrl: string;
  name: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({ imageUrl, name }) => {
  return (
    <div className="h-16 w-16 sm:h-14 sm:w-14 rounded-xl overflow-hidden border border-gray-100 shadow-sm flex-shrink-0 bg-white">
      <img
        src={imageUrl}
        alt={name}
        className="h-full w-full object-cover"
      />
    </div>
  );
};

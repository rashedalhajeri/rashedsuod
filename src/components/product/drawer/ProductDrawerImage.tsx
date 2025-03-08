
import React from "react";

interface ProductDrawerImageProps {
  imageUrl: string;
  productName: string;
}

const ProductDrawerImage: React.FC<ProductDrawerImageProps> = ({ imageUrl, productName }) => {
  return (
    <div className="aspect-square w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center mb-4">
      <img
        src={imageUrl}
        alt={productName}
        className="h-full w-full object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/placeholder.svg";
        }}
      />
    </div>
  );
};

export default ProductDrawerImage;

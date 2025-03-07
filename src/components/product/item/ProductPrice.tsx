
import React from "react";
import { formatPrice } from "@/lib/utils";

interface ProductPriceProps {
  price: number;
  discountPrice: number | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const ProductPrice: React.FC<ProductPriceProps> = ({ 
  price, 
  discountPrice, 
  className = "",
  size = "md"
}) => {
  const hasDiscount = discountPrice !== null && discountPrice > 0 && discountPrice < price;
  
  // Define font sizes based on component size
  let priceSize = "text-xl"; // Default size
  
  if (size === "sm") {
    priceSize = "text-lg";
  } else if (size === "lg") {
    priceSize = "text-2xl";
  }

  return (
    <div className={`flex items-center ltr ${className}`}>
      {hasDiscount ? (
        <span className={`font-bold text-primary ${priceSize} force-en-nums`}>
          {formatPrice(discountPrice as number)}
        </span>
      ) : (
        <span className={`font-bold text-gray-800 ${priceSize} force-en-nums`}>
          {formatPrice(price)}
        </span>
      )}
    </div>
  );
};

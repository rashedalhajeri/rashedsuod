
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
  let priceSize = "text-sm"; // Default size
  let discountSize = "text-xs";
  
  if (size === "sm") {
    priceSize = "text-sm";
    discountSize = "text-xs";
  } else if (size === "lg") {
    priceSize = "text-base";
    discountSize = "text-xs";
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {hasDiscount ? (
        <>
          <span className={`font-bold text-red-600 ${priceSize} force-en-nums`}>
            {formatPrice(discountPrice as number)}
          </span>
          <span className={`text-gray-400 ${discountSize} line-through force-en-nums`}>
            {formatPrice(price)}
          </span>
        </>
      ) : (
        <span className={`font-bold text-gray-800 ${priceSize} force-en-nums`}>
          {formatPrice(price)}
        </span>
      )}
    </div>
  );
};


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
  
  // تحديد أحجام الخط بناءً على حجم المكون
  let priceSize = "text-base"; // Increased from text-sm
  let discountSize = "text-sm"; // Increased from text-xs
  
  if (size === "sm") {
    priceSize = "text-sm"; // Increased from text-xs
    discountSize = "text-xs"; // Increased from text-[10px]
  } else if (size === "lg") {
    priceSize = "text-lg"; // Increased from text-base
    discountSize = "text-base"; // Increased from text-sm
  }

  return (
    <div className={`flex items-center gap-3 mr-2 ${className}`} dir="ltr">
      {hasDiscount ? (
        <>
          <span className={`font-medium text-primary ${priceSize}`}>
            {formatPrice(discountPrice as number)}
          </span>
          <span className={`line-through text-gray-400 ${discountSize}`}>
            {formatPrice(price)}
          </span>
        </>
      ) : (
        <span className={`font-medium text-gray-800 ${priceSize}`}>
          {formatPrice(price)}
        </span>
      )}
    </div>
  );
};

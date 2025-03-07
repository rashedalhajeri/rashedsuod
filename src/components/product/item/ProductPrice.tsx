
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
  let priceSize = "text-lg"; // Increased size
  let discountSize = "text-base"; // Increased size
  
  if (size === "sm") {
    priceSize = "text-base"; // Increased size
    discountSize = "text-sm"; // Increased size
  } else if (size === "lg") {
    priceSize = "text-xl"; // Increased size
    discountSize = "text-lg"; // Increased size
  }

  return (
    <div className={`flex items-center gap-3 mr-4 ${className}`} dir="ltr">
      {hasDiscount ? (
        <span className={`font-bold text-primary ${priceSize}`}>
          {formatPrice(discountPrice as number)}
        </span>
      ) : (
        <span className={`font-bold text-gray-800 ${priceSize}`}>
          {formatPrice(price)}
        </span>
      )}
    </div>
  );
};

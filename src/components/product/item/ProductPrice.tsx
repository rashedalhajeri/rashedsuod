
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
  let priceSize = "text-sm";
  let discountSize = "text-xs";
  
  if (size === "sm") {
    priceSize = "text-xs";
    discountSize = "text-[10px]";
  } else if (size === "lg") {
    priceSize = "text-base";
    discountSize = "text-sm";
  }
  
  // حساب نسبة الخصم
  const discountPercentage = hasDiscount ? Math.round((1 - (discountPrice as number) / price) * 100) : null;

  return (
    <div className={`flex items-center gap-2 ${className}`} dir="rtl">
      {hasDiscount ? (
        <>
          <span className={`font-medium text-primary ${priceSize}`}>
            {formatPrice(discountPrice as number)}
          </span>
          <span className={`line-through text-gray-400 ${discountSize}`}>
            {formatPrice(price)}
          </span>
          {discountPercentage !== null && discountPercentage > 0 && (
            <span className={`text-red-500 ${discountSize}`}>
              ({discountPercentage}%-) خصم
            </span>
          )}
        </>
      ) : (
        <span className={`font-medium text-gray-800 ${priceSize}`}>
          {formatPrice(price)}
        </span>
      )}
    </div>
  );
};


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
  let priceSize = "text-xl"; // Increased size further
  
  if (size === "sm") {
    priceSize = "text-lg"; // Increased size
  } else if (size === "lg") {
    priceSize = "text-2xl"; // Increased size
  }

  // Helper function to ensure numbers are displayed in English format
  const formatEnglishNumbers = (formattedPrice: string): string => {
    return formattedPrice.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
  };

  return (
    <div className={`flex items-center gap-3 mr-6 ltr ${className}`}>
      {hasDiscount ? (
        <span className={`font-bold text-primary ${priceSize} force-en-nums`}>
          {formatEnglishNumbers(formatPrice(discountPrice as number))}
        </span>
      ) : (
        <span className={`font-bold text-gray-800 ${priceSize} force-en-nums`}>
          {formatEnglishNumbers(formatPrice(price))}
        </span>
      )}
    </div>
  );
};

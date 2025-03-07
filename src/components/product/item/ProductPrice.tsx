
import React from "react";
import { getCurrencyFormatter } from "@/hooks/use-store-data";

interface ProductPriceProps {
  price: number;
  discountPrice: number | null;
}

export const ProductPrice: React.FC<ProductPriceProps> = ({ price, discountPrice }) => {
  const formatCurrency = getCurrencyFormatter();
  const hasDiscount = discountPrice !== null && discountPrice !== undefined;
  
  return (
    <div className="flex items-center text-sm mt-2">
      {hasDiscount ? (
        <div className="flex gap-1.5 items-center">
          <span className="text-red-600 font-bold">{formatCurrency(discountPrice!)}</span>
          <span className="line-through text-gray-500 text-xs">{formatCurrency(price)}</span>
        </div>
      ) : (
        <span className="font-bold text-gray-900">{formatCurrency(price)}</span>
      )}
    </div>
  );
};

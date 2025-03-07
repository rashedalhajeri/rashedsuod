
import React from "react";
import { getCurrencyFormatter } from "@/hooks/use-store-data";
import { BadgePercent } from "lucide-react";

interface ProductPriceProps {
  price: number;
  discountPrice: number | null;
}

export const ProductPrice: React.FC<ProductPriceProps> = ({ price, discountPrice }) => {
  const formatCurrency = getCurrencyFormatter();
  const hasDiscount = discountPrice !== null && discountPrice !== undefined && discountPrice < price;
  const discountPercentage = hasDiscount ? Math.round(((price - discountPrice!) / price) * 100) : 0;
  
  return (
    <div className="flex items-center text-sm mt-2">
      {hasDiscount ? (
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 items-center">
            <span className="text-red-600 font-bold">{formatCurrency(discountPrice!)}</span>
            <span className="line-through text-gray-500 text-xs">{formatCurrency(price)}</span>
          </div>
          <div className="flex items-center gap-0.5 bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full text-xs">
            <BadgePercent className="h-3 w-3" />
            <span>-{discountPercentage}%</span>
          </div>
        </div>
      ) : (
        <span className="font-bold text-gray-900">{formatCurrency(price)}</span>
      )}
    </div>
  );
};

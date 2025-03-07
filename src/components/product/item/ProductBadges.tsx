
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/utils/products/types";
import { Fire, Sparkles, Percent, Tag } from "lucide-react";

interface ProductBadgesProps {
  product: Product;
  size?: "sm" | "md";
}

export const ProductBadges: React.FC<ProductBadgesProps> = ({ product, size = "sm" }) => {
  const {
    discount_price,
    is_featured,
    sales_count,
    has_colors,
    has_sizes,
  } = product;

  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";
  const height = size === "sm" ? "h-5" : "h-6";

  const hasDiscount = discount_price !== null && discount_price > 0;
  const isBestSeller = sales_count >= 5; // افتراضيًا إذا كان أكثر من 5 مبيعات

  return (
    <>
      {hasDiscount && (
        <Badge variant="secondary" className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 flex gap-1 items-center px-1.5" style={{ height }}>
          <Percent className={iconSize} />
          <span className={textSize}>خصم</span>
        </Badge>
      )}
      
      {is_featured && (
        <Badge variant="secondary" className="bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 flex gap-1 items-center px-1.5" style={{ height }}>
          <Sparkles className={iconSize} />
          <span className={textSize}>مميز</span>
        </Badge>
      )}
      
      {isBestSeller && (
        <Badge variant="secondary" className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 flex gap-1 items-center px-1.5" style={{ height }}>
          <Fire className={iconSize} />
          <span className={textSize}>الأكثر مبيعًا</span>
        </Badge>
      )}
      
      {(has_colors || has_sizes) && (
        <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100 flex gap-1 items-center px-1.5" style={{ height }}>
          <Tag className={iconSize} />
          <span className={textSize}>{has_colors && has_sizes ? 'ألوان ومقاسات' : has_colors ? 'ألوان' : 'مقاسات'}</span>
        </Badge>
      )}
    </>
  );
};

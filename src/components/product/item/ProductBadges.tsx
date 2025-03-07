
import React from "react";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Percent, Box } from "lucide-react";
import { Product } from "@/utils/products/types";

interface ProductBadgesProps {
  product: Product;
}

export const ProductBadges: React.FC<ProductBadgesProps> = ({ product }) => {
  const { is_featured, discount_price, track_inventory } = product;

  return (
    <>
      {is_featured && (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex gap-1 h-5 px-1.5 items-center">
          <TrendingUp className="h-3 w-3" />
          <span className="text-[10px]">مميز</span>
        </Badge>
      )}
      
      {/* سنعرض علامة خصم واحدة فقط بدلاً من تكرارها في مكان آخر */}
      {discount_price && discount_price < price && (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex gap-1 h-5 px-1.5 items-center">
          <Percent className="h-3 w-3" />
          <span className="text-[10px]">خصم</span>
        </Badge>
      )}
      
      {/* لن نعرض شارة تتبع المخزون لأنها ليست مهمة للمستخدم */}
      {/* {track_inventory && (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex gap-1 h-5 px-1.5 items-center">
          <Box className="h-3 w-3" />
          <span className="text-[10px]">تتبع المخزون</span>
        </Badge>
      )} */}
    </>
  );
};

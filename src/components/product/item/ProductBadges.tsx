
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/utils/products/types";

interface ProductBadgesProps {
  product: Product;
}

export const ProductBadges: React.FC<ProductBadgesProps> = ({ product }) => {
  const { track_inventory, stock_quantity, category, is_archived, is_active } = product;

  // Show different stock status badges
  const getStockBadge = () => {
    if (!track_inventory) return (
      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">كمية غير محدودة</Badge>
    );
    
    if (stock_quantity <= 0) {
      return <Badge variant="destructive" className="text-xs">نفذت الكمية</Badge>;
    } else if (stock_quantity <= 5) {
      return <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">كمية منخفضة</Badge>;
    }
    
    return <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">{stock_quantity} متوفر</Badge>;
  };

  return (
    <div className="flex flex-wrap gap-1.5 mb-1">
      {getStockBadge()}
      
      {category && (
        <Badge variant="outline" className="text-xs">
          {category.name}
        </Badge>
      )}

      {is_archived && (
        <Badge variant="outline" className="text-xs bg-gray-50 text-gray-500 border-gray-200">مؤرشف</Badge>
      )}
      
      {!is_active && !is_archived && (
        <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-600 border-yellow-200">غير نشط</Badge>
      )}
    </div>
  );
};

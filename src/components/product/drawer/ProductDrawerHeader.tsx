
import React from "react";
import { DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/utils/products/types";

interface ProductDrawerHeaderProps {
  product: Product;
}

const ProductDrawerHeader: React.FC<ProductDrawerHeaderProps> = ({ product }) => {
  return (
    <DrawerHeader>
      <DrawerTitle className="text-lg font-semibold flex items-center justify-between">
        <span>تفاصيل المنتج</span>
        {product.is_active ? (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            نشط
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
            غير نشط
          </Badge>
        )}
      </DrawerTitle>
      <DrawerDescription>إدارة المنتج أو عرض التفاصيل</DrawerDescription>
    </DrawerHeader>
  );
};

export default ProductDrawerHeader;

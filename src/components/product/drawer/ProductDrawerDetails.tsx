
import React from "react";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/currency";
import { Product } from "@/utils/products/types";

interface ProductDrawerDetailsProps {
  product: Product;
}

const ProductDrawerDetails: React.FC<ProductDrawerDetailsProps> = ({ product }) => {
  return (
    <>
      <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
      
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl font-bold text-green-600">
          {formatCurrency(product.discount_price || product.price)}
        </span>
        {product.discount_price && (
          <span className="text-sm line-through text-gray-400">
            {formatCurrency(product.price)}
          </span>
        )}
      </div>

      {product.description && (
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          {product.description}
        </p>
      )}

      <div className="space-y-2 text-sm">
        {product.category && (
          <div className="flex justify-between">
            <span className="text-gray-500">الفئة:</span>
            <span>{product.category.name}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-gray-500">المخزون:</span>
          <span>
            {product.track_inventory
              ? `${product.stock_quantity || 0} قطعة`
              : "غير محدود"}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-500">تاريخ الإضافة:</span>
          <span>
            {new Date(product.created_at).toLocaleDateString("ar-EG")}
          </span>
        </div>
      </div>

      <Separator className="my-4" />
    </>
  );
};

export default ProductDrawerDetails;

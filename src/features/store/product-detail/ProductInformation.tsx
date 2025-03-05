
import React from "react";
import { Badge } from "@/components/ui/badge";

interface ProductInformationProps {
  product: any;
  formattedPrice: string;
}

const ProductInformation: React.FC<ProductInformationProps> = ({ 
  product, 
  formattedPrice 
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">{formattedPrice}</span>
          {product.stock_quantity <= 0 && (
            <Badge variant="destructive">غير متوفر</Badge>
          )}
          {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
              كمية محدودة
            </Badge>
          )}
        </div>
      </div>

      {product.description && (
        <div className="py-4 border-t border-b border-gray-100">
          <h2 className="text-lg font-medium mb-2">الوصف</h2>
          <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
        </div>
      )}
    </div>
  );
};

export default ProductInformation;


import React from "react";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductActionsProps {
  quantity: number;
  onQuantityChange: (type: 'increase' | 'decrease') => void;
  onAddToCart: () => void;
  isOutOfStock?: boolean;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  quantity,
  onQuantityChange,
  onAddToCart,
  isOutOfStock = false
}) => {
  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div className="flex items-center justify-between">
        <span className="text-gray-700 font-medium">الكمية</span>
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => onQuantityChange('decrease')}
            disabled={quantity <= 1 || isOutOfStock}
            className="px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            aria-label="تقليل الكمية"
          >
            <Minus className="h-4 w-4" />
          </button>
          
          <span className="w-12 text-center font-medium">{quantity}</span>
          
          <button
            onClick={() => onQuantityChange('increase')}
            disabled={isOutOfStock}
            className="px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            aria-label="زيادة الكمية"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Add to cart button */}
      <Button
        onClick={onAddToCart}
        disabled={isOutOfStock}
        variant="default"
        size="lg"
        className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12"
      >
        <ShoppingCart className="h-5 w-5 ml-2" />
        {isOutOfStock ? 'نفدت الكمية' : 'إضافة إلى السلة'}
      </Button>
    </div>
  );
};

export default ProductActions;


import React from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart, Heart } from "lucide-react";

interface ProductActionsProps {
  quantity: number;
  onQuantityChange: (type: 'increase' | 'decrease') => void;
  onAddToCart: () => void;
  isOutOfStock: boolean;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  quantity,
  onQuantityChange,
  onAddToCart,
  isOutOfStock
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center">
        <span className="ml-4 font-medium">الكمية:</span>
        <div className="flex items-center border rounded-md">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon"
            onClick={() => onQuantityChange('decrease')}
            disabled={quantity <= 1}
            className="hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <Button 
            type="button" 
            variant="ghost" 
            size="icon"
            onClick={() => onQuantityChange('increase')}
            disabled={isOutOfStock}
            className="hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Button 
        onClick={onAddToCart} 
        size="lg" 
        className="w-full gap-2"
        disabled={isOutOfStock}
      >
        <ShoppingCart className="ml-2 h-5 w-5" /> إضافة إلى السلة
      </Button>
      
      <Button 
        variant="outline"
        size="lg"
        className="w-full border-primary/20 text-primary hover:bg-primary/5"
      >
        <Heart className="ml-2 h-5 w-5" /> أضف للمفضلة
      </Button>
    </div>
  );
};

export default ProductActions;

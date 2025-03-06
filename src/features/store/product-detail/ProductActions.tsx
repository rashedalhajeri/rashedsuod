
import React from "react";
import { MinusCircle, PlusCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductActionsProps {
  product: any;
  quantity: number;
  setQuantity: (quantity: number) => void;
  addToCart: () => void;
  isAddingToCart: boolean;
  currency: string;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  quantity,
  setQuantity,
  addToCart,
  isAddingToCart,
  currency
}) => {
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: currency
    }).format(price);
  };
  
  const totalPrice = product.price * quantity;
  
  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };
  
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const isOutOfStock = product.stock_quantity !== null && product.stock_quantity <= 0;
  
  return (
    <div className="space-y-4 border-t pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleDecrement}
            disabled={quantity <= 1 || isOutOfStock}
            className="h-8 w-8 rounded-full"
          >
            <MinusCircle className="h-4 w-4" />
          </Button>
          
          <span className="w-8 text-center font-medium">{quantity}</span>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleIncrement}
            disabled={isOutOfStock}
            className="h-8 w-8 rounded-full"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-lg font-bold text-blue-600">
          {formatCurrency(totalPrice)}
        </div>
      </div>
      
      <Button 
        className="w-full"
        onClick={addToCart}
        disabled={isAddingToCart || isOutOfStock}
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        {isOutOfStock ? 'غير متوفر حالياً' : 'إضافة إلى السلة'}
      </Button>
    </div>
  );
};

export default ProductActions;

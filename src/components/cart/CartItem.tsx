
import React from "react";
import { Link } from "react-router-dom";
import { Trash, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image_url?: string | null;
  };
  storeDomain: string;
  currency: string;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  storeDomain,
  currency,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-4 space-x-reverse">
        <div className="h-24 w-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border">
          <img 
            src={item.image_url || "/placeholder.svg"} 
            alt={item.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
        
        <div className="flex-grow">
          <Link 
            to={`/store/${storeDomain}/product/${item.id}`} 
            className="font-medium text-lg hover:text-primary transition-colors"
          >
            {item.name}
          </Link>
          
          <div className="flex justify-between items-end mt-2">
            <div className="flex items-center mt-3">
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                className="h-8 w-8 rounded-r-md"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <div className="h-8 px-4 flex items-center justify-center border-t border-b text-sm">
                {item.quantity}
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                className="h-8 w-8 rounded-l-md"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="space-y-1 text-left">
              <div className="text-gray-500 text-sm">سعر القطعة</div>
              <div className="font-semibold">{item.price.toFixed(2)} {currency}</div>
            </div>
            
            <div className="space-y-1 text-left">
              <div className="text-gray-500 text-sm">المجموع</div>
              <div className="font-bold text-primary">
                {(item.price * item.quantity).toFixed(2)} {currency}
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onRemove(item.id)}
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors ml-1"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

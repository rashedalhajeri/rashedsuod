
import React from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
}

interface CartItemsPreviewProps {
  items: CartItem[];
  currency: string;
}

const CartItemsPreview: React.FC<CartItemsPreviewProps> = ({ items, currency }) => {
  return (
    <div className="divide-y max-h-80 overflow-y-auto">
      {items.map(item => (
        <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-start space-x-3 space-x-reverse">
            <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden border flex-shrink-0">
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
              <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
              <div className="flex justify-between items-center mt-1">
                <div className="text-gray-600 text-sm">
                  {item.quantity} × {item.price} {currency}
                </div>
                
                <div className="font-semibold text-primary">
                  {(item.price * item.quantity).toFixed(2)} {currency}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItemsPreview;

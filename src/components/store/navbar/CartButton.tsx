
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CartButtonProps {
  storeDomain: string;
  totalItems: number;
}

const CartButton: React.FC<CartButtonProps> = ({ 
  storeDomain, 
  totalItems 
}) => {
  return (
    <Link to={`/store/${storeDomain}/cart`}>
      <Button 
        variant="ghost" 
        size="sm" 
        className="relative text-gray-700 hover:bg-gray-100 rounded-full"
        aria-label="عربة التسوق"
      >
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-primary text-white text-xs h-5 min-w-5 flex items-center justify-center rounded-full px-1">
            {totalItems}
          </Badge>
        )}
      </Button>
    </Link>
  );
};

export default CartButton;

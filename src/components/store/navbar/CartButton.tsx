
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
        className="relative text-white bg-transparent hover:bg-white/10 rounded-full"
        aria-label="عربة التسوق"
      >
        <ShoppingCart className="h-6 w-6" />
        {totalItems > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs h-5 min-w-5 flex items-center justify-center rounded-full px-1">
            {totalItems}
          </Badge>
        )}
      </Button>
    </Link>
  );
};

export default CartButton;

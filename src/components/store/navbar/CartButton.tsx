
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
        className="relative text-white p-0 hover:bg-transparent"
        aria-label="عربة التسوق"
      >
        <ShoppingCart className="h-7 w-7" />
        {totalItems > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-5 min-w-5 flex items-center justify-center rounded-full px-1 border border-white/20 shadow-sm">
            {totalItems}
          </Badge>
        )}
      </Button>
    </Link>
  );
};

export default CartButton;

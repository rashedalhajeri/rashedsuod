
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ShoppingCart } from "lucide-react";

interface CartHeaderProps {
  storeDomain: string;
}

const CartHeader: React.FC<CartHeaderProps> = ({ storeDomain }) => {
  return (
    <div className="bg-gradient-to-b from-primary/10 to-transparent py-6">
      <div className="container mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link to={`/store/${storeDomain}`} className="hover:text-primary transition-colors">
            الرئيسية
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-primary">سلة التسوق</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">
          سلة التسوق <ShoppingCart className="inline-block h-7 w-7 mr-2 text-primary" />
        </h1>
      </div>
    </div>
  );
};

export default CartHeader;

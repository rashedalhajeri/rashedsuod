
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";

interface CategoryHeaderProps {
  headerTitle: string;
  storeDomain?: string;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ 
  headerTitle, 
  storeDomain 
}) => {
  const navigate = useNavigate();
  const { cart } = useCart();
  
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleNavigateToStore = () => {
    navigate(`/store/${storeDomain}`);
  };

  return (
    <header className="bg-gradient-to-l from-blue-600 to-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 relative z-10">
        <div className="flex items-center justify-between">
          {/* Left side: Back button with category name */}
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="text-white p-0 h-9 w-9 mr-2 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              onClick={handleNavigateToStore}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium">{headerTitle}</h1>
          </div>
          
          {/* Right side: Cart button only */}
          <Link to={`/store/${storeDomain}/cart`} className="block">
            <Button 
              variant="ghost" 
              size="icon"
              className="relative text-white h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              aria-label="عربة التسوق"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] h-5 min-w-5 flex items-center justify-center rounded-full px-1 border border-white/20 shadow-md">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default CategoryHeader;


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
    <header className="relative w-full" dir="rtl">
      {/* Blue gradient background with curved design at the bottom */}
      <div className="bg-gradient-to-l from-blue-500 to-blue-600 pt-6 pb-10 px-3 sm:px-4 relative">
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50" style={{ 
          borderTopLeftRadius: '2rem', 
          borderTopRightRadius: '2rem',
          transform: 'translateY(50%)'
        }}></div>
        
        <div className="mx-auto max-w-7xl w-full">
          <div className="flex items-center justify-between">
            {/* Left side: Back button with category name */}
            <div className="flex items-center gap-2 sm:gap-3 text-white">
              <Button 
                variant="ghost" 
                className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 flex items-center justify-center"
                onClick={handleNavigateToStore}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
              <h1 className="font-bold text-lg tracking-wide">{headerTitle}</h1>
            </div>
            
            {/* Right side: Cart button only */}
            <Link to={`/store/${storeDomain}/cart`} className="block">
              <Button 
                variant="ghost" 
                size="icon"
                className="relative h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 flex items-center justify-center"
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
        
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-white/5 rounded-full blur-xl -mb-8 -ml-8"></div>
          <div className="absolute bottom-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-blue-500/10 rounded-full blur-xl -mb-10 -mr-10"></div>
        </div>
      </div>
    </header>
  );
};

export default CategoryHeader;

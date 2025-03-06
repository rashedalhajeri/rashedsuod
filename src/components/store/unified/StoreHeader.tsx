
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StoreHeaderProps {
  title: string;
  storeDomain?: string;
  storeName?: string;
  logoUrl?: string;
  showBackButton?: boolean;
  isMainHeader?: boolean;
}

const StoreHeader: React.FC<StoreHeaderProps> = ({ 
  title, 
  storeDomain,
  storeName,
  logoUrl,
  showBackButton = false,
  isMainHeader = false
}) => {
  const navigate = useNavigate();
  const { cart } = useCart();
  
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleNavigateBack = () => {
    if (storeDomain) {
      navigate(`/store/${storeDomain}`);
    } else {
      navigate(-1);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const initials = getInitials(storeName || "Store");

  return (
    <header className="relative w-full" dir="rtl">
      <div className="bg-gradient-to-l from-blue-500 to-blue-600 pt-6 pb-10 px-3 sm:px-4 relative">
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50" style={{ 
          borderTopLeftRadius: '2rem', 
          borderTopRightRadius: '2rem',
          transform: 'translateY(50%)'
        }}></div>
        
        <div className="mx-auto max-w-7xl w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 text-white">
              {showBackButton ? (
                <Button 
                  variant="ghost" 
                  className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 flex items-center justify-center"
                  onClick={handleNavigateBack}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              ) : isMainHeader && logoUrl ? (
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 bg-white/20 backdrop-blur-sm text-white border-2 border-white/50 shadow-lg transition-all hover:scale-105 duration-300 shrink-0">
                  {logoUrl ? (
                    <AvatarImage src={logoUrl} alt={storeName} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-500 text-white text-lg sm:text-xl font-bold">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
              ) : null}
              <div className="text-right">
                {isMainHeader && (
                  <span className="text-[10px] sm:text-xs font-medium bg-white/20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full backdrop-blur-sm text-white inline-block mb-1 shadow-sm">
                    مرحبًا
                  </span>
                )}
                <h2 className="font-bold text-base sm:text-lg tracking-wide">{isMainHeader ? storeName : title}</h2>
              </div>
            </div>
            
            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* User button */}
              {isMainHeader && (
                <Link to={`/store/${storeDomain}/profile`}>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="relative h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 flex items-center justify-center"
                    aria-label="الحساب الشخصي"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}
              
              {/* Cart button */}
              <Link to={`/store/${storeDomain}/cart`}>
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
        </div>
        
        {/* Background decoration */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-white/5 rounded-full blur-xl -mb-8 -ml-8"></div>
          <div className="absolute bottom-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-blue-500/10 rounded-full blur-xl -mb-10 -mr-10"></div>
        </div>
      </div>
    </header>
  );
};

export default StoreHeader;

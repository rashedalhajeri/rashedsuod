import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { normalizeStoreDomain } from "@/utils/url-helpers";

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
  
  // استخراج الأحرف الأولى من اسم المتجر
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const initials = getInitials(storeName || "Store");
  
  // Make sure storeDomain is lowercase for consistency
  const cleanStoreDomain = normalizeStoreDomain(storeDomain || "");

  // العودة للصفحة السابقة
  const handleNavigateBack = () => {
    if (cleanStoreDomain) {
      navigate(`/store/${cleanStoreDomain}`);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="relative w-full" dir="rtl">
      <div className="bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] pt-5 pb-8 px-3 sm:px-4 relative">
        <div className="absolute inset-0 bg-[url('/public/lovable-uploads/9bdce759-607e-417a-b056-f23d54b1d8f3.png')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50" style={{ 
          borderTopLeftRadius: '2rem', 
          borderTopRightRadius: '2rem',
          transform: 'translateY(50%)'
        }}></div>
        
        <div className="mx-auto max-w-7xl w-full relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 text-white">
              {showBackButton ? (
                <Button 
                  variant="ghost" 
                  className="h-9 w-9 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/30 flex items-center justify-center"
                  onClick={handleNavigateBack}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              ) : isMainHeader && (
                <Avatar className="h-9 w-9 sm:h-10 sm:w-10 bg-white/20 backdrop-blur-sm text-white border-2 border-white/50 shadow-lg shrink-0">
                  {logoUrl ? (
                    <AvatarImage src={logoUrl} alt={storeName} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-gray-200 to-gray-300 text-gray-800 text-sm font-bold">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
              )}
              <div className="text-right">
                {isMainHeader && (
                  <span className="text-[10px] sm:text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm text-white inline-block mb-1 shadow-sm">
                    مرحبًا
                  </span>
                )}
                <h2 className="font-bold text-sm sm:text-base tracking-wide">{isMainHeader ? storeName : title}</h2>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isMainHeader && cleanStoreDomain && (
                <Link to={`/store/${cleanStoreDomain}/profile`}>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 flex items-center justify-center"
                    aria-label="الحساب الشخصي"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              
              {cleanStoreDomain && (
                <Link to={`/store/${cleanStoreDomain}/cart`}>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 flex items-center justify-center"
                    aria-label="عربة التسوق"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] h-4 min-w-4 flex items-center justify-center rounded-full px-1 border border-white/20 shadow-md">
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StoreHeader;

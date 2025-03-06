
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NavActions from "./navbar/NavActions";
import { useIsMobile } from "@/hooks/use-media-query";

interface StoreNavbarProps {
  storeName: string;
  logoUrl?: string | null;
}

const StoreNavbar: React.FC<StoreNavbarProps> = ({
  storeName,
  logoUrl
}) => {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const { cart } = useCart();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  
  const elegantMessage = "مرحبًا";
  
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const initials = getInitials(storeName || "Store");

  // Add scroll event listener to detect when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`} dir="rtl">
      {/* خلفية رأس الصفحة الأساسية باللون الأزرق الفاتح بدلاً من البنفسجي */}
      <div className={`transition-all duration-300 ${
        isScrolled 
          ? 'bg-white py-2 px-3 sm:px-4' 
          : 'bg-gradient-to-l from-blue-500 to-blue-600 pt-6 pb-10 px-3 sm:px-4'
      } relative`}>
        {isScrolled ? null : (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50" style={{ 
            borderTopLeftRadius: '2rem', 
            borderTopRightRadius: '2rem',
            transform: 'translateY(50%)'
          }}></div>
        )}
        
        <div className="mx-auto max-w-7xl w-full">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 sm:gap-3 ${isScrolled ? 'text-blue-600' : 'text-white'}`}>
              <Avatar className={`h-10 w-10 sm:h-12 sm:w-12 transition-all ${
                isScrolled 
                  ? 'bg-blue-50 text-blue-600 border-2 border-blue-100' 
                  : 'bg-white/20 backdrop-blur-sm text-white border-2 border-white/50'
              } shadow-lg hover:scale-105 duration-300 shrink-0`}>
                {logoUrl ? (
                  <AvatarImage src={logoUrl} alt={storeName} />
                ) : (
                  <AvatarFallback className={`${
                    isScrolled 
                      ? 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600' 
                      : 'bg-gradient-to-br from-blue-400 to-blue-500 text-white'
                    } text-lg sm:text-xl font-bold`}>
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="text-right">
                {!isScrolled && (
                  <span className="text-[10px] sm:text-xs font-medium bg-white/20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full backdrop-blur-sm text-white inline-block mb-1 shadow-sm">
                    {elegantMessage}
                  </span>
                )}
                <h2 className={`font-bold text-base sm:text-lg tracking-wide ${isScrolled ? 'text-blue-600' : ''}`}>{storeName || "RASHED ALHAJERI"}</h2>
              </div>
            </div>
            
            <NavActions 
              storeDomain={storeDomain || ''} 
              totalItems={totalItems}
              isScrolled={isScrolled}
            />
          </div>
        </div>
        
        {!isScrolled && (
          <div className="absolute bottom-0 left-0 w-full overflow-hidden">
            <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-white/5 rounded-full blur-xl -mb-8 -ml-8"></div>
            <div className="absolute bottom-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-blue-500/10 rounded-full blur-xl -mb-10 -mr-10"></div>
          </div>
        )}
      </div>
    </header>
  );
};

export default StoreNavbar;


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
  const [isScrolled, setIsScrolled] = useState(false);
  
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
      if (scrollPosition > 10) {
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
    <header className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'header-scrolled shadow-md' : ''
    }`} dir="rtl">
      <div className={`bg-blue-600 py-4 px-4 ${isScrolled ? 'py-2' : ''} transition-all duration-300`}>
        <div className="container mx-auto flex items-center justify-between">
          {/* Store Logo and Name */}
          <div className="flex items-center gap-2">
            <div className="text-white font-bold text-lg">
              {storeName || "متجر"}
            </div>
            
            <Avatar className="h-8 w-8 bg-white/20 text-white border border-white/30">
              {logoUrl ? (
                <AvatarImage src={logoUrl} alt={storeName} />
              ) : (
                <AvatarFallback className="bg-transparent text-white text-sm font-bold">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          
          {/* Navigation Actions */}
          <NavActions 
            storeDomain={storeDomain || ''} 
            totalItems={totalItems}
            isScrolled={false}
          />
        </div>
      </div>
      
      {/* Curved Bottom Edge */}
      <div className="bg-white h-6 rounded-t-[2rem] -mt-3"></div>
    </header>
  );
};

export default StoreNavbar;

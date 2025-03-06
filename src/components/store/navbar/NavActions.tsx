
import React from "react";
import { useIsMobile } from "@/hooks/use-media-query";
import SearchToggle from "./SearchToggle";
import FavoritesButton from "./FavoritesButton";
import CartButton from "./CartButton";
import MobileMenuToggle from "./MobileMenuToggle";

interface NavActionsProps {
  storeDomain: string;
  totalItems: number;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const NavActions: React.FC<NavActionsProps> = ({
  storeDomain,
  totalItems,
  showSearch,
  setShowSearch,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {/* Search toggle */}
      <SearchToggle 
        showSearch={showSearch} 
        setShowSearch={setShowSearch} 
      />
      
      {/* Favorites button */}
      <FavoritesButton />
      
      {/* Cart button */}
      <CartButton 
        storeDomain={storeDomain} 
        totalItems={totalItems} 
      />
      
      {/* Mobile menu toggle - only visible on mobile */}
      {isMobile && (
        <MobileMenuToggle 
          isOpen={isMobileMenuOpen} 
          onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        />
      )}
    </div>
  );
};

export default NavActions;


import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Search, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AuthLinks from "./AuthLinks";

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
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {/* Authentication Links - Desktop */}
      <AuthLinks storeDomain={storeDomain} />
      
      {/* Search toggle */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setShowSearch(!showSearch)} 
        className="text-gray-700 hover:bg-gray-100 rounded-full"
      >
        <Search className="h-5 w-5" />
      </Button>
      
      {/* Favorites button */}
      <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-gray-100 rounded-full hidden sm:flex">
        <Heart className="h-5 w-5" />
      </Button>
      
      {/* Cart button */}
      <Link to={`/store/${storeDomain}/cart`}>
        <Button variant="ghost" size="sm" className="relative text-gray-700 hover:bg-gray-100 rounded-full">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-primary text-white text-xs h-5 min-w-5 flex items-center justify-center rounded-full px-1">
              {totalItems}
            </Badge>
          )}
        </Button>
      </Link>
      
      {/* Mobile menu toggle - only visible on mobile */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="md:hidden text-gray-700 hover:bg-gray-100 rounded-full" 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};

export default NavActions;

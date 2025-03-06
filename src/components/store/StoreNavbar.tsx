
import React from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

interface StoreNavbarProps {
  storeName: string;
  logoUrl?: string | null;
}

const StoreNavbar: React.FC<StoreNavbarProps> = ({ storeName, logoUrl }) => {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const { cart } = useCart();
  
  return (
    <header className="backdrop-blur-md bg-black/80 shadow-sm sticky top-0 z-50 border-b border-gray-800/30">
      <div className="container mx-auto py-4 px-4">
        <div className="flex items-center justify-between">
          <Link to={`/store/${storeDomain}`} className="flex items-center space-x-2 space-x-reverse">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={storeName} 
                className="h-8 w-auto" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            ) : (
              <div className="h-8 w-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-gray-100">
                  {storeName ? storeName.charAt(0).toUpperCase() : "S"}
                </span>
              </div>
            )}
            <span className="font-medium text-base text-white">{storeName}</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10">
              <Search className="h-5 w-5" />
            </Button>
            
            <Link to={`/store/${storeDomain}/cart`}>
              <Button variant="ghost" size="sm" className="relative text-gray-300 hover:text-white hover:bg-white/10">
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StoreNavbar;

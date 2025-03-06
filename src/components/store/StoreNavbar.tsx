
import React from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
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
    <header className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto py-3 px-4">
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
              <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600">
                  {storeName ? storeName.charAt(0).toUpperCase() : "S"}
                </span>
              </div>
            )}
            <span className="font-bold text-lg">{storeName}</span>
          </Link>
          
          <Link to={`/store/${storeDomain}/cart`}>
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default StoreNavbar;

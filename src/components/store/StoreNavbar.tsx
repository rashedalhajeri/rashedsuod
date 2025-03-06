
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingCart, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Input } from "@/components/ui/input";

interface StoreNavbarProps {
  storeName: string;
  logoUrl?: string | null;
}

const StoreNavbar: React.FC<StoreNavbarProps> = ({ storeName, logoUrl }) => {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const { cart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-black/80 backdrop-blur-md shadow-md" 
          : "bg-black/60 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto py-4 px-4">
        <div className="flex items-center justify-between">
          {/* Logo and Store Name */}
          <Link to={`/store/${storeDomain}`} className="flex items-center space-x-2 space-x-reverse">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={storeName} 
                className="h-8 w-auto object-contain" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            ) : (
              <div className="h-8 w-8 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {storeName ? storeName.charAt(0).toUpperCase() : "S"}
                </span>
              </div>
            )}
            <span className="font-bold text-lg text-white">{storeName}</span>
          </Link>
          
          {/* Desktop Navigation - hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
            <Link to={`/store/${storeDomain}`} className="text-white hover:text-gray-300 transition-colors">
              الرئيسية
            </Link>
            <Link to={`/store/${storeDomain}/products`} className="text-white hover:text-gray-300 transition-colors">
              المنتجات
            </Link>
            <Link to={`/store/${storeDomain}/about`} className="text-white hover:text-gray-300 transition-colors">
              عن المتجر
            </Link>
            <Link to={`/store/${storeDomain}/contact`} className="text-white hover:text-gray-300 transition-colors">
              تواصل معنا
            </Link>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-2 space-x-reverse">
            {/* Search toggle */}
            <Button variant="ghost" size="sm" onClick={() => setShowSearch(!showSearch)} className="text-white">
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Cart button */}
            <Link to={`/store/${storeDomain}/cart`}>
              <Button variant="ghost" size="sm" className="relative text-white">
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </Link>
            
            {/* Mobile menu toggle - only visible on mobile */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Search bar - conditionally rendered */}
        {showSearch && (
          <div className="mt-4 animate-slide-down">
            <div className="relative">
              <Input
                type="search"
                placeholder="ابحث في المتجر..."
                className="w-full bg-white/10 border-white/20 text-white placeholder-gray-300"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-300" />
            </div>
          </div>
        )}
        
        {/* Mobile menu - conditionally rendered */}
        {isMobileMenuOpen && (
          <nav className="mt-4 py-3 border-t border-white/10 md:hidden animate-slide-down">
            <ul className="space-y-3">
              <li>
                <Link 
                  to={`/store/${storeDomain}`} 
                  className="block text-white hover:text-gray-300 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link 
                  to={`/store/${storeDomain}/products`} 
                  className="block text-white hover:text-gray-300 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  المنتجات
                </Link>
              </li>
              <li>
                <Link 
                  to={`/store/${storeDomain}/about`} 
                  className="block text-white hover:text-gray-300 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  عن المتجر
                </Link>
              </li>
              <li>
                <Link 
                  to={`/store/${storeDomain}/contact`} 
                  className="block text-white hover:text-gray-300 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default StoreNavbar;

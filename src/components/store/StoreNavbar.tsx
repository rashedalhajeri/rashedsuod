
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingCart, Search, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Input } from "@/components/ui/input";

interface StoreNavbarProps {
  storeName: string;
  logoUrl?: string | null;
}

const StoreNavbar: React.FC<StoreNavbarProps> = ({
  storeName,
  logoUrl
}) => {
  const {
    storeDomain
  } = useParams<{
    storeDomain: string;
  }>();
  const {
    cart
  } = useCart();
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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md" : "bg-white"}`}>
      <div className="container mx-auto py-3 px-4">
        <div className="flex items-center justify-between">
          {/* Logo and Store Name */}
          <Link to={`/store/${storeDomain}`} className="flex items-center gap-2">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={storeName} 
                className="h-10 w-auto object-contain" 
                onError={e => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }} 
              />
            ) : (
              <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-gray-700">
                  {storeName ? storeName.charAt(0).toUpperCase() : "S"}
                </span>
              </div>
            )}
            <span className="font-bold text-xl text-gray-800">{storeName}</span>
          </Link>
          
          {/* Desktop Navigation - hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            <Link to={`/store/${storeDomain}`} className="text-gray-700 hover:text-primary transition-colors font-medium">
              الرئيسية
            </Link>
            <Link to={`/store/${storeDomain}/products`} className="text-gray-700 hover:text-primary transition-colors font-medium">
              المنتجات
            </Link>
            <Link to={`/store/${storeDomain}/about`} className="text-gray-700 hover:text-primary transition-colors font-medium">
              عن المتجر
            </Link>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Authentication Links - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <Link to={`/store/${storeDomain}/login`} className="text-gray-700 hover:text-primary transition-colors font-medium">
                تسجيل دخول
              </Link>
              <Link to={`/store/${storeDomain}/register`} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors font-medium">
                تسجيل حساب
              </Link>
            </div>
            
            {/* Search toggle */}
            <Button variant="ghost" size="sm" onClick={() => setShowSearch(!showSearch)} className="text-gray-700">
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Cart button */}
            <Link to={`/store/${storeDomain}/cart`}>
              <Button variant="ghost" size="sm" className="relative text-gray-700">
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </Link>
            
            {/* Mobile menu toggle - only visible on mobile */}
            <Button variant="ghost" size="sm" className="md:hidden text-gray-700" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
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
                className="w-full bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400 pr-10" 
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        )}
        
        {/* Mobile menu - conditionally rendered */}
        {isMobileMenuOpen && (
          <nav className="mt-4 py-3 border-t border-gray-200 md:hidden animate-slide-down">
            <ul className="space-y-3">
              <li>
                <Link 
                  to={`/store/${storeDomain}`} 
                  className="block text-gray-700 hover:text-primary transition-colors" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link 
                  to={`/store/${storeDomain}/products`} 
                  className="block text-gray-700 hover:text-primary transition-colors" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  المنتجات
                </Link>
              </li>
              <li>
                <Link 
                  to={`/store/${storeDomain}/about`} 
                  className="block text-gray-700 hover:text-primary transition-colors" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  عن المتجر
                </Link>
              </li>
              <li>
                <Link 
                  to={`/store/${storeDomain}/login`} 
                  className="block text-gray-700 hover:text-primary transition-colors" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  تسجيل دخول
                </Link>
              </li>
              <li>
                <Link 
                  to={`/store/${storeDomain}/register`} 
                  className="block text-gray-700 hover:text-primary transition-colors" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  تسجيل حساب
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

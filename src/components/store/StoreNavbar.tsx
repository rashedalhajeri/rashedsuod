
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingCart, Search, Menu, User, Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
  const [showSearch, setShowSearch] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // هنا يمكنك تنفيذ البحث
      console.log(`Searching for: ${searchQuery}`);
      // إعادة توجيه للصفحة الرئيسية مع استعلام البحث
      window.location.href = `/store/${storeDomain}?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "glass-nav py-2" : "bg-white py-4"}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo and Store Name */}
          <Link to={`/store/${storeDomain}`} className="flex items-center gap-3">
            {logoUrl ? (
              <div className="h-12 w-12 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-white shadow-sm">
                <img 
                  src={logoUrl} 
                  alt={storeName} 
                  className="h-10 w-10 object-contain" 
                  onError={e => {
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }} 
                />
              </div>
            ) : (
              <div className="h-12 w-12 bg-gradient-to-br from-primary/80 to-primary rounded-full flex items-center justify-center border border-primary/20 shadow-sm">
                <span className="text-lg font-bold text-white">
                  {storeName ? storeName.charAt(0).toUpperCase() : "S"}
                </span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-800">{storeName}</span>
              <span className="text-xs text-gray-500">متجر إلكتروني احترافي</span>
            </div>
          </Link>
          
          {/* Desktop Navigation - hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-6 mr-auto ml-10">
            <Link 
              to={`/store/${storeDomain}`} 
              className="text-gray-700 hover:text-primary transition-colors font-medium relative py-2 group"
            >
              الرئيسية
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link 
              to={`/store/${storeDomain}/products`} 
              className="text-gray-700 hover:text-primary transition-colors font-medium relative py-2 group"
            >
              المنتجات
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link 
              to={`/store/${storeDomain}/about`} 
              className="text-gray-700 hover:text-primary transition-colors font-medium relative py-2 group"
            >
              عن المتجر
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Authentication Links - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <Link to={`/store/${storeDomain}/login`} className="text-gray-700 hover:text-primary transition-colors font-medium">
                تسجيل دخول
              </Link>
              <Link to={`/store/${storeDomain}/register`}>
                <Button className="bg-primary hover:bg-primary/90 transition-colors">
                  تسجيل حساب
                </Button>
              </Link>
            </div>
            
            {/* Search toggle */}
            <Button variant="ghost" size="sm" onClick={() => setShowSearch(!showSearch)} className="text-gray-700 hover:bg-gray-100 rounded-full">
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
        </div>
        
        {/* Search bar - conditionally rendered */}
        {showSearch && (
          <div className="mt-4 animate-slide-down">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input 
                type="search" 
                placeholder="ابحث في المتجر..." 
                className="w-full bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400 pr-10 pl-14 py-2 rounded-full" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Button 
                type="submit" 
                size="sm" 
                className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full h-8 px-3 text-sm"
                disabled={!searchQuery.trim()}
              >
                بحث
              </Button>
            </form>
          </div>
        )}
        
        {/* Mobile menu - conditionally rendered */}
        {isMobileMenuOpen && (
          <nav className="mt-4 py-3 border-t border-gray-200 md:hidden animate-slide-down">
            <ul className="space-y-4">
              <li>
                <Link 
                  to={`/store/${storeDomain}`} 
                  className="block text-gray-700 hover:text-primary transition-colors py-2 font-medium" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link 
                  to={`/store/${storeDomain}/products`} 
                  className="block text-gray-700 hover:text-primary transition-colors py-2 font-medium" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  المنتجات
                </Link>
              </li>
              <li>
                <Link 
                  to={`/store/${storeDomain}/about`} 
                  className="block text-gray-700 hover:text-primary transition-colors py-2 font-medium" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  عن المتجر
                </Link>
              </li>
              <li>
                <Link 
                  to={`/store/${storeDomain}/login`} 
                  className="block text-gray-700 hover:text-primary transition-colors py-2 font-medium" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  تسجيل دخول
                </Link>
              </li>
              <li>
                <Link 
                  to={`/store/${storeDomain}/register`}
                  className="block bg-primary text-white py-2 px-4 rounded-md text-center font-medium"
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

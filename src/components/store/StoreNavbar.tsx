
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { useIsMobile } from "@/hooks/use-media-query";
import { User } from "lucide-react";

// Import components
import NavActions from "./navbar/NavActions";
import SearchBar from "./navbar/SearchBar";
import MobileMenu from "./navbar/MobileMenu";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
      // Redirect to the home page with the search query
      window.location.href = `/store/${storeDomain}?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-white/95 backdrop-blur-md shadow-md py-2" 
        : "bg-transparent py-4"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Left: Account Button */}
          <Link to={`/store/${storeDomain}/login`}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-700 hover:bg-gray-100/80 backdrop-blur-sm rounded-full p-2 transition-all duration-300 shadow-sm"
              aria-label="حسابي"
            >
              <User className="h-6 w-6" />
            </Button>
          </Link>
          
          {/* Right side: Actions (Search, Cart) */}
          <NavActions 
            storeDomain={storeDomain || ''} 
            totalItems={totalItems}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        </div>
        
        {/* Search bar - conditionally rendered */}
        {showSearch && (
          <SearchBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            handleSearchSubmit={handleSearchSubmit} 
          />
        )}
        
        {/* Mobile menu - conditionally rendered */}
        {isMobileMenuOpen && (
          <MobileMenu 
            storeDomain={storeDomain || ''} 
            setIsMobileMenuOpen={setIsMobileMenuOpen} 
          />
        )}
      </div>
    </header>
  );
};

export default StoreNavbar;

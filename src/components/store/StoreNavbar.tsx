
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";

// Import components
import StoreLogo from "./navbar/StoreLogo";
import DesktopNavigation from "./navbar/DesktopNavigation";
import NavActions from "./navbar/NavActions";
import SearchBar from "./navbar/SearchBar";
import MobileMenu from "./navbar/MobileMenu";

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
      // Redirect to the home page with the search query
      window.location.href = `/store/${storeDomain}?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "glass-nav py-2" : "bg-white py-4"}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo and Store Name */}
          <StoreLogo 
            storeName={storeName} 
            logoUrl={logoUrl} 
            storeDomain={storeDomain || ''} 
          />
          
          {/* Desktop Navigation */}
          <DesktopNavigation storeDomain={storeDomain || ''} />
          
          {/* Actions (Search, Cart, Mobile Menu) */}
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

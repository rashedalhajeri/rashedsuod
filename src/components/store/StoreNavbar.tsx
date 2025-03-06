
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NavActions from "./navbar/NavActions";
import SearchBar from "./navbar/SearchBar";
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
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  
  // Simple elegant greeting message
  const elegantMessage = "أهلاً بك";
  
  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to the home page with the search query
      window.location.href = `/store/${storeDomain}?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Extract initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const initials = getInitials(storeName || "Store");

  return (
    <header className="relative w-full" dir="rtl">
      {/* Professional header with enhanced gradient background and curved bottom edge */}
      <div className="bg-gradient-to-l from-purple-700 to-indigo-600 pt-6 pb-14 px-3 sm:px-4 rounded-b-[2rem] shadow-lg relative">
        <div className="mx-auto max-w-7xl w-full">
          <div className="flex items-center justify-between">
            {/* Right: Store logo and info with improved RTL alignment */}
            <div className="flex items-center gap-2 sm:gap-3 text-white">
              <Avatar className="h-12 w-12 sm:h-14 sm:w-14 bg-white/20 backdrop-blur-sm text-white border-2 border-white/50 shadow-lg transition-all hover:scale-105 duration-300 shrink-0">
                {logoUrl ? (
                  <AvatarImage src={logoUrl} alt={storeName} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white text-lg sm:text-xl font-bold">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="text-right">
                <span className="text-[10px] sm:text-xs font-medium bg-white/20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full backdrop-blur-sm text-white inline-block mb-1 sm:mb-2 shadow-sm">
                  {elegantMessage}
                </span>
                <h2 className="font-bold text-base sm:text-xl tracking-wide">{storeName}</h2>
              </div>
            </div>
            
            {/* Left: Authentication, Notification and Cart */}
            <NavActions 
              storeDomain={storeDomain || ''} 
              totalItems={totalItems}
            />
          </div>
        </div>
        
        {/* Decorative elements - made less pronounced to avoid layout issues */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-white/5 rounded-full blur-xl -mb-8 -ml-8"></div>
          <div className="absolute bottom-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-purple-500/10 rounded-full blur-xl -mb-10 -mr-10"></div>
        </div>
      </div>
      
      {/* Search bar positioned for overlap with improved shadow and styling */}
      <div className="w-full mx-auto px-3 sm:px-4 relative -mt-7">
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          handleSearchSubmit={handleSearchSubmit} 
        />
      </div>
    </header>
  );
};

export default StoreNavbar;

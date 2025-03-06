
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NavActions from "./navbar/NavActions";
import SearchBar from "./navbar/SearchBar";

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
    <header className="relative" dir="rtl">
      {/* Professional header with gradient background and curved bottom edge */}
      <div className="bg-gradient-to-l from-purple-600 to-indigo-700 pt-6 pb-14 px-4 rounded-b-[2rem] shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            {/* Right: Store logo and info */}
            <div className="flex items-center gap-3 text-white">
              <Avatar className="h-12 w-12 bg-white/10 backdrop-blur-sm text-white border-2 border-white/40 shadow-lg transition-transform hover:scale-105">
                {logoUrl ? (
                  <AvatarImage src={logoUrl} alt={storeName} />
                ) : (
                  <AvatarFallback className="bg-indigo-500/80 text-white text-xl font-bold backdrop-blur-sm">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="text-right">
                <span className="text-xs font-medium bg-white/15 px-2 py-0.5 rounded-full backdrop-blur-sm text-white/90">
                  {elegantMessage}
                </span>
                <h2 className="font-bold text-lg tracking-wide mt-1">{storeName}</h2>
              </div>
            </div>
            
            {/* Left: Authentication, Notification and Cart */}
            <NavActions 
              storeDomain={storeDomain || ''} 
              totalItems={totalItems}
            />
          </div>
        </div>
      </div>
      
      {/* Search bar positioned for overlap */}
      <div className="container mx-auto px-4 relative -mt-7">
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

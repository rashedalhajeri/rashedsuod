
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
      {/* Professional header with enhanced gradient background and curved bottom edge */}
      <div className="bg-gradient-to-l from-purple-700 to-indigo-600 pt-6 pb-14 px-4 rounded-b-[2.5rem] shadow-lg relative">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            {/* Right: Store logo and info with improved RTL alignment */}
            <div className="flex items-center gap-3 text-white">
              <Avatar className="h-14 w-14 bg-white/20 backdrop-blur-sm text-white border-2 border-white/50 shadow-lg transition-all hover:scale-105 duration-300 shrink-0">
                {logoUrl ? (
                  <AvatarImage src={logoUrl} alt={storeName} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white text-xl font-bold">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="text-right">
                <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm text-white inline-block mb-2 shadow-sm">
                  {elegantMessage}
                </span>
                <h2 className="font-bold text-xl tracking-wide">{storeName}</h2>
              </div>
            </div>
            
            {/* Left: Authentication, Notification and Cart */}
            <NavActions 
              storeDomain={storeDomain || ''} 
              totalItems={totalItems}
            />
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full">
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mb-12 -ml-12"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mb-16 -mr-16"></div>
        </div>
      </div>
      
      {/* Search bar positioned for overlap with improved shadow and styling */}
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

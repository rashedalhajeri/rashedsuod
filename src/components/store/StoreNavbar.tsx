
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { User } from "lucide-react";

// Import components
import NavActions from "./navbar/NavActions";
import SearchBar from "./navbar/SearchBar";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  // Get current time
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  // Format time as HH:MM in Arabic/Eastern format
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

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
    <header className="relative">
      {/* Main Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-700 to-green-500 pt-10 pb-20 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            {/* Left: Notification and Cart */}
            <NavActions 
              storeDomain={storeDomain || ''} 
              totalItems={totalItems}
            />
            
            {/* Right: User info and avatar */}
            <div className="flex items-center gap-3 text-white">
              <div className="text-right">
                <p className="text-sm">مرحباً،</p>
                <h2 className="font-bold text-lg tracking-wide">{storeName}</h2>
              </div>
              
              <Link to={`/store/${storeDomain}/login`}>
                <Avatar className="h-12 w-12 bg-white text-blue-600 border-2 border-white/30">
                  {logoUrl ? (
                    <AvatarImage src={logoUrl} alt={storeName} />
                  ) : (
                    <AvatarFallback className="bg-white text-blue-600 text-xl font-bold">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Link>
            </div>
          </div>
          
          {/* Time display in top right */}
          <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            {formatTime(currentTime)}
          </div>
          
          {/* Mobile signal indicators - purely decorative */}
          <div className="absolute top-4 left-4 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-6 h-3 border border-white/70 rounded-sm flex items-center justify-start p-[2px]">
                <div className="bg-white/70 h-full w-1/3 rounded-sm"></div>
              </div>
              <span className="text-white/90 text-xs font-medium">5G</span>
            </div>
            <div className="flex gap-[2px]">
              <div className="h-2 w-[2px] bg-white/70"></div>
              <div className="h-3 w-[2px] bg-white/70"></div>
              <div className="h-4 w-[2px] bg-white/70"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search bar positioned for overlap */}
      <div className="container mx-auto px-4 relative -mt-6">
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

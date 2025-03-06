
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
  
  // Single elegant greeting message (instead of rotating)
  const elegantMessage = "أهلاً بك";
  
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
    <header className="relative" dir="rtl">
      {/* Elegant header with gradient background and curved bottom edge */}
      <div className="bg-gradient-to-l from-purple-600 to-indigo-700 pt-8 pb-16 px-4 rounded-b-[2.5rem] shadow-xl">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            {/* Right: Store logo and info */}
            <div className="flex items-center gap-3 text-white">
              <Link to={`/store/${storeDomain}/login`}>
                <Avatar className="h-12 w-12 bg-white/10 backdrop-blur-sm text-white border-2 border-white/40 shadow-lg transition-transform hover:scale-105">
                  {logoUrl ? (
                    <AvatarImage src={logoUrl} alt={storeName} />
                  ) : (
                    <AvatarFallback className="bg-indigo-500/80 text-white text-xl font-bold backdrop-blur-sm">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Link>
              <div className="text-right">
                <span className="text-xs font-medium bg-white/15 px-2 py-0.5 rounded-full backdrop-blur-sm text-white/90">
                  {elegantMessage}
                </span>
                <h2 className="font-bold text-lg tracking-wide mt-1">{storeName}</h2>
              </div>
            </div>
            
            {/* Left: Notification and Cart */}
            <NavActions 
              storeDomain={storeDomain || ''} 
              totalItems={totalItems}
            />
          </div>
          
          {/* Time display in top right */}
          <div className="absolute top-4 left-4 bg-indigo-500/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium shadow-md border border-white/20">
            {formatTime(currentTime)}
          </div>
          
          {/* Mobile signal indicators - purely decorative */}
          <div className="absolute top-4 right-4 flex items-center gap-3">
            <div className="flex gap-[2px]">
              <div className="h-4 w-[2px] bg-white/70"></div>
              <div className="h-3 w-[2px] bg-white/70"></div>
              <div className="h-2 w-[2px] bg-white/70"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-3 border border-white/70 rounded-sm flex items-center justify-end p-[2px]">
                <div className="bg-white/70 h-full w-1/3 rounded-sm"></div>
              </div>
              <span className="text-white/90 text-xs font-medium">5G</span>
            </div>
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


import React from "react";
import { Heart, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-media-query";

const FavoritesButton: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all duration-300 shadow-sm"
      aria-label="الإشعارات"
    >
      <Bell className="h-6 w-6" />
    </Button>
  );
};

export default FavoritesButton;

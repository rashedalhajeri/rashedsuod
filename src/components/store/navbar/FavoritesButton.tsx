
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
      className="text-white bg-transparent hover:bg-white/10 rounded-full p-2"
      aria-label="الإشعارات"
    >
      <Bell className="h-6 w-6" />
    </Button>
  );
};

export default FavoritesButton;

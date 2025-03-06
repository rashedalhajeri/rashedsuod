
import React from "react";
import { Heart, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-media-query";

const FavoritesButton: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <>
      {isMobile ? (
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white bg-transparent hover:bg-white/10 rounded-full"
          aria-label="الإشعارات"
        >
          <Bell className="h-6 w-6" />
        </Button>
      ) : (
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white bg-transparent hover:bg-white/10 rounded-full hidden sm:flex"
          aria-label="المفضلة"
        >
          <Heart className="h-5 w-5" />
        </Button>
      )}
    </>
  );
};

export default FavoritesButton;

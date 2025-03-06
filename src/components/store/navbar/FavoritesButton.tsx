
import React from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const FavoritesButton: React.FC = () => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="text-gray-700 hover:bg-gray-100 rounded-full hidden sm:flex"
      aria-label="المفضلة"
    >
      <Heart className="h-5 w-5" />
    </Button>
  );
};

export default FavoritesButton;

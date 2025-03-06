
import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const FavoritesButton: React.FC = () => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="text-white p-0 hover:bg-transparent"
      aria-label="الإشعارات"
    >
      <Bell className="h-7 w-7" />
    </Button>
  );
};

export default FavoritesButton;

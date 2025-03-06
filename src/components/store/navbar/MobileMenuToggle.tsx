
import React from "react";
import { Menu, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileMenuToggle: React.FC<MobileMenuToggleProps> = ({ 
  isOpen, 
  onToggle 
}) => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="md:hidden text-white bg-transparent hover:bg-white/10 rounded-full p-2" 
      onClick={onToggle}
      aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <Bell className="h-6 w-6" />
      )}
    </Button>
  );
};

export default MobileMenuToggle;

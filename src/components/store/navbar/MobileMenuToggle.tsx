
import React from "react";
import { Menu, X } from "lucide-react";
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
      className="md:hidden text-gray-700 hover:bg-gray-100 rounded-full" 
      onClick={onToggle}
      aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
    >
      {isOpen ? (
        <X className="h-5 w-5" />
      ) : (
        <Menu className="h-5 w-5" />
      )}
    </Button>
  );
};

export default MobileMenuToggle;

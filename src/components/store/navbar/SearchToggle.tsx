
import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchToggleProps {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
}

const SearchToggle: React.FC<SearchToggleProps> = ({ 
  showSearch, 
  setShowSearch 
}) => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => setShowSearch(!showSearch)} 
      className="text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all duration-300 shadow-sm"
      aria-label={showSearch ? "إغلاق البحث" : "فتح البحث"}
    >
      <Search className="h-6 w-6" />
    </Button>
  );
};

export default SearchToggle;

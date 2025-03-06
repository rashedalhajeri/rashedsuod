
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
      className="text-gray-700 hover:bg-gray-100 rounded-full"
      aria-label={showSearch ? "إغلاق البحث" : "فتح البحث"}
    >
      <Search className="h-5 w-5" />
    </Button>
  );
};

export default SearchToggle;

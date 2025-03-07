
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProductSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ProductSearchBar: React.FC<ProductSearchBarProps> = ({ 
  searchQuery, 
  onSearchChange 
}) => {
  return (
    <div className="relative">
      <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input 
        placeholder="البحث عن منتج..." 
        className="pl-3 pr-10" 
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default ProductSearchBar;

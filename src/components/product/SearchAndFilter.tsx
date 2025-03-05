
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <div className="relative">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="البحث عن منتج..." 
            className="pl-3 pr-10" 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div>
        <Button variant="outline" className="w-full gap-2">
          <Filter className="h-4 w-4" />
          <span>تصفية النتائج</span>
        </Button>
      </div>
    </div>
  );
};

export default SearchAndFilter;

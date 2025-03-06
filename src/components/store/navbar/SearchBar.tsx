
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearchSubmit
}) => {
  return (
    <div className="mt-4 mb-2 animate-slide-down px-4 sm:px-0">
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative w-full rounded-full overflow-hidden bg-white shadow-md border border-gray-100">
          <Input 
            type="search" 
            placeholder="ابحث حسب المتجر أو المنتج" 
            className="w-full bg-transparent border-0 text-gray-700 placeholder-gray-400 pr-12 pl-14 py-6 rounded-full text-lg focus-visible:ring-0" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
          <Button 
            type="submit" 
            variant="ghost"
            size="sm" 
            className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full h-8 px-3 text-sm"
            disabled={!searchQuery.trim()}
          >
            بحث
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;


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
    <div className="mt-4 animate-slide-down">
      <form onSubmit={handleSearchSubmit} className="relative">
        <Input 
          type="search" 
          placeholder="ابحث في المتجر..." 
          className="w-full bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400 pr-10 pl-14 py-2 rounded-full" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Button 
          type="submit" 
          size="sm" 
          className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full h-8 px-3 text-sm"
          disabled={!searchQuery.trim()}
        >
          بحث
        </Button>
      </form>
    </div>
  );
};

export default SearchBar;

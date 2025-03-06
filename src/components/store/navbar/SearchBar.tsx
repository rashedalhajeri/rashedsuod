
import React from "react";
import { Search } from "lucide-react";

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
    <form onSubmit={handleSearchSubmit} className="relative w-full max-w-full">
      <div className="relative w-full h-12 sm:h-14 rounded-full overflow-hidden bg-white shadow-xl border border-indigo-100/50 transition-all hover:shadow-lg">
        <input 
          type="search" 
          placeholder="ابحث عن منتج أو خدمة..." 
          className="w-full h-full bg-transparent border-0 text-gray-700 placeholder-gray-400 pr-12 pl-4 py-3 rounded-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          dir="rtl"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500">
          <Search className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>
    </form>
  );
};

export default SearchBar;

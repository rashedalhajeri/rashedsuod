
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ searchTerm, onSearch }) => {
  return (
    <div className="flex-1 relative min-w-[200px]">
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
        <Search className="h-4 w-4" />
      </div>
      <Input
        type="text"
        placeholder="بحث..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="pr-9 bg-white border-gray-200 h-10 text-sm placeholder:text-gray-400 rounded-lg w-full"
        dir="rtl"
      />
    </div>
  );
};

export default SearchInput;


import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CategorySearchBoxProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CategorySearchBox: React.FC<CategorySearchBoxProps> = ({
  searchQuery,
  setSearchQuery
}) => {
  return (
    <div className="relative">
      <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input 
        placeholder="البحث عن تصنيف..." 
        className="pl-3 pr-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default CategorySearchBox;

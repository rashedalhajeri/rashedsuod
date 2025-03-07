
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CategorySearchBoxProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CategorySearchBox: React.FC<CategorySearchBoxProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="relative">
      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder="بحث حسب الاسم..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 pr-9"
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 p-1.5 text-gray-500 hover:text-primary-500 hover:bg-primary-50/50"
            >
              <SlidersHorizontal className="h-full w-full" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>تصفية متقدمة</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default CategorySearchBox;

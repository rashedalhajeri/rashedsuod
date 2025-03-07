
import React from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MoreOptionsProps {
  handleSelectAll: () => void;
  setFilterActive: (status: string) => void;
  setCategoryFilter: (category: string | null) => void;
  selectedItemsCount: number;
  filteredProductsCount: number;
}

const MoreOptions: React.FC<MoreOptionsProps> = ({
  handleSelectAll,
  setFilterActive,
  setCategoryFilter,
  selectedItemsCount,
  filteredProductsCount,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-shrink-0 w-8 h-8 p-0 rounded-full"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleSelectAll}>
          {selectedItemsCount === filteredProductsCount && filteredProductsCount > 0
            ? "إلغاء تحديد الكل"
            : "تحديد الكل"}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => setFilterActive("active")}>
          عرض النشطة فقط
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFilterActive("inactive")}>
          عرض غير النشطة فقط
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFilterActive("archived")}>
          عرض المسودات فقط
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => setCategoryFilter(null)}>
          عرض كل الفئات
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MoreOptions;

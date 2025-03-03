
import React from "react";
import { Filter, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface ProductFilterProps {
  categories: string[];
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  categories,
  activeFilter,
  onFilterChange
}) => {
  return (
    <div>
      <Select value={activeFilter || ""} onValueChange={(value) => onFilterChange(value || null)}>
        <SelectTrigger className="w-[180px]">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>{activeFilter || "جميع التصنيفات"}</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">جميع التصنيفات</SelectItem>
          {categories.map(category => (
            <SelectItem key={category} value={category}>{category}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {activeFilter && (
        <div className="mt-3 flex items-center">
          <span className="text-sm text-gray-500 ml-2">التصنيف النشط:</span>
          <div className="flex items-center gap-1 bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-sm">
            <Tag className="h-3 w-3" />
            {activeFilter}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 hover:bg-primary-100" 
              onClick={() => onFilterChange(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

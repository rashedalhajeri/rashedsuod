
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
import { Badge } from "@/components/ui/badge";

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
    <div className="animate-fade-in">
      <Select value={activeFilter || "all"} onValueChange={(value) => onFilterChange(value === "all" ? null : value)}>
        <SelectTrigger className="w-[180px] bg-white shadow-sm border-primary-100 hover:border-primary-300 transition-all">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary-500" />
            <span>{activeFilter || "جميع التصنيفات"}</span>
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white shadow-md border-primary-100">
          <SelectItem value="all">جميع التصنيفات</SelectItem>
          {categories.map(category => (
            <SelectItem key={category} value={category}>{category}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {activeFilter && (
        <div className="mt-3 flex items-center animate-slide-up">
          <span className="text-sm text-gray-500 ml-2">التصنيف النشط:</span>
          <Badge 
            variant="outline" 
            className="flex items-center gap-1 bg-primary-50 text-primary-700 px-2 py-1 hover:bg-primary-100 transition-colors"
          >
            <Tag className="h-3 w-3" />
            {activeFilter}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 ml-1 hover:bg-primary-200 rounded-full" 
              onClick={() => onFilterChange(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      )}
    </div>
  );
};

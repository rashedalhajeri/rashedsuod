
import React from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCategories } from "@/hooks/use-categories";

interface CategoryFilterProps {
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categoryFilter,
  setCategoryFilter,
}) => {
  // Get categories from hook
  const { categories } = useCategories();

  return (
    <div className="flex-1 min-w-[150px]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between text-right"
          >
            {categoryFilter ? 
              categories.find(c => c.id === categoryFilter)?.name || "تصفية حسب الفئة" : 
              "تصفية حسب الفئة"}
            <Filter className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>الفئات</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <ScrollArea className="h-[200px]">
            <DropdownMenuItem 
              onClick={() => setCategoryFilter(null)}
              className={!categoryFilter ? "bg-primary-50 text-primary-700" : ""}
            >
              الكل
            </DropdownMenuItem>
            {categories.map((category) => (
              <DropdownMenuItem 
                key={category.id}
                onClick={() => setCategoryFilter(category.id)}
                className={categoryFilter === category.id ? "bg-primary-50 text-primary-700" : ""}
              >
                {category.name}
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CategoryFilter;


import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onCategorySelect: (categoryId: string) => void;
  isLoading: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategoryId,
  onCategorySelect,
  isLoading
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<Category[]>(categories);

  // Filter categories based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredCategories(
        categories.filter(category => 
          category.name.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, categories]);

  return (
    <div className="space-y-2 mt-4">
      <Label htmlFor="category-select">اختر الفئة</Label>
      <div className="border rounded-md p-2">
        <div className="mb-2">
          <div className="relative">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ابحث عن فئة..."
              className="pr-9 text-right"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="max-h-[200px] overflow-y-auto space-y-1 mt-2">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-gray-500">جاري التحميل...</div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">لا توجد فئات مطابقة</div>
          ) : (
            filteredCategories.map(category => (
              <div
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={cn(
                  "p-2 rounded-md cursor-pointer hover:bg-gray-100 flex items-center justify-between",
                  selectedCategoryId === category.id ? "bg-primary/10" : ""
                )}
              >
                <span>{category.name}</span>
                {selectedCategoryId === category.id && (
                  <CheckIcon className="h-4 w-4 text-primary" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySelector;

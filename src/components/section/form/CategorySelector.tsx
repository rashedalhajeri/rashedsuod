
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search, CheckIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
      <Label htmlFor="category-select" className="text-base font-medium">
        <span className="text-rose-500">*</span> اختر الفئة
      </Label>
      <p className="text-sm text-gray-500 mb-2">سيتم عرض منتجات هذه الفئة في هذا القسم</p>
      
      <div className="border rounded-md p-3">
        <div className="mb-3">
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
        
        <div className="max-h-[200px] overflow-y-auto space-y-1 mt-2 custom-scrollbar">
          {isLoading ? (
            <div className="p-6 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-sm text-gray-500">جاري تحميل الفئات...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">
              <p className="mb-1">لا توجد فئات مطابقة</p>
              <p className="text-xs">جرب كلمات بحث أخرى</p>
            </div>
          ) : (
            <>
              {filteredCategories.map(category => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => onCategorySelect(category.id)}
                  className={cn(
                    "p-2.5 rounded-md cursor-pointer hover:bg-gray-50 flex items-center justify-between",
                    selectedCategoryId === category.id ? "bg-primary/10 border border-primary/20" : "border border-transparent"
                  )}
                >
                  <span>{category.name}</span>
                  {selectedCategoryId === category.id && (
                    <div className="bg-primary text-white rounded-full p-0.5">
                      <CheckIcon className="h-3.5 w-3.5" />
                    </div>
                  )}
                </motion.div>
              ))}
            </>
          )}
        </div>
        
        <div className="text-xs text-gray-500 mt-3 text-center">
          {!isLoading && filteredCategories.length > 0 && 
            `${filteredCategories.length} فئة متاحة للاختيار`
          }
        </div>
      </div>
    </div>
  );
};

export default CategorySelector;


import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProductCategories } from "@/hooks/use-product-categories";

interface CategorySelectorProps {
  categoryId: string | null;
  storeId?: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categoryId,
  storeId,
  onCategoryChange
}) => {
  const { categories, loading: categoriesLoading } = useProductCategories(storeId);

  return (
    <div className="space-y-2">
      <Label htmlFor="category_id">الفئة</Label>
      <Select 
        value={categoryId || ""} 
        onValueChange={onCategoryChange}
      >
        <SelectTrigger id="category_id">
          <SelectValue placeholder="اختر الفئة" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">بدون فئة</SelectItem>
          {categories.map(category => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {categoriesLoading && (
        <p className="text-xs text-gray-500">جاري تحميل الفئات...</p>
      )}
      {categories.length === 0 && !categoriesLoading && (
        <p className="text-xs text-gray-500">لا توجد فئات متاحة. يمكنك إضافة فئات من قسم "الفئات والأقسام"</p>
      )}
    </div>
  );
};

export default CategorySelector;

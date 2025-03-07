
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategorySelectProps {
  categoryId: string | null;
  categories: any[];
  onCategoryChange: (categoryId: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  categoryId,
  categories,
  onCategoryChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">الفئة</Label>
      <Select 
        value={categoryId || "none"} 
        onValueChange={onCategoryChange}
      >
        <SelectTrigger id="category">
          <SelectValue placeholder="اختر الفئة" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">بدون فئة</SelectItem>
          {categories.map(category => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelect;

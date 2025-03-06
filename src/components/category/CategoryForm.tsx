
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface CategoryFormProps {
  newCategory: string;
  setNewCategory: (name: string) => void;
  handleAddCategory: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  newCategory,
  setNewCategory,
  handleAddCategory
}) => {
  return (
    <div className="flex gap-2">
      <Input
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="اسم التصنيف الجديد..."
        className="max-w-xs"
      />
      <Button 
        className="gap-2"
        onClick={handleAddCategory}
        disabled={!newCategory.trim()}
      >
        <Plus className="h-4 w-4" />
        <span>إضافة</span>
      </Button>
    </div>
  );
};

export default CategoryForm;

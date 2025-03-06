
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash, Save, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  sort_order: number;
}

interface CategoryItemProps {
  category: Category;
  editingCategory: Category | null;
  setEditingCategory: (category: Category | null) => void;
  handleUpdateCategory: () => void;
  handleDeleteCategory: (id: string) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  editingCategory,
  setEditingCategory,
  handleUpdateCategory,
  handleDeleteCategory
}) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      {editingCategory?.id === category.id ? (
        <div className="flex items-center gap-2 flex-1">
          <Input 
            value={editingCategory.name}
            onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
            className="flex-1"
          />
          <Button 
            size="sm" 
            variant="default"
            onClick={handleUpdateCategory}
            disabled={!editingCategory.name.trim()}
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => setEditingCategory(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <span className="text-lg">{category.name}</span>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setEditingCategory(category)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDeleteCategory(category.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryItem;

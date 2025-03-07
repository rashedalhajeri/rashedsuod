import React from "react";
import { Tags, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryItem from "./CategoryItem";
interface Category {
  id: string;
  name: string;
  sort_order: number;
}
interface CategoryListProps {
  categories: Category[];
  loading: boolean;
  searchQuery: string;
  editingCategory: Category | null;
  setEditingCategory: (category: Category | null) => void;
  handleUpdateCategory: () => void;
  handleDeleteCategory: (id: string) => void;
  setNewCategory: (name: string) => void;
  openAddDialog: () => void;
}
const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  loading,
  searchQuery,
  editingCategory,
  setEditingCategory,
  handleUpdateCategory,
  handleDeleteCategory,
  setNewCategory,
  openAddDialog
}) => {
  // Filter categories by search query
  const filteredCategories = categories.filter(category => category.name.toLowerCase().includes(searchQuery.toLowerCase()));
  if (loading) {
    return <div className="text-center py-6">جاري التحميل...</div>;
  }
  if (filteredCategories.length === 0) {
    return <div className="text-center py-12">
        <Tags className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">لا توجد تصنيفات بعد</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          أضف تصنيفات لتنظيم منتجاتك وتسهيل تصفحها للعملاء
        </p>
        
      </div>;
  }
  return <div className="space-y-4">
      {filteredCategories.map(category => <CategoryItem key={category.id} category={category} editingCategory={editingCategory} setEditingCategory={setEditingCategory} handleUpdateCategory={handleUpdateCategory} handleDeleteCategory={handleDeleteCategory} />)}
    </div>;
};
export default CategoryList;
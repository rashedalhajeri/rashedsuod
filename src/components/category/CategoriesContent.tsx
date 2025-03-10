
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tags } from "lucide-react";
import CategoryList from "./CategoryList";
import { Category } from "@/services/category-service";

interface CategoriesContentProps {
  categories: Category[];
  loading: boolean;
  searchQuery: string;
  editingCategory: Category | null;
  setEditingCategory: (category: Category | null) => void;
  handleUpdateCategory: () => void;
  handleDeleteCategory: (id: string) => Promise<void>;
  setNewCategory: (name: string) => void;
  openAddDialog: () => void;
}

const CategoriesContent: React.FC<CategoriesContentProps> = ({
  categories,
  loading,
  searchQuery,
  editingCategory,
  setEditingCategory,
  handleUpdateCategory,
  handleDeleteCategory,
  setNewCategory,
  openAddDialog,
}) => {
  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Tags className="h-4 w-4 text-primary" />
          قائمة الفئات
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-6">
        <CategoryList
          categories={categories}
          loading={loading}
          searchQuery={searchQuery}
          editingCategory={editingCategory}
          setEditingCategory={setEditingCategory}
          handleUpdateCategory={handleUpdateCategory}
          handleDeleteCategory={handleDeleteCategory}
          setNewCategory={setNewCategory}
          openAddDialog={openAddDialog}
        />
      </CardContent>
    </Card>
  );
};

export default CategoriesContent;

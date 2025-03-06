
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tags, Plus } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import CategorySearchBox from "@/components/category/CategorySearchBox";
import CategoryList from "@/components/category/CategoryList";
import CategoryForm from "@/components/category/CategoryForm";
import { useCategories } from "@/hooks/use-categories";

const Categories: React.FC = () => {
  const {
    categories,
    loading,
    newCategory,
    setNewCategory,
    editingCategory,
    setEditingCategory,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory
  } = useCategories();
  
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">إدارة التصنيفات</h1>
          <CategoryForm
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            handleAddCategory={handleAddCategory}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <CategorySearchBox 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">
              <Tags className="h-4 w-4 inline-block ml-2" />
              قائمة التصنيفات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryList
              categories={categories}
              loading={loading}
              searchQuery={searchQuery}
              editingCategory={editingCategory}
              setEditingCategory={setEditingCategory}
              handleUpdateCategory={handleUpdateCategory}
              handleDeleteCategory={handleDeleteCategory}
              setNewCategory={setNewCategory}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Categories;

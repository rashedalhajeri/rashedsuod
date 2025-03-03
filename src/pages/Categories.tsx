
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

import CategoryList from "@/components/category/CategoryList";
import CategoryEmptyState from "@/components/category/CategoryEmptyState";
import CategoryForm from "@/components/category/CategoryForm";

const Categories = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
  // Mock categories data
  const mockCategories = [
    { 
      id: "cat-1", 
      name: "إلكترونيات", 
      description: "أجهزة إلكترونية وملحقاتها",
      productsCount: 24,
      displayOrder: 1
    },
    { 
      id: "cat-2", 
      name: "ملابس", 
      description: "ملابس رجالية ونسائية",
      productsCount: 45,
      displayOrder: 2
    },
    { 
      id: "cat-3", 
      name: "أحذية", 
      description: "أحذية رجالية ونسائية",
      productsCount: 16,
      displayOrder: 3
    },
    { 
      id: "cat-4", 
      name: "إكسسوارات", 
      description: "إكسسوارات متنوعة",
      productsCount: 12,
      displayOrder: 4
    }
  ];
  
  // Filter categories based on search query
  const filteredCategories = mockCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowForm(true);
  };
  
  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setShowForm(true);
  };
  
  const handleDeleteCategory = (categoryId: string) => {
    toast({
      title: "تم حذف التصنيف",
      description: "تم حذف التصنيف بنجاح",
    });
  };
  
  const handleSaveCategory = (categoryData: any) => {
    if (editingCategory) {
      toast({
        title: "تم تحديث التصنيف",
        description: "تم تحديث التصنيف بنجاح",
      });
    } else {
      toast({
        title: "تم إضافة التصنيف",
        description: "تم إضافة التصنيف بنجاح",
      });
    }
    setShowForm(false);
    setEditingCategory(null);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">التصنيفات</h2>
            <p className="text-muted-foreground">
              إدارة تصنيفات المنتجات في متجرك
            </p>
          </div>
          
          <Button onClick={handleAddCategory}>
            <Plus className="h-4 w-4 ml-2" />
            إضافة تصنيف جديد
          </Button>
        </div>
        
        {showForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{editingCategory ? "تعديل التصنيف" : "إضافة تصنيف جديد"}</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryForm 
                  initialData={editingCategory}
                  onSave={handleSaveCategory}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingCategory(null);
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle>قائمة التصنيفات</CardTitle>
                
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="بحث عن تصنيف..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-9"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {filteredCategories.length === 0 ? (
                <CategoryEmptyState onAdd={handleAddCategory} />
              ) : (
                <CategoryList
                  categories={filteredCategories}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                />
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Categories;

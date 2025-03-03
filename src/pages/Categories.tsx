
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

import CategoryList from "@/components/category/CategoryList";
import CategoryEmptyState from "@/components/category/CategoryEmptyState";
import CategoryForm from "@/components/category/CategoryForm";
import { Category, CategoryFormData } from "@/types/category";

const Categories = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock categories data conforming to the Category type
  const mockCategories: Category[] = [
    { 
      id: "cat-1", 
      name: "إلكترونيات", 
      description: "أجهزة إلكترونية وملحقاتها",
      display_order: 1,
      store_id: "store-1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      product_count: 24
    },
    { 
      id: "cat-2", 
      name: "ملابس", 
      description: "ملابس رجالية ونسائية",
      display_order: 2,
      store_id: "store-1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      product_count: 45
    },
    { 
      id: "cat-3", 
      name: "أحذية", 
      description: "أحذية رجالية ونسائية",
      display_order: 3,
      store_id: "store-1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      product_count: 16
    },
    { 
      id: "cat-4", 
      name: "إكسسوارات", 
      description: "إكسسوارات متنوعة",
      display_order: 4,
      store_id: "store-1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      product_count: 12
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
  
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };
  
  const handleDeleteCategory = (categoryId: string) => {
    toast({
      title: "تم حذف التصنيف",
      description: "تم حذف التصنيف بنجاح",
    });
  };
  
  const handleSaveCategory = async (categoryData: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم يتم حفظ التصنيف. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                  category={editingCategory}
                  onSubmit={handleSaveCategory}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingCategory(null);
                  }}
                  isSubmitting={isSubmitting}
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
                <CategoryEmptyState onCreateCategory={handleAddCategory} />
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

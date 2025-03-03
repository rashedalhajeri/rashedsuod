
import React, { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plus, FileDown, FileUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import CategoryList from "@/components/category/CategoryList";
import CategoryEmptyState from "@/components/category/CategoryEmptyState";
import CategoryForm from "@/components/category/CategoryForm";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Category, CategoryFormData } from "@/types/category";
import { supabase } from "@/integrations/supabase/client";
import { useStoreData, useCategories } from "@/hooks/use-store-data";
import LoadingState from "@/components/ui/loading-state";
import ErrorState from "@/components/ui/error-state";

// النمط الافتراضي للتصنيف الجديد
const defaultCategory: Category = {
  id: "",
  name: "",
  description: "",
  slug: "",
  image: null,
  parent_id: null,
  display_order: 0,
  product_count: 0,
  is_active: true,
  created_at: new Date().toISOString(),
};

const Categories: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const queryClient = useQueryClient();

  // جلب بيانات المتجر
  const { 
    data: storeData,
    isLoading: isLoadingStore,
    error: storeError 
  } = useStoreData();

  // جلب التصنيفات
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
    refetch: refetchCategories
  } = useCategories(storeData?.id);

  // إضافة تصنيف جديد
  const addCategoryMutation = useMutation({
    mutationFn: async (category: CategoryFormData) => {
      if (!storeData?.id) {
        throw new Error("معرف المتجر غير موجود");
      }
      
      const newCategory = {
        ...category,
        store_id: storeData.id,
      };
      
      const { data, error } = await supabase
        .from('categories')
        .insert([newCategory])
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsDialogOpen(false);
      toast.success("تم إضافة التصنيف بنجاح");
    },
    onError: (error) => {
      console.error("خطأ في إضافة التصنيف:", error);
      toast.error("حدث خطأ أثناء إضافة التصنيف");
    },
  });

  // تحديث تصنيف
  const updateCategoryMutation = useMutation({
    mutationFn: async (category: CategoryFormData & { id: string }) => {
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: category.name,
          description: category.description,
          display_order: category.display_order,
          is_active: category.is_active,
          parent_id: category.parent_id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', category.id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsDialogOpen(false);
      setEditingCategory(null);
      toast.success("تم تحديث التصنيف بنجاح");
    },
    onError: (error) => {
      console.error("خطأ في تحديث التصنيف:", error);
      toast.error("حدث خطأ أثناء تحديث التصنيف");
    },
  });

  // حذف تصنيف
  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
        
      if (error) {
        throw error;
      }
      
      return categoryId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("تم حذف التصنيف بنجاح");
    },
    onError: (error) => {
      console.error("خطأ في حذف التصنيف:", error);
      toast.error("حدث خطأ أثناء حذف التصنيف");
    },
  });

  // تصفية التصنيفات بناءً على البحث
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // إضافة تصنيف جديد
  const handleAddCategory = async (formData: CategoryFormData): Promise<void> => {
    await addCategoryMutation.mutateAsync(formData);
  };

  // تعديل تصنيف
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  // حذف تصنيف
  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا التصنيف؟")) {
      deleteCategoryMutation.mutate(categoryId);
    }
  };

  // تحديث تصنيف
  const handleUpdateCategory = async (formData: CategoryFormData): Promise<void> => {
    if (editingCategory?.id) {
      await updateCategoryMutation.mutateAsync({
        ...formData,
        id: editingCategory.id
      });
    }
  };

  // مشاهدة منتجات تصنيف معين
  const handleViewProducts = (category: Category) => {
    toast.info(`عرض منتجات التصنيف: ${category.name}`);
    // في التطبيق الحقيقي يمكن التوجه لصفحة المنتجات مع فلتر التصنيف
    // navigate(`/dashboard/products?category=${category.id}`);
  };

  // مسح نموذج التحرير
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  // عرض حالة التحميل
  if (isLoadingStore || (storeData && isLoadingCategories)) {
    return <LoadingState message="جاري تحميل بيانات التصنيفات..." />;
  }

  // عرض حالة الخطأ
  if (storeError || categoriesError) {
    return (
      <ErrorState 
        title="خطأ في تحميل التصنيفات" 
        message="لم نتمكن من تحميل بيانات التصنيفات" 
        onRetry={() => {
          if (categoriesError) refetchCategories();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">التصنيفات</h2>
          <p className="text-muted-foreground">
            إدارة تصنيفات متجرك وترتيبها
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info("تصدير التصنيفات قريبًا")}>
            <FileDown className="h-4 w-4 ml-2" />
            تصدير
          </Button>
          <Button variant="outline" onClick={() => toast.info("استيراد التصنيفات قريبًا")}>
            <FileUp className="h-4 w-4 ml-2" />
            استيراد
          </Button>
          <Button onClick={() => {
            setEditingCategory(defaultCategory);
            setIsDialogOpen(true);
          }}>
            <Plus className="h-4 w-4 ml-2" />
            إضافة تصنيف
          </Button>
        </div>
      </div>

      {/* بطاقة التصنيفات */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>قائمة التصنيفات</CardTitle>
              
              <div className="relative w-full sm:w-64">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="بحث عن تصنيف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-3 pr-9"
                />
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {filteredCategories.length === 0 ? (
              <CategoryEmptyState onCreateCategory={() => {
                setEditingCategory(defaultCategory);
                setIsDialogOpen(true);
              }} />
            ) : (
              <CategoryList
                categories={filteredCategories}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
                onViewProducts={handleViewProducts}
                currencyCode={storeData?.currency || "ر.س"}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      {/* نافذة إضافة/تعديل التصنيف */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogTitle>
            {editingCategory?.id && editingCategory.id !== "" ? "تعديل التصنيف" : "إضافة تصنيف جديد"}
          </DialogTitle>
          <CategoryForm
            initialData={editingCategory || defaultCategory}
            categories={categories.filter(cat => cat.parent_id === null && (editingCategory?.id !== cat.id))}
            onSubmit={editingCategory?.id && editingCategory.id !== "" ? handleUpdateCategory : handleAddCategory}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;

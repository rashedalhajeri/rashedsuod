
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Layers, Plus, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase, getCurrentUser } from "@/integrations/supabase/client";
import { CategoryForm, CategoryFormData } from "@/components/category/CategoryForm";
import { CategoryEmptyState } from "@/components/category/CategoryEmptyState";
import { CategoryList } from "@/components/category/CategoryList";

interface Category {
  id: string;
  name: string;
  description: string | null;
  display_order: number | null;
  product_count: number;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>("KWD"); // القيمة الافتراضية
  const navigate = useNavigate();

  const fetchCategories = async (storeId: string) => {
    try {
      setIsLoading(true);
      
      // جلب الأقسام
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('store_id', storeId)
        .order('display_order', { ascending: true });
      
      if (categoryError) throw categoryError;
      
      // جلب عدد المنتجات لكل قسم
      const categoriesWithCounts = await Promise.all(
        categoryData.map(async (category) => {
          const { count, error } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('store_id', storeId)
            .eq('category', category.name);
            
          return {
            ...category,
            product_count: count || 0
          };
        })
      );
      
      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("حدث خطأ أثناء جلب الأقسام");
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchStoreInfo = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        navigate("/");
        return;
      }
      
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('id, currency')
        .eq('user_id', user.id)
        .single();
        
      if (storeError) throw storeError;
      
      setStoreId(storeData.id);
      setCurrency(storeData.currency);
      
      // بعد جلب معلومات المتجر، نجلب الأقسام
      if (storeData.id) {
        await fetchCategories(storeData.id);
      }
    } catch (error) {
      console.error("Error fetching store info:", error);
      toast.error("حدث خطأ أثناء جلب معلومات المتجر");
    }
  };

  useEffect(() => {
    fetchStoreInfo();
  }, [navigate]);

  const handleCreateCategory = async (formData: CategoryFormData) => {
    if (!storeId) return;
    
    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('categories')
        .insert({
          store_id: storeId,
          name: formData.name,
          description: formData.description,
          display_order: formData.display_order
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setCategories((prev) => [...prev, { ...data, product_count: 0 }]);
      setShowForm(false);
      toast.success("تم إضافة القسم بنجاح");
      
    } catch (error: any) {
      console.error("Error creating category:", error);
      toast.error(`حدث خطأ أثناء إضافة القسم: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async (formData: CategoryFormData) => {
    if (!editingCategory || !storeId) return;
    
    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: formData.name,
          description: formData.description,
          display_order: formData.display_order
        })
        .eq('id', editingCategory.id)
        .select()
        .single();
        
      if (error) throw error;
      
      setCategories((prev) => 
        prev.map((category) => 
          category.id === editingCategory.id 
            ? { ...data, product_count: editingCategory.product_count } 
            : category
        )
      );
      
      setEditingCategory(null);
      toast.success("تم تحديث القسم بنجاح");
      
    } catch (error: any) {
      console.error("Error updating category:", error);
      toast.error(`حدث خطأ أثناء تحديث القسم: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategoryId || !storeId) return;
    
    try {
      // أولاً، حذف القسم من جميع المنتجات المرتبطة به
      const categoryToDelete = categories.find(cat => cat.id === deletingCategoryId);
      if (categoryToDelete && categoryToDelete.product_count > 0) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ category: null })
          .eq('store_id', storeId)
          .eq('category', categoryToDelete.name);
          
        if (updateError) throw updateError;
      }
      
      // ثم حذف القسم نفسه
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', deletingCategoryId);
        
      if (error) throw error;
      
      setCategories((prev) => prev.filter((category) => category.id !== deletingCategoryId));
      setDeletingCategoryId(null);
      toast.success("تم حذف القسم بنجاح");
      
    } catch (error: any) {
      console.error("Error deleting category:", error);
      toast.error(`حدث خطأ أثناء حذف القسم: ${error.message}`);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleFormSubmit = async (formData: CategoryFormData) => {
    if (editingCategory) {
      await handleUpdateCategory(formData);
    } else {
      await handleCreateCategory(formData);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">الأقسام</h1>
            <p className="text-gray-600">إدارة أقسام المنتجات في متجرك</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-primary-600 hover:bg-primary-700">
            <Plus className="h-4 w-4 ml-2" />
            إضافة قسم جديد
          </Button>
        </div>

        {!isLoading && categories.length > 0 && (
          <div className="flex items-center space-x-4 space-x-reverse bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث عن قسم..."
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="h-8 w-8 p-0 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل الأقسام...</p>
          </div>
        ) : filteredCategories.length > 0 ? (
          <CategoryList
            categories={filteredCategories}
            onEdit={(category) => setEditingCategory(category)}
            onDelete={(id) => setDeletingCategoryId(id)}
          />
        ) : (
          <CategoryEmptyState
            isSearchActive={searchQuery !== ""}
            searchQuery={searchQuery}
            onAddCategory={() => setShowForm(true)}
            onResetSearch={() => setSearchQuery("")}
          />
        )}

        {/* نموذج إضافة/تعديل قسم */}
        <Dialog
          open={showForm || editingCategory !== null}
          onOpenChange={(open) => {
            if (!open) {
              setShowForm(false);
              setEditingCategory(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogTitle>
              {editingCategory ? "تعديل القسم" : "إضافة قسم جديد"}
            </DialogTitle>
            <CategoryForm
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingCategory(null);
              }}
              initialData={editingCategory || undefined}
              isSubmitting={isSubmitting}
              isEdit={!!editingCategory}
            />
          </DialogContent>
        </Dialog>

        {/* مربع حوار تأكيد الحذف */}
        <AlertDialog
          open={deletingCategoryId !== null}
          onOpenChange={(open) => {
            if (!open) setDeletingCategoryId(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>هل أنت متأكد من حذف هذا القسم؟</AlertDialogTitle>
              <AlertDialogDescription>
                سيتم حذف هذا القسم نهائياً. سيتم إزالة القسم من جميع المنتجات المرتبطة به أيضاً.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteCategory}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                حذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default Categories;

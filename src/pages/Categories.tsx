
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { supabase, getCategoriesByStoreId, updateProductCategory } from "@/integrations/supabase/client";
import { secureRetrieve } from "@/lib/encryption";
import DashboardLayout from "@/components/DashboardLayout";
import CategoryForm from "@/components/category/CategoryForm";
import CategoryList from "@/components/category/CategoryList";
import CategoryEmptyState from "@/components/category/CategoryEmptyState";
import LoadingState from "@/components/dashboard/LoadingState";
import { Category, CategoryFormData } from "@/types/category";

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [currency, setCurrency] = useState("KWD");
  const [storeId, setStoreId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
    return () => {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch store data to get currency
        const userId = await secureRetrieve('user-id');
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (storeError) {
          throw storeError;
        }
        
        setCurrency(storeData.currency);
        setStoreId(storeData.id);
        
        // Fetch categories using the helper function
        const { data: categoriesData, error: categoriesError } = await getCategoriesByStoreId(storeData.id);
        
        if (categoriesError) {
          throw categoriesError;
        }
        
        // Fetch product counts for each category
        const categoriesWithCounts = await Promise.all(
          (categoriesData || []).map(async (category) => {
            const { count, error: countError } = await supabase
              .from('products')
              .select('*', { count: 'exact', head: true })
              .eq('category_id', category.id);
            
            return {
              ...category,
              product_count: count || 0
            };
          })
        );
        
        setCategories(categoriesWithCounts);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("حدث خطأ أثناء تحميل الأقسام");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleCreateCategory = async (data: CategoryFormData) => {
    try {
      setIsSubmitting(true);
      
      if (!storeId) {
        throw new Error("لم يتم العثور على معرف المتجر");
      }
      
      const { data: newCategory, error } = await supabase
        .from('categories')
        .insert({
          store_id: storeId,
          name: data.name,
          description: data.description || null,
          display_order: data.display_order || null
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setCategories(prev => [...prev, { ...newCategory, product_count: 0 }]);
      setShowForm(false);
      toast.success("تم إنشاء القسم بنجاح");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("حدث خطأ أثناء إنشاء القسم");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async (data: CategoryFormData) => {
    try {
      setIsSubmitting(true);
      
      if (!selectedCategory) {
        throw new Error("لم يتم تحديد قسم للتعديل");
      }
      
      const { data: updatedCategory, error } = await supabase
        .from('categories')
        .update({
          name: data.name,
          description: data.description || null,
          display_order: data.display_order || null
        })
        .eq('id', selectedCategory.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setCategories(prev => 
        prev.map(cat => 
          cat.id === selectedCategory.id 
            ? { ...updatedCategory, product_count: cat.product_count } 
            : cat
        )
      );
      
      setSelectedCategory(null);
      setShowForm(false);
      toast.success("تم تحديث القسم بنجاح");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("حدث خطأ أثناء تحديث القسم");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      if (!categoryToDelete) return;
      
      // Update products to remove category_id using the helper function
      const { error: updateError } = await updateProductCategory(categoryToDelete, null);
      
      if (updateError) {
        throw updateError;
      }
      
      // Delete the category
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryToDelete);
      
      if (deleteError) {
        throw deleteError;
      }
      
      setCategories(prev => prev.filter(cat => cat.id !== categoryToDelete));
      setCategoryToDelete(null);
      toast.success("تم حذف القسم بنجاح");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("حدث خطأ أثناء حذف القسم");
    }
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setSelectedCategory(null);
    setShowForm(false);
  };

  const handleViewProducts = (category: Category) => {
    navigate(`/products?category=${category.id}`);
  };

  const handleSubmit = async (data: CategoryFormData) => {
    if (selectedCategory) {
      await handleUpdateCategory(data);
    } else {
      await handleCreateCategory(data);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">الأقسام</h1>
          {!showForm && categories.length > 0 && (
            <Button 
              onClick={() => {
                setSelectedCategory(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              إضافة قسم
            </Button>
          )}
        </div>
        
        {!showForm && categories.length === 0 && (
          <CategoryEmptyState onCreateCategory={() => {
            setSelectedCategory(null);
            setShowForm(true);
          }} />
        )}
        
        {showForm && (
          <CategoryForm
            category={selectedCategory}
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
            isSubmitting={isSubmitting}
          />
        )}
        
        {!showForm && categories.length > 0 && (
          <CategoryList
            categories={categories}
            currencyCode={currency}
            onEdit={handleEditCategory}
            onDelete={(id) => setCategoryToDelete(id)}
            onViewProducts={handleViewProducts}
          />
        )}
        
        <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>هل أنت متأكد من حذف هذا القسم؟</AlertDialogTitle>
              <AlertDialogDescription>
                سيتم إلغاء ارتباط جميع المنتجات بهذا القسم. هذا الإجراء لا يمكن التراجع عنه.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteCategory}
                className="bg-red-500 hover:bg-red-600 text-white"
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

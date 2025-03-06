
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  fetchUserStoreId, 
  fetchCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory, 
  Category 
} from "@/services/category-service";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    const initializeCategories = async () => {
      try {
        setLoading(true);
        
        // Get current user's store
        const userStoreId = await fetchUserStoreId();
        if (!userStoreId) {
          setLoading(false);
          return;
        }
        
        setStoreId(userStoreId);
        
        // Fetch categories
        const { data, error } = await fetchCategories(userStoreId);
        if (error) throw error;
        
        setCategories(data);
      } catch (err: any) {
        console.error("Error fetching store and categories:", err);
        toast.error("حدث خطأ أثناء تحميل التصنيفات");
      } finally {
        setLoading(false);
      }
    };
    
    initializeCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim() || !storeId) return;
    
    try {
      const nextOrder = categories.length > 0 
        ? Math.max(...categories.map(c => c.sort_order)) + 1 
        : 0;
      
      const { data, error } = await addCategory(newCategory, storeId, nextOrder);
      
      if (error) throw error;
      if (data) {
        setCategories([...categories, data]);
        setNewCategory("");
        toast.success("تم إضافة التصنيف بنجاح");
      }
    } catch (err: any) {
      console.error("Error adding category:", err);
      toast.error("حدث خطأ أثناء إضافة التصنيف");
    }
  };
  
  const handleUpdateCategory = async () => {
    if (!editingCategory || !storeId) return;
    
    try {
      const { error } = await updateCategory(editingCategory, storeId);
      
      if (error) throw error;
      
      setCategories(categories.map(c => 
        c.id === editingCategory.id ? editingCategory : c
      ));
      
      setEditingCategory(null);
      toast.success("تم تعديل التصنيف بنجاح");
    } catch (err: any) {
      console.error("Error updating category:", err);
      toast.error("حدث خطأ أثناء تعديل التصنيف");
    }
  };
  
  const handleDeleteCategory = async (categoryId: string) => {
    if (!storeId) return;
    
    try {
      const { error } = await deleteCategory(categoryId, storeId);
      
      if (error) throw error;
      
      setCategories(categories.filter(c => c.id !== categoryId));
      toast.success("تم حذف التصنيف بنجاح");
    } catch (err: any) {
      console.error("Error deleting category:", err);
      toast.error("حدث خطأ أثناء حذف التصنيف");
    }
  };

  return {
    categories,
    loading,
    storeId,
    newCategory,
    setNewCategory,
    editingCategory,
    setEditingCategory,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory
  };
};

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  fetchUserStoreId, 
  fetchCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory, 
  Category,
  updateShowCategoryImages,
  getShowCategoryImages
} from "@/services/category-service";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [categoryImage, setCategoryImage] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showCategoryImages, setShowCategoryImages] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState(false);

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
        
        // Fetch show category images setting
        const { data: showImages } = await getShowCategoryImages(userStoreId);
        setShowCategoryImages(showImages);
      } catch (err: any) {
        console.error("Error fetching store and categories:", err);
        toast.error("حدث خطأ أثناء تحميل التصنيفات");
      } finally {
        setLoading(false);
      }
    };
    
    initializeCategories();
  }, []);

  const handleAddCategory = async (): Promise<void> => {
    if (!newCategory.trim() || !storeId) {
      return Promise.reject("Invalid category or store ID");
    }
    
    setIsUpdating(true);
    try {
      const nextOrder = categories.length > 0 
        ? Math.max(...categories.map(c => c.sort_order)) + 1 
        : 0;
      
      const { data, error } = await addCategory(
        newCategory, 
        storeId, 
        nextOrder,
        showCategoryImages ? categoryImage : null
      );
      
      if (error) throw error;
      if (data) {
        setCategories([...categories, data]);
        setNewCategory("");
        setCategoryImage(null);
        toast.success("تم إضافة التصنيف بنجاح");
        return Promise.resolve();
      }
    } catch (err: any) {
      console.error("Error adding category:", err);
      toast.error("حدث خطأ أثناء إضافة التصنيف");
      return Promise.reject(err);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleUpdateCategory = async () => {
    if (!editingCategory || !storeId) return;
    
    setIsUpdating(true);
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
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDeleteCategory = async (categoryId: string): Promise<void> => {
    if (!storeId) return Promise.reject("No store ID");
    
    setIsUpdating(true);
    try {
      const { error } = await deleteCategory(categoryId, storeId);
      
      if (error) throw error;
      
      setCategories(categories.filter(c => c.id !== categoryId));
      toast.success("تم حذف التصنيف بنجاح");
      return Promise.resolve();
    } catch (err: any) {
      console.error("Error deleting category:", err);
      toast.error("حدث خطأ أثناء حذف التصنيف");
      return Promise.reject(err);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleToggleShowCategoryImages = async (show: boolean) => {
    if (!storeId) return false;
    
    setIsUpdating(true);
    try {
      const { error } = await updateShowCategoryImages(storeId, show);
      
      if (error) throw error;
      
      setShowCategoryImages(show);
      return true;
    } catch (err: any) {
      console.error("Error updating show category images:", err);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    categories,
    loading,
    storeId,
    newCategory,
    setNewCategory,
    categoryImage,
    setCategoryImage,
    editingCategory,
    setEditingCategory,
    showCategoryImages,
    isUpdating,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleToggleShowCategoryImages
  };
};

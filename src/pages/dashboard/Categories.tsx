
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tags, Plus, Search, Edit, Trash, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  sort_order: number;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [storeId, setStoreId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchStoreAndCategories = async () => {
      try {
        setLoading(true);
        
        // Get current user's store
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) return;
        
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('id')
          .eq('user_id', userData.user.id)
          .maybeSingle();
          
        if (storeError) throw storeError;
        if (!storeData) return;
        
        setStoreId(storeData.id);
        
        // Fetch categories
        await fetchCategories(storeData.id);
      } catch (err) {
        console.error("Error fetching store and categories:", err);
        toast.error("حدث خطأ أثناء تحميل التصنيفات");
      } finally {
        setLoading(false);
      }
    };
    
    fetchStoreAndCategories();
  }, []);
  
  const fetchCategories = async (storeId: string) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('store_id', storeId)
        .order('sort_order', { ascending: true });
        
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("حدث خطأ أثناء تحميل التصنيفات");
    }
  };
  
  const handleAddCategory = async () => {
    if (!newCategory.trim() || !storeId) return;
    
    try {
      const nextOrder = categories.length > 0 
        ? Math.max(...categories.map(c => c.sort_order)) + 1 
        : 0;
      
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: newCategory.trim(),
          store_id: storeId,
          sort_order: nextOrder
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setCategories([...categories, data]);
      setNewCategory("");
      toast.success("تم إضافة التصنيف بنجاح");
    } catch (err) {
      console.error("Error adding category:", err);
      toast.error("حدث خطأ أثناء إضافة التصنيف");
    }
  };
  
  const handleUpdateCategory = async () => {
    if (!editingCategory || !storeId) return;
    
    try {
      const { error } = await supabase
        .from('categories')
        .update({
          name: editingCategory.name
        })
        .eq('id', editingCategory.id)
        .eq('store_id', storeId);
        
      if (error) throw error;
      
      setCategories(categories.map(c => 
        c.id === editingCategory.id ? editingCategory : c
      ));
      
      setEditingCategory(null);
      toast.success("تم تعديل التصنيف بنجاح");
    } catch (err) {
      console.error("Error updating category:", err);
      toast.error("حدث خطأ أثناء تعديل التصنيف");
    }
  };
  
  const handleDeleteCategory = async (categoryId: string) => {
    if (!storeId) return;
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId)
        .eq('store_id', storeId);
        
      if (error) throw error;
      
      setCategories(categories.filter(c => c.id !== categoryId));
      toast.success("تم حذف التصنيف بنجاح");
    } catch (err) {
      console.error("Error deleting category:", err);
      toast.error("حدث خطأ أثناء حذف التصنيف");
    }
  };
  
  const filteredCategories = categories.filter(
    category => category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">إدارة التصنيفات</h1>
          <div className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="اسم التصنيف الجديد..."
              className="max-w-xs"
            />
            <Button 
              className="gap-2"
              onClick={handleAddCategory}
              disabled={!newCategory.trim()}
            >
              <Plus className="h-4 w-4" />
              <span>إضافة</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="البحث عن تصنيف..." 
                className="pl-3 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
            {loading ? (
              <div className="text-center py-6">جاري التحميل...</div>
            ) : filteredCategories.length > 0 ? (
              <div className="space-y-4">
                {filteredCategories.map(category => (
                  <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                    {editingCategory?.id === category.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input 
                          value={editingCategory.name}
                          onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                          className="flex-1"
                        />
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={handleUpdateCategory}
                          disabled={!editingCategory.name.trim()}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setEditingCategory(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="text-lg">{category.name}</span>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => setEditingCategory(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Tags className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">لا توجد تصنيفات بعد</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  أضف تصنيفات لتنظيم منتجاتك وتسهيل تصفحها للعملاء
                </p>
                <Button 
                  className="mt-4 gap-2"
                  onClick={() => setNewCategory("تصنيف جديد")}
                >
                  <Plus className="h-4 w-4" />
                  <span>إضافة أول تصنيف</span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Categories;

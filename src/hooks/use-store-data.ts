
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { secureRetrieve } from "@/lib/encryption";

// Hook لجلب بيانات المتجر
export const useStoreData = () => {
  const fetchStoreData = async () => {
    const userId = await secureRetrieve('user-id');
    
    if (!userId) {
      throw new Error("لم يتم العثور على معرف المستخدم");
    }
    
    console.log("Fetching store data for user:", userId);
    
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error) {
      console.error("خطأ في جلب بيانات المتجر:", error);
      throw new Error("فشل في جلب بيانات المتجر");
    }
    
    return data;
  };
  
  return useQuery({
    queryKey: ['storeData'],
    queryFn: fetchStoreData,
    staleTime: 1000 * 60 * 5, // 5 دقائق
    retry: 1,
  });
};

// Hook لجلب التصنيفات
export const useCategories = (storeId: string | undefined) => {
  const fetchCategories = async () => {
    if (!storeId) {
      return [];
    }
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('store_id', storeId)
        .order('display_order', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      // إضافة عدد المنتجات (هذا سيكون حقيقيًا في التطبيق الحقيقي عندما تكون هناك علاقة مع جدول المنتجات)
      return data.map(category => ({
        ...category,
        product_count: Math.floor(Math.random() * 50), // بيانات وهمية
      }));
    } catch (error) {
      console.error("خطأ في جلب التصنيفات:", error);
      throw new Error("فشل في جلب التصنيفات");
    }
  };

  return useQuery({
    queryKey: ['categories', storeId],
    queryFn: fetchCategories,
    enabled: !!storeId,
    staleTime: 1000 * 60, // دقيقة واحدة
  });
};

export default useStoreData;


import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Category {
  id: string;
  name: string;
  sort_order: number;
}

export const useProductCategories = (storeId?: string) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!storeId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('store_id', storeId)
          .order('sort_order', { ascending: true });
        
        if (error) throw error;
        
        setCategories(data || []);
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        setError(err.message);
        toast.error("حدث خطأ أثناء تحميل التصنيفات");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, [storeId]);

  return {
    categories,
    loading,
    error
  };
};


import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useProductCategories = (storeId: string | undefined) => {
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    if (storeId) {
      const fetchCategories = async () => {
        const { data } = await supabase
          .from('categories')
          .select('*')
          .eq('store_id', storeId)
          .order('name', { ascending: true });
        
        setCategories(data || []);
      };
      
      fetchCategories();
    }
  }, [storeId]);

  return { categories };
};

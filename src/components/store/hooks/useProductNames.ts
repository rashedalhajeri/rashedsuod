
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useProductNames = (storeDomain?: string) => {
  const [productNames, setProductNames] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchProductNames = async () => {
      if (!storeDomain) return;
      
      try {
        const { data } = await supabase
          .from('products')
          .select('name')
          .limit(10);
          
        if (data && data.length > 0) {
          setProductNames(data.map(product => product.name));
        }
      } catch (error) {
        console.error("Error fetching product names:", error);
      }
    };
    
    fetchProductNames();
  }, [storeDomain]);

  return productNames;
};

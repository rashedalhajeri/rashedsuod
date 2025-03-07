
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSectionProducts = (storeId?: string) => {
  const [sectionProducts, setSectionProducts] = useState<{[key: string]: any[]}>({});
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchSectionsWithProducts = async () => {
      if (!storeId) return;
      
      setIsLoading(true);
      try {
        const { data: activeSections } = await supabase
          .from('sections')
          .select('*')
          .eq('store_id', storeId)
          .eq('is_active', true);
          
        if (!activeSections || activeSections.length === 0) {
          setSectionProducts({});
          return;
        }
        
        const sectionProductsObj: {[key: string]: any[]} = {};
        
        for (const section of activeSections) {
          let productsQuery = supabase
            .from('products')
            .select('*')
            .eq('store_id', storeId);
            
          switch (section.section_type) {
            case 'best_selling':
              productsQuery = productsQuery.limit(8);
              break;
            case 'new_arrivals':
              productsQuery = productsQuery.order('created_at', { ascending: false }).limit(8);
              break;
            case 'featured':
              productsQuery = productsQuery.limit(4);
              break;
            case 'on_sale':
              productsQuery = productsQuery.limit(6);
              break;
            case 'custom':
            default:
              productsQuery = productsQuery.limit(8);
              break;
          }
          
          const { data: sectionProductsData } = await productsQuery;
          sectionProductsObj[section.name] = sectionProductsData || [];
        }
        
        setSectionProducts(sectionProductsObj);
      } catch (error) {
        console.error("Error fetching sections with products:", error);
        setSectionProducts({});
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSectionsWithProducts();
  }, [storeId]);

  return { sectionProducts, isLoading };
};

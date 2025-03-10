
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
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
          
        if (!activeSections || activeSections.length === 0) {
          setSectionProducts({});
          return;
        }
        
        const sectionProductsObj: {[key: string]: any[]} = {};
        
        for (const section of activeSections) {
          let productsQuery = supabase
            .from('products')
            .select('*')
            .eq('store_id', storeId)
            .eq('is_active', true);
            
          switch (section.section_type) {
            case 'best_selling':
              productsQuery = productsQuery
                .order('sales_count', { ascending: false })
                .limit(8);
              break;
            case 'new_arrivals':
              productsQuery = productsQuery
                .order('created_at', { ascending: false })
                .limit(8);
              break;
            case 'featured':
              productsQuery = productsQuery
                .eq('is_featured', true)
                .limit(8);
              break;
            case 'on_sale':
              productsQuery = productsQuery
                .not('discount_price', 'is', null)
                .limit(8);
              break;
            case 'all_products':
              productsQuery = productsQuery
                .order('created_at', { ascending: false })
                .limit(12);
              break;
            case 'category':
              if (section.category_id) {
                productsQuery = productsQuery
                  .eq('category_id', section.category_id)
                  .limit(8);
              }
              break;
            case 'custom':
              if (section.product_ids && section.product_ids.length > 0) {
                productsQuery = productsQuery
                  .in('id', section.product_ids)
                  .limit(section.product_ids.length);
              }
              break;
            default:
              productsQuery = productsQuery.limit(8);
              break;
          }
          
          const { data: sectionProductsData } = await productsQuery;
          
          // Only add sections that have products
          if (sectionProductsData && sectionProductsData.length > 0) {
            sectionProductsObj[section.name] = sectionProductsData;
          }
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

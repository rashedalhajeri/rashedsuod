
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Define extended Section type to include the properties we need
interface ExtendedSection {
  id: string;
  name: string;
  section_type: string;
  store_id: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Add the missing properties as optional
  category_id?: string | null;
  product_ids?: string[] | null;
  display_style?: 'grid' | 'list';
}

export const useSectionProducts = (storeId?: string) => {
  const [sectionProducts, setSectionProducts] = useState<{[key: string]: any[]}>({});
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchSectionsWithProducts = async () => {
      if (!storeId) return;
      
      setIsLoading(true);
      try {
        // Cast the returned data to the extended section type
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
        
        // Cast each section to our extended type
        for (const section of activeSections as ExtendedSection[]) {
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
            case 'trending':
              // For trending, we'll use a combination of sales and views (using sales_count for now)
              productsQuery = productsQuery
                .order('sales_count', { ascending: false })
                .limit(8);
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

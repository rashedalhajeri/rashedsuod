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
        // Fetch all active sections
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

        // To avoid repeating same products in different sections, keep track of products already added
        const addedProductIds = new Set<string>();
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
                .limit(50);
              break;
            case 'new_arrivals':
              productsQuery = productsQuery
                .order('created_at', { ascending: false })
                .limit(50);
              break;
            case 'featured':
              productsQuery = productsQuery
                .eq('is_featured', true)
                .limit(50);
              break;
            case 'on_sale':
              productsQuery = productsQuery
                .not('discount_price', 'is', null)
                .limit(50);
              break;
            case 'all_products':
              productsQuery = productsQuery
                .order('created_at', { ascending: false })
                .limit(50);
              break;
            case 'trending':
              // For trending, use view_count if available, otherwise sales_count
              productsQuery = productsQuery
                .order('view_count', { ascending: false })
                .limit(50);
              break;
            default:
              productsQuery = productsQuery.limit(50);
              break;
          }
          
          const { data: sectionProductsData } = await productsQuery;
          
          // Filter out products that already appear in other sections to avoid duplication
          // But only do this for specific section types (not for all_products)
          let filteredProducts = sectionProductsData || [];
          
          if (section.section_type !== 'all_products') {
            filteredProducts = filteredProducts.filter(product => {
              // Keep this product if it hasn't been shown in another section
              if (!addedProductIds.has(product.id)) {
                addedProductIds.add(product.id);
                return true;
              }
              return false;
            });
          }
          
          // Only add sections that have products
          if (filteredProducts.length > 0) {
            sectionProductsObj[section.name] = filteredProducts;
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

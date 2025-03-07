
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CategoryWithProductCount {
  name: string;
  product_count: number;
}

export const useCategoryNavigation = (storeDomain?: string) => {
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<CategoryWithProductCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategoriesWithProducts = async () => {
      try {
        setIsLoading(true);
        
        // Get store ID first by domain
        if (!storeDomain) {
          setIsLoading(false);
          return;
        }
        
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('id')
          .eq('domain_name', storeDomain)
          .maybeSingle();
          
        if (storeError || !storeData) {
          console.error("Error fetching store:", storeError);
          setIsLoading(false);
          return;
        }
        
        // Fetch categories with actual products (not just counts)
        const { data, error } = await supabase
          .from('categories')
          .select(`
            name,
            products:products(id)
          `)
          .eq('store_id', storeData.id)
          .order('sort_order');
          
        if (error) {
          console.error("Error fetching categories:", error);
          setIsLoading(false);
          return;
        }
        
        if (data && data.length > 0) {
          // Transform data to include product counts
          const categoriesWithCounts = data.map(category => ({
            name: category.name,
            product_count: category.products.length
          }));
          
          // Filter out categories with no products
          const filteredCategories = categoriesWithCounts.filter(cat => cat.product_count > 0);
          
          setCategoriesWithProducts(filteredCategories);
        }
      } catch (err) {
        console.error("Error in fetchCategoriesWithProducts:", err);
      } finally {
        // Add a small delay for smoother transition
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      }
    };
    
    if (storeDomain) {
      fetchCategoriesWithProducts();
    }
  }, [storeDomain]);

  // Only include categories with products
  const displayCategories = ["الكل", ...categoriesWithProducts.map(cat => cat.name)];
  
  return {
    categoriesWithProducts,
    displayCategories,
    isLoading,
    hasCategories: displayCategories.length > 1 // At least "All" and one other category
  };
};

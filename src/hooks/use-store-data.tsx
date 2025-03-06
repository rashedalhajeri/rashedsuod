
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useStoreData = (storeDomain: string | undefined) => {
  const [storeData, setStoreData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);

        // Get store by domain name
        const { data: store, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('domain_name', storeDomain)
          .single();

        if (storeError) throw storeError;
        if (!store) {
          setError("لم يتم العثور على المتجر");
          return;
        }
        
        setStoreData(store);

        // Fetch store categories
        const { data: storeCategories, error: categoriesError } = await supabase
          .from('categories')
          .select('name')
          .eq('store_id', store.id)
          .order('sort_order', { ascending: true });
        
        if (categoriesError) throw categoriesError;
        
        // Set categories from database
        const dbCategories = storeCategories?.map(cat => cat.name) || [];
        setCategories(dbCategories);

        // Get products from this store
        const { data: storeProducts, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', store.id)
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;
        
        const allProducts = storeProducts || [];
        setProducts(allProducts);

        // Select featured products (most recent 4)
        setFeaturedProducts(allProducts.slice(0, 4));
        
        // Select best selling products (random 4 for demo)
        // In a real app, you would sort by sales count
        const randomProducts = [...allProducts]
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        
        setBestSellingProducts(randomProducts);
      } catch (err) {
        console.error("Error fetching store data:", err);
        setError("حدث خطأ أثناء تحميل بيانات المتجر");
      } finally {
        setLoading(false);
      }
    };

    if (storeDomain) {
      fetchStoreData();
    }
  }, [storeDomain]);

  return {
    storeData,
    products,
    categories,
    featuredProducts,
    bestSellingProducts,
    loading,
    error
  };
};

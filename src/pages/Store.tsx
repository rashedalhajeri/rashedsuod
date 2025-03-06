
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStoreData } from "@/hooks/use-store-data";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import StoreLayout from "@/components/store/StoreLayout";
import StoreContent from "@/components/store/StoreContent";
import { supabase } from "@/integrations/supabase/client";

const Store = () => {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const { storeData, isLoading, error } = useStoreData();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);

  useEffect(() => {
    if (storeData?.id) {
      const fetchStoreData = async () => {
        setIsLoadingData(true);
        try {
          // Fetch products
          const { data: productsData } = await supabase
            .from('products')
            .select('*')
            .eq('store_id', storeData.id);
          
          setProducts(productsData || []);
          
          // Fetch categories
          const { data: categoriesData } = await supabase
            .from('categories')
            .select('name')
            .eq('store_id', storeData.id);
          
          const categoryNames = categoriesData?.map(cat => cat.name) || [];
          setCategories(categoryNames);
          
          // Fetch sections
          const { data: sectionsData } = await supabase
            .from('sections')
            .select('name')
            .eq('store_id', storeData.id)
            .eq('is_active', true);
          
          const sectionNames = sectionsData?.map(sec => sec.name) || [];
          setSections(sectionNames);
          
          // For now, use empty arrays for featured and best selling products
          // In a real implementation, you'd filter products based on section data
          setFeaturedProducts([]);
          setBestSellingProducts([]);
        } catch (err) {
          console.error("Error fetching store data:", err);
        } finally {
          setIsLoadingData(false);
        }
      };
      
      fetchStoreData();
    }
  }, [storeData]);

  if (isLoading || isLoadingData) {
    return <LoadingState message="جاري تحميل المتجر..." />;
  }

  if (error) {
    return <ErrorState title="خطأ" message={error.message || "حدث خطأ أثناء تحميل المتجر"} />;
  }

  return (
    <StoreLayout storeData={storeData}>
      <StoreContent 
        storeData={storeData}
        products={products}
        categories={categories}
        sections={sections}
        featuredProducts={featuredProducts}
        bestSellingProducts={bestSellingProducts}
      />
    </StoreLayout>
  );
};

export default Store;

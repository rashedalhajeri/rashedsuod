
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStoreData } from "@/hooks/use-store-data";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import StoreLayout from "@/components/store/StoreLayout";
import StoreContent from "@/components/store/StoreContent";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import ProductGridSkeleton from "@/components/store/skeletons/ProductGridSkeleton";

const Store = () => {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const { storeData, isLoading, error } = useStoreData();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [showContent, setShowContent] = useState(false);
  const [currentStoreData, setCurrentStoreData] = useState<any>(null);

  // تحميل بيانات المتجر الحالي استناداً إلى اسم الدومين
  useEffect(() => {
    const fetchCurrentStore = async () => {
      if (!storeDomain) return;
      
      try {
        const cleanDomain = storeDomain.trim().toLowerCase();
        
        const { data, error } = await supabase
          .from("stores")
          .select("*")
          .eq("domain_name", cleanDomain)
          .single();
          
        if (error) {
          console.error("خطأ في تحميل بيانات المتجر:", error);
          return;
        }
        
        setCurrentStoreData(data);
      } catch (err) {
        console.error("خطأ غير متوقع في تحميل المتجر:", err);
      }
    };
    
    fetchCurrentStore();
  }, [storeDomain]);

  useEffect(() => {
    // تأكد من استخدام بيانات المتجر المحدد بدقة (من الدومين) بدلاً من storeData العام
    const store = currentStoreData || storeData;
    
    if (store?.id) {
      const fetchStoreData = async () => {
        setIsLoadingData(true);
        try {
          // Fetch products
          const { data: productsData } = await supabase
            .from('products')
            .select('*')
            .eq('store_id', store.id)
            .order('created_at', { ascending: false });
          
          setProducts(productsData || []);
          
          // Fetch categories with product counts
          const { data: categoriesData } = await supabase
            .from('categories')
            .select(`
              name,
              products:products(count)
            `)
            .eq('store_id', store.id);
          
          // Filter out categories with no products
          const categoriesWithProducts = categoriesData
            ?.filter(cat => cat.products.length > 0)
            .map(cat => cat.name) || [];
            
          setCategories(categoriesWithProducts);
          
          // Fetch active sections
          const { data: sectionsData } = await supabase
            .from('sections')
            .select('name')
            .eq('store_id', store.id)
            .eq('is_active', true);
          
          const sectionNames = sectionsData?.map(sec => sec.name) || [];
          setSections(sectionNames);
          
          // Fetch featured and best selling products
          // In a real app, these would be based on actual sales data
          // For now, we'll just grab some products as examples
          
          // Featured products
          const { data: featuredProductsData } = await supabase
            .from('products')
            .select('*')
            .eq('store_id', store.id)
            .limit(4);
          
          setFeaturedProducts(featuredProductsData || []);
          
          // Best selling products
          const { data: bestSellingProductsData } = await supabase
            .from('products')
            .select('*')
            .eq('store_id', store.id)
            .limit(8);
          
          setBestSellingProducts(bestSellingProductsData || []);
        } catch (err) {
          console.error("Error fetching store data:", err);
        } finally {
          // Add a small delay for smoother transitions
          setTimeout(() => {
            setIsLoadingData(false);
            // Short delay before showing content for smooth transition
            setTimeout(() => {
              setShowContent(true);
            }, 100);
          }, 300);
        }
      };
      
      fetchStoreData();
    }
  }, [currentStoreData, storeData]);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ErrorState title="خطأ" message={error.message || "حدث خطأ أثناء تحميل المتجر"} />
      </motion.div>
    );
  }

  // استخدام بيانات المتجر المحدد أو الافتراضي
  const storeToShow = currentStoreData || storeData || {};

  // Instead of a loading state, render the layout with skeletons
  return (
    <StoreLayout storeData={storeToShow}>
      {isLoading || isLoadingData ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="container mx-auto px-4 py-6"
        >
          <div className="grid grid-cols-5 gap-1.5 mx-auto mb-6">
            {[...Array(5)].map((_, index) => (
              <div key={`cat-skeleton-${index}`} className="flex-shrink-0">
                <div className="w-full flex flex-col items-center bg-white rounded-lg p-1.5 shadow-sm border border-gray-100">
                  <div className="w-full aspect-square mb-1 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-2 w-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center py-3 px-5 bg-white border-b border-gray-100 rounded-t-lg shadow-sm">
              <div className="h-7 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="bg-white p-4 rounded-b-lg shadow-sm border border-t-0 border-gray-100">
              <ProductGridSkeleton count={8} />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <StoreContent 
            storeData={storeToShow}
            products={products}
            categories={categories}
            sections={sections}
            featuredProducts={featuredProducts}
            bestSellingProducts={bestSellingProducts}
          />
        </motion.div>
      )}
    </StoreLayout>
  );
};

export default Store;

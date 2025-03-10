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
import { toast } from "sonner";

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
  const [storeNotFound, setStoreNotFound] = useState(false);

  useEffect(() => {
    const fetchCurrentStore = async () => {
      if (!storeDomain) return;
      
      try {
        const cleanDomain = storeDomain.trim().toLowerCase();
        console.log("البحث عن متجر بالدومين:", cleanDomain);
        
        const { data, error } = await supabase
          .from("stores")
          .select("*")
          .ilike("domain_name", cleanDomain)
          .eq("status", "active")
          .maybeSingle();
          
        if (error) {
          console.error("خطأ في تحميل بيانات المتجر:", error);
          setStoreNotFound(true);
          return;
        }
        
        if (!data) {
          console.log("لم يتم العثور على متجر بهذا الدومين:", cleanDomain);
          setStoreNotFound(true);
          return;
        }
        
        console.log("تم العثور على المتجر:", data);
        setCurrentStoreData(data);
        setStoreNotFound(false);
      } catch (err) {
        console.error("خطأ غير متوقع في تحميل المتجر:", err);
        setStoreNotFound(true);
      }
    };
    
    fetchCurrentStore();
  }, [storeDomain]);

  useEffect(() => {
    const store = currentStoreData || storeData;
    
    if (store?.id) {
      const fetchStoreData = async () => {
        setIsLoadingData(true);
        try {
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('store_id', store.id)
            .eq('is_active', true)
            .is('deleted_at', null)
            .order('created_at', { ascending: false });
          
          if (productsError) {
            console.error("خطأ في تحميل المنتجات:", productsError);
            toast.error("حدث خطأ أثناء تحميل المن��جات");
            return;
          }
          
          setProducts(productsData || []);
          
          const { data: categoriesData, error: categoriesError } = await supabase
            .from('categories')
            .select(`
              name,
              products:products(count)
            `)
            .eq('store_id', store.id);
          
          if (categoriesError) {
            console.error("خطأ في تحميل الفئات:", categoriesError);
          } else {
            const categoriesWithProducts = categoriesData
              ?.filter(cat => cat.products.length > 0)
              .map(cat => cat.name) || [];
              
            setCategories(categoriesWithProducts);
          }
          
          const { data: sectionsData, error: sectionsError } = await supabase
            .from('sections')
            .select('name')
            .eq('store_id', store.id)
            .eq('is_active', true);
          
          if (sectionsError) {
            console.error("خطأ في تحميل الأقسام:", sectionsError);
          } else {
            const sectionNames = sectionsData?.map(sec => sec.name) || [];
            setSections(sectionNames);
          }
          
          const { data: featuredProductsData, error: featuredError } = await supabase
            .from('products')
            .select('*')
            .eq('store_id', store.id)
            .eq('is_featured', true)
            .eq('is_active', true)
            .is('deleted_at', null)
            .limit(4);
          
          if (featuredError) {
            console.error("خطأ في تحميل المنتجات المميزة:", featuredError);
          } else {
            setFeaturedProducts(featuredProductsData || []);
          }
          
          const { data: bestSellingProductsData, error: bestSellingError } = await supabase
            .from('products')
            .select('*')
            .eq('store_id', store.id)
            .eq('is_active', true)
            .is('deleted_at', null)
            .order('sales_count', { ascending: false })
            .limit(8);
          
          if (bestSellingError) {
            console.error("خطأ في تحميل المنتجات الأكثر مبيعاً:", bestSellingError);
          } else {
            setBestSellingProducts(bestSellingProductsData || []);
          }
        } catch (err) {
          console.error("خطأ في تحميل بيانات المتجر:", err);
          toast.error("حدث خطأ أثناء تحميل بيانات المتجر");
        } finally {
          setTimeout(() => {
            setIsLoadingData(false);
            setTimeout(() => {
              setShowContent(true);
            }, 100);
          }, 300);
        }
      };
      
      fetchStoreData();
    }
  }, [currentStoreData, storeData]);

  if (storeNotFound) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4"
      >
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">المتجر غير موجود</h1>
          <p className="text-gray-600 mb-6">
            عذراً، لا يمكن العثور على متجر بالدومين: 
            <span className="font-bold text-gray-800 mx-1 dir-ltr inline-block">{storeDomain}</span>
          </p>
          <a 
            href="/" 
            className="inline-block bg-primary-500 text-white px-6 py-2 rounded-md hover:bg-primary-600 transition-colors"
          >
            العودة للصفحة الرئيسية
          </a>
        </div>
      </motion.div>
    );
  }

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

  const storeToShow = currentStoreData || storeData || {};

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

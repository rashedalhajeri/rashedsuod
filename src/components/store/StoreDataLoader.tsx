
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { normalizeStoreDomain } from "@/utils/url-helpers";
import { fetchStoreByDomain, clearStoreCache } from "@/utils/store-helpers";

interface StoreDataLoaderProps {
  storeDomain: string | undefined;
  onStoreLoaded: (storeData: any) => void;
  onStoreNotFound: () => void;
  onLoadingComplete: () => void;
  storeData: any;
  children: React.ReactNode;
}

const StoreDataLoader: React.FC<StoreDataLoaderProps> = ({
  storeDomain,
  onStoreLoaded,
  onStoreNotFound,
  onLoadingComplete,
  storeData: initialStoreData,
  children
}) => {
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [currentStoreData, setCurrentStoreData] = useState<any>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Fetch the current store based on domain
  useEffect(() => {
    const fetchCurrentStore = async () => {
      if (!storeDomain) {
        console.error("اسم الدومين غير محدد");
        onStoreNotFound();
        return;
      }
      
      try {
        console.log("بدء البحث عن المتجر بالدومين:", storeDomain, "محاولة رقم:", retryCount + 1);
        
        // If this is a retry attempt, clear the cache first
        if (retryCount > 0) {
          clearStoreCache();
        }
        
        // استخدام الدالة الجديدة للبحث عن المتجر
        const storeData = await fetchStoreByDomain(storeDomain);
        
        if (!storeData) {
          console.error("لم يتم العثور على المتجر بعد محاولات متعددة للبحث:", storeDomain);
          
          // إذا كان هذا رقم المحاولة الأخيرة، نستسلم ونعرض رسالة الخطأ
          if (retryCount >= 2) {
            // طباعة جميع المتاجر للتصحيح
            const { data: allStores } = await supabase
              .from("stores")
              .select("domain_name, store_name, status, id")
              .order("created_at", { ascending: false });
              
            console.log("جميع المتاجر المتاحة في StoreDataLoader:", allStores);
            
            onStoreNotFound();
            return;
          } else {
            // محاولة أخرى بعد تأخير قصير
            setRetryCount(prev => prev + 1);
            setTimeout(() => fetchCurrentStore(), 1000);
            return;
          }
        }
        
        if (storeData.status !== 'active') {
          console.log("تم العثور على المتجر ولكن حالته غير نشطة:", storeData.status);
          toast.error("هذا المتجر غير نشط حالياً");
          onStoreNotFound();
          return;
        }
        
        console.log("تم العثور على المتجر:", storeData);
        setCurrentStoreData(storeData);
        onStoreLoaded(storeData);
        // Reset retry count on success
        setRetryCount(0);
      } catch (err) {
        console.error("خطأ غير متوقع في تحميل المتجر:", err);
        
        // على المحاولة الأخيرة، نستسلم
        if (retryCount >= 2) {
          onStoreNotFound();
        } else {
          // محاولة أخرى
          setRetryCount(prev => prev + 1);
          setTimeout(() => fetchCurrentStore(), 1000);
        }
      }
    };
    
    fetchCurrentStore();
  }, [storeDomain, onStoreLoaded, onStoreNotFound, retryCount]);

  // Fetch store products and other data
  useEffect(() => {
    const store = currentStoreData || initialStoreData;
    
    if (store?.id) {
      const fetchStoreData = async () => {
        setIsLoadingData(true);
        try {
          console.log("تحميل بيانات المتجر بمعرف:", store.id);
          
          // Fetch products with additional logging
          console.log("جاري جلب المنتجات للمتجر:", store.id);
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('store_id', store.id)
            .eq('is_active', true)
            .is('deleted_at', null)
            .order('created_at', { ascending: false });
          
          if (productsError) {
            console.error("خطأ في تحميل المنتجات:", productsError);
            toast.error("حدث خطأ أثناء تحميل المنتجات");
            return;
          }
          
          console.log(`تم جلب ${productsData?.length || 0} منتجات`);
          
          // Fetch categories
          console.log("جاري جلب الفئات للمتجر:", store.id);
          const { data: categoriesData, error: categoriesError } = await supabase
            .from('categories')
            .select(`
              name,
              products:products(count)
            `)
            .eq('store_id', store.id);
          
          // Fetch sections
          console.log("جاري جلب الأقسام للمتجر:", store.id);
          const { data: sectionsData, error: sectionsError } = await supabase
            .from('sections')
            .select('name')
            .eq('store_id', store.id)
            .eq('is_active', true);
          
          // Fetch featured products
          console.log("جاري جلب المنتجات المميزة للمتجر:", store.id);
          const { data: featuredProductsData, error: featuredError } = await supabase
            .from('products')
            .select('*')
            .eq('store_id', store.id)
            .eq('is_featured', true)
            .eq('is_active', true)
            .is('deleted_at', null)
            .limit(4);
          
          // Fetch best selling products
          console.log("جاري جلب المنتجات الأكثر مبيعاً للمتجر:", store.id);
          const { data: bestSellingProductsData, error: bestSellingError } = await supabase
            .from('products')
            .select('*')
            .eq('store_id', store.id)
            .eq('is_active', true)
            .is('deleted_at', null)
            .order('sales_count', { ascending: false })
            .limit(8);
          
          // Log any errors
          if (categoriesError) {
            console.error("خطأ في تحميل الفئات:", categoriesError);
          }
          
          if (sectionsError) {
            console.error("خطأ في تحميل الأقسام:", sectionsError);
          }
          
          if (featuredError) {
            console.error("خطأ في تحميل المنتجات المميزة:", featuredError);
          }
          
          if (bestSellingError) {
            console.error("خطأ في تحميل المنتجات الأكثر مبيعاً:", bestSellingError);
          }
          
          // Process and format the loaded data
          const categoriesWithProducts = categoriesData
            ?.filter(cat => cat.products.length > 0)
            .map(cat => cat.name) || [];
            
          const sectionNames = sectionsData?.map(sec => sec.name) || [];
          
          const storeDataWithProducts = {
            ...store,
            products: productsData || [],
            categories: categoriesWithProducts,
            sections: sectionNames,
            featuredProducts: featuredProductsData || [],
            bestSellingProducts: bestSellingProductsData || []
          };
          
          // Pass all data to parent component through callback
          onStoreLoaded(storeDataWithProducts);
          
          console.log("تم تحميل بيانات المتجر بنجاح:", 
            `منتجات: ${productsData?.length || 0}`, 
            `فئات: ${categoriesWithProducts.length || 0}`,
            `أقسام: ${sectionNames.length || 0}`
          );
          
        } catch (err) {
          console.error("خطأ في تحميل بيانات المتجر:", err);
          toast.error("حدث خطأ أثناء تحميل بيانات المتجر");
        } finally {
          setTimeout(() => {
            setIsLoadingData(false);
            setTimeout(() => {
              onLoadingComplete();
            }, 100);
          }, 300);
        }
      };
      
      fetchStoreData();
    }
  }, [currentStoreData, initialStoreData, onLoadingComplete, onStoreLoaded]);

  return <>{children}</>;
};

export default StoreDataLoader;

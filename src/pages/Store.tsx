
import React, { useState, useEffect } from "react";
import { useStoreData } from "@/hooks/use-store-data";
import StoreDataLoader from "@/components/store/StoreDataLoader";
import StoreNotFound from "@/components/store/StoreNotFound";
import StoreSkeleton from "@/components/store/StoreSkeleton";
import StoreContent from "@/components/store/StoreContent";
import StorePageLayout from "@/components/store/layout/StorePageLayout";
import { useStoreDomain } from "@/hooks/use-store-domain";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { ErrorState } from "@/components/ui/error-state";
import { toast } from "sonner";
import { checkStoreStatus } from "@/utils/store-helpers";
import { supabase } from "@/integrations/supabase/client";

const Store = () => {
  const { domain: storeDomain, isValidDomain, rawDomain } = useStoreDomain();
  const { storeData, isLoading, error } = useStoreData();
  const [storeNotFound, setStoreNotFound] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [currentStoreData, setCurrentStoreData] = useState<any>(null);
  const [loadedStoreData, setLoadedStoreData] = useState<any>({
    products: [],
    categories: [],
    sections: [],
    featuredProducts: [],
    bestSellingProducts: []
  });

  // تحقق من وجود وحالة المتجر عند التحميل
  useEffect(() => {
    const verifyStore = async () => {
      if (isValidDomain && storeDomain) {
        console.log("التحقق من حالة المتجر:", storeDomain);
        
        try {
          // تحقق أولاً من وجود المتجر بشكل مباشر عبر supabase
          const { data: directData, error: directError } = await supabase
            .from('stores')
            .select('*')
            .eq('domain_name', storeDomain.toLowerCase())
            .maybeSingle();
            
          console.log("نتيجة البحث المباشر:", directData, directError);
          
          if (directData) {
            // المتجر موجود
            console.log("تم العثور على المتجر مباشرة:", directData);
            
            if (directData.status === 'active') {
              setStoreNotFound(false);
              setCurrentStoreData(directData);
            } else {
              console.log("المتجر موجود ولكنه غير نشط:", directData.status);
              toast.error("هذا المتجر غير نشط حالياً");
              setStoreNotFound(true);
            }
            return;
          }
          
          // إذا لم يتم العثور على المتجر، نستخدم الوظيفة المساعدة
          const { exists, active, store } = await checkStoreStatus(storeDomain);
          
          if (!exists) {
            console.log("المتجر غير موجود:", storeDomain);
            setStoreNotFound(true);
          } else if (!active) {
            console.log("المتجر موجود ولكنه غير نشط:", storeDomain);
            toast.error("هذا المتجر غير نشط حالياً");
            setStoreNotFound(true);
          } else {
            console.log("المتجر موجود ونشط:", store);
            setStoreNotFound(false);
            if (store) {
              setCurrentStoreData(store);
            }
          }
        } catch (error) {
          console.error("خطأ في التحقق من المتجر:", error);
          setStoreNotFound(true);
        }
      }
    };
    
    // طباعة جميع المتاجر للتصحيح
    const logAllStores = async () => {
      try {
        const { data: allStores } = await supabase
          .from("stores")
          .select("domain_name, store_name, status, id")
          .order("created_at", { ascending: false });
          
        console.log("جميع المتاجر المتاحة في Store.tsx:", allStores);
      } catch (err) {
        console.error("خطأ في جلب جميع المتاجر:", err);
      }
    };
    
    logAllStores();
    verifyStore();
  }, [storeDomain, isValidDomain]);

  // Debug logging to help identify domain issues
  useEffect(() => {
    console.log("Store component - Raw domain:", rawDomain);
    console.log("Store component - Normalized domain:", storeDomain);
    console.log("Store component - Is valid domain:", isValidDomain);
    console.log("Store component - Window location:", window.location.href);
    console.log("Store component - Store not found state:", storeNotFound);
  }, [storeDomain, isValidDomain, rawDomain, storeNotFound]);

  const handleStoreLoaded = (data: any) => {
    console.log("تم تحميل بيانات المتجر بنجاح:", data?.store_name);
    setCurrentStoreData(data);
    setStoreNotFound(false);
  };

  const handleStoreDataLoaded = (data: any) => {
    console.log("تم تحميل بيانات المنتجات والفئات:", data);
    setLoadedStoreData(data);
  };

  const handleLoadingComplete = () => {
    setIsLoadingData(false);
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  };

  const handleStoreNotFound = () => {
    console.log("لم يتم العثور على المتجر بالدومين:", storeDomain);
    setStoreNotFound(true);
  };

  if (!isValidDomain || storeNotFound) {
    console.log("إظهار مكون StoreNotFound. دومين صالح:", isValidDomain, "المتجر غير موجود:", storeNotFound);
    return <StoreNotFound storeDomain={rawDomain || storeDomain} />;
  }

  if (error) {
    console.error("خطأ في المتجر:", error);
    return <ErrorState title="خطأ" message={error.message || "حدث خطأ أثناء تحميل المتجر"} />;
  }

  const storeToShow = currentStoreData || storeData || {};

  return (
    <ErrorBoundary>
      <StorePageLayout 
        storeName={storeToShow.store_name || ''}
        logoUrl={storeToShow.logo_url}
      >
        <StoreDataLoader
          storeDomain={storeDomain}
          onStoreLoaded={handleStoreLoaded}
          onStoreNotFound={handleStoreNotFound}
          onLoadingComplete={handleLoadingComplete}
          storeData={storeToShow}
        >
          {isLoading || isLoadingData ? (
            <StoreSkeleton />
          ) : (
            <StoreContent 
              storeData={loadedStoreData}
              products={loadedStoreData.products}
              categories={loadedStoreData.categories}
              sections={loadedStoreData.sections}
              featuredProducts={loadedStoreData.featuredProducts}
              bestSellingProducts={loadedStoreData.bestSellingProducts}
            />
          )}
        </StoreDataLoader>
      </StorePageLayout>
    </ErrorBoundary>
  );
};

export default Store;

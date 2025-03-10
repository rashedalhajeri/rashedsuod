
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

const Store = () => {
  const { domain: storeDomain, isValidDomain } = useStoreDomain();
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

  // Debug logging to help identify domain issues
  useEffect(() => {
    console.log("Store component - Domain:", storeDomain);
    console.log("Store component - Is valid domain:", isValidDomain);
    console.log("Store component - Window location:", window.location.href);
  }, [storeDomain, isValidDomain]);

  const handleStoreLoaded = (data: any) => {
    console.log("Store loaded:", data);
    setCurrentStoreData(data);
    setStoreNotFound(false);
  };

  const handleStoreDataLoaded = (data: any) => {
    console.log("Store data loaded:", data);
    setLoadedStoreData(data);
  };

  const handleLoadingComplete = () => {
    setIsLoadingData(false);
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  };

  const handleStoreNotFound = () => {
    console.log("Store not found for domain:", storeDomain);
    setStoreNotFound(true);
  };

  if (!isValidDomain || storeNotFound) {
    console.log("Showing StoreNotFound component. Valid domain:", isValidDomain, "Store not found:", storeNotFound);
    return <StoreNotFound storeDomain={storeDomain} />;
  }

  if (error) {
    console.error("Store error:", error);
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

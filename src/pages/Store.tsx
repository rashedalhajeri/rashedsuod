
import React, { useState } from "react";
import { useStoreVerification } from "@/hooks/use-store-verification";
import StoreDataLoader from "@/components/store/StoreDataLoader";
import StoreNotFound from "@/components/store/StoreNotFound";
import StoreSkeleton from "@/components/store/StoreSkeleton";
import StoreContent from "@/components/store/StoreContent";
import StorePageLayout from "@/components/store/layout/StorePageLayout";
import { useStoreDomain } from "@/hooks/use-store-domain";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

const Store = () => {
  const { rawDomain } = useStoreDomain();
  const { isVerifying, storeData, error } = useStoreVerification();
  const [loadedStoreData, setLoadedStoreData] = useState<any>({
    products: [],
    categories: [],
    sections: [],
    featuredProducts: [],
    bestSellingProducts: []
  });
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showContent, setShowContent] = useState(false);

  if (isVerifying) {
    return <StoreSkeleton />;
  }

  if (error || !storeData) {
    return <StoreNotFound storeDomain={rawDomain} />;
  }

  const handleStoreDataLoaded = (data: any) => {
    setLoadedStoreData(data);
  };

  const handleLoadingComplete = () => {
    setIsLoadingData(false);
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <ErrorBoundary>
      <StorePageLayout 
        storeName={storeData.store_name || ''}
        logoUrl={storeData.logo_url}
      >
        <StoreDataLoader
          storeDomain={storeData.domain_name}
          onStoreLoaded={handleStoreDataLoaded}
          onStoreNotFound={() => {}}
          onLoadingComplete={handleLoadingComplete}
          storeData={storeData}
        >
          {isLoadingData ? (
            <StoreSkeleton />
          ) : (
            <StoreContent 
              storeData={storeData}
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

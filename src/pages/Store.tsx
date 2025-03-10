
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useStoreData } from "@/hooks/use-store-data";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import StoreLayout from "@/components/store/StoreLayout";
import StoreContent from "@/components/store/StoreContent";
import { motion } from "framer-motion";
import StoreNotFound from "@/components/store/StoreNotFound";
import StoreDataLoader from "@/components/store/StoreDataLoader";
import StoreSkeleton from "@/components/store/StoreSkeleton";

const Store = () => {
  const { storeDomain } = useParams<{ storeDomain: string }>();
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

  // Handle store being found
  const handleStoreLoaded = (data: any) => {
    setCurrentStoreData(data);
    setStoreNotFound(false);
  };

  // Handle store data being loaded
  const handleStoreDataLoaded = (data: any) => {
    setLoadedStoreData(data);
  };

  // Handle loading being complete
  const handleLoadingComplete = () => {
    setIsLoadingData(false);
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  };

  // Handle store not being found
  const handleStoreNotFound = () => {
    setStoreNotFound(true);
  };

  if (storeNotFound) {
    return <StoreNotFound storeDomain={storeDomain} />;
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
      <StoreDataLoader
        storeDomain={storeDomain}
        onStoreLoaded={handleStoreDataLoaded}
        onStoreNotFound={handleStoreNotFound}
        onLoadingComplete={handleLoadingComplete}
        storeData={storeToShow}
      >
        {isLoading || isLoadingData ? (
          <StoreSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <StoreContent 
              storeData={loadedStoreData}
              products={loadedStoreData.products}
              categories={loadedStoreData.categories}
              sections={loadedStoreData.sections}
              featuredProducts={loadedStoreData.featuredProducts}
              bestSellingProducts={loadedStoreData.bestSellingProducts}
            />
          </motion.div>
        )}
      </StoreDataLoader>
    </StoreLayout>
  );
};

export default Store;

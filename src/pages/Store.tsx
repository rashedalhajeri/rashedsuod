
import React from "react";
import { useParams } from "react-router-dom";
import { useStoreData } from "@/hooks/use-store-data";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import StoreLayout from "@/components/store/StoreLayout";
import StoreContent from "@/components/store/StoreContent";

const Store = () => {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const {
    storeData,
    products,
    categories,
    featuredProducts,
    bestSellingProducts,
    loading,
    error
  } = useStoreData(storeDomain);

  if (loading) {
    return <LoadingState message="جاري تحميل المتجر..." />;
  }

  if (error) {
    return <ErrorState title="خطأ" message={error} />;
  }

  return (
    <StoreLayout storeData={storeData}>
      <StoreContent 
        storeData={storeData}
        products={products}
        categories={categories}
        featuredProducts={featuredProducts}
        bestSellingProducts={bestSellingProducts}
      />
    </StoreLayout>
  );
};

export default Store;

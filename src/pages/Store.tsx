
import React from "react";
import { useParams } from "react-router-dom";
import { useStoreData } from "@/hooks/use-store-data";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import StoreLayout from "@/components/store/StoreLayout";
import StoreContent from "@/components/store/StoreContent";

// Mock data for development (will be replaced with actual data from the API)
const mockProducts = [
  { id: '1', name: 'منتج 1', price: 100, category: 'ملابس', section: 'مميز' },
  { id: '2', name: 'منتج 2', price: 200, category: 'إلكترونيات', section: 'جديد' },
  { id: '3', name: 'منتج 3', price: 300, category: 'منزل', section: 'مميز' },
  { id: '4', name: 'منتج 4', price: 400, category: 'ملابس', section: 'الأكثر مبيعًا' },
  { id: '5', name: 'منتج 5', price: 500, category: 'إلكترونيات', section: 'جديد' },
]; 

const mockCategories = ['ملابس', 'إلكترونيات', 'منزل', 'مطبخ', 'رياضة'];
const mockSections = ['مميز', 'جديد', 'الأكثر مبيعًا', 'خصومات', 'العروض'];
const mockFeaturedProducts = [];
const mockBestSellingProducts = [];

const Store = () => {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const { storeData, isLoading, error } = useStoreData();

  // In a real implementation, we would fetch these from the API
  // This is just a placeholder until we implement the actual data fetching
  const products = mockProducts;
  const categories = mockCategories;
  const sections = mockSections;
  const featuredProducts = mockFeaturedProducts;
  const bestSellingProducts = mockBestSellingProducts;

  if (isLoading) {
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

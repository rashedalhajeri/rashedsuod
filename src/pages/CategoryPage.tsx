
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStoreData } from "@/hooks/use-store-data";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useCategoryData } from "@/hooks/use-category-data";
import CategoryContent from "@/components/store/category/CategoryContent";
import StorePageLayout from "@/components/store/layout/StorePageLayout";
import { normalizeStoreDomain } from "@/utils/url-helpers";

const CategoryPage = () => {
  const { storeDomain, categoryName } = useParams();
  const { storeData, isLoading: isLoadingStore, error } = useStoreData();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  // Debug log for domain handling
  useEffect(() => {
    console.log("CategoryPage - Domain:", storeDomain);
    console.log("CategoryPage - Normalized domain:", normalizeStoreDomain(storeDomain || ''));
    console.log("CategoryPage - Category:", categoryName);
  }, [storeDomain, categoryName]);

  const { 
    categoryDetails,
    isLoadingProducts,
    productNames,
    categories,
    sections,
    filteredProducts
  } = useCategoryData(categoryName, searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  const handleCategoryChange = (category: string) => {
    if (!storeDomain) return;
    
    const normalizedDomain = normalizeStoreDomain(storeDomain);
    
    if (category === "الكل") {
      navigate(`/store/${normalizedDomain}/category/الكل`);
    } else {
      navigate(`/store/${normalizedDomain}/category/${encodeURIComponent(category.toLowerCase())}`);
    }
  };
  
  const handleSectionChange = (section: string) => {
    console.log("Section changed:", section);
  };

  if (isLoadingStore) {
    return <LoadingState message="جاري تحميل المتجر..." />;
  }

  if (error) {
    return <ErrorState title="خطأ" message={error.message} />;
  }

  return (
    <StorePageLayout 
      storeName={storeData?.store_name || ''}
      logoUrl={storeData?.logo_url}
      showBackButton={true}
    >
      <CategoryContent
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearchSubmit={handleSearchSubmit}
        productNames={productNames}
        categories={categories}
        sections={sections}
        categoryName={categoryName}
        handleCategoryChange={handleCategoryChange}
        handleSectionChange={handleSectionChange}
        isLoadingProducts={isLoadingProducts}
        filteredProducts={filteredProducts}
        storeDomain={normalizeStoreDomain(storeDomain || '')}
      />
    </StorePageLayout>
  );
};

export default CategoryPage;

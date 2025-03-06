
import React from "react";
import { useStoreFilter } from "@/context/StoreFilterContext";
import { filterProductsBySearch, filterProductsByCategory } from "@/utils/product-filters";
import StoreBanner from "@/components/store/StoreBanner";
import CategoryNavigation from "@/components/store/CategoryNavigation";
import AllProductsSection from "@/components/store/sections/AllProductsSection";

interface StoreContentProps {
  storeData: any;
  products: any[];
  categories: string[];
  sections: string[];
  featuredProducts: any[];
  bestSellingProducts: any[];
}

const StoreContent: React.FC<StoreContentProps> = ({
  storeData,
  products,
  categories,
  sections,
  featuredProducts,
  bestSellingProducts
}) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    activeCategory,
    activeSection,
    handleCategoryChange,
    handleSectionChange,
    handleClearSearch
  } = useStoreFilter();

  // Filter products by search query
  const filteredBySearch = filterProductsBySearch(products, searchQuery);

  // Filter products by category and section
  const displayProducts = filterProductsByCategory(
    filteredBySearch,
    activeCategory,
    activeSection,
    bestSellingProducts,
    searchQuery
  );

  return (
    <>
      {/* App Banner - Now conditional based on bannerUrl existence */}
      <StoreBanner 
        storeName={storeData?.store_name}
        storeDescription={storeData?.description}
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        logoUrl={storeData?.logo_url}
        bannerUrl={storeData?.banner_url}
      />
      
      {/* Category and Section Navigation */}
      <CategoryNavigation 
        activeCategory={activeCategory}
        activeSection={activeSection}
        onCategoryChange={handleCategoryChange}
        onSectionChange={handleSectionChange}
        categories={categories}
        sections={sections}
      />
      
      {/* All Products Section */}
      <AllProductsSection 
        products={displayProducts}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        onClearSearch={handleClearSearch}
      />
    </>
  );
};

export default StoreContent;

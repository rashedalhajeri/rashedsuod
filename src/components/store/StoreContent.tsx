
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
  featuredProducts: any[];
  bestSellingProducts: any[];
}

const StoreContent: React.FC<StoreContentProps> = ({
  storeData,
  products,
  categories,
  featuredProducts,
  bestSellingProducts
}) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    activeCategory,
    handleCategoryChange,
    handleClearSearch
  } = useStoreFilter();

  // Filter products by search query
  const filteredBySearch = filterProductsBySearch(products, searchQuery);

  // Filter products by category
  const displayProducts = filterProductsByCategory(
    filteredBySearch,
    activeCategory,
    "", // No active section anymore
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
      
      {/* Category Quick Links - Now only showing categories */}
      <CategoryNavigation 
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        categories={categories}
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

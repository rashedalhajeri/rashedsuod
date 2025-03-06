
import React from "react";
import { useStoreFilter } from "@/context/StoreFilterContext";
import { filterProductsBySearch, filterProductsByCategory } from "@/utils/product-filters";
import StoreBanner from "@/components/store/StoreBanner";
import CategoryNavigation from "@/components/store/CategoryNavigation";
import FeaturedProductsSection from "@/components/store/sections/FeaturedProductsSection";
import BestSellingProductsSection from "@/components/store/sections/BestSellingProductsSection";
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
    activeSection,
    handleCategoryChange,
    handleClearSearch,
    sections
  } = useStoreFilter();

  // Filter products by search query
  const filteredBySearch = filterProductsBySearch(products, searchQuery);

  // Filter products by category or section
  const displayProducts = filterProductsByCategory(
    filteredBySearch,
    activeCategory,
    activeSection,
    bestSellingProducts,
    searchQuery
  );

  const handleViewAllBestSelling = () => {
    handleCategoryChange("الأكثر مبيعاً");
  };

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
      
      {/* Category Quick Links - نمرر كلا من الأقسام والفئات */}
      <CategoryNavigation 
        activeCategory={activeCategory || activeSection}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        sections={sections}
      />
      
      {/* Featured Products Section */}
      {activeSection === "جميع المنتجات" && !activeCategory && (
        <FeaturedProductsSection 
          products={featuredProducts} 
          onViewAll={() => {}} 
        />
      )}
      
      {/* Best Selling Products Section */}
      {activeSection === "جميع المنتجات" && !activeCategory && (
        <BestSellingProductsSection 
          products={bestSellingProducts} 
          onViewAll={handleViewAllBestSelling} 
        />
      )}
      
      {/* All Products Section */}
      <AllProductsSection 
        products={displayProducts}
        activeCategory={activeCategory || activeSection}
        searchQuery={searchQuery}
        onClearSearch={handleClearSearch}
      />
    </>
  );
};

export default StoreContent;

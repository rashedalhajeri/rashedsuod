
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

  // فلترة المنتجات حسب البحث
  const filteredBySearch = filterProductsBySearch(products, searchQuery);

  // فلترة المنتجات حسب الفئة والقسم
  const displayProducts = filterProductsByCategory(
    filteredBySearch,
    activeCategory,
    activeSection,
    bestSellingProducts,
    searchQuery
  );

  return (
    <>
      {/* شعار المتجر - الآن شرطي بناءً على وجود عنوان URL للشعار */}
      <StoreBanner 
        storeName={storeData?.store_name}
        storeDescription={storeData?.description}
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        logoUrl={storeData?.logo_url}
        bannerUrl={storeData?.banner_url}
      />
      
      {/* تنقل الفئات والأقسام */}
      <CategoryNavigation 
        activeCategory={activeCategory}
        activeSection={activeSection}
        onCategoryChange={handleCategoryChange}
        onSectionChange={handleSectionChange}
        categories={categories}
        sections={sections}
      />
      
      {/* قسم جميع المنتجات */}
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

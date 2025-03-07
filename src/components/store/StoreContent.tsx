
import React, { useState } from "react";
import { useStoreFilter } from "@/context/StoreFilterContext";
import { filterProductsBySearch, filterProductsByCategory } from "@/utils/product-filters";
import { useParams, useNavigate } from "react-router-dom";
import PromoBanner from "./banner/PromoBanner";
import CategoryNavigation from "./CategoryNavigation";
import AllProductsSection from "./sections/AllProductsSection";
import SearchBar from "./navbar/SearchBar";
import SectionContainer from "./sections/SectionContainer";
import SearchResults from "./search/SearchResults";
import { useSectionProducts } from "./hooks/useSectionProducts";
import { useProductNames } from "./hooks/useProductNames";

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
  bestSellingProducts
}) => {
  const navigate = useNavigate();
  const { 
    searchQuery, 
    setSearchQuery, 
    activeCategory,
    activeSection,
    handleCategoryChange,
    handleSectionChange,
    handleClearSearch
  } = useStoreFilter();
  
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const productNames = useProductNames(storeDomain);
  const [showPromoBanner, setShowPromoBanner] = useState(false);
  const { sectionProducts } = useSectionProducts(storeData?.id);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const filteredBySearch = filterProductsBySearch(products, searchQuery);

  const displayProducts = filterProductsByCategory(
    filteredBySearch,
    activeCategory,
    activeSection,
    bestSellingProducts,
    searchQuery
  );

  const showNavigation = categories.length > 0 || sections.length > 0;
  
  const handleCategoryChangeWithNavigation = (category: string) => {
    if (!storeDomain) return;
    
    if (category === "الكل") {
      navigate(`/store/${storeDomain}/category/الكل`);
    } else {
      const categorySlug = encodeURIComponent(category.toLowerCase());
      navigate(`/store/${storeDomain}/category/${categorySlug}`);
    }
  };

  const isShowingSearchResults = searchQuery.trim().length > 0;

  return (
    <>
      {showPromoBanner && <PromoBanner />}
      
      <div className="mb-6 px-3 sm:px-5 w-full mx-auto">
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchSubmit={handleSearchSubmit}
          productNames={productNames.length > 0 ? productNames : undefined}
        />
      </div>
      
      {showNavigation && (
        <CategoryNavigation 
          activeCategory={activeCategory}
          activeSection={activeSection}
          onCategoryChange={handleCategoryChangeWithNavigation}
          onSectionChange={handleSectionChange}
          categories={categories}
          sections={sections}
          storeDomain={storeDomain}
        />
      )}
      
      {isShowingSearchResults ? (
        <SearchResults
          searchQuery={searchQuery}
          displayProducts={displayProducts}
          activeCategory={activeCategory}
          onClearSearch={handleClearSearch}
        />
      ) : (
        <>
          <SectionContainer 
            sectionProducts={sectionProducts} 
            storeDomain={storeDomain} 
          />
          
          {(Object.keys(sectionProducts).length === 0 || sections.length === 0) && (
            <AllProductsSection 
              products={displayProducts}
              activeCategory={activeCategory}
              storeDomain={storeDomain}
            />
          )}
        </>
      )}
    </>
  );
};

export default StoreContent;

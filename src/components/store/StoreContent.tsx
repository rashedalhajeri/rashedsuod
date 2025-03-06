
import React from "react";
import { useStoreFilter } from "@/context/StoreFilterContext";
import { filterProductsBySearch, filterProductsByCategory } from "@/utils/product-filters";
import StoreBanner from "@/components/store/StoreBanner";
import CategoryNavigation from "@/components/store/CategoryNavigation";
import AllProductsSection from "@/components/store/sections/AllProductsSection";
import SearchBar from "@/components/store/navbar/SearchBar";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

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
  
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const [productNames, setProductNames] = useState<string[]>([]);
  
  useEffect(() => {
    // Fetch product names for the search animation
    const fetchProductNames = async () => {
      if (!storeDomain) return;
      
      try {
        const { data } = await supabase
          .from('products')
          .select('name')
          .limit(10);
          
        if (data && data.length > 0) {
          setProductNames(data.map(product => product.name));
        }
      } catch (error) {
        console.error("Error fetching product names:", error);
      }
    };
    
    fetchProductNames();
  }, [storeDomain]);

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No need to navigate, we'll just filter the products inline
  };

  // Filter products by search
  const filteredBySearch = filterProductsBySearch(products, searchQuery);

  // Filter products by category and section
  const displayProducts = filterProductsByCategory(
    filteredBySearch,
    activeCategory,
    activeSection,
    bestSellingProducts,
    searchQuery
  );

  // Only show navigation if there are categories or sections
  const showNavigation = categories.length > 0 || sections.length > 0;

  return (
    <>
      {/* Store banner with search functionality */}
      <StoreBanner 
        storeName={storeData?.store_name}
        storeDescription={storeData?.description}
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        logoUrl={storeData?.logo_url}
        bannerUrl={storeData?.banner_url}
      />
      
      {/* Only show navigation if there are categories or sections */}
      {showNavigation && (
        <CategoryNavigation 
          activeCategory={activeCategory}
          activeSection={activeSection}
          onCategoryChange={handleCategoryChange}
          onSectionChange={handleSectionChange}
          categories={categories}
          sections={sections}
        />
      )}
      
      {/* Search Bar - Now positioned right after the categories */}
      <div className="mt-4 mb-6 px-3 sm:px-5 w-full max-w-3xl mx-auto">
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchSubmit={handleSearchSubmit}
          productNames={productNames.length > 0 ? productNames : undefined}
        />
      </div>
      
      {/* Products section */}
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

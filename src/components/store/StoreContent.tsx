
import React from "react";
import { useStoreFilter } from "@/context/StoreFilterContext";
import { filterProductsBySearch, filterProductsByCategory } from "@/utils/product-filters";
import StoreBanner from "@/components/store/StoreBanner";
import CategoryNavigation from "@/components/store/CategoryNavigation";
import AllProductsSection from "@/components/store/sections/AllProductsSection";
import SearchBar from "@/components/store/navbar/SearchBar";
import { useParams, useNavigate } from "react-router-dom";
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
  
  // Custom category change handler for navigation
  const handleCategoryChangeWithNavigation = (category: string) => {
    if (!storeDomain) return;
    
    if (category === "الكل") {
      // If "All" category is selected, stay on main page and update filter state
      handleCategoryChange(category);
    } else {
      // For other categories, navigate to category page
      const categorySlug = encodeURIComponent(category.toLowerCase());
      navigate(`/store/${storeDomain}/category/${categorySlug}`);
    }
  };

  return (
    <>
      {/* Custom promotional banner */}
      <div className="relative bg-gradient-to-l from-blue-500 to-blue-600 py-6 px-4 sm:px-5 rounded-xl shadow-md mt-4 mb-6 overflow-hidden border border-blue-100/80 w-full">
        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-blue-300/20 rounded-full -mt-10 -mr-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-blue-400/10 rounded-full -mb-8 -ml-8 blur-xl"></div>
        
        <div className="flex items-center justify-between gap-3 sm:gap-4 relative w-full">
          <div className="flex-1 flex flex-col items-end text-right">
            <h3 className="text-white font-bold text-lg sm:text-2xl mb-2 flex items-center gap-1 sm:gap-2">
              مع تطبيق KIB Paytally
            </h3>
            <p className="text-white/80 mb-3 sm:mb-4 text-sm sm:text-base max-w-md">
              تسوّق، قسّط وتتبّع حالة طلبك بسهولة
            </p>
          </div>
          
          <div className="hidden md:block w-32 h-32 bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden">
            <img src="/public/lovable-uploads/458d1c93-d142-4466-9f1a-1085922105f5.png" alt="Promo" className="w-full h-full object-cover" />
          </div>
        </div>
        
        {/* Indicator Dots */}
        <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse mt-4 sm:mt-6">
          {[...Array(5)].map((_, index) => (
            <div 
              key={index} 
              className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                index === 3 ? "bg-white w-3 sm:w-4" : "bg-white/50 hover:bg-white/60"
              }`}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Search Bar - Now positioned above categories */}
      <div className="mb-6 px-3 sm:px-5 w-full mx-auto">
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchSubmit={handleSearchSubmit}
          productNames={productNames.length > 0 ? productNames : undefined}
        />
      </div>
      
      {/* Only show navigation if there are categories or sections */}
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

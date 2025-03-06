
import React from "react";
import { motion } from "framer-motion";
import SearchBar from "@/components/store/navbar/SearchBar";
import CategoryNavigation from "@/components/store/CategoryNavigation";
import ProductGrid from "@/components/store/ProductGrid";

interface CategoryContentProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  productNames: string[];
  categories: string[];
  sections: string[];
  categoryName?: string;
  handleCategoryChange: (category: string) => void;
  handleSectionChange: (section: string) => void;
  isLoadingProducts: boolean;
  filteredProducts: any[];
  storeDomain?: string;
}

const CategoryContent: React.FC<CategoryContentProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearchSubmit,
  productNames,
  categories,
  sections,
  categoryName,
  handleCategoryChange,
  handleSectionChange,
  isLoadingProducts,
  filteredProducts,
  storeDomain
}) => {
  return (
    <motion.div 
      className="container mx-auto px-4 py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4">
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchSubmit={handleSearchSubmit}
          productNames={productNames}
        />
      </div>
      
      {categories.length > 0 && (
        <CategoryNavigation
          categories={categories}
          sections={sections}
          activeCategory={categoryName || ""}
          activeSection=""
          onCategoryChange={handleCategoryChange}
          onSectionChange={handleSectionChange}
          storeDomain={storeDomain}
        />
      )}
      
      <div className="mt-6">
        <ProductGrid 
          products={filteredProducts} 
          isLoading={isLoadingProducts} 
        />
      </div>
    </motion.div>
  );
};

export default CategoryContent;

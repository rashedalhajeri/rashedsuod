
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
      
      <CategoryNavigation
        categories={categories}
        sections={sections}
        activeCategory={categoryName || ""}
        activeSection=""
        onCategoryChange={handleCategoryChange}
        onSectionChange={handleSectionChange}
        storeDomain={storeDomain}
      />
      
      <div className="mt-6">
        {isLoadingProducts ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-medium text-gray-600 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-500">لم نتمكن من العثور على منتجات في هذه الفئة</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CategoryContent;

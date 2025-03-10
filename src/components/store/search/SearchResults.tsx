
import React from "react";
import AllProductsSection from "../sections/AllProductsSection";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SearchResultsProps {
  searchQuery: string;
  displayProducts: any[];
  activeCategory: string;
  onClearSearch: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchQuery,
  displayProducts,
  activeCategory,
  onClearSearch
}) => {
  if (!searchQuery || searchQuery.trim().length === 0) {
    return null;
  }
  
  if (displayProducts.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
          <div className="text-5xl text-gray-300 mb-4 mx-auto w-20 h-20 flex items-center justify-center">
            <XCircle className="w-20 h-20" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">لا توجد نتائج</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            لم نتمكن من العثور على أي منتجات تطابق كلمة البحث "
            <span className="text-primary font-medium">{searchQuery}</span>
            "
          </p>
          <Button
            onClick={onClearSearch}
            variant="outline"
            size="lg"
            className="bg-white hover:bg-gray-50 border-gray-200"
          >
            مسح البحث
          </Button>
        </div>
      </motion.div>
    );
  }
  
  return (
    <AllProductsSection 
      products={displayProducts}
      activeCategory={activeCategory}
      searchQuery={searchQuery}
      onClearSearch={onClearSearch}
    />
  );
};

export default SearchResults;

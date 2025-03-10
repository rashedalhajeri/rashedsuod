
import React from "react";
import AllProductsSection from "../sections/AllProductsSection";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <div className="container mx-auto px-4 py-10">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-5xl text-gray-300 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
            <XCircle className="w-16 h-16" />
          </div>
          <h2 className="text-xl font-medium text-gray-800 mb-2">لا توجد نتائج</h2>
          <p className="text-gray-600 mb-6">
            لم نتمكن من العثور على أي منتجات تطابق كلمة البحث "
            <span className="text-primary-600 font-medium">{searchQuery}</span>
            "
          </p>
          <Button
            onClick={onClearSearch}
            variant="outline"
            className="bg-white hover:bg-gray-50"
          >
            مسح البحث
          </Button>
        </div>
      </div>
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


import React from "react";
import AllProductsSection from "../sections/AllProductsSection";

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

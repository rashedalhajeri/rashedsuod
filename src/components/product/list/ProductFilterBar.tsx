
import React from "react";
import CategoryFilter from "./CategoryFilter";
import SearchInput from "./SearchInput";
import StatusFilters from "./StatusFilters";
import MoreOptions from "./MoreOptions";

interface ProductFilterBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
  filterActive: string;
  setFilterActive: (status: string) => void;
  handleSelectAll: () => void;
  selectedItemsCount: number;
  filteredProductsCount: number;
  filterCounts: {
    active: number;
    inactive: number;
    archived: number;
  };
}

const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  searchTerm,
  onSearch,
  categoryFilter,
  setCategoryFilter,
  filterActive,
  setFilterActive,
  handleSelectAll,
  selectedItemsCount,
  filteredProductsCount,
  filterCounts,
}) => {
  return (
    <div className="p-3 border-b border-gray-100 flex flex-wrap gap-3 items-center bg-gradient-to-r from-gray-50 to-white">
      {/* Category Filter */}
      <CategoryFilter 
        categoryFilter={categoryFilter} 
        setCategoryFilter={setCategoryFilter} 
      />

      {/* Search Input */}
      <SearchInput 
        searchTerm={searchTerm} 
        onSearch={onSearch} 
      />

      {/* Status Filter Buttons */}
      <StatusFilters 
        filterActive={filterActive} 
        setFilterActive={setFilterActive} 
        filterCounts={filterCounts} 
      />

      {/* More Options Button */}
      <MoreOptions 
        handleSelectAll={handleSelectAll}
        setFilterActive={setFilterActive}
        setCategoryFilter={setCategoryFilter}
        selectedItemsCount={selectedItemsCount}
        filteredProductsCount={filteredProductsCount}
      />
    </div>
  );
};

export default ProductFilterBar;

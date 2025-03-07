
import React, { useState } from "react";
import { Product } from "@/utils/products/types";
import ProductsList from "./ProductsList";
import { Pagination } from "@/components/ui/pagination";

interface ProductsContentProps {
  products: Product[];
  selectedItems: string[];
  searchTerm: string;
  onEdit: (id: string) => void;
  onSelectionChange: (items: string[]) => void;
  onSearch: (term: string) => void;
  onArchive?: (id: string, isArchived: boolean) => void;
  onActivate?: (id: string, isActive: boolean) => void;
  onRefresh?: () => void;
}

const ProductsContent: React.FC<ProductsContentProps> = ({
  products,
  selectedItems,
  searchTerm,
  onEdit,
  onSelectionChange,
  onSearch,
  onArchive,
  onActivate,
  onRefresh
}) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Display 10 products per page
  
  // Calculate pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Reset selected items when changing page
    onSelectionChange([]);
  };
  
  return (
    <div className="bg-gray-50 rounded-lg p-2">
      <ProductsList 
        products={paginatedProducts}
        onEdit={onEdit}
        onSelectionChange={onSelectionChange}
        searchTerm={searchTerm}
        onSearch={onSearch}
        onArchive={onArchive}
        onActivate={onActivate}
        onRefresh={onRefresh}
      />
      
      {/* Pagination control */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 pb-2">
          <Pagination 
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ProductsContent;

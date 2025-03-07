
import React from "react";
import { Pagination } from "@/components/ui/pagination";

interface ProductsPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const ProductsPagination: React.FC<ProductsPaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange
}) => {
  return (
    <div className="flex justify-center mt-4 pb-2">
      <Pagination 
        pageCount={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ProductsPagination;

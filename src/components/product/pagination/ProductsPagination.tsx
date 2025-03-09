
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-media-query";

interface ProductsPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const ProductsPagination: React.FC<ProductsPaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const isMobile = useIsMobile();
  
  // تحديد عدد الصفحات التي سيتم عرضها
  const getPageNumbers = () => {
    const maxVisiblePages = isMobile ? 3 : 5;
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // إذا كان عدد الصفحات المعروضة أقل من الحد الأقصى، قم بتعديل نقطة البداية
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div className="flex justify-center items-center gap-1" dir="ltr">
      {/* زر الانتقال للصفحة الأولى */}
      {!isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      )}
      
      {/* زر الصفحة السابقة */}
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {/* أرقام الصفحات */}
      {pageNumbers.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          className={`h-8 w-8 ${
            currentPage === page ? "bg-primary-500 text-white" : "text-gray-700"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
      
      {/* زر الصفحة التالية */}
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      {/* زر الانتقال للصفحة الأخيرة */}
      {!isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ProductsPagination;

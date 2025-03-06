
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  totalItems,
  pageSize = 10
}) => {
  // حساب نطاق العناصر المعروضة حالياً
  const startItem = page * pageSize + 1;
  const endItem = Math.min((page + 1) * pageSize, totalItems || (totalPages * pageSize));
  
  // إنشاء مصفوفة لعرض أرقام الصفحات
  const getPageNumbers = () => {
    const maxPageButtons = 5;
    let startPage = Math.max(0, page - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPageButtons - 1);
    
    // إعادة ضبط startPage إذا كنا قريبين من النهاية
    if (endPage - startPage < maxPageButtons - 1) {
      startPage = Math.max(0, endPage - maxPageButtons + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };
  
  return (
    <div className="flex justify-between items-center" dir="rtl">
      {totalItems && (
        <div className="text-sm text-gray-500">
          عرض <span className="font-medium">{startItem}</span> إلى <span className="font-medium">{endItem}</span> من <span className="font-medium">{totalItems}</span> عنصر
        </div>
      )}
      
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(0)}
          disabled={page === 0}
        >
          <ChevronRight className="h-4 w-4" />
          <ChevronRight className="h-4 w-4 -mr-2" />
          <span className="sr-only">الصفحة الأولى</span>
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">الصفحة السابقة</span>
        </Button>
        
        <div className="flex items-center gap-1 mx-1">
          {getPageNumbers().map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === page ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum + 1}
            </Button>
          ))}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">الصفحة التالية</span>
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(totalPages - 1)}
          disabled={page >= totalPages - 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <ChevronLeft className="h-4 w-4 -ml-2" />
          <span className="sr-only">الصفحة الأخيرة</span>
        </Button>
      </div>
    </div>
  );
};

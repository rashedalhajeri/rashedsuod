
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const handlePrevious = () => {
    if (page > 0) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages - 1) {
      onPageChange(page + 1);
    }
  };

  // حساب نطاق العناصر المعروضة
  const calculateRange = () => {
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, totalItems || 0);
    return `${start}-${end} من ${totalItems}`;
  };

  // توليد أرقام الصفحات بشكل ذكي
  const generatePageNumbers = () => {
    const MAX_DISPLAYED_PAGES = 5;

    // عدد الصفحات قليل، عرض جميع الأرقام
    if (totalPages <= MAX_DISPLAYED_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    // عرض نطاق حول الصفحة الحالية
    const pages = [];
    let startPage = Math.max(0, page - Math.floor(MAX_DISPLAYED_PAGES / 2));
    const endPage = Math.min(startPage + MAX_DISPLAYED_PAGES - 1, totalPages - 1);

    // ضبط نطاق البداية إذا كنا قريبين من النهاية
    startPage = Math.max(0, endPage - MAX_DISPLAYED_PAGES + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between" dir="rtl">
      {totalItems && (
        <div className="text-sm text-gray-500">
          {calculateRange()}
        </div>
      )}
      
      <div className="flex items-center space-x-1 space-x-reverse">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          disabled={page === 0}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">الصفحة السابقة</span>
        </Button>

        {generatePageNumbers().map((pageNumber) => (
          <Button
            key={pageNumber}
            variant={pageNumber === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(pageNumber)}
            className="h-8 w-8 px-0"
          >
            {pageNumber + 1}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={page >= totalPages - 1}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">الصفحة التالية</span>
        </Button>
      </div>
    </div>
  );
};


import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export function Pagination({
  pageCount,
  currentPage,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  const generatePagesArray = (count: number, current: number, siblings: number) => {
    // Always show first and last pages
    // Show current page and siblings on both sides
    const pages: (number | '...')[] = [];
    
    // Calculate start and end of sibling range
    const siblingStart = Math.max(current - siblings, 1);
    const siblingEnd = Math.min(current + siblings, count);
    
    // Add dots if there's a gap
    const shouldShowLeftDots = siblingStart > 2;
    const shouldShowRightDots = siblingEnd < count - 1;
    
    // Always add page 1
    pages.push(1);
    
    // Add dots or pages after page 1
    if (shouldShowLeftDots) {
      pages.push('...');
    } else if (siblingStart > 1) {
      for (let i = 2; i < siblingStart; i++) {
        pages.push(i);
      }
    }
    
    // Add sibling pages and current page
    for (let i = siblingStart; i <= siblingEnd; i++) {
      if (i !== 1 && i !== count) { // Avoid duplication of first and last pages
        pages.push(i);
      }
    }
    
    // Add dots or pages before last page
    if (shouldShowRightDots) {
      pages.push('...');
    } else if (siblingEnd < count) {
      for (let i = siblingEnd + 1; i < count; i++) {
        pages.push(i);
      }
    }
    
    // Always add last page if not already added
    if (count !== 1) {
      pages.push(count);
    }
    
    return pages;
  };

  const pages = generatePagesArray(pageCount, currentPage, siblingCount);

  if (pageCount <= 1) return null;

  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      <Button
        variant="outline"
        size="icon"
        className="hidden h-8 w-8 sm:flex"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        <ChevronRight className="h-4 w-4" />
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center space-x-1 rtl:space-x-reverse">
        {pages.map((page, i) => (
          page === '...' ? (
            <span key={`ellipsis-${i}`} className="text-sm px-3">...</span>
          ) : (
            <Button
              key={`page-${page}`}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              className={cn(
                "h-8 w-8",
                currentPage === page ? "bg-primary text-primary-foreground" : ""
              )}
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </Button>
          )
        ))}
      </div>
      
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(Math.min(pageCount, currentPage + 1))}
        disabled={currentPage === pageCount}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="hidden h-8 w-8 sm:flex"
        onClick={() => onPageChange(pageCount)}
        disabled={currentPage === pageCount}
      >
        <ChevronLeft className="h-4 w-4" />
        <ChevronLeft className="h-4 w-4" />
      </Button>
    </div>
  );
}


import React from "react";
import { Package, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductEmptyStateProps {
  isSearchActive: boolean;
  searchQuery?: string;
  filterName?: string;
  onAddProduct: () => void;
  onResetSearch: () => void;
}

export const ProductEmptyState: React.FC<ProductEmptyStateProps> = ({
  isSearchActive,
  searchQuery,
  filterName,
  onAddProduct,
  onResetSearch
}) => {
  if (isSearchActive) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-800 mb-2">لم يتم العثور على منتجات</h3>
        <p className="text-gray-600 mb-4">
          {searchQuery && `لم نتمكن من العثور على أي منتجات تطابق "${searchQuery}"`}
          {filterName && !searchQuery && `لم نتمكن من العثور على منتجات في تصنيف "${filterName}"`}
          {filterName && searchQuery && ` في تصنيف "${filterName}"`}
        </p>
        <Button 
          variant="outline"
          onClick={onResetSearch}
        >
          عرض جميع المنتجات
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-800 mb-2">لا توجد منتجات</h3>
      <p className="text-gray-600 mb-4">لم تقم بإضافة أي منتجات بعد. أضف منتجك الأول الآن!</p>
      <Button 
        onClick={onAddProduct}
        className="bg-primary-600 hover:bg-primary-700"
      >
        <Plus className="h-4 w-4 ml-2" />
        إضافة منتج جديد
      </Button>
    </div>
  );
};

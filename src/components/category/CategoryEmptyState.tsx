
import React from "react";
import { Layers, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryEmptyStateProps {
  isSearchActive: boolean;
  searchQuery?: string;
  onAddCategory: () => void;
  onResetSearch: () => void;
}

export const CategoryEmptyState: React.FC<CategoryEmptyStateProps> = ({
  isSearchActive,
  searchQuery,
  onAddCategory,
  onResetSearch
}) => {
  if (isSearchActive) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-800 mb-2">لم يتم العثور على أقسام</h3>
        <p className="text-gray-600 mb-4">
          {searchQuery && `لم نتمكن من العثور على أي أقسام تطابق "${searchQuery}"`}
        </p>
        <Button 
          variant="outline"
          onClick={onResetSearch}
        >
          عرض جميع الأقسام
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <Layers className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-800 mb-2">لا توجد أقسام</h3>
      <p className="text-gray-600 mb-4">لم تقم بإضافة أي أقسام بعد. أضف قسمك الأول الآن!</p>
      <Button 
        onClick={onAddCategory}
        className="bg-primary-600 hover:bg-primary-700"
      >
        <Plus className="h-4 w-4 ml-2" />
        إضافة قسم جديد
      </Button>
    </div>
  );
};

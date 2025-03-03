
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export interface CategoryEmptyStateProps {
  onCreateCategory: () => void;
}

const CategoryEmptyState: React.FC<CategoryEmptyStateProps> = ({ onCreateCategory }) => {
  return (
    <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
      <div className="mx-auto w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
        <PlusCircle className="text-primary-500 w-8 h-8" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أقسام</h3>
      <p className="text-gray-500 mb-6">قم بإنشاء أقسام لتنظيم منتجاتك وتسهيل عملية التصفح للعملاء</p>
      <Button 
        onClick={onCreateCategory}
        className="bg-primary-600 hover:bg-primary-700"
      >
        إنشاء قسم جديد
      </Button>
    </div>
  );
};

export default CategoryEmptyState;

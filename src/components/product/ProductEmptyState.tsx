
import React from "react";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductEmptyStateProps {
  onAddProduct: () => void;
}

export const ProductEmptyState: React.FC<ProductEmptyStateProps> = ({ onAddProduct }) => {
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

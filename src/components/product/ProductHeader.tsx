
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProductHeaderProps {
  onAddProduct: () => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ onAddProduct }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
      <Button 
        className="gap-2 rounded-full shadow-sm"
        onClick={onAddProduct}
      >
        <Plus className="h-4 w-4" />
        <span>إضافة منتج</span>
      </Button>
    </div>
  );
};

export default ProductHeader;

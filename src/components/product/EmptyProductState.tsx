
import React from "react";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyProductStateProps {
  onAddProduct: () => void;
}

const EmptyProductState: React.FC<EmptyProductStateProps> = ({ onAddProduct }) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
      <div className="bg-gray-50 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
        <Package className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="mt-2 text-xl font-medium">لا توجد منتجات بعد</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
        ابدأ بإضافة منتجات جديدة لعرضها في متجرك. يمكنك إضافة صور وأسعار وتفاصيل لكل منتج.
      </p>
      <Button 
        className="mt-6 gap-2 px-6 rounded-full shadow-sm"
        onClick={onAddProduct}
      >
        <Plus className="h-4 w-4" />
        <span>إضافة أول منتج</span>
      </Button>
    </div>
  );
};

export default EmptyProductState;

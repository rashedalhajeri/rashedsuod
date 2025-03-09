
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Product } from "@/utils/products/types";
import ProductDrawerActions from "./drawer/ProductDrawerActions";

interface ProductActionDrawerProps {
  product: Product;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (id: string) => void;
  onDelete?: (id: string) => Promise<void>;
  onActivate?: (id: string, isActive: boolean) => Promise<void>;
}

const ProductActionDrawer: React.FC<ProductActionDrawerProps> = ({
  product,
  isOpen,
  onOpenChange,
  onEdit,
  onDelete,
  onActivate,
}) => {
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsActionLoading(true);
    try {
      await onDelete(product.id);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleActivateToggle = async () => {
    if (!onActivate) return;
    setIsActionLoading(true);
    try {
      await onActivate(product.id, !product.is_active);
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[300px] p-0 overflow-hidden" dir="rtl">
        {/* اسم المنتج */}
        <div className="p-3 text-center border-b border-gray-100 bg-gray-50">
          <h3 className="text-base font-medium">{product.name}</h3>
        </div>
        
        <div className="p-4">
          <ProductDrawerActions 
            productId={product.id}
            isActive={product.is_active}
            isActionLoading={isActionLoading}
            onEdit={onEdit}
            onDelete={handleDelete}
            onActivate={handleActivateToggle}
          />
        </div>

        <DialogFooter className="px-4 pb-4 pt-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            إغلاق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductActionDrawer;

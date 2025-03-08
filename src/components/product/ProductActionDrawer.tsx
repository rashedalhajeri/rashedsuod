
import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Product } from "@/utils/products/types";

import ProductDrawerHeader from "./drawer/ProductDrawerHeader";
import ProductDrawerImage from "./drawer/ProductDrawerImage";
import ProductDrawerDetails from "./drawer/ProductDrawerDetails";
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

  const imageUrl = product.images && product.images.length > 0
    ? product.images[0]
    : "/placeholder.svg";

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction="left">
      <DrawerContent className="h-full max-h-[95vh]" dir="rtl">
        <div className="mx-auto w-full max-w-sm">
          <ProductDrawerHeader product={product} />

          <div className="p-4 pb-0">
            <ProductDrawerImage imageUrl={imageUrl} productName={product.name} />
            
            <ProductDrawerDetails product={product} />

            <ProductDrawerActions 
              productId={product.id}
              isActive={product.is_active}
              isActionLoading={isActionLoading}
              onEdit={onEdit}
              onDelete={handleDelete}
              onActivate={handleActivateToggle}
            />
          </div>

          <DrawerFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              إغلاق
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ProductActionDrawer;


import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Product } from "@/utils/products/types";
import { Loader2, Edit, Trash, Power, PowerOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/currency";

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
          <DrawerHeader>
            <DrawerTitle className="text-lg font-semibold flex items-center justify-between">
              <span>تفاصيل المنتج</span>
              {product.is_active ? (
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                  نشط
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                  غير نشط
                </Badge>
              )}
            </DrawerTitle>
            <DrawerDescription>إدارة المنتج أو عرض التفاصيل</DrawerDescription>
          </DrawerHeader>

          <div className="p-4 pb-0">
            <div className="aspect-square w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center mb-4">
              <img
                src={imageUrl}
                alt={product.name}
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>

            <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
            
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-bold text-green-600">
                {formatCurrency(product.discount_price || product.price)}
              </span>
              {product.discount_price && (
                <span className="text-sm line-through text-gray-400">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {product.description}
              </p>
            )}

            <div className="space-y-2 text-sm">
              {product.category && (
                <div className="flex justify-between">
                  <span className="text-gray-500">الفئة:</span>
                  <span>{product.category.name}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-500">المخزون:</span>
                <span>
                  {product.track_inventory
                    ? `${product.stock_quantity || 0} قطعة`
                    : "غير محدود"}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">تاريخ الإضافة:</span>
                <span>
                  {new Date(product.created_at).toLocaleDateString("ar-EG")}
                </span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <Button
                onClick={() => onEdit(product.id)}
                className="w-full"
                variant="outline"
              >
                <Edit className="h-4 w-4 ml-2" />
                تعديل المنتج
              </Button>
              
              {onActivate && (
                <Button
                  onClick={handleActivateToggle}
                  className="w-full"
                  variant="outline"
                  disabled={isActionLoading}
                >
                  {isActionLoading ? (
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  ) : product.is_active ? (
                    <PowerOff className="h-4 w-4 ml-2" />
                  ) : (
                    <Power className="h-4 w-4 ml-2" />
                  )}
                  {product.is_active ? "تعطيل المنتج" : "تفعيل المنتج"}
                </Button>
              )}
              
              {onDelete && (
                <Button
                  onClick={handleDelete}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200"
                  variant="outline"
                  disabled={isActionLoading}
                >
                  {isActionLoading ? (
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4 ml-2" />
                  )}
                  حذف المنتج
                </Button>
              )}
            </div>
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

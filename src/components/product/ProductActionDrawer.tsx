
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Product } from "@/utils/products/types";
import ProductDrawerActions from "./drawer/ProductDrawerActions";
import { useIsMobile } from "@/hooks/use-media-query";
import { CalendarIcon, ClockIcon } from "lucide-react";

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
  const isMobile = useIsMobile();

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsActionLoading(true);
    try {
      await onDelete(product.id);
      onOpenChange(false);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleActivateToggle = async () => {
    if (!onActivate) return;
    setIsActionLoading(true);
    try {
      await onActivate(product.id, !product.is_active);
      onOpenChange(false);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleEdit = () => {
    onEdit(product.id);
    onOpenChange(false); // Close the drawer when editing
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ar-EG");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[320px] p-0 overflow-hidden rounded-lg ${isMobile ? "w-[90vw]" : ""}`} dir="rtl">
        {/* رأس الدرج مع معلومات المنتج */}
        <div className="border-b border-gray-100">
          <div className="flex p-4 items-center">
            {product.image_url ? (
              <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-100 ml-3 bg-white">
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-md ml-3 flex items-center justify-center">
                <span className="text-xs text-gray-500">لا توجد صورة</span>
              </div>
            )}
            <div>
              <h3 className="text-base font-medium text-gray-800 mb-1">{product.name}</h3>
              <div className="text-xs text-gray-500">
                {product.category?.name || "بدون فئة"}
              </div>
            </div>
          </div>
        </div>
        
        {/* معلومات إضافية عن المنتج */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">السعر</div>
              <div className="font-medium">
                {product.discount_price ? (
                  <div className="flex items-center gap-1">
                    <span className="text-green-600">{product.discount_price}</span>
                    <span className="text-xs text-gray-500 line-through">
                      {product.price}
                    </span>
                  </div>
                ) : (
                  <span>{product.price} د.ك</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">الحالة</div>
              <div className="font-medium">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    product.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {product.is_active ? "نشط" : "غير نشط"}
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                <span>تاريخ الإضافة</span>
              </div>
              <div className="text-sm">{formatDate(product.created_at)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <ClockIcon className="h-3 w-3" />
                <span>وقت الإضافة</span>
              </div>
              <div className="text-sm">{formatTime(product.created_at)}</div>
            </div>
          </div>
        </div>
        
        {/* أزرار الإجراءات */}
        <div className="p-4">
          <ProductDrawerActions 
            productId={product.id}
            isActive={product.is_active}
            isActionLoading={isActionLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onActivate={handleActivateToggle}
          />
        </div>

        <DialogFooter className="px-4 pb-4 pt-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full text-gray-600 hover:bg-gray-50"
          >
            إغلاق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductActionDrawer;

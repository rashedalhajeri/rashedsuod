
import React from "react";
import { Product } from "@/utils/products/types";
import { 
  Sheet, 
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ProductPrice } from "./item/ProductPrice";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Pencil, Power, Trash, BadgePercent } from "lucide-react";
import { handleImageError } from "@/utils/products/image-helpers";

interface ProductActionDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (id: string) => void;
  onActivate?: (id: string, isActive: boolean) => void;
  onDelete?: (id: string) => void;
}

const ProductActionDrawer: React.FC<ProductActionDrawerProps> = ({
  product,
  isOpen,
  onOpenChange,
  onEdit,
  onActivate,
  onDelete
}) => {
  if (!product) return null;

  const {
    id,
    name,
    price,
    discount_price,
    description,
    images,
    is_active = true,
  } = product;

  const imageUrl = images && images.length > 0
    ? images[0]
    : "/placeholder.svg";

  // Calculate discount percentage if applicable
  const discountPercentage = discount_price && discount_price < price 
    ? Math.round((1 - (discount_price / price)) * 100) 
    : null;

  // Handlers with proper checks to prevent errors
  const handleEdit = () => {
    if (id && onEdit) {
      onEdit(id);
      onOpenChange(false);
    }
  };
  
  const handleActivate = () => {
    if (id && onActivate) {
      onActivate(id, !is_active);
      onOpenChange(false);
    }
  };
  
  const handleDelete = () => {
    if (id && onDelete) {
      onDelete(id);
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[95%] sm:w-[450px] overflow-y-auto" dir="rtl">
        <SheetHeader className="mb-6 text-right">
          <SheetTitle className="text-xl font-bold">{name}</SheetTitle>
          <SheetDescription>
            {description ? description.substring(0, 100) + (description.length > 100 ? '...' : '') : 'لا يوجد وصف'}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          {/* Product Image */}
          <div className="w-full h-60 rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
            <img 
              src={imageUrl} 
              alt={name} 
              className="h-full w-full object-contain"
              onError={handleImageError}
            />
          </div>

          {/* Product Price */}
          <div className="flex items-center gap-2">
            <ProductPrice price={price} discountPrice={discount_price} size="lg" />
            
            {/* Discount Badge - Only show if there's a discount */}
            {discountPercentage && discountPercentage > 0 && (
              <Badge className="bg-red-500 text-white border-0 h-6 px-2 flex items-center">
                <BadgePercent className="h-3 w-3 mr-0.5" />
                <span className="force-en-nums">{discountPercentage}%</span>
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <Button
              onClick={handleEdit}
              className="flex flex-col items-center gap-2 h-auto py-3"
              variant="outline"
            >
              <Pencil className="h-5 w-5 text-blue-600" />
              <span>تعديل</span>
            </Button>
            
            <Button
              onClick={handleActivate}
              className={`flex flex-col items-center gap-2 h-auto py-3 ${
                is_active 
                  ? "text-green-600 border-green-200 hover:bg-green-50" 
                  : "text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
              variant="outline"
            >
              <Power className={`h-5 w-5 ${is_active ? "text-green-600" : "text-gray-500"}`} />
              <span>{is_active ? "غير نشط" : "نشط"}</span>
            </Button>
            
            <Button
              onClick={handleDelete}
              className="flex flex-col items-center gap-2 h-auto py-3 text-red-600 border-red-200 hover:bg-red-50"
              variant="outline"
            >
              <Trash className="h-5 w-5" />
              <span>حذف</span>
            </Button>
          </div>
        </div>

        <SheetFooter className="mt-8 flex justify-center">
          <SheetClose asChild>
            <Button 
              className="w-full" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              إغلاق
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ProductActionDrawer;

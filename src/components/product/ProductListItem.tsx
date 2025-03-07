import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/utils/products/types";
import { useIsMobile } from "@/hooks/use-media-query";
import { motion } from "framer-motion";
import { ProductImage } from "./item/ProductImage";
import { ProductBadges } from "./item/ProductBadges";
import { ProductPrice } from "./item/ProductPrice";
import { ProductActions } from "./item/ProductActions";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Archive, EyeOff, ToggleLeft } from "lucide-react";

interface ProductListItemProps {
  product: Product;
  onSelect: (id: string, isSelected: boolean) => void;
  isSelected: boolean;
  onEdit: (id: string) => void;
  onArchive?: (id: string, isArchived: boolean) => void;
  onActivate?: (id: string, isActive: boolean) => void;
  onRefresh?: () => void;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ 
  product, 
  onSelect, 
  isSelected, 
  onEdit,
  onArchive,
  onActivate,
  onRefresh
}) => {
  const {
    id,
    name,
    price,
    discount_price,
    images,
    is_archived,
    is_active = true,
    track_inventory,
    stock_quantity,
    sales_count = 0,
    created_at,
    category
  } = product;

  const isMobile = useIsMobile();
  
  const imageUrl = images && images.length > 0
    ? images[0]
    : "/placeholder.svg";

  const hasLowStock = track_inventory && stock_quantity !== null && stock_quantity <= 5;

  return (
    <motion.div 
      className={`product-list-item border rounded-md shadow-sm ${isSelected ? 'bg-blue-50/60 border-blue-200' : 'bg-white border-gray-100'} 
        ${is_archived ? 'opacity-75' : ''} 
        ${!is_active ? 'bg-gray-50/70' : ''} transition-all duration-200 hover:shadow-md`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-start sm:items-center p-3 sm:p-4">
        <div className="flex items-start sm:items-center gap-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={checked => onSelect(id, !!checked)}
            className="mt-1 sm:mt-0 h-4 w-4 flex-shrink-0"
          />
          
          <ProductImage 
            imageUrl={imageUrl} 
            name={name} 
            size={isMobile ? "sm" : "md"} 
            className=""
          />
        </div>
        
        <div className="flex-1 min-w-0 mr-2 sm:mr-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                <h3 className="text-sm font-medium text-gray-900 leading-tight line-clamp-1">{name}</h3>
                {is_archived && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 flex gap-1 h-5 px-1.5 items-center">
                    <Archive className="h-3 w-3" />
                    <span className="text-[10px]">مؤرشف</span>
                  </Badge>
                )}
                {!is_active && !is_archived && (
                  <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 flex gap-1 h-5 px-1.5 items-center">
                    <ToggleLeft className="h-3 w-3" />
                    <span className="text-[10px]">غير نشط</span>
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center flex-wrap gap-1 mb-1.5">
                <ProductBadges product={product} />
                
                {category?.name && (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 h-5 px-1.5">
                    <span className="text-[10px]">{category.name}</span>
                  </Badge>
                )}
                
                {hasLowStock && (
                  <Badge variant="destructive" className="bg-red-50 text-red-600 border-red-200 h-5 px-1.5">
                    <span className="text-[10px]">المخزون منخفض ({stock_quantity})</span>
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <ProductPrice price={price} discountPrice={discount_price} size={isMobile ? "sm" : "md"} />
                
                <div className="hidden sm:flex text-xs text-gray-500 gap-3">
                  <span className="flex items-center gap-1">
                    <span className="text-gray-400">المبيعات:</span> {sales_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-gray-400">تاريخ الإضافة:</span> {formatDate(created_at)}
                  </span>
                </div>
              </div>
            </div>
            
            <ProductActions 
              id={id}
              isArchived={is_archived}
              isActive={is_active}
              onEdit={onEdit}
              onArchive={onArchive}
              onActivate={onActivate}
              isMobile={true}
            />
          </div>
        </div>
        
        <ProductActions 
          id={id}
          isArchived={is_archived}
          isActive={is_active}
          onEdit={onEdit}
          onArchive={onArchive}
          onActivate={onActivate}
          isMobile={false}
        />
      </div>
    </motion.div>
  );
};

export default ProductListItem;

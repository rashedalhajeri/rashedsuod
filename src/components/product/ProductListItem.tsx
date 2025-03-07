
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/utils/products/types";
import { useIsMobile } from "@/hooks/use-media-query";
import { motion } from "framer-motion";
import { ProductImage } from "./item/ProductImage";
import { ProductPrice } from "./item/ProductPrice";
import { ProductActions } from "./item/ProductActions";
import { Badge } from "@/components/ui/badge";

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
  } = product;

  const isMobile = useIsMobile();
  
  const imageUrl = images && images.length > 0
    ? images[0]
    : "/placeholder.svg";

  // Calculate discount percentage if applicable
  const discountPercentage = discount_price && discount_price < price 
    ? Math.round((1 - (discount_price / price)) * 100) 
    : null;

  return (
    <motion.div 
      className={`product-list-item border rounded-md shadow-sm ${isSelected ? 'bg-blue-50/60 border-blue-200' : 'bg-white border-gray-100'} 
        ${is_archived ? 'opacity-75' : ''} 
        ${!is_active ? 'bg-gray-50/70' : ''} transition-all duration-200 hover:shadow-md`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-start sm:items-center p-3 sm:p-4" dir="rtl">
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
              {/* Product Name */}
              <h3 className="text-sm font-medium text-gray-900 leading-tight line-clamp-1 mb-2">{name}</h3>
              
              {/* Product Price */}
              <div className="flex items-center">
                <ProductPrice price={price} discountPrice={discount_price} size={isMobile ? "sm" : "md"} />
                
                {/* Discount Badge - Only show if there's a discount */}
                {discountPercentage && discountPercentage > 0 && (
                  <Badge className="mr-2 bg-red-500 text-white border-0">
                    {discountPercentage}% خصم
                  </Badge>
                )}
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

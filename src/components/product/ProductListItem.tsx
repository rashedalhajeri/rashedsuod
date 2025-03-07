
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/utils/products/types";
import { useIsMobile } from "@/hooks/use-media-query";
import { motion } from "framer-motion";
import { ProductImage } from "./item/ProductImage";
import { ProductBadges } from "./item/ProductBadges";
import { ProductPrice } from "./item/ProductPrice";
import { ProductActions } from "./item/ProductActions";

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
    is_active = true // Default to true if not provided
  } = product;

  const isMobile = useIsMobile();
  
  const imageUrl = images && images.length > 0
    ? images[0]
    : "/placeholder.svg";

  return (
    <motion.div 
      className={`product-list-item border ${isSelected ? 'bg-blue-50/60 border-blue-200' : 'bg-white border-gray-100'} 
        ${is_archived ? 'opacity-75' : ''} 
        ${!is_active ? 'bg-gray-50/70' : ''} transition-all duration-200`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-start sm:items-center p-4">
        {/* Checkbox and image container */}
        <div className="flex items-start sm:items-center gap-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={checked => onSelect(id, !!checked)}
            className="mt-1 sm:mt-0 h-4 w-4 flex-shrink-0"
          />
          
          <ProductImage imageUrl={imageUrl} name={name} />
        </div>
        
        {/* Product information */}
        <div className="flex-1 min-w-0 mr-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 leading-tight mb-1 line-clamp-1">{name}</h3>
              
              <ProductBadges product={product} />
              
              <ProductPrice price={price} discountPrice={discount_price} />
            </div>
            
            {/* Mobile action buttons */}
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
        
        {/* Desktop action buttons */}
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

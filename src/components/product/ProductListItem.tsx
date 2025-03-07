
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/utils/products/types";
import { useIsMobile } from "@/hooks/use-media-query";
import { motion } from "framer-motion";
import { ProductPrice } from "./item/ProductPrice";
import { Badge } from "@/components/ui/badge";
import { BadgePercent } from "lucide-react";
import { handleImageError } from "@/utils/products/image-helpers";

interface ProductListItemProps {
  product: Product;
  onSelect: (id: string, isSelected: boolean) => void;
  isSelected: boolean;
  onEdit: (id: string) => void;
  onArchive?: (id: string, isArchived: boolean) => void;
  onActivate?: (id: string, isActive: boolean) => void;
  onRefresh?: () => void;
  onClick?: () => void;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ 
  product, 
  onSelect, 
  isSelected,
  onClick
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
      className={`border rounded-lg shadow-sm ${isSelected ? 'bg-blue-50/60 border-blue-200' : 'bg-white border-gray-100'} 
        ${is_archived ? 'opacity-75' : ''} 
        ${!is_active ? 'bg-gray-50/70' : ''} 
        cursor-pointer hover:bg-gray-50 transition-colors`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
    >
      <div className="flex items-center p-3 py-3" dir="rtl">
        {/* Checkbox */}
        <Checkbox
          checked={isSelected}
          onCheckedChange={checked => {
            onSelect(id, !!checked);
            // Stop propagation to prevent drawer from opening when checking
            event?.stopPropagation();
          }}
          className="h-5 w-5 flex-shrink-0 ml-3"
          onClick={(event) => event.stopPropagation()}
        />
        
        {/* Product Image */}
        <div className="flex-shrink-0 mr-1.5">
          <div className="w-20 h-20 rounded-md overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
            <img 
              src={imageUrl} 
              alt={name} 
              className="h-full w-full object-contain"
              onError={handleImageError}
            />
          </div>
        </div>
        
        {/* Product Information */}
        <div className="flex-1 mx-3 min-w-0">
          {/* Product Name */}
          <h3 className="text-sm font-medium text-gray-900 mb-1.5 line-clamp-2">
            {name}
          </h3>
          
          {/* Product Price and Discount Badge */}
          <div className="flex items-center gap-2">
            <ProductPrice price={price} discountPrice={discount_price} size="sm" />
            
            {/* Discount Badge - Only show if there's a discount */}
            {discountPercentage && discountPercentage > 0 && (
              <Badge className="bg-red-500 text-white border-0 h-5 px-1.5 flex items-center">
                <BadgePercent className="h-3 w-3 mr-0.5" />
                <span className="force-en-nums text-xs">{discountPercentage}%</span>
              </Badge>
            )}
          </div>
        </div>
        
        {/* Status Indicators */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {!is_active && (
            <Badge variant="outline" className="bg-gray-100 text-gray-600 text-xs">
              غير نشط
            </Badge>
          )}
          {is_archived && (
            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
              مسودة
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductListItem;

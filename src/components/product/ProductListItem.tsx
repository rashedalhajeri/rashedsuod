
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/utils/products/types";
import { useIsMobile } from "@/hooks/use-media-query";
import { motion } from "framer-motion";
import { ProductImage } from "./item/ProductImage";
import { ProductPrice } from "./item/ProductPrice";
import { Badge } from "@/components/ui/badge";
import { Pencil, Power, BadgePercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { truncateText } from "@/lib/utils";

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
  onActivate
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
      className={`product-list-item border rounded-xl shadow-sm ${isSelected ? 'bg-blue-50/60 border-blue-200' : 'bg-white border-gray-100'} 
        ${is_archived ? 'opacity-75' : ''} 
        ${!is_active ? 'bg-gray-50/70' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center p-3" dir="rtl">
        {/* Checkbox for selection */}
        <Checkbox
          checked={isSelected}
          onCheckedChange={checked => onSelect(id, !!checked)}
          className="h-4 w-4 flex-shrink-0 ml-3"
        />
        
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
            <img 
              src={imageUrl} 
              alt={name} 
              className="h-full w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
        </div>
        
        {/* Product Information */}
        <div className="flex-1 mx-3 min-w-0">
          {/* Product Name - Always on single line with ellipsis */}
          <h3 className="text-sm font-medium text-gray-900 mb-2 truncate max-w-full">
            {name}
          </h3>
          
          {/* Product Price and Discount Badge */}
          <div className="flex items-center gap-2">
            <ProductPrice price={price} discountPrice={discount_price} size="sm" />
            
            {/* Discount Badge - Only show if there's a discount */}
            {discountPercentage && discountPercentage > 0 && (
              <Badge className="bg-red-500 text-white border-0 px-1.5 h-5 flex items-center">
                <BadgePercent className="h-3 w-3 ml-0.5" />
                <span className="force-en-nums text-xs">{discountPercentage}%</span>
              </Badge>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full h-8 w-8 p-0 border-gray-200"
            onClick={() => onEdit(id)}
          >
            <Pencil className="h-3.5 w-3.5 text-gray-500" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className={`rounded-full h-8 w-8 p-0 ${is_active ? 'bg-green-50 border-green-200 hover:bg-green-100' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
            onClick={() => onActivate && onActivate(id, !is_active)}
          >
            <Power className={`h-3.5 w-3.5 ${is_active ? 'text-green-500' : 'text-gray-400'}`} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductListItem;

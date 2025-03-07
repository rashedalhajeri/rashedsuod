
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, EyeOff, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrencyFormatter } from "@/hooks/use-store-data";
import { Link } from "react-router-dom";
import { Product } from "@/utils/products/types";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-media-query";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

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
    stock_quantity,
    track_inventory,
    images,
    category,
    is_archived,
    is_active = true // Default to true if not provided
  } = product;

  const isMobile = useIsMobile();
  const formatCurrency = getCurrencyFormatter();

  const imageUrl = images && images.length > 0
    ? images[0]
    : "/placeholder.svg";

  const hasDiscount = discount_price !== null && discount_price !== undefined;
  
  // Show different stock status badges
  const getStockBadge = () => {
    if (!track_inventory) return (
      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">كمية غير محدودة</Badge>
    );
    
    if (stock_quantity <= 0) {
      return <Badge variant="destructive" className="text-xs">نفذت الكمية</Badge>;
    } else if (stock_quantity <= 5) {
      return <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">كمية منخفضة</Badge>;
    }
    
    return <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">{stock_quantity} متوفر</Badge>;
  };

  const handleArchive = () => {
    if (onArchive) {
      onArchive(id, !is_archived);
    }
  };

  const handleToggleActive = () => {
    if (onActivate) {
      onActivate(id, !is_active);
      toast({
        title: is_active ? "تم تعطيل المنتج" : "تم تفعيل المنتج",
        description: is_active ? "تم تعطيل المنتج بنجاح" : "تم تفعيل المنتج بنجاح",
      });
    }
  };

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
          
          <div className="h-16 w-16 sm:h-14 sm:w-14 rounded-xl overflow-hidden border border-gray-100 shadow-sm flex-shrink-0 bg-white">
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        
        {/* Product information */}
        <div className="flex-1 min-w-0 mr-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 leading-tight mb-1 line-clamp-1">
                {name}
                {is_archived && (
                  <Badge variant="outline" className="text-xs mr-1.5 bg-gray-50 text-gray-500 border-gray-200">مؤرشف</Badge>
                )}
                {!is_active && !is_archived && (
                  <Badge variant="outline" className="text-xs mr-1.5 bg-yellow-50 text-yellow-600 border-yellow-200">غير نشط</Badge>
                )}
              </h3>
              
              <div className="flex flex-wrap gap-1.5 mb-1">
                {getStockBadge()}
                
                {category && (
                  <Badge variant="outline" className="text-xs">
                    {category.name}
                  </Badge>
                )}
              </div>
              
              {/* Price information */}
              <div className="flex items-center text-sm mt-2">
                {hasDiscount ? (
                  <div className="flex gap-1.5 items-center">
                    <span className="text-red-600 font-bold">{formatCurrency(discount_price!)}</span>
                    <span className="line-through text-gray-500 text-xs">{formatCurrency(price)}</span>
                  </div>
                ) : (
                  <span className="font-bold text-gray-900">{formatCurrency(price)}</span>
                )}
              </div>
            </div>
            
            {/* Mobile action buttons */}
            <div className="flex sm:hidden gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(id)}
                className="text-gray-500 hover:text-gray-700 h-8 w-8"
                title="تعديل"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleActive}
                className={`h-8 w-8 ${is_active ? 'text-green-500 hover:text-green-600' : 'text-gray-400 hover:text-gray-500'}`}
                title={is_active ? "تعطيل المنتج" : "تفعيل المنتج"}
              >
                {is_active ? (
                  <ToggleRight className="h-3.5 w-3.5" />
                ) : (
                  <ToggleLeft className="h-3.5 w-3.5" />
                )}
              </Button>
              
              {onArchive && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleArchive}
                  className={`h-8 w-8 ${is_archived ? 'text-blue-500 hover:text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  title={is_archived ? "إلغاء الأرشفة" : "أرشفة"}
                >
                  <EyeOff className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Desktop action buttons */}
        <div className="hidden sm:flex ml-auto gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(id)}
            className="text-gray-500 hover:text-gray-700 h-8 w-8"
            title="تعديل"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleActive}
            className={`h-8 w-8 ${is_active ? 'text-green-500 hover:text-green-600' : 'text-gray-400 hover:text-gray-500'}`}
            title={is_active ? "تعطيل المنتج" : "تفعيل المنتج"}
          >
            {is_active ? (
              <ToggleRight className="h-4 w-4" />
            ) : (
              <ToggleLeft className="h-4 w-4" />
            )}
          </Button>
          
          {onArchive && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleArchive}
              className={`h-8 w-8 ${is_archived ? 'text-blue-500 hover:text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              title={is_archived ? "إلغاء الأرشفة" : "أرشفة"}
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductListItem;


import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, EyeIcon, ShoppingCart, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrencyFormatter } from "@/hooks/use-store-data";
import { Link } from "react-router-dom";
import { Product } from "@/utils/products/types";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-media-query";
import { motion } from "framer-motion";

interface ProductListItemProps {
  product: Product;
  onSelect: (id: string, isSelected: boolean) => void;
  isSelected: boolean;
  onEdit: (id: string) => void;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ 
  product, 
  onSelect, 
  isSelected, 
  onEdit 
}) => {
  const {
    id,
    name,
    price,
    discount_price,
    stock_quantity,
    track_inventory,
    images,
    category
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

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center p-4 transition-colors ${isSelected ? 'bg-blue-50/60' : 'hover:bg-gray-50'} border-b`}>
      <div className="flex items-center">
        <Checkbox
          checked={isSelected}
          onCheckedChange={checked => onSelect(id, !!checked)}
          className="mr-3 h-4 w-4"
        />
        
        <div className="flex items-center flex-1">
          <div className="h-16 w-16 sm:h-14 sm:w-14 rounded-xl overflow-hidden border border-gray-100 shadow-sm flex-shrink-0">
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0 mr-3">
            <h3 className="text-sm font-medium text-gray-900 leading-tight line-clamp-1 mb-1">
              {name}
            </h3>
            
            <div className="flex flex-wrap gap-1.5 mb-1">
              {getStockBadge()}
              
              {category && (
                <Badge variant="outline" className="text-xs">
                  {category.name}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center text-sm">
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
        </div>
      </div>
      
      <div className="flex ml-auto mt-3 sm:mt-0 gap-1 self-end sm:self-auto">
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
          asChild
          className="text-gray-500 hover:text-gray-700 h-8 w-8"
          title="معاينة"
        >
          <Link to={`/product/${id}`} target="_blank">
            <EyeIcon className="h-4 w-4" />
          </Link>
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-red-600 h-8 w-8"
          title="أرشفة"
        >
          <Archive className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductListItem;

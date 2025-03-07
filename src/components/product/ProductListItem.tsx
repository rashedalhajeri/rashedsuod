
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, EyeIcon, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrencyFormatter } from "@/hooks/use-store-data";
import { Link } from "react-router-dom";
import { Product } from "@/utils/products/types";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-media-query";

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
    if (!track_inventory) return null;
    
    if (stock_quantity <= 0) {
      return <Badge variant="destructive" className="text-xs">نفذت الكمية</Badge>;
    } else if (stock_quantity <= 5) {
      return <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">كمية منخفضة</Badge>;
    }
    
    return <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">{stock_quantity} متوفر</Badge>;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center p-4 hover:bg-gray-50 transition-colors relative">
      <div className="absolute right-4 top-4 sm:static sm:mr-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={checked => onSelect(id, !!checked)}
        />
      </div>
      
      <div className="flex items-center mt-4 sm:mt-0 sm:mr-4">
        <div className="flex-shrink-0 h-16 w-16 mr-4 sm:mr-4 sm:h-14 sm:w-14 rounded-lg overflow-hidden border border-gray-100">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 leading-tight line-clamp-2">
            {name}
          </h3>
          
          <div className="mt-1 flex flex-wrap gap-2">
            <div className="flex items-center text-sm">
              {hasDiscount ? (
                <div className="flex gap-2 items-center">
                  <span className="text-red-600 font-bold">{formatCurrency(discount_price!)}</span>
                  <span className="line-through text-gray-500 text-xs">{formatCurrency(price)}</span>
                </div>
              ) : (
                <span className="font-bold text-gray-900">{formatCurrency(price)}</span>
              )}
            </div>
            
            {getStockBadge()}
            
            {category && (
              <Badge variant="outline" className="text-xs">
                {category.name}
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-3 sm:mt-0 sm:ml-0 sm:mr-auto">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(id)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Edit className="h-4 w-4" />
            {!isMobile && <span className="mr-1">تعديل</span>}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-gray-500 hover:text-gray-700"
          >
            <Link to={`/product/${id}`} target="_blank">
              <EyeIcon className="h-4 w-4" />
              {!isMobile && <span className="mr-1">معاينة</span>}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductListItem;

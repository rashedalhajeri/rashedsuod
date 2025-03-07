
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrencyFormatter } from "@/hooks/use-store-data";
import { Link } from "react-router-dom";
import { Product } from "@/utils/products/types";
import { Badge } from "@/components/ui/badge";

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

  const formatCurrency = getCurrencyFormatter();

  const imageUrl = images && images.length > 0
    ? images[0]
    : "/placeholder.svg";

  return (
    <div className="flex items-center p-4 hover:bg-gray-50 border-b last:border-b-0 transition-colors">
      <div className="mr-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={checked => onSelect(id, !!checked)}
        />
      </div>
      
      <div className="flex-shrink-0 h-14 w-14 mr-4">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover rounded-md"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {name}
        </h3>
        <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
          <div className="mt-1 flex items-center text-sm text-gray-500">
            {discount_price !== null ? (
              <div className="flex flex-row-reverse gap-2 items-center">
                <span className="text-red-600">{formatCurrency(discount_price)}</span>
                <span className="line-through text-gray-500 text-xs">{formatCurrency(price)}</span>
              </div>
            ) : (
              <span>{formatCurrency(price)}</span>
            )}
          </div>
          
          {track_inventory && (
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <span className="ltr">المخزون: {stock_quantity}</span>
            </div>
          )}
          
          {category && (
            <Badge variant="outline" className="mt-1 text-xs">
              {category.name}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex-shrink-0 flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(id)}
          className="text-gray-500 hover:text-gray-700"
        >
          <Edit className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-gray-500 hover:text-gray-700"
        >
          <Link to={`/product/${id}`} target="_blank">
            <EyeIcon className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ProductListItem;

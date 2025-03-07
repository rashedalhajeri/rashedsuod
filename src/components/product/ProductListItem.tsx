
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Product } from "@/utils/products/types";

interface ProductListItemProps {
  product: Product;
  formatCurrency: (amount: number) => string;
  onDeleteClick: (product: Product) => void;
}

const ProductListItem: React.FC<ProductListItemProps> = ({
  product,
  formatCurrency,
  onDeleteClick
}) => {
  const navigate = useNavigate();
  
  const handleEditClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 p-3 border-b border-gray-100">
      <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-md bg-gray-100">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-xs">لا توجد صورة</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-gray-500 truncate">
          {product.description || "لا يوجد وصف للمنتج"}
        </p>
      </div>
      
      <div className="text-left mt-2 md:mt-0">
        <div className="font-medium">
          {formatCurrency(product.price)}
        </div>
        {product.discount_price !== null && (
          <div className="text-xs text-gray-500 line-through">
            {formatCurrency(product.discount_price)}
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={handleEditClick}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-red-500" 
          onClick={() => onDeleteClick(product)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductListItem;

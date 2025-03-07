
import React from "react";
import { Edit, Eye, MoreHorizontal, Package, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Product } from "@/utils/product-helpers";

interface ProductListItemProps {
  product: Product;
  formatCurrency: (price: number) => string;
  onDeleteClick: (product: Product) => void;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ 
  product, 
  formatCurrency,
  onDeleteClick
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            ) : (
              <Package className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-1">{product.description || "بدون وصف"}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="font-bold">{formatCurrency(product.price)}</div>
            <div className="text-sm">
              <Badge variant={product.stock_quantity && product.stock_quantity > 0 ? "outline" : "destructive"} className="mt-1">
                {product.stock_quantity && product.stock_quantity > 0 ? `${product.stock_quantity} في المخزون` : "نفذت الكمية"}
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center gap-2">
                <Edit className="h-4 w-4" /> تعديل
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Eye className="h-4 w-4" /> عرض
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2 text-red-600"
                onClick={() => onDeleteClick(product)}
              >
                <Trash2 className="h-4 w-4" /> حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductListItem;

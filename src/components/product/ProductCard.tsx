
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Package, ImagePlus, MoreHorizontal, Edit, Eye, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getCurrencyFormatter } from "@/hooks/use-store-data";
import {
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface ProductCardProps {
  product: any;
  currency?: string;
  onDelete: (product: any) => void;
  onEdit: (product: any) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  currency = "SAR", 
  onDelete,
  onEdit
}) => {
  const formatCurrency = getCurrencyFormatter(currency);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
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
            <h3 className="font-medium text-lg">{product.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-1 max-w-md">{product.description || "بدون وصف"}</p>
            
            {product.additional_images && Array.isArray(product.additional_images) && product.additional_images.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <ImagePlus className="h-3 w-3" />
                <span>{product.additional_images.length} صور إضافية</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="font-bold text-lg">{formatCurrency(product.price)}</div>
            <div className="text-sm">
              <Badge variant={product.stock_quantity > 0 ? "outline" : "destructive"} className="mt-1">
                {product.stock_quantity > 0 ? `${product.stock_quantity} في المخزون` : "نفذت الكمية"}
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => onEdit(product)}
              >
                <Edit className="h-4 w-4" /> تعديل
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Eye className="h-4 w-4" /> عرض
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2 text-red-600 cursor-pointer"
                onClick={() => onDelete(product)}
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

export default ProductCard;

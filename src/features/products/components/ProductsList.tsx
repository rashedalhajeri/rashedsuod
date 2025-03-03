
import React from "react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Edit, Trash, Copy, MoreHorizontal, Tag, Eye, ImageIcon 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: string;
  isActive: boolean;
}

interface ProductsListProps {
  products: Product[];
  formatCurrency: (price: number) => string;
  selectedProducts: string[];
  onSelectProduct: (id: string, selected: boolean) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({ 
  products, 
  formatCurrency, 
  selectedProducts, 
  onSelectProduct 
}) => {
  const getStockColor = (stock: number) => {
    if (stock > 10) return "bg-green-100 text-green-800 border-green-200";
    if (stock > 0) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };
  
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 py-2 px-4 bg-muted/50 rounded-md text-sm font-medium text-muted-foreground">
        <div className="col-span-1 flex items-center justify-center">
          <span>#</span>
        </div>
        <div className="col-span-6 md:col-span-5">المنتج</div>
        <div className="col-span-2 text-center hidden md:block">التصنيف</div>
        <div className="col-span-3 md:col-span-2 text-center">السعر</div>
        <div className="col-span-2 text-center">المخزون</div>
      </div>
      
      {/* Products List */}
      {products.map((product) => (
        <motion.div
          key={product.id}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-12 gap-4 py-3 px-4 items-center border-b border-muted last:border-0 hover:bg-muted/30 rounded-md"
        >
          <div className="col-span-1 flex items-center justify-center">
            <Checkbox 
              checked={selectedProducts.includes(product.id)}
              onCheckedChange={(checked) => 
                onSelectProduct(product.id, checked === true)
              }
            />
          </div>
          
          <div className="col-span-6 md:col-span-5 flex items-center gap-3">
            <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center overflow-hidden">
              {product.images[0] ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground opacity-50" />
              )}
            </div>
            
            <div className="overflow-hidden">
              <div className="font-medium leading-none mb-1 truncate">
                {product.name}
              </div>
              <div className="text-xs text-muted-foreground line-clamp-1">
                {product.description}
              </div>
            </div>
          </div>
          
          <div className="col-span-2 text-center hidden md:block">
            <Badge variant="outline">{product.category}</Badge>
          </div>
          
          <div className="col-span-3 md:col-span-2 text-center font-medium">
            {formatCurrency(product.price)}
          </div>
          
          <div className="col-span-2 flex items-center justify-between">
            <Badge 
              variant="outline" 
              className={`${getStockColor(product.stock)} hidden sm:inline-flex`}
            >
              {product.stock}
            </Badge>
            <span className="sm:hidden">{product.stock}</span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toast.info(`عرض المنتج: ${product.name}`)}>
                  <Eye className="h-4 w-4 ml-2" />
                  عرض
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info(`تعديل المنتج: ${product.name}`)}>
                  <Edit className="h-4 w-4 ml-2" />
                  تعديل
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info(`نسخ المنتج: ${product.name}`)}>
                  <Copy className="h-4 w-4 ml-2" />
                  نسخ
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast.info(`حذف المنتج: ${product.name}`)}>
                  <Trash className="h-4 w-4 ml-2" />
                  حذف
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductsList;

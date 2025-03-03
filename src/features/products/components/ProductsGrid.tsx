import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, MoreHorizontal, Tag, ImageIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
interface ProductsGridProps {
  products: Product[];
  formatCurrency: (price: number) => string;
}
const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  formatCurrency
}) => {
  const getStockColor = (stock: number) => {
    if (stock > 10) return "bg-green-100 text-green-800 border-green-200";
    if (stock > 0) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };
  return <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(product => <motion.div key={product.id} layout initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} transition={{
      duration: 0.2
    }}>
          <Card className="overflow-hidden h-full flex flex-col">
            <div className="h-40 bg-muted relative">
              {product.images[0] ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-muted">
                  <ImageIcon className="h-12 w-12 text-muted-foreground opacity-30" />
                </div>}
              
              <Badge variant="secondary" className="absolute top-2 right-2">
                {product.category}
              </Badge>
              
              <div className="absolute inset-0 bg-black/0 hover:bg-black/60 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => toast.info(`عرض المنتج: ${product.name}`)}>
                    <Eye className="h-4 w-4 ml-1" />
                    عرض
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => toast.info(`تعديل المنتج: ${product.name}`)}>
                    <Edit className="h-4 w-4 ml-1" />
                    تعديل
                  </Button>
                </div>
              </div>
            </div>
            
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base line-clamp-1">
                  {product.name}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 -ml-2">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">خيارات</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => toast.info(`عرض المنتج: ${product.name}`)}>
                      <Eye className="h-4 w-4 ml-2" />
                      عرض التفاصيل
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info(`تعديل المنتج: ${product.name}`)}>
                      <Edit className="h-4 w-4 ml-2" />
                      تعديل المنتج
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => toast.info(`تغيير التصنيف: ${product.name}`)}>
                      <Tag className="h-4 w-4 ml-2" />
                      تغيير التصنيف
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 pt-0 flex-grow">
              
            </CardContent>
            
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <div className="font-medium">
                {formatCurrency(product.price)}
              </div>
              
            </CardFooter>
          </Card>
        </motion.div>)}
    </div>;
};
export default ProductsGrid;

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ChevronRight, AlertTriangle, ExternalLink, MoreHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RecentProductsProps {
  products: {
    id: string;
    name: string;
    thumbnail: string | null;
    price: number;
    stock: number;
    category: string;
  }[];
  currency: string;
}

const RecentProducts: React.FC<RecentProductsProps> = ({ products, currency }) => {
  const placeholderImage = "/placeholder.svg";
  
  const isLowStock = (stock: number) => stock < 10;

  return (
    <Card className="shadow-sm bg-white overflow-hidden h-full border border-gray-100 hover:border-primary-200 transition-all duration-200">
      <CardHeader className="pb-2 border-b border-gray-50 bg-gradient-to-r from-white to-gray-50/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Package className="h-4 w-4 text-orange-600" />
            </span>
            <span className="text-gray-900">
              أحدث المنتجات
            </span>
          </CardTitle>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild className="text-xs font-normal hover:bg-orange-50 hover:text-orange-600">
              <Link to="/dashboard/products" className="flex items-center gap-1">
                عرض الكل
                <ChevronRight className="h-3 w-3" />
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-gray-100"
                >
                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link to="/dashboard/products/add" className="flex items-center gap-1 w-full">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    إضافة منتج جديد
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>تصدير المنتجات</DropdownMenuItem>
                <DropdownMenuItem>تحديث البيانات</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {products && products.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-white hover:to-orange-50/30 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-200">
                      {product.thumbnail ? (
                        <img 
                          src={product.thumbnail} 
                          alt={product.name} 
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <img 
                          src={placeholderImage} 
                          alt="صورة افتراضية" 
                          className="h-8 w-8 opacity-30"
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 truncate max-w-[150px] group-hover:text-primary-600 transition-colors">{product.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <span>{product.category || "بدون تصنيف"}</span>
                      {isLowStock(product.stock) && (
                        <>
                          <span className="inline-block h-1 w-1 rounded-full bg-amber-500"></span>
                          <span className="text-amber-600 font-medium flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-0.5" />
                            مخزون منخفض
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <p className="font-bold text-gray-900">
                      {product.price.toFixed(2)} {currency}
                    </p>
                    <p className="text-xs text-right">
                      {isLowStock(product.stock) 
                        ? <span className="text-amber-600 flex items-center justify-end gap-1"><AlertTriangle className="h-3 w-3" /> {product.stock}</span> 
                        : <span className="text-green-600">{product.stock} متوفر</span>
                      }
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 rounded-full hover:bg-primary-50 text-gray-400 hover:text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    asChild
                  >
                    <Link to={`/dashboard/products/${product.id}`}>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">لا توجد منتجات حتى الآن</p>
            <Button variant="outline" size="sm" className="mt-3 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200" asChild>
              <Link to="/dashboard/products/add">إضافة منتج جديد</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentProducts;

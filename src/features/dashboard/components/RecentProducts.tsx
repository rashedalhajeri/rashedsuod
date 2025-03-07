
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ChevronRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
    <Card className="shadow-sm bg-white overflow-hidden h-full">
      <CardHeader className="pb-2 border-b border-gray-50">
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="h-6 w-6 rounded bg-orange-100 flex items-center justify-center">
              <Package className="h-4 w-4 text-orange-600" />
            </span>
            أحدث المنتجات
          </span>
          <Button variant="ghost" size="sm" asChild className="text-xs font-normal">
            <Link to="/dashboard/products" className="flex items-center gap-1">
              عرض الكل
              <ChevronRight className="h-3 w-3" />
            </Link>
          </Button>
        </CardTitle>
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
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
                      {product.thumbnail ? (
                        <img 
                          src={product.thumbnail} 
                          alt={product.name} 
                          className="h-full w-full object-cover"
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
                    <p className="font-medium text-gray-900 truncate max-w-[150px]">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category || "بدون تصنيف"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {isLowStock(product.stock) && (
                    <div className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 bg-amber-50 text-amber-600">
                      <AlertTriangle className="h-3 w-3" />
                      <span>المخزون منخفض</span>
                    </div>
                  )}
                  <div className="text-left">
                    <p className="font-bold">{product.price.toFixed(2)} {currency}</p>
                    <p className="text-xs text-gray-500">
                      {isLowStock(product.stock) 
                        ? <span className="text-amber-500">المخزون: {product.stock}</span> 
                        : <span>المخزون: {product.stock}</span>
                      }
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">لا توجد منتجات حتى الآن</p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <Link to="/dashboard/products/add">إضافة منتج جديد</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentProducts;

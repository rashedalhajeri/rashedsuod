
import React, { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";
import { Loader2, Heart } from "lucide-react";

interface ProductGridProps {
  products: any[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Format currency with proper locale and format
  const formatCurrency = (price: number, currency = 'KWD') => {
    return new Intl.NumberFormat('ar-KW', {
      style: 'decimal',
      maximumFractionDigits: 3
    }).format(price) + " " + currency;
  };
  
  // Show a professional empty state when no products are available
  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white rounded-lg border border-gray-100 shadow-sm">
        <div className="max-w-md mx-auto px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
          <p className="text-gray-800 font-medium text-lg mb-2">لا توجد منتجات متاحة حالياً</p>
          <p className="text-sm text-gray-500">يمكنك العودة لاحقاً للاطلاع على المنتجات الجديدة</p>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={gridRef}
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {products.map((product, index) => (
        <div key={product.id} className="relative">
          {/* بطاقة المنتج مع التصميم الجديد */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm h-full pb-4">
            {/* صورة المنتج مع زر المفضلة */}
            <div className="relative">
              <img 
                src={product.image_url || "/placeholder.svg"} 
                alt={product.name} 
                className="w-full aspect-square object-cover"
              />
              <button className="absolute top-2 right-2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:text-rose-500 transition-colors">
                <Heart className="h-6 w-6" />
              </button>
            </div>
            
            {/* معلومات المنتج */}
            <div className="p-3">
              {/* سعر المنتج */}
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-lg text-left" dir="ltr">
                  {formatCurrency(product.price)}
                </div>
                {/* شعار المتجر */}
                <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                  <img 
                    src={product.store_logo || "/placeholder.svg"} 
                    alt="store logo" 
                    className="w-6 h-6 object-contain"
                  />
                </div>
              </div>
              
              {/* اسم المنتج */}
              <h3 className="text-right font-semibold text-gray-800 mb-1 text-base leading-tight line-clamp-2">
                {product.name}
              </h3>
              
              {/* اسم المتجر */}
              <p className="text-right text-gray-500 text-xs">{product.store_name || "اسم المتجر"}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;


import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import ProductItem from "@/components/store/unified/ProductItem";

interface ProductGridProps {
  products: any[];
  isLoading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading = false }) => {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={`loading-${index}`} className="flex flex-col">
            <div className="relative rounded-xl overflow-hidden shadow-sm bg-gray-100 w-full aspect-square animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded mt-2 w-3/4 mx-auto animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }
  
  // Show a professional empty state when no products are available
  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-gray-100 shadow-sm">
        <p className="text-gray-800 font-medium text-lg mb-2">لا توجد منتجات متاحة حالياً</p>
        <p className="text-sm text-gray-500">يمكنك العودة لاحقاً للاطلاع على المنتجات الجديدة</p>
      </div>
    );
  }
  
  return (
    <div 
      ref={gridRef}
      className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
    >
      {products.map((product, index) => (
        <ProductItem 
          key={product.id} 
          product={product} 
          storeDomain={storeDomain}
          index={index}
        />
      ))}
    </div>
  );
};

export default ProductGrid;

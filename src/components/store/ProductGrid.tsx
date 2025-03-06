
import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import ProductItem from "@/components/store/unified/ProductItem";
import ProductGridSkeleton from "@/components/store/skeletons/ProductGridSkeleton";

interface ProductGridProps {
  products: any[];
  isLoading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading = false }) => {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Show skeleton loading state
  if (isLoading) {
    return <ProductGridSkeleton count={8} />;
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

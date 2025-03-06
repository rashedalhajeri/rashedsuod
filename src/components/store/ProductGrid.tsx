
import React from "react";
import { useParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";

interface ProductGridProps {
  products: any[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  
  const formatCurrency = (price: number, currency = 'SAR') => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency
    }).format(price);
  };
  
  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg border">
        <p className="text-gray-500 mb-4">لا توجد منتجات متاحة حالياً</p>
        <p className="text-sm text-gray-400">يمكنك العودة لاحقاً للاطلاع على المنتجات الجديدة</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <ProductCard 
            product={product} 
            storeDomain={storeDomain || ''} 
            formatCurrency={formatCurrency}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;

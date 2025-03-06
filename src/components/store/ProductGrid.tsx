
import React, { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ProductGridProps {
  products: any[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const gridRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (gridRef.current) {
      // Apply a subtle entrance animation to the entire grid
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("opacity-100");
              entry.target.classList.remove("opacity-0", "translate-y-4");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      
      observer.observe(gridRef.current);
      
      return () => {
        if (gridRef.current) observer.unobserve(gridRef.current);
      };
    }
  }, []);
  
  // Format currency with proper locale and format
  const formatCurrency = (price: number, currency = 'SAR') => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency
    }).format(price);
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
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 transition-all duration-500 opacity-0 translate-y-4"
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: index * 0.05,
            ease: [0.25, 0.1, 0.25, 1.0]  // Cubic bezier for smooth motion
          }}
          whileHover={{ y: -5 }}
          className="h-full"
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

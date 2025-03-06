
import React from "react";
import { X } from "lucide-react";
import ProductGrid from "@/components/store/ProductGrid";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface AllProductsSectionProps {
  products: any[];
  activeCategory: string;
  searchQuery: string;
  onClearSearch: () => void;
}

const AllProductsSection: React.FC<AllProductsSectionProps> = ({
  products,
  activeCategory,
  searchQuery,
  onClearSearch
}) => {
  // Determine the section title
  let sectionTitle = "جميع المنتجات";
  if (activeCategory) {
    sectionTitle = activeCategory;
  } else if (searchQuery) {
    sectionTitle = `نتائج البحث: "${searchQuery}"`;
  }

  const hasFilters = activeCategory || searchQuery;

  return (
    <section className="py-10 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <motion.h2 
            className="text-2xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {sectionTitle}
          </motion.h2>
          
          {hasFilters && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={onClearSearch}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                <span>إلغاء التصفية</span>
              </Button>
            </motion.div>
          )}
        </div>
        
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-gray-500 text-lg mb-4">
              {searchQuery 
                ? "لا توجد منتجات تطابق بحثك" 
                : activeCategory 
                  ? "لا توجد منتجات في هذه الفئة" 
                  : "لا توجد منتجات متاحة حالياً"
              }
            </p>
            
            {hasFilters && (
              <Button onClick={onClearSearch} variant="outline">
                عرض جميع المنتجات
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default AllProductsSection;

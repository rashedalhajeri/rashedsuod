
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
    <section className="py-4 px-3 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-3">
          <motion.h2 
            className="text-xl font-bold"
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
                className="flex items-center gap-1 text-xs h-8 px-2"
              >
                <X className="h-3 w-3" />
                <span>إلغاء التصفية</span>
              </Button>
            </motion.div>
          )}
        </div>
        
        <ProductGrid products={products} />
      </div>
    </section>
  );
};

export default AllProductsSection;


import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductGrid from "@/components/store/ProductGrid";

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
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="store-section-title">
            {activeCategory === "جميع المنتجات" ? "جميع المنتجات" : activeCategory}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {products.length} منتج
            </span>
          </div>
        </div>
        
        {searchQuery && (
          <p className="mb-6 text-gray-500">
            نتائج البحث عن: <span className="font-medium text-primary">{searchQuery}</span>
          </p>
        )}
        
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-500">
              {searchQuery
                ? `لا توجد نتائج مطابقة لـ "${searchQuery}"`
                : "لا توجد منتجات متاحة حالياً"}
            </p>
            {searchQuery && (
              <Button
                onClick={onClearSearch}
                variant="outline"
                className="mt-4"
              >
                عرض جميع المنتجات
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllProductsSection;

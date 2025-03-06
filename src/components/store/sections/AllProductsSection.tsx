
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
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold relative pr-3 before:content-[''] before:absolute before:right-0 before:top-0 before:bottom-0 before:w-1 before:bg-blue-600 before:rounded-full">
            {activeCategory === "جميع المنتجات" ? "أحدث العروض" : activeCategory}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {products.length} منتج
            </span>
          </div>
        </div>
        
        {searchQuery && (
          <p className="mb-6 text-gray-500">
            نتائج البحث عن: <span className="font-medium text-blue-600">{searchQuery}</span>
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
        
        <div className="text-center mt-6">
          <Button variant="outline" className="rounded-full px-6">
            عرض الكل
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AllProductsSection;

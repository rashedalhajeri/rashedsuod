
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ProductGrid from "@/components/store/ProductGrid";

interface AllProductsSectionProps {
  products: any[];
  activeCategory?: string;
  searchQuery?: string;
  onClearSearch?: () => void;
}

const AllProductsSection: React.FC<AllProductsSectionProps> = ({
  products,
  activeCategory,
  searchQuery,
  onClearSearch,
}) => {
  // Show category name if active
  const sectionTitle = activeCategory ? 
    activeCategory === 'الكل' ? 'كل المنتجات' : activeCategory 
    : 'المنتجات';
  
  // If we have a search query, show the results title instead
  const finalTitle = searchQuery ? 'نتائج البحث' : sectionTitle;
  
  return (
    <section className="mt-6 mb-8">
      <div className="flex justify-between items-center mb-4 py-2 px-4 bg-white border-b border-gray-100 rounded-t-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-800">{finalTitle}</h2>
        
        {/* Show clear search button if there's a search query */}
        {searchQuery && onClearSearch && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearSearch}
            className="text-gray-600 flex items-center gap-1 hover:bg-gray-50"
          >
            <X size={14} /> مسح البحث
          </Button>
        )}
      </div>
      
      {/* Product grid with proper spacing and alignment */}
      <div className="bg-white p-4 rounded-b-lg shadow-sm border border-gray-100">
        <ProductGrid products={products} />
      </div>
    </section>
  );
};

export default AllProductsSection;

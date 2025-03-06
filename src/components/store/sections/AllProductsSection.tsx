
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ProductGrid from "@/components/store/ProductGrid";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/ui/loading-state";

interface AllProductsSectionProps {
  products: any[];
  activeCategory?: string;
  searchQuery?: string;
  onClearSearch?: () => void;
}

const AllProductsSection: React.FC<AllProductsSectionProps> = ({
  products: initialProducts,
  activeCategory,
  searchQuery,
  onClearSearch,
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchRealProducts = async () => {
      try {
        setIsLoading(true);
        
        // Fetch real products data from Supabase
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching products:", error);
          return;
        }
        
        if (data) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Error in fetchRealProducts:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRealProducts();
  }, []);
  
  // Show category name if active
  const sectionTitle = activeCategory ? 
    activeCategory === 'الكل' ? 'كل المنتجات' : activeCategory 
    : 'المنتجات';
  
  // If we have a search query, show the results title instead
  const finalTitle = searchQuery ? 'نتائج البحث' : sectionTitle;
  
  if (isLoading) {
    return (
      <section className="mt-6 mb-8 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">{finalTitle}</h2>
        </div>
        <div className="p-6">
          <LoadingState message="جاري تحميل المنتجات..." />
        </div>
      </section>
    );
  }
  
  // Determine which products to display (real products or props)
  const displayProducts = products.length > 0 ? products : initialProducts;
  
  return (
    <section className="mt-6 mb-8">
      <div className="flex justify-between items-center mb-4 py-3 px-5 bg-white border-b border-gray-100 rounded-t-lg shadow-sm">
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
      <div className="bg-white p-5 rounded-b-lg shadow-sm border border-gray-100">
        {displayProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 font-medium">لا توجد منتجات متوفرة حالياً</p>
            <p className="text-sm text-gray-400 mt-1">يرجى المحاولة لاحقاً</p>
          </div>
        ) : (
          <ProductGrid products={displayProducts} />
        )}
      </div>
    </section>
  );
};

export default AllProductsSection;

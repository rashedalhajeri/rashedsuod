
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft } from "lucide-react";
import ProductGrid from "@/components/store/ProductGrid";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/ui/loading-state";
import { Link } from "react-router-dom";

interface AllProductsSectionProps {
  products: any[];
  activeCategory?: string;
  searchQuery?: string;
  onClearSearch?: () => void;
  storeDomain?: string;
}

const AllProductsSection: React.FC<AllProductsSectionProps> = ({
  products: initialProducts,
  activeCategory,
  searchQuery,
  onClearSearch,
  storeDomain,
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
      <section className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100">
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
    <section className="mb-6">
      <div className="flex justify-between items-center py-3 px-5 bg-white border-b border-gray-100 rounded-t-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-800">{finalTitle}</h2>
        
        <div className="flex items-center gap-2">
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
          
          {/* View All button */}
          {!searchQuery && activeCategory && storeDomain && (
            <Link to={`/store/${storeDomain}/category/الكل`} className="flex items-center text-blue-600 text-sm font-medium">
              مشاهدة الكل <ChevronLeft size={16} />
            </Link>
          )}
        </div>
      </div>
      
      {/* Product grid without extra spacing */}
      <div className="bg-white p-4 rounded-b-lg shadow-sm border border-t-0 border-gray-100">
        {displayProducts.length === 0 ? (
          <div className="text-center py-12">
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

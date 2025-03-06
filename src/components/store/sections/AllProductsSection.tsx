import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft } from "lucide-react";
import ProductGrid from "@/components/store/ProductGrid";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface AllProductsSectionProps {
  products: any[];
  activeCategory?: string;
  searchQuery?: string;
  onClearSearch?: () => void;
  storeDomain?: string;
  sectionTitle?: string;
}

const AllProductsSection: React.FC<AllProductsSectionProps> = ({
  products: initialProducts,
  activeCategory,
  searchQuery,
  onClearSearch,
  storeDomain,
  sectionTitle
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // If we received products via props, use those
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
      setIsLoading(false);
      return;
    }

    // Otherwise fetch products from the database
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
        // Add a small delay to make the transition smoother
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };
    
    fetchRealProducts();
  }, [initialProducts]);
  
  // Determine section title
  // 1. If we have a custom section title, use it
  // 2. If we're showing search results, show "نتائج البحث"
  // 3. If we have an active category, use that (or "كل المنتجات" for "الكل")
  // 4. Default to "المنتجات"
  const finalTitle = sectionTitle
    ? sectionTitle
    : searchQuery
      ? 'نتائج البحث'
      : activeCategory
        ? activeCategory === 'الكل' ? 'كل المنتجات' : activeCategory
        : 'المنتجات';
  
  // No products to display
  if (!isLoading && products.length === 0) {
    return null;
  }
  
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6"
    >
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
          {!searchQuery && storeDomain && (sectionTitle || activeCategory) && (
            <Link to={`/store/${storeDomain}/category/الكل`} className="flex items-center text-blue-600 text-sm font-medium">
              مشاهدة الكل <ChevronLeft size={16} />
            </Link>
          )}
        </div>
      </div>
      
      {/* Product grid without extra spacing */}
      <div className="bg-white p-4 rounded-b-lg shadow-sm border border-t-0 border-gray-100">
        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </motion.section>
  );
};

export default AllProductsSection;

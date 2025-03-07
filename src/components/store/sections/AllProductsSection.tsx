import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft } from "lucide-react";
import ProductGrid from "@/components/store/ProductGrid";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Product, fetchProductsWithFilters } from "@/utils/product-helpers";

interface AllProductsSectionProps {
  products: Product[];
  activeCategory?: string;
  searchQuery?: string;
  onClearSearch?: () => void;
  storeDomain?: string;
  sectionTitle?: string;
  sectionType?: string;
  categoryId?: string;
  sectionId?: string;
  displayStyle?: 'grid' | 'list';
}

const AllProductsSection: React.FC<AllProductsSectionProps> = ({
  products: initialProducts,
  activeCategory,
  searchQuery,
  onClearSearch,
  storeDomain,
  sectionTitle,
  sectionType = 'all',
  categoryId,
  sectionId,
  displayStyle = 'grid'
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const currentStoreDomain = storeDomain || params.storeDomain;
  
  useEffect(() => {
    // If we received products via props, use those
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
      setIsLoading(false);
      return;
    }

    // Otherwise fetch products from the database based on section type
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        
        const data = await fetchProductsWithFilters(sectionType, undefined, categoryId, sectionId);
        setProducts(data);
        
      } catch (err) {
        console.error("Error in fetchProducts:", err);
      } finally {
        // Add a small delay to make the transition smoother
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };
    
    loadProducts();
  }, [initialProducts, sectionType, categoryId, sectionId]);
  
  // Determine section title
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
          {!searchQuery && currentStoreDomain && (sectionTitle || activeCategory) && (
            <Link to={`/store/${currentStoreDomain}/category/الكل`} className="flex items-center text-blue-600 text-sm font-medium">
              مشاهدة الكل <ChevronLeft size={16} />
            </Link>
          )}
        </div>
      </div>
      
      {/* Product grid without extra spacing */}
      <div className="bg-white p-4 rounded-b-lg shadow-sm border border-t-0 border-gray-100">
        <ProductGrid 
          products={products} 
          isLoading={isLoading} 
          displayStyle={displayStyle} 
        />
      </div>
    </motion.section>
  );
};

export default AllProductsSection;

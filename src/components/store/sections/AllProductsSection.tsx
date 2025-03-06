
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft } from "lucide-react";
import ProductGrid from "@/components/store/ProductGrid";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Json } from "@/integrations/supabase/types";

// Define Product interface to match database structure
interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category_id?: string | null;
  store_id: string;
  image_url?: string | null;
  additional_images?: Json | null; // Changed to Json type to match database
  stock_quantity?: number | null;
  created_at?: string;
  updated_at?: string;
}

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
  
  useEffect(() => {
    // If we received products via props, use those
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
      setIsLoading(false);
      return;
    }

    // Otherwise fetch products from the database based on section type
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase
          .from('products')
          .select('*');
        
        // If we have a specific section type, filter accordingly
        if (sectionType === 'category' && categoryId) {
          query = query.eq('category_id', categoryId);
        } else if (sectionType === 'featured') {
          // Fetch featured products (example only - implement as needed)
          query = query.eq('is_featured', true);
        } else if (sectionType === 'best_selling') {
          // For best selling, we would normally have a sales count
          // This is a placeholder logic - implement properly with your data model
          query = query.order('sales_count', { ascending: false });
        } else if (sectionType === 'new_arrivals') {
          query = query.order('created_at', { ascending: false });
        } else if (sectionType === 'on_sale') {
          // For sale items, we would need a discounted_price field or similar
          query = query.not('discount_price', 'is', null);
        } else if (sectionType === 'custom' && sectionId) {
          // For custom section, we would need a join table between products and sections
          // This is a placeholder - implement properly with your data model
          query = query.eq('section_id', sectionId);
        }
        
        // Execute query
        const { data, error } = await query.order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching products:", error);
          return;
        }
        
        if (data) {
          // Explicitly cast data to Product[] to avoid type issues
          setProducts(data as unknown as Product[]);
        }
      } catch (err) {
        console.error("Error in fetchProducts:", err);
      } finally {
        // Add a small delay to make the transition smoother
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };
    
    fetchProducts();
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
          {!searchQuery && storeDomain && (sectionTitle || activeCategory) && (
            <Link to={`/store/${storeDomain}/category/الكل`} className="flex items-center text-blue-600 text-sm font-medium">
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

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
  additional_images?: Json | null;
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

// Simplified helper function to fetch products with appropriate filters
const fetchProductsWithFilters = async (
  sectionType: string,
  categoryId?: string,
  sectionId?: string
): Promise<Product[]> => {
  try {
    let query;
    
    // Create the appropriate query based on section type
    switch (sectionType) {
      case 'best_selling':
        const { data: bestSellingData, error: bestSellingError } = await supabase
          .from('products')
          .select('*')
          .order('sales_count', { ascending: false });
          
        if (bestSellingError) {
          console.error("Error fetching best selling products:", bestSellingError);
          return [];
        }
        return bestSellingData || [];
        
      case 'category':
        if (!categoryId) return [];
        
        const { data: categoryData, error: categoryError } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', categoryId)
          .order('created_at', { ascending: false });
          
        if (categoryError) {
          console.error("Error fetching category products:", categoryError);
          return [];
        }
        return categoryData || [];
        
      case 'featured':
        const { data: featuredData, error: featuredError } = await supabase
          .from('products')
          .select('*')
          .eq('is_featured', true)
          .order('created_at', { ascending: false });
          
        if (featuredError) {
          console.error("Error fetching featured products:", featuredError);
          return [];
        }
        return featuredData || [];
        
      case 'on_sale':
        const { data: saleData, error: saleError } = await supabase
          .from('products')
          .select('*')
          .not('discount_price', 'is', null)
          .order('created_at', { ascending: false });
          
        if (saleError) {
          console.error("Error fetching on sale products:", saleError);
          return [];
        }
        return saleData || [];
        
      case 'custom':
        if (!sectionId) return [];
        
        const { data: customData, error: customError } = await supabase
          .from('products')
          .select('*')
          .eq('section_id', sectionId)
          .order('created_at', { ascending: false });
          
        if (customError) {
          console.error("Error fetching custom section products:", customError);
          return [];
        }
        return customData || [];
        
      default:
        // Default case: fetch all products
        const { data: allData, error: allError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (allError) {
          console.error("Error fetching all products:", allError);
          return [];
        }
        return allData || [];
    }
  } catch (err) {
    console.error("Error in fetchProductsWithFilters:", err);
    return [];
  }
};

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
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        
        const data = await fetchProductsWithFilters(sectionType, categoryId, sectionId);
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

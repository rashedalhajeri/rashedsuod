
import React, { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CategorySkeleton from "@/components/store/skeletons/CategorySkeleton";

interface CategoryNavigationProps {
  categories: string[];
  sections: string[];
  activeCategory: string;
  activeSection: string;
  onCategoryChange: (category: string) => void;
  onSectionChange: (section: string) => void;
  storeDomain?: string;
}

interface CategoryWithProductCount {
  name: string;
  product_count: number;
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = memo(({
  categories,
  sections,
  activeCategory,
  activeSection,
  onCategoryChange,
  onSectionChange,
  storeDomain
}) => {
  const navigate = useNavigate();
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<CategoryWithProductCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategoriesWithProducts = async () => {
      try {
        setIsLoading(true);
        
        // Get store ID first by domain
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('id')
          .eq('domain_name', storeDomain)
          .single();
          
        if (storeError || !storeData) {
          console.error("Error fetching store:", storeError);
          return;
        }
        
        // Fetch categories with actual products (not just counts)
        const { data, error } = await supabase
          .from('categories')
          .select(`
            name,
            products:products(id)
          `)
          .eq('store_id', storeData.id)
          .order('sort_order');
          
        if (error) {
          console.error("Error fetching categories:", error);
          return;
        }
        
        if (data && data.length > 0) {
          // Transform data to include product counts
          const categoriesWithCounts = data.map(category => ({
            name: category.name,
            product_count: category.products.length
          }));
          
          // Filter out categories with no products
          const filteredCategories = categoriesWithCounts.filter(cat => cat.product_count > 0);
          
          setCategoriesWithProducts(filteredCategories);
        }
      } catch (err) {
        console.error("Error in fetchCategoriesWithProducts:", err);
      } finally {
        // Add a small delay for smoother transition
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      }
    };
    
    if (storeDomain) {
      fetchCategoriesWithProducts();
    }
  }, [storeDomain]);
  
  // Only include "الكل" and categories with products
  const displayCategories = ["الكل", ...categoriesWithProducts.map(cat => cat.name)];
  const hasCategories = displayCategories.length > 1; // At least "All" and one other category
  const hasSections = sections.length > 0;

  // If no data, don't render the component
  if (!hasCategories && !hasSections) {
    return null;
  }

  // Category images mapping
  const categoryImageMap = {
    "الكل": "/public/lovable-uploads/76b54a01-0b01-4389-87c4-99406ba4e5ca.png",
    "العيادات": "/public/lovable-uploads/c8a5c4e7-628d-4c52-acca-e8f603036b6b.png",
    "الإلكترونيات": "/public/lovable-uploads/827a00fa-f421-45c3-96d7-b9305fb217d1.jpg",
  };

  // Handle category click with navigation to category page
  const handleCategoryClick = (category: string) => {
    if (!storeDomain) return;
    
    // Always navigate to category page, even for "All"
    if (category === "الكل") {
      navigate(`/store/${storeDomain}/category/الكل`);
    } else {
      // For other categories, navigate to category page
      const categorySlug = encodeURIComponent(category.toLowerCase());
      navigate(`/store/${storeDomain}/category/${categorySlug}`);
    }
    
    // Call the provided category change handler
    onCategoryChange(category);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="py-2 z-10 transition-all duration-300"
      dir="rtl"
    >
      <div className="grid grid-cols-5 gap-1.5 mx-auto">
        {isLoading ? (
          // Placeholder for loading state using CategorySkeleton
          [...Array(5)].map((_, index) => (
            <CategorySkeleton key={`category-skeleton-${index}`} index={index} />
          ))
        ) : (
          displayCategories.map((category, index) => {
            // Get appropriate image
            const imagePath = categoryImageMap[category as keyof typeof categoryImageMap] || "/placeholder.svg";
            const isActive = (category === "الكل" && activeCategory === "الكل") || 
                           (category.toLowerCase() === activeCategory.toLowerCase());
            
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={index}
                className="flex-shrink-0"
              >
                <button
                  onClick={() => handleCategoryClick(category)}
                  className={`w-full h-full flex flex-col items-center transition-all duration-300 bg-white rounded-lg p-1.5 shadow-sm ${
                    isActive
                      ? 'border-2 border-blue-400'
                      : 'border border-gray-100'
                  }`}
                >
                  <div className="w-full aspect-square mb-1 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                    <img 
                      src={imagePath}
                      alt={category} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <span className={`text-xs truncate w-full text-center ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-800'
                  }`}>
                    {category}
                  </span>
                </button>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
});

CategoryNavigation.displayName = 'CategoryNavigation';

export default CategoryNavigation;

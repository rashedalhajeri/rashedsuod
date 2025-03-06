
import React, { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface CategoryNavigationProps {
  categories: string[];
  sections: string[];
  activeCategory: string;
  activeSection: string;
  onCategoryChange: (category: string) => void;
  onSectionChange: (section: string) => void;
  storeDomain?: string;
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
  const [realCategories, setRealCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchRealCategories = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('categories')
          .select('name')
          .order('sort_order');
          
        if (error) {
          console.error("Error fetching categories:", error);
          return;
        }
        
        if (data && data.length > 0) {
          const categoryNames = data.map(cat => cat.name);
          setRealCategories(categoryNames);
        }
      } catch (err) {
        console.error("Error in fetchRealCategories:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRealCategories();
  }, []);
  
  // Filter out empty arrays
  const hasCategories = realCategories.length > 0 || categories.length > 0;
  const hasSections = sections.length > 0;

  // If no data, don't render the component
  if (!hasCategories && !hasSections) {
    return null;
  }

  // Prepare categories with "All" option at the beginning
  const allCategories = ["الكل", ...realCategories.length > 0 ? realCategories : categories];
  
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
    <div className="py-4 z-10 transition-all duration-300" dir="rtl">
      <div className="grid grid-cols-3 gap-4 mx-auto">
        {isLoading ? (
          // Placeholder for loading state
          [...Array(3)].map((_, index) => (
            <motion.div
              key={`loading-${index}`}
              className="flex-shrink-0"
            >
              <div className="w-full h-full flex flex-col items-center bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
                <div className="w-full aspect-square mb-2 bg-gray-200 rounded-lg"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
            </motion.div>
          ))
        ) : (
          allCategories.map((category, index) => {
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
                  className={`w-full h-full flex flex-col items-center transition-all duration-300 bg-white rounded-xl p-4 shadow-sm ${
                    isActive
                      ? 'border-2 border-blue-400'
                      : 'border border-gray-100'
                  }`}
                >
                  <div className="w-full aspect-square mb-2 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                    <img 
                      src={imagePath}
                      alt={category} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <span className={`text-sm font-medium ${
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
    </div>
  );
});

CategoryNavigation.displayName = 'CategoryNavigation';

export default CategoryNavigation;

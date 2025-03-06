
import React, { memo } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

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
  
  // Filter out empty arrays
  const hasCategories = categories.length > 0;
  const hasSections = sections.length > 0;

  // If no data, don't render the component
  if (!hasCategories && !hasSections) {
    return null;
  }

  // Prepare categories with "All" option at the beginning
  const categoriesWithAll = ["الكل", ...categories];
  
  // Category images mapping
  const categoryImageMap = {
    "الكل": "/public/lovable-uploads/76b54a01-0b01-4389-87c4-99406ba4e5ca.png",
    "العيادات": "/public/lovable-uploads/c8a5c4e7-628d-4c52-acca-e8f603036b6b.png",
    "الإلكترونيات": "/public/lovable-uploads/827a00fa-f421-45c3-96d7-b9305fb217d1.jpg",
  };

  // Handle category click with smooth transitions
  const handleCategoryClick = (category: string) => {
    if (!storeDomain) return;
    onCategoryChange(category);
  };

  return (
    <div className="py-4 z-10 transition-all duration-300" dir="rtl">
      <div className="grid grid-cols-3 gap-4 mx-auto">
        {categoriesWithAll.map((category, index) => {
          // Determine display name based on index
          const displayName = 
            category === "الكل" ? "الكل" : 
            index === 1 ? "Clinics" : 
            index === 2 ? "Electronics" : category;
            
          // Get appropriate image
          const imagePath = category === "الكل" 
            ? categoryImageMap["الكل"]
            : index === 1 
              ? categoryImageMap["العيادات"] 
              : index === 2 
                ? categoryImageMap["الإلكترونيات"]
                : "/placeholder.svg";
          
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
                  (category === "الكل" && !activeCategory) || 
                  (activeCategory && category.toLowerCase() === activeCategory.toLowerCase())
                    ? 'border-2 border-blue-400'
                    : 'border border-gray-100'
                }`}
              >
                <div className="w-full aspect-square mb-2 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                  <img 
                    src={imagePath}
                    alt={displayName} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <span className={`text-sm font-medium ${
                  (category === "الكل" && !activeCategory) || 
                  (activeCategory && category.toLowerCase() === activeCategory.toLowerCase())
                    ? 'text-blue-600'
                    : 'text-gray-800'
                }`}>
                  {displayName}
                </span>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

CategoryNavigation.displayName = 'CategoryNavigation';

export default CategoryNavigation;


import React, { useState, useEffect, useCallback, memo } from "react";
import { motion } from "framer-motion";

interface CategoryNavigationProps {
  categories: string[];
  sections: string[];
  activeCategory: string;
  activeSection: string;
  onCategoryChange: (category: string) => void;
  onSectionChange: (section: string) => void;
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = memo(({
  categories,
  sections,
  activeCategory,
  activeSection,
  onCategoryChange,
  onSectionChange
}) => {
  // Filter out empty arrays
  const hasCategories = categories.length > 0;
  const hasSections = sections.length > 0;

  // If no data, don't render the component
  if (!hasCategories && !hasSections) {
    return null;
  }

  // Prepare categories with "All" option at the beginning
  const categoriesWithAll = ["الكل", ...categories];
  
  // Ejemplos de categorías con imágenes para coincidir con el diseño enviado por el usuario
  const categoryImages = [
    "/public/lovable-uploads/40f2878b-2f08-4165-b6f3-ef717990c0e1.png", // Imagen para "الكل"
    "/placeholder.svg", // Imagen para clinics
    "/placeholder.svg", // Imagen para electronics
  ];

  return (
    <div className="bg-white py-4 z-10 transition-all duration-300 mb-4" dir="rtl">
      <div className="container mx-auto px-3">
        <div className="grid grid-cols-3 gap-4">
          {categoriesWithAll.map((category, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              key={index}
              className="flex-shrink-0 rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => onCategoryChange(category === "الكل" ? "" : category)}
                className={`w-full h-full flex flex-col items-center p-3 ${
                  (category === "الكل" && !activeCategory) || activeCategory === category
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-700'
                }`}
              >
                <div className="w-16 h-16 mb-2 flex items-center justify-center bg-gray-50 rounded-lg">
                  <img 
                    src={index < categoryImages.length ? categoryImages[index] : "/placeholder.svg"} 
                    alt={category} 
                    className="w-12 h-12 object-contain" 
                  />
                </div>
                <span className="text-sm whitespace-nowrap">
                  {category === "الكل" ? "الكل" : 
                   index === 1 ? "Clinics" : 
                   index === 2 ? "Electronics" : category}
                </span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
});

CategoryNavigation.displayName = 'CategoryNavigation';

export default CategoryNavigation;

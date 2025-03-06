
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

  // Prepare categories with "All" option at the beginning for RTL display
  const categoriesWithAll = ["الكل", ...categories];

  return (
    <div className="bg-gray-50 py-4 z-10 transition-all duration-300">
      <div className="container mx-auto px-3">
        <div className="flex overflow-x-auto gap-3 pb-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex-row-reverse">
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
                {/* أيقونة افتراضية للفئة - يمكن استبدالها بأيقونات حقيقية */}
                <div className="w-16 h-16 mb-2 flex items-center justify-center bg-gray-50 rounded-lg">
                  {index === 0 && (
                    <img src="/placeholder.svg" alt="الكل" className="w-12 h-12 object-contain" />
                  )}
                  {index === 1 && categories.length > 0 && (
                    <img src="/placeholder.svg" alt={category} className="w-12 h-12 object-contain" />
                  )}
                  {index === 2 && categories.length > 1 && (
                    <img src="/placeholder.svg" alt={category} className="w-12 h-12 object-contain" />
                  )}
                </div>
                <span className="text-sm whitespace-nowrap">{category}</span>
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
